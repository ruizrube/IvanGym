// Service worker: caché del "app shell" para funcionar sin conexión.
const VERSION = 'ivangym-v4';
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
  'img/exercises/aperturas.gif',
  'img/exercises/belt-squat.gif',
  'img/exercises/crunch-abdominal.gif',
  'img/exercises/curl-biceps.gif',
  'img/exercises/curl-femoral.gif',
  'img/exercises/elevaciones-laterales.gif',
  'img/exercises/extension-cuadriceps.gif',
  'img/exercises/extension-triceps-maquina.gif',
  'img/exercises/extension-triceps-polea.gif',
  'img/exercises/hiperextensiones.gif',
  'img/exercises/jalon-pecho.gif',
  'img/exercises/jalon-unilateral.gif',
  'img/exercises/prensa.gif',
  'img/exercises/press-militar.gif',
  'img/exercises/press-pecho.gif',
  'img/exercises/remo-dorian.gif',
  'img/exercises/thruster.gif',
  'img/exercises/zancadas-traseras.gif',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
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
        if (res.ok) caches.open(VERSION).then((c) => c.put(request, copy));
        return res;
      })),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        if (res.ok) caches.open(VERSION).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() => caches.match(request, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html'))),
  );
});
