const CACHE_NAME = 'ima-cache-v1';
const assetsToCache = [
  './',
  'index.html',
  'about.html',
  'contact.html',
  'offline.html',
  'manifest.json',
  'icon/iMaBrand192.png',
  'icon/iMaBrand512.png'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assetsToCache))
  );
  self.skipWaiting(); // agar SW langsung aktif
});

// Membersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// gunakan cache jika offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then((response) => {
      return response || caches.match('offline.html');
    }))
  );
});
