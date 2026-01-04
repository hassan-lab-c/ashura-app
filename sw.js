const CACHE_NAME = 'ashura-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/image_1.jpeg',
  '/ziyarat.mp3',
  '/distribute_1.jpg',
  '/distribute_2.jpg',
  '/distribute_3.jpg',
  '/distribute_4.jpg',
  '/distribute_5.jpg',
  '/distribute_6.jpg',
  '/distribute_7.jpg',
  '/distribute_8.jpg',
  '/distribute_9.jpg',
  '/distribute_10.jpg',
  '/distribute_11.jpg',
  '/distribute_12.jpg',
  '/distribute_13.jpg',
  '/distribute_14.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});