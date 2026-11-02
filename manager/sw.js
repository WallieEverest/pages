// Shell, vault and photo list: network first (so changes show up), cache fallback offline.
// Encrypted photos (for thumbnails): cache first, sharing the slideshow's photo cache so nothing is stored twice.
const VERSION = 'manager-v1';
const PHOTOS = 'slideshow-photos';
const SHELL = ['./', 'index.html', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', '../slideshow/vault.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('manager-v') && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  if (url.pathname.includes('/slideshow/photos/')) {
    e.respondWith(
      caches.open(PHOTOS).then(c => c.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(r => {
        if (r.ok) c.put(req, r.clone());
        return r;
      })))
    );
    return;
  }

  e.respondWith(
    fetch(req)
      .then(r => {
        if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return r;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || Response.error()))
  );
});
