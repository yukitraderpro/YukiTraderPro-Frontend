(function (root) {
"use strict";
function mulberry32(seed) {
return function () {
seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}
function hashString(s) {
let h = 2166136261;
for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
return h >>> 0;
}
const INTERVAL_MS = { "1h": 3600000, "4h": 4 * 3600000, "1day": 86400000, "1week": 7 * 86400000 };
function pad(n) { return String(n).padStart(2, "0"); }
function fmt(ts) {
const d = new Date(ts);
return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}
function getSeries(symbol, interval) {
const seed = hashString(symbol + "|" + (interval || "1h"));
const rnd = mulberry32(seed);
const stepMs = INTERVAL_MS[interval] || INTERVAL_MS["1h"];
const count = 160;
let price = 15 + (seed % 480);
const drift = ((seed % 9) - 4) * 0.0009;
const vol = 0.006 + (rnd() * 0.012);
const baseVolume = 5000 + (seed % 90000);
const out = [];
let ts = Date.now() - count * stepMs;
for (let i = 0; i < count; i++) {
const open = price;
const regimeDrift = (i > 100 && seed % 3 === 0) ? -drift * 1.6 : drift;
const change = regimeDrift + (rnd() - 0.5) * 2 * vol;
const close = Math.max(0.5, open * (1 + change));
const wick = vol * open * (0.3 + rnd() * 0.9);
const high = Math.max(open, close) + wick * rnd();
const low = Math.max(0.1, Math.min(open, close) - wick * rnd());
const volume = Math.round(baseVolume * (0.5 + rnd() * 1.4));
out.push({ datetime: fmt(ts), open: round4(open), high: round4(high), low: round4(low), close: round4(close), volume });
price = close;
ts += stepMs;
}
return out;
}
function round4(x) { return Math.round(x * 10000) / 10000; }
const api = { getSeries };
root.YukiDemoData = api;
if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);