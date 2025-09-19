// Musicist Service Worker - Simplified for GitHub Pages debugging
const CACHE_NAME = 'musicist-v3';
const AUDIO_CACHE_NAME = 'musicist-audio-v3';

// Install event - simple cache strategy
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('musicist-') && 
              cacheName !== CACHE_NAME && 
              cacheName !== AUDIO_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - basic caching strategy
self.addEventListener('fetch', event => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Handle audio files specially
  if (event.request.url.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/i) ||
      event.request.url.includes('audio/') ||
      event.request.url.includes('cached-audio/')) {
    
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            console.log('[SW] Serving audio from cache:', event.request.url);
            return response;
          }
          
          return fetch(event.request).then(fetchResponse => {
            if (fetchResponse && fetchResponse.status === 200) {
              cache.put(event.request, fetchResponse.clone());
              console.log('[SW] Cached audio file:', event.request.url);
            }
            return fetchResponse;
          }).catch(error => {
            console.log('[SW] Audio fetch failed:', error);
            return new Response('Audio not available', { status: 404 });
          });
        });
      })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version if available
      if (response) {
        console.log('[SW] Serving from cache:', event.request.url);
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request).then(fetchResponse => {
        // Don't cache if not successful
        if (!fetchResponse || fetchResponse.status !== 200) {
          return fetchResponse;
        }

        // Cache successful responses
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
          console.log('[SW] Cached resource:', event.request.url);
        });

        return fetchResponse;
      }).catch(error => {
        console.log('[SW] Fetch failed:', event.request.url, error);
        
        // For navigation requests, try to return the main page
        if (event.request.mode === 'navigate') {
          return caches.match('/') || 
                 caches.match('./') ||
                 new Response('<h1>Offline</h1><p>Please check your connection and try again.</p>', {
                   headers: { 'Content-Type': 'text/html' }
                 });
        }
        
        return new Response('Resource not available offline', { 
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

// Handle messages from main thread (for audio caching)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_AUDIO') {
    const { audioData, filename } = event.data;
    
    console.log('[SW] Caching audio file:', filename);
    
    caches.open(AUDIO_CACHE_NAME).then(cache => {
      const response = new Response(audioData, {
        headers: { 'Content-Type': 'audio/mpeg' }
      });
      cache.put(`./cached-audio/${filename}`, response);
    }).catch(error => {
      console.error('[SW] Failed to cache audio:', error);
    });
  }
});

console.log('[SW] Musicist Service Worker loaded - GitHub Pages compatible version');