'use strict';
const CACHE='malaymate-frontend-v3';
const CORE=['./','./index.html','./style.css','./app.js','./redesign.css','./experience.js','./games.js','./data.js','./views.js','./learning.js','./rewards.js','./learners.js','./pwa.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('malaymate-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!CORE.some(path=>new URL(path,self.location.href).pathname===url.pathname))return;
 // Network-first serves edits immediately; the cached frontend remains usable offline.
 event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(cached=>cached||(event.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});
