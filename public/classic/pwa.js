'use strict';
let installPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
if('serviceWorker'in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>console.info('Offline caching is unavailable in this preview.')));
}
async function installMalayMate(){
 if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return;}
 openModal('MalayMate on your device','<p>In Chrome or Edge, choose <b>Install app</b> from the browser menu when available. On iPhone or iPad, open Safari, tap <b>Share</b>, then <b>Add to Home Screen</b>.</p><p class="muted">Your lessons and locally saved progress remain available after the first online visit. Audio requires an attached recording or an available Malay voice. Download the project ZIP while online.</p>');
}
