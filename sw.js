// Service Worker pour SOUDA
// Version v4 - Désactivation complète du cache pour éviter les erreurs

// Installation - Passer immédiatement
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// Activation - Supprimer TOUS les caches et prendre le contrôle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Supprimer tous les caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        )
      }),
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ])
  )
})

// Fetch - NE RIEN FAIRE
// Ne pas intercepter les requêtes du tout
// Le navigateur gérera tout normalement
self.addEventListener('fetch', () => {
  // Handler vide - ne fait absolument rien
  // Cela évite toute tentative de cache
})
