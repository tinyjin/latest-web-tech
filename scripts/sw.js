var CACHE_NAME = 'my-site-cache-v2';
// var urlsToCache = [
//   '/',
//   '/index.js',
//   '/index.html',
//   '/main-icon.png'
// ];


// 캐싱
// self.addEventListener('install', function(event) {
//   // Perform install steps
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(function(cache) {
//         console.log('Opened cache');
//         return cache.addAll(serviceWorkerOption);
//       })
//   );
// });


// 캐싱된 파일 요청
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
  );
});


// 푸쉬 알람 수신
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const data = JSON.parse(event.data.text());

  const title = data.title;
  const options = {
    body: data.value,
    icon: '/main-icon.png',
    badge: '/main-icon.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});


// 알림 클릭
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://wlsdml1103.blog.me/')
  );
});