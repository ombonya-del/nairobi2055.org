// Nairobi 2055 — Service Worker
// Cache-first strategy: app shell cached on install, served offline

const CACHE_NAME = 'nairobi2055-v18';
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

// Fetch: NETWORK-FIRST for HTML (always fresh pages), cache-first for other assets
self.addEventListener('fetch', event => {
  // Only handle GET requests for same-origin resources
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  const url = event.request.url;
  const isHTML = event.request.mode === 'navigate' || url.endsWith('.html');
  const cacheable = (
    url.endsWith('.html') || url.endsWith('.js') || url.endsWith('.css') ||
    url.endsWith('.json') || url.endsWith('.png') || url.endsWith('.jpg') ||
    url.endsWith('.svg') || url.endsWith('.ico') || url.endsWith('.mp3') ||
    url.endsWith('.m4a') || url === self.location.origin + '/'
  );

  if (isHTML) {
    // Network-first: get the latest page, fall back to cache only when offline
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match(event.request).then(c => c || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok && cacheable) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
