// Service Worker pour SOUDA
// Version minimale qui filtre uniquement les requêtes non-HTTP(S)

const CACHE_NAME = 'souda-v3' // Version incrémentée pour forcer la mise à jour

// Activation - Nettoie les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer TOUS les anciens caches
          return caches.delete(cacheName)
        })
      )
    })
  )
  return self.clients.claim()
})

// Fetch - Filtrer UNIQUEMENT les requêtes non-HTTP(S), laisser tout le reste passer
self.addEventListener('fetch', (event) => {
  const request = event.request
  
  // Filtrer IMMÉDIATEMENT les requêtes non-HTTP(S) AVANT toute opération
  try {
    const url = new URL(request.url)
    
    // Ignorer TOUTES les requêtes avec des schémas non-HTTP(S)
    // (chrome-extension, moz-extension, etc.)
    if (!url.protocol.startsWith('http')) {
      // Ne pas appeler event.respondWith() pour ces requêtes
      // Laisser le navigateur gérer normalement (ou les ignorer)
      return
    }
  } catch (error) {
    // Si l'URL est invalide, ne pas intercepter
    return
  }
  
  // Pour toutes les autres requêtes HTTP(S), laisser passer normalement
  // Ne pas intercepter avec event.respondWith() pour éviter tout problème de cache
  // Le navigateur gérera les requêtes normalement
})
