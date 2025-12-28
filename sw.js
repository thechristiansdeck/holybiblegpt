const CACHE_NAME = 'hbgpt-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/bible/kjv.json',
  '/assets/index.css' // Assuming css location, but standard build usually handles this. Keeping safe list.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Stale-While-Revalidate Strategy
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const networkFetch = fetch(event.request).then(response => {
        // Cache valid responses only (and not AI calls which might be POST or dynamic)
        if (response.status === 200 && event.request.method === 'GET' && !event.request.url.includes('/api/')) {
          cache.put(event.request, response.clone());
        }
        return response;
      });
      return cachedResponse || networkFetch;
    })
  );
});
