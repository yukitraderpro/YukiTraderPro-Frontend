(function () {
function fieldsList() { return [
{ id: "symbol", label: t("csvFieldSymbol") },
{ id: "name", label: t("csvFieldName") },
{ id: "market", label: t("csvFieldMarket") },
{ id: "assetType", label: t("csvFieldAssetType") },
{ id: "isin", label: "ISIN" },
{ id: "quantity", label: t("csvFieldQuantity") },
{ id: "entryPrice", label: t("csvFieldEntryPrice") },
{ id: "entryAt", label: t("csvFieldEntryAt") },
{ id: "currency", label: t("csvFieldCurrency") },
{ id: "stopLoss", label: t("csvFieldStopLoss") },
{ id: "target", label: t("csvFieldTarget") },
{ id: "timeframe", label: "Timeframe" },
{ id: "strategy", label: t("csvFieldStrategy") },
{ id: "statusField", label: t("csvFieldStatus") },
{ id: "notes", label: t("csvFieldNotes") },
{ id: "tags", label: "Tags" }
]; }
let currentPreview = null;
function el(id) { return document.getElementById(id); }
function userEmail() { return (typeof currentUser === "function" && currentUser()) ? currentUser().email : null; }
function updateGate() {
const gated = !(typeof isServerMode === "function" && isServerMode());
if (el("csvServerGate")) el("csvServerGate").style.display = gated ? "" : "none";
if (el("csvWizardCard")) el("csvWizardCard").style.display = gated ? "none" : "";
}
function readFileAsText(file) {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = () => resolve(reader.result);
reader.onerror = () => reject(new Error(t("csvCannotReadFile")));
reader.readAsText(file, "utf-8");
});
}
async function handleUpload() {
const input = el("csvFileInput");
const status = el("csvUploadStatus");
const email = userEmail();
if (!email) return;
if (!input.files || !input.files.length) { status.textContent = t("csvChooseFileFirst"); return; }
const file = input.files[0];
status.textContent = t("csvReadingFile");
try {
const csvText = await readFileAsText(file);
status.textContent = t("analyzingInProgress");
const preview = await apiFetch("/api/csv/imports", {
method: "POST", email,
body: { filename: file.name, source: el("csvSource").value, destination: el("csvDestination").value, csvText, mimeType: file.type }
});
currentPreview = preview;
renderPreview(preview);
status.textContent = "";
} catch (e) {
status.textContent = e.message;
}
}
function renderPreview(preview) {
el("csvPreviewCard").style.display = "";
el("csvReportCard").style.display = "none";
el("csvPreviewSummary").textContent = t("csvRowsDetected")(preview.totalRows, preview.delimiter === "\t" ? t("csvTabDelimiter") : preview.delimiter, preview.headers.join(", "));
const table = preview.sampleRows.slice(0, 5).map(row => `<div class="item"><small>${row.map(escapeHtml).join(" · ")}</small></div>`).join("");
el("csvPreviewTable").innerHTML = table || `<div class="item muted">${t("csvNoRowsPreview")}</div>`;
const fields = fieldsList();
el("csvMappingFields").innerHTML = preview.headers.map((h, idx) => {
const options = [`<option value="">${t("csvIgnoreColumn")}</option>`]
.concat(fields.map(f => `<option value="${f.id}" ${preview.suggestedMapping[idx] === f.id ? "selected" : ""}>${f.label}</option>`));
return `<label>${escapeHtml(h)} <select data-map-col="${idx}">${options.join("")}</select></label>`;
}).join("");
}
function escapeHtml(s) {
return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function collectMapping() {
const mapping = {};
document.querySelectorAll("[data-map-col]").forEach(sel => {
mapping[sel.dataset.mapCol] = sel.value || null;
});
return mapping;
}
async function handleConfirm() {
const email = userEmail();
if (!email || !currentPreview) return;
try {
const report = await apiFetch(`/api/csv/imports/${currentPreview.importId}/confirm`, {
method: "POST", email,
body: { mapping: collectMapping(), duplicateStrategy: el("csvDuplicateStrategy").value }
});
renderReport(report);
el("csvPreviewCard").style.display = "none";
el("csvFileInput").value = "";
currentPreview = null;
refreshHistory();
refreshRows();
} catch (e) {
alert(e.message);
}
}
function renderReport(report) {
el("csvReportCard").style.display = "";
el("csvReportBox").innerHTML = `
<div><span>${t("csvImportedLabel")}</span><strong>${report.imported}</strong></div>
<div><span>${t("csvSkippedLabel")}</span><strong>${report.skipped}</strong></div>
<div><span>${t("csvUpdatedLabel")}</span><strong>${report.updated}</strong></div>
<div><span>${t("csvErrorLabel")}</span><strong>${report.errorCount}</strong></div>`;
el("csvReportErrors").innerHTML = report.errors && report.errors.length
? report.errors.map(e => `<div class="item muted"><small>${t("csvRowPrefix")} ${e.row} : ${e.errors.join(", ")}</small></div>`).join("")
: "";
}
async function handleCancel() {
const email = userEmail();
if (!email || !currentPreview) return;
try { await apiFetch(`/api/csv/imports/${currentPreview.importId}/cancel`, { method: "POST", email }); } catch {}
currentPreview = null;
el("csvPreviewCard").style.display = "none";
el("csvFileInput").value = "";
}
async function refreshRows() {
const email = userEmail();
const box = el("csvRowsList");
if (!email || !box) return;
if (!(typeof isServerMode === "function" && isServerMode())) return;
const params = new URLSearchParams();
if (el("csvFilterTicker").value.trim()) params.set("ticker", el("csvFilterTicker").value.trim().toUpperCase());
if (el("csvFilterSource").value) params.set("source", el("csvFilterSource").value);
try {
const result = await apiFetch(`/api/csv/rows?${params.toString()}`, { email });
box.innerHTML = result.rows.length ? result.rows.map(r => `
<div class="item"><div class="item-head"><strong>${escapeHtml(r.symbol || "—")}</strong><span class="provider-badge">${escapeHtml(r.source)}</span></div>
<small>${escapeHtml(r.name || "")} · ${t("csvQtyShort")} ${r.quantity ?? "—"} · ${t("entryShort")} ${r.entry_price ?? "—"} ${escapeHtml(r.currency || "")}</small></div>`).join("")
: `<div class="item muted">${t("csvNoRowsYet")}</div>`;
} catch (e) { box.innerHTML = `<div class="item muted">${escapeHtml(e.message)}</div>`; }
}
async function refreshHistory() {
const email = userEmail();
const box = el("csvHistoryList");
if (!email || !box) return;
if (!(typeof isServerMode === "function" && isServerMode())) return;
try {
const result = await apiFetch("/api/csv/imports", { email });
box.innerHTML = result.imports.length ? result.imports.map(imp => `
<div class="item">
<div class="item-head"><strong>${escapeHtml(imp.filename)}</strong><span class="provider-badge">${imp.status}</span></div>
<small>${escapeHtml(imp.source)} → ${escapeHtml(imp.destination)} · ${new Date(imp.created_at).toLocaleString(typeof currentLang === "function" && currentLang() === "en" ? "en-US" : "fr-FR")}</small><br>
<small>${imp.imported_count} ${t("csvImportedCountSuffix")} · ${imp.skipped_count} ${t("csvSkippedCountSuffix")} · ${imp.updated_count} ${t("csvUpdatedCountSuffix")} · ${imp.error_count} ${t("csvErrorCountSuffix")}</small>
<div class="toolbar" style="margin-top:8px">
${imp.status === "deleted"
? `<button data-csv-restore="${imp.id}">${t("csvRestoreBtn")}</button>`
: `<button data-csv-delete-file="${imp.id}">${t("csvDeleteFileOnlyBtn")}</button><button data-csv-delete-all="${imp.id}">${t("csvDeleteAllBtn")}</button>`}
</div>
</div>`).join("") : `<div class="item muted">${t("csvNoImportsYet")}</div>`;
box.querySelectorAll("[data-csv-delete-all]").forEach(b => b.onclick = () => confirmAndDelete(b.dataset.csvDeleteAll, "all"));
box.querySelectorAll("[data-csv-delete-file]").forEach(b => b.onclick = () => confirmAndDelete(b.dataset.csvDeleteFile, "file_only"));
box.querySelectorAll("[data-csv-restore]").forEach(b => b.onclick = () => restoreImport(b.dataset.csvRestore));
} catch (e) { box.innerHTML = `<div class="item muted">${escapeHtml(e.message)}</div>`; }
}
async function confirmAndDelete(importId, scope) {
const email = userEmail();
try {
const impact = await apiFetch(`/api/csv/imports/${importId}/impact`, { email });
const message = scope === "all"
? t("csvConfirmDeleteAllMsg")(impact.affectedRows, impact.filename, impact.destination)
: t("csvConfirmDeleteFileOnlyMsg")(impact.filename, impact.affectedRows);
if (!confirm(message)) return;
if (scope === "all" && !confirm(t("csvConfirmDeleteAllStrong"))) return;
await apiFetch(`/api/csv/imports/${importId}?scope=${scope}`, { method: "DELETE", email });
refreshHistory(); refreshRows();
} catch (e) { alert(e.message); }
}
async function restoreImport(importId) {
const email = userEmail();
try { await apiFetch(`/api/csv/imports/${importId}/restore`, { method: "POST", email }); refreshHistory(); refreshRows(); }
catch (e) { alert(e.message); }
}
function wire() {
if (!el("csv")) return;
if (el("csvUploadBtn")) el("csvUploadBtn").onclick = handleUpload;
if (el("csvConfirmBtn")) el("csvConfirmBtn").onclick = handleConfirm;
if (el("csvCancelBtn")) el("csvCancelBtn").onclick = handleCancel;
if (el("csvRowsRefreshBtn")) el("csvRowsRefreshBtn").onclick = refreshRows;
if (el("csvApplyFiltersBtn")) el("csvApplyFiltersBtn").onclick = refreshRows;
if (el("csvHistoryRefreshBtn")) el("csvHistoryRefreshBtn").onclick = refreshHistory;
updateGate();
}
function onPanelOpened(name) {
if (name !== "csv") return;
updateGate();
refreshHistory();
refreshRows();
}
window.YukiCsvImport = { wire, onPanelOpened, updateGate };
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
else wire();
})();