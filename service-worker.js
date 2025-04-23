// Nombre y versión del caché
const CACHE_NAME = 'gijon-live-cache-v1';

// Archivos que se cachearán
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-192x192.png'
];

// Instalación del service worker - cachea los recursos iniciales
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  // Espera hasta que la promesa se resuelva
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del service worker - borra cachés antiguos
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // Si el caché actual es diferente del nuevo, bórralo
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpiando caché antigua');
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch - sirve recursos desde caché cuando sea posible
self.addEventListener('fetch', event => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;
  
  // Ignorar las peticiones a APIs externas
  if (event.request.url.includes('weatherwidget.org') || 
      event.request.url.includes('marea.ooo') ||
      event.request.url.includes('angelcam.com') ||
      event.request.url.includes('rtsp.me') ||
      event.request.url.includes('surf-forecast.com') ||
      event.request.url.includes('windfinder.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si se encuentra en caché, devuelve el recurso cacheado
        if (response) {
          return response;
        }
        
        // Si no está en caché, busca en la red
        return fetch(event.request)
          .then(networkResponse => {
            // Si la respuesta no es válida, simplemente devuélvela
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Si la respuesta es válida, copia y guarda en caché
            let responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return networkResponse;
          })
          .catch(error => {
            console.log('Error en la petición fetch:', error);
            // Puedes devolver una página de error offline específica aquí
          });
      })
  );
});

// Sincronización en segundo plano
self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        // Aquí iría la lógica para sincronizar datos en segundo plano
        console.log('Sincronizando datos...');
    }
});

// Recibir notificaciones push
self.addEventListener('push', event => {
    const data = event.data.json();
    
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
}); 