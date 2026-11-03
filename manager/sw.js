// Shell, vault and photo list: network first (so changes show up), cache fallback offline.
// Encrypted photos (for thumbnails): cache first, sharing the slideshow's photo cache so nothing is stored twice.
const VERSION = 'manager-v10';
const PHOTOS = 'slideshow-photos';
const SHELL = ['./', 'index.html', 'github.js', 'manifest.json', 'icons/icon-180.png', 'icons/icon-192.png', '../slideshow/vault.js'];

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

  // no-cache: check with the server (a cheap 304 when unchanged) instead of taking the browser's copy, which GitHub Pages
  // lets it keep for 10 minutes: that served an old page while the version label (fetched fresh) showed the new one.
  e.respondWith(
    fetch(req.url, { cache: 'no-cache' })
      .then(r => {
        if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return r;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || Response.error()))
  );
});
