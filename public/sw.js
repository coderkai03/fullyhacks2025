// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "fullyhacks-offline";
const OFFLINE_URL = "/offline";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        OFFLINE_URL,
        "/",
        "/manifest.json"
      ]);
    })
  );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // If request was successful, return it
        return response;
      })
      .catch(function(error) {
        // Check to see if you have it in the cache
        // Return response
        // If not in the cache, then return the offline page
        return caches.match(event.request).then(function(response) {
          if (response) {
            return response;
          }
          return caches.match(OFFLINE_URL);
        });
      })
  );
}); 