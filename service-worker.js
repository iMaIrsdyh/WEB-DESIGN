const CACHE_NAME = "ima-cache-v6";
const urlsToCache = [
  "index.html",
  "about.html",
  "contact.html",
  "offline.html",
  "css/about.css",
  "css/contact.css",
  "css/home.css",
  "css/offline.css",
  "manifest.json",
  "icon/iMaBrand192.png",
  "icon/iMaBrand512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("📦 Menyimpan file ke cache...");
      return cache.addAll(urlsToCache);
    }).catch(err => console.error("❌ Gagal cache:", err))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => response)
        .catch(() => caches.match("offline.html"))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

// Saat aktivasi — hapus cache lama
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log("🧹 Menghapus cache lama:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});