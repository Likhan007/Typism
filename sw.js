// Service Worker for Jungle Typing Adventure
const CACHE_NAME = 'jungle-typing-v1';
const urlsToCache = [
    './',
    './index.html',
    './css/main.css',
    './css/jungle-theme.css',
    './css/animations.css',
    './js/app.js',
    './js/modules/storage.js',
    './js/modules/ui.js',
    './js/modules/game.js',
    './js/modules/ghost.js',
    './js/modules/animals.js',
    './js/modules/typing-engine.js',
    './js/modules/stats.js',
    './js/modules/sound.js',
    './js/data/text-content.js',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    './manifest.json'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Cache installation failed:', error);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
