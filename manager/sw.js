// The Manager app was removed on 2026-11-12. This last version replaces the installed one, deletes the
// removed apps' caches and reloads any open copy into the "removed" page (index.html), which unregisters it.
const VERSION = 'manager-v11';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  const done = caches.keys()
    .then(keys => Promise.all(keys.filter(k => /^(slideshow|manager)-/.test(k)).map(k => caches.delete(k))))
    .then(() => self.clients.claim());
  e.waitUntil(done);
  // Reload open pages only once activation is over: a reload started inside it waits for it, and neither finishes.
  done.then(() => self.clients.matchAll({ type: 'window' }))
    .then(pages => pages.forEach(p => p.navigate(p.url).catch(() => {})));
});

// No fetch handler: everything comes from the network.
