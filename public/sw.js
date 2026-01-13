// Service Worker pour SOUDA
// Version v5 - Suppression complète de tous les caches et désactivation

// Installation - Passer immédiatement sans cache
self.addEventListener('install', (event) => {
  // Ne rien mettre en cache
  self.skipWaiting()
})

// Activation - Supprimer TOUS les caches et prendre le contrôle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Supprimer tous les caches existants
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Suppression du cache:', cacheName)
            return caches.delete(cacheName)
          })
        )
      }),
      // Prendre le contrôle immédiatement pour forcer la mise à jour
      self.clients.claim()
    ]).then(() => {
      // Notifier tous les clients que le service worker est activé
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SW_ACTIVATED' })
        })
      })
    })
  )
})

// Fetch - NE RIEN FAIRE, laisser toutes les requêtes passer normalement
// Ne pas intercepter les requêtes pour éviter tout problème de cache
self.addEventListener('fetch', (event) => {
  // Handler complètement vide
  // Le navigateur gérera toutes les requêtes normalement
  // Cela garantit qu'aucun cache ne sera utilisé
})
