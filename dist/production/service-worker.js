const C='yuki-pro-4-0-1-fix-api-base',F=['./','./index.html','./style.css','./css/yuki-assistant.css','./config.js','./auth.js','./analysis.js','./api-cache.js','./app.js','./sync-client.js','./push-client.js','./js/yuki-messages.js','./js/yuki-knowledge.js','./js/yuki-assistant.js','./csv-import-client.js','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./assets/images/yuki/yuki-avatar-64.png?v=20260719d','./assets/images/yuki/yuki-avatar-96.png?v=20260719d','./assets/images/yuki/yuki-avatar-192.png?v=20260719d','./assets/images/yuki/yuki-avatar-250.png?v=20260719d','./assets/images/yuki/yuki-welcome.webp?v=20260719d'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
const req=e.request;
if(req.method!=='GET')return;
const url=new URL(req.url);
if(url.origin!==self.location.origin)return;
if(url.pathname.startsWith('/api/'))return;
e.respondWith(fetch(req).then(r=>{if(r&&r.ok){const q=r.clone();caches.open(C).then(c=>c.put(req,q));}return r}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
});
self.addEventListener("push", event => {
let payload = { title: "Yuki Trader Pro", body: "Nouvelle alerte disponible." };
try {
if (event.data) {
const data = event.data.json();
payload = {
title: (data.notification && data.notification.title) || data.title || payload.title,
body: (data.notification && data.notification.body) || data.body || payload.body,
data: data.data || {}
};
}
} catch {  }
event.waitUntil(
self.registration.showNotification(payload.title, {
body: payload.body,
icon: "icon.svg",
badge: "icon.svg",
vibrate: [250, 120, 250],
tag: (payload.data && payload.data.tag) || "yuki-push",
renotify: true,
data: { url: (payload.data && payload.data.url) || "./", ...(payload.data || {}) }
})
);
});
self.addEventListener("notificationclick", event=>{
event.notification.close();
const data = event.notification.data || {};
event.waitUntil(
clients.matchAll({type:"window", includeUncontrolled:true}).then(list=>{
for(const client of list){
if("focus" in client){
client.postMessage({type:"YUKI_NOTIFICATION_CLICK", data});
return client.focus();
}
}
return clients.openWindow(data.url || "./");
})
);
});