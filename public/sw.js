const CACHE_NAME = 'health-craft-cache-v1';
const OFFLINE_URL = '/offline.html';
const STATIC_ASSETS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : undefined))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method === 'GET') {
    if (request.mode === 'navigate') {
      event.respondWith(
        fetch(request)
          .then(res => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            return res;
          })
          .catch(() => caches.match(request).then(r => r || caches.match(OFFLINE_URL)))
      );
      return;
    }

    event.respondWith(
      caches.match(request).then(r => {
        return (
          r ||
          fetch(request).then(res => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            return res;
          })
        );
      })
    );
  } else if (request.method === 'POST') {
    event.respondWith(
      fetch(request.clone()).catch(() => queueRequest(request))
    );
  }
});

async function queueRequest(request) {
  const body = await request.clone().text();
  const db = await openDB();
  const tx = db.transaction('requests', 'readwrite');
  tx.objectStore('requests').add({
    url: request.url,
    method: request.method,
    headers: Array.from(request.headers.entries()),
    body
  });
  await transactionComplete(tx);
  await self.registration.sync.register('sync-requests');
  return new Response(JSON.stringify({ ok: true, offline: true }), {
    status: 202,
    headers: { 'Content-Type': 'application/json' }
  });
}

self.addEventListener('sync', event => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(processQueue());
  }
});

async function processQueue() {
  const db = await openDB();
  const tx = db.transaction('requests', 'readwrite');
  const store = tx.objectStore('requests');
  let cursor = await requestToPromise(store.openCursor());
  while (cursor) {
    const { url, method, headers, body } = cursor.value;
    try {
      await fetch(url, { method, headers: new Headers(headers), body });
      await cursor.delete();
    } catch (err) {
      console.error('Replay failed', err);
      break;
    }
    cursor = await requestToPromise(cursor.continue());
  }
  await transactionComplete(tx);
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('health-craft-bg', 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('requests', { autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionComplete(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Health Craft';
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: data.url ? { url: data.url } : {}
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
