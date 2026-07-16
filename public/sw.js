/* LINK'D UP service worker — push notifications + installability */
const VERSION = 'linkdup-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// A minimal fetch handler is required for the app to be installable.
// Network-first, no caching of app routes (keeps content fresh).
self.addEventListener('fetch', () => {})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = { title: "LINK'D UP", body: event.data ? event.data.text() : '' }
  }
  const title = data.title || "LINK'D UP"
  const options = {
    body: data.body || '',
    icon: data.icon || '/api/icon?size=192',
    badge: '/api/icon?size=192&maskable=1',
    tag: data.tag || 'linkdup',
    data: { url: data.url || '/home' },
    vibrate: [80, 40, 80],
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/home'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(target)
          return client.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target)
    })
  )
})
