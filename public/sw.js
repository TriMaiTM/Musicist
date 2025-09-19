// Musicist Service Worker for GitHub Pages
const CACHE_NAME = 'musicist-v2';
const AUDIO_CACHE_NAME = 'musicist-audio-v2';

// Get the base path for GitHub Pages
const getBasePath = () => {
  const location = self.location;
  if (location.hostname === 'trimaitm.github.io') {
    return '/Musicist';
  }
  return '';
};

const BASE_PATH = getBasePath();

// Static files to cache (adjust paths for GitHub Pages)
const STATIC_CACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/static/js/bundle.js`,
  `${BASE_PATH}/static/css/main.css`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/favicon.ico`
];

// Install event - cache static resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Try to cache files, but don't fail if some are missing
      return Promise.allSettled(
        STATIC_CACHE_URLS.map(url => 
          fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
          }).catch(err => console.log(`Failed to cache ${url}:`, err))
        )
      );
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

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle audio files specially
  if (request.url.includes('audio/') || 
      request.url.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/i)) {
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
          }).catch(err => {
            console.log('Failed to fetch audio:', err);
            return new Response('Audio file not found', { status: 404 });
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
        // If offline and no cache, return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match(`${BASE_PATH}/`) || 
                 caches.match('/') ||
                 new Response('Offline', { status: 503 });
        }
        return new Response('Resource not available offline', { status: 503 });
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
      icon: `${BASE_PATH}/logo192.png`,
      badge: `${BASE_PATH}/favicon.ico`
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
      cache.put(`${BASE_PATH}/cached-audio/${filename}`, response);
    });
  }
});

console.log('Service Worker loaded for Musicist PWA - GitHub Pages version');