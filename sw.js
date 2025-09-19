// Musicist Service Worker
const CACHE_NAME = 'musicist-v1';
const AUDIO_CACHE_NAME = 'musicist-audio-v1';

// Static files to cache
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
];

// Install event - cache static resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle audio files specially
  if (request.url.includes('audio/') || 
      request.url.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            return response;
          }
          return fetch(request).then(fetchResponse => {
            // Don't cache if it's not successful
            if (fetchResponse.ok) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Handle other requests
  event.respondWith(
    caches.match(request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(request).catch(() => {
        // If offline and no cache, return offline page
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});

// Background sync for future enhancements
self.addEventListener('sync', event => {
  console.log('Background sync:', event.tag);
});

// Push notifications (for future enhancements)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo192.png',
      badge: '/favicon.ico'
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle audio caching messages from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_AUDIO') {
    const { audioData, filename } = event.data;
    
    // Cache the audio blob
    caches.open(AUDIO_CACHE_NAME).then(cache => {
      const response = new Response(audioData, {
        headers: {
          'Content-Type': 'audio/mpeg'
        }
      });
      cache.put(`/cached-audio/${filename}`, response);
    });
  }
});