const CACHE_NAME = "conect360-site-v6";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/acesso.html",
  "/manifest.json",
  "/assets/css/style.css",
  "/assets/js/script.js",
  "/assets/img/conect360-logo.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  const request = event.request;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(function () {
        return caches.match("/acesso.html").then(function (cachedAcesso) {
          return cachedAcesso || caches.match("/index.html");
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then(function (networkResponse) {
        const responseClone = networkResponse.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(request, responseClone);
        });

        return networkResponse;
      })
      .catch(function () {
        return caches.match(request);
      })
  );
});