// Service Worker for PWA functionality
const CACHE_NAME = 'ezu-portfolio-v2.0.0';
const STATIC_CACHE_NAME = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE_NAME = `${CACHE_NAME}-dynamic`;

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/Eyup_Zafer_UNAL_CV.pdf',
  // Add other static assets as needed
];

// Dynamic cache patterns
const CACHE_PATTERNS = {
  // Cache images for 30 days
  images: {
    pattern: /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i,
    strategy: 'CacheFirst',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 100
  },
  // Cache CSS and JS for 7 days
  assets: {
    pattern: /\.(css|js)$/i,
    strategy: 'StaleWhileRevalidate',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 50
  },
  // Cache fonts for 1 year
  fonts: {
    pattern: /\.(woff|woff2|ttf|eot)$/i,
    strategy: 'CacheFirst',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    maxEntries: 20
  },
  // Cache API responses for 1 hour
  api: {
    pattern: /\/api\//,
    strategy: 'NetworkFirst',
    maxAge: 60 * 60 * 1000, // 1 hour
    maxEntries: 50
  }
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        // Force the new service worker to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - serve cached content
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (unless they're for assets)
  if (url.origin !== self.location.origin && !isAssetRequest(request)) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Handle different types of requests
async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Check if it's a navigation request (HTML page)
  if (request.mode === 'navigate') {
    return handleNavigationRequest(request);
  }
  
  // Check cache patterns for different asset types
  for (const [type, config] of Object.entries(CACHE_PATTERNS)) {
    if (config.pattern.test(url.pathname) || config.pattern.test(url.href)) {
      return handleAssetRequest(request, config);
    }
  }
  
  // Default strategy for other requests
  return handleDefaultRequest(request);
}

// Handle navigation requests (HTML pages)
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If both fail, return offline page or index.html
    const fallbackResponse = await caches.match('/') || 
                            await caches.match('/index.html');
    return fallbackResponse || new Response('Offline', { status: 503 });
  }
}

// Handle asset requests based on strategy
async function handleAssetRequest(request, config) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  switch (config.strategy) {
    case 'CacheFirst':
      return handleCacheFirst(request, cache, config);
    case 'NetworkFirst':
      return handleNetworkFirst(request, cache, config);
    case 'StaleWhileRevalidate':
      return handleStaleWhileRevalidate(request, cache, config);
    default:
      return handleDefaultRequest(request);
  }
}

// Cache First strategy
async function handleCacheFirst(request, cache, config) {
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && !isExpired(cachedResponse, config.maxAge)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Network Error', { status: 503 });
  }
}

// Network First strategy
async function handleNetworkFirst(request, cache, config) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Network Error', { status: 503 });
  }
}

// Stale While Revalidate strategy
async function handleStaleWhileRevalidate(request, cache, config) {
  const cachedResponse = await cache.match(request);
  
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Silently fail network requests
  });
  
  return cachedResponse || networkPromise;
}

// Default request handler
async function handleDefaultRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Network Error', { status: 503 });
  }
}

// Utility functions
function isAssetRequest(request) {
  const url = new URL(request.url);
  return /\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|pdf)$/i.test(url.pathname);
}

function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseDate = new Date(dateHeader);
  const now = new Date();
  
  return (now.getTime() - responseDate.getTime()) > maxAge;
}

// Clean up old cache entries
async function cleanupCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxEntries) {
    const keysToDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync operations
      console.log('[SW] Background sync triggered')
    );
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: data.actions
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// Periodic cleanup
setInterval(() => {
  Object.entries(CACHE_PATTERNS).forEach(([type, config]) => {
    if (config.maxEntries) {
      cleanupCache(DYNAMIC_CACHE_NAME, config.maxEntries);
    }
  });
}, 24 * 60 * 60 * 1000); // Daily cleanup

console.log('[SW] Service Worker loaded successfully');