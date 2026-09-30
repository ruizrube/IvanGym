// Service worker: caché del "app shell" para funcionar sin conexión.
const VERSION = 'ivangym-v10';
// Los GIF de los ejercicios no van aquí: la app los guarda en la caché 'ivangym-gifs'
// a partir de las rutinas de js/data.js (ver precacheGifs en js/app.js).
const GIF_CACHE = 'ivangym-gifs';
const SHELL = [
  './',
  'index.html',
  'css/style.css',
  'js/app.js',
  'js/data.js',
  'js/storage.js',
  'site.webmanifest',
  'icon.svg',
  'icon.png',
  'icon-512.png',
  'favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== GIF_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // GIFs: primero caché (no cambian). Resto: primero red para recoger actualizaciones.
  if (url.pathname.includes('/img/')) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((res) => {
        const copy = res.clone();
        if (res.ok) caches.open(GIF_CACHE).then((c) => c.put(request, copy));
        return res;
      })),
    );
    return;
  }

  event.respondWith(
    fetch(request, { cache: 'no-cache' })
      .then((res) => {
        const copy = res.clone();
        if (res.ok) caches.open(VERSION).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() => caches.match(request, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html'))),
  );
});
