// Nairobi 2055 — Service Worker
// Cache-first strategy: app shell cached on install, served offline

const CACHE_NAME = 'nairobi2055-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/viz-patch.js',
  '/icon-192.png',
  '/icon-512.png'
];

// Install: cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, fall back to network
self.addEventListener('fetch', event => {
  // Only handle GET requests for same-origin resources
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Cache valid responses for HTML, JS, CSS, fonts, images
        if (
          response.ok &&
          (event.request.url.endsWith('.html') ||
           event.request.url.endsWith('.js') ||
           event.request.url.endsWith('.css') ||
           event.request.url.endsWith('.json') ||
           event.request.url.endsWith('.png') ||
           event.request.url.endsWith('.jpg') ||
           event.request.url.endsWith('.svg') ||
           event.request.url.endsWith('.ico') ||
           event.request.url === self.location.origin + '/')
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback — serve the cached index for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
