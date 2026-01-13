// Service Worker pour SOUDA
// Filtre les requêtes non-HTTP(S) pour éviter les erreurs de cache

const CACHE_NAME = 'souda-v1'
const BASE_PATH = '/souda/' // GitHub Pages subpath

// Fonction pour normaliser les URLs avec le base path
function normalizeUrl(url) {
  if (url.startsWith(BASE_PATH)) {
    return url
  }
  if (url.startsWith('/')) {
    return BASE_PATH + url.slice(1)
  }
  return url
}

const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html'
]

// Installation - Cache les ressources initiales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache.map(url => new Request(url, { mode: 'no-cors' })))
          .catch((err) => {
            console.warn('Service Worker: Erreur lors du cache initial:', err)
          })
      })
  )
  self.skipWaiting()
})

// Activation - Nettoie les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

// Fetch - Stratégie Cache First avec filtre des schémas non-HTTP(S)
self.addEventListener('fetch', (event) => {
  const request = event.request
  
  // Filtrer les requêtes non-HTTP(S) (chrome-extension, moz-extension, etc.)
  try {
    const url = new URL(request.url)
    
    // Ignorer les requêtes avec des schémas non-HTTP(S)
    if (!url.protocol.startsWith('http')) {
      // Ignorer silencieusement les requêtes non-HTTP(S)
      return
    }
    
    // Ignorer les requêtes cross-origin non-CORS
    if (url.origin !== self.location.origin && request.mode === 'no-cors') {
      return
    }
  } catch (error) {
    // Si l'URL est invalide, ignorer la requête
    return
  }
  
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Retourner depuis le cache si disponible
        if (response) {
          return response
        }
        
        // Sinon, fetch depuis le réseau
        return fetch(request)
          .then((response) => {
            // Vérifier que la réponse est valide
            if (!response || response.status !== 200 || response.type === 'error') {
              return response
            }
            
            // Cloner la réponse pour le cache
            const responseToCache = response.clone()
            
            // Mettre en cache uniquement les requêtes GET et HTTP(S)
            if (request.method === 'GET') {
              try {
                const url = new URL(request.url)
                if (url.protocol.startsWith('http')) {
                  caches.open(CACHE_NAME)
                    .then((cache) => {
                      try {
                        cache.put(request, responseToCache)
                      } catch (error) {
                        // Ignorer les erreurs de cache (ex: schéma non supporté)
                        // Ne pas logger pour éviter le spam dans la console
                      }
                    })
                    .catch(() => {
                      // Ignorer silencieusement les erreurs
                    })
                }
              } catch (error) {
                // Ignorer silencieusement les erreurs d'URL
              }
            }
            
            return response
          })
          .catch((error) => {
            // Retourner une réponse depuis le cache en cas d'erreur réseau
            return caches.match(request)
          })
      })
  )
})
