const CACHE_NAME = 'radar-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './radar.css',
  './radar.js',
  './manifest.json'
];

// Установка воркера и кэширование файлов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехват запросов (возвращаем кэш, если нет сети)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если файл есть в кэше, возвращаем его
        if (response) {
          return response;
        }
        // Иначе пытаемся загрузить из сети
        return fetch(event.request);
      })
  );
});
  
