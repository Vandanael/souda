import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadGameState } from './features/game/saveSystem'
import { useGameStore } from './store/gameStore'

// Détecter la plateforme et vérifier le storage
const isWeb = typeof window !== 'undefined' && window.document !== undefined

if (isWeb) {
  // Vérifier que IndexedDB est disponible
  if (typeof indexedDB !== 'undefined') {
    console.log('✅ Running on Web - Storage Check OK (IndexedDB available)')
  } else {
    console.warn('⚠️ Running on Web - IndexedDB not available, using localStorage fallback')
  }
  
  // Vérifier que localStorage est disponible
  try {
    localStorage.setItem('_storage_test', 'ok')
    localStorage.removeItem('_storage_test')
    console.log('✅ Running on Web - localStorage Check OK')
  } catch (error) {
    console.error('❌ Running on Web - localStorage not available:', error)
  }
}

// Enregistrer le service worker
if (isWeb && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // @ts-ignore - BASE_URL est défini par Vite
    const baseUrl = import.meta.env.BASE_URL || '/souda/'
    const swPath = baseUrl + 'sw.js'
    
    // D'abord, désinscrire tous les anciens service workers
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      // Désinscrire tous les anciens
      return Promise.all(
        registrations.map((registration) => registration.unregister())
      )
    }).then(() => {
      // Attendre un peu pour que la désinscription soit complète
      return new Promise(resolve => setTimeout(resolve, 100))
    }).then(() => {
      // Enregistrer le nouveau service worker avec updateViaCache: 'none'
      return navigator.serviceWorker.register(swPath, { 
        updateViaCache: 'none' 
      })
    }).then((registration) => {
      // Forcer la mise à jour immédiate
      registration.update()
      
      // Écouter les messages du service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_ACTIVATED') {
          // Le service worker est activé, recharger la page pour forcer le nouveau cache
          window.location.reload()
        }
      })
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Service Worker enregistré:', registration.scope)
      }
    }).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Service Worker non disponible:', error)
      }
    })
  })
}

// Charger la sauvegarde au démarrage
loadGameState().then((savedState) => {
  if (savedState) {
    // Restaurer l'état sauvegardé
    useGameStore.setState(savedState)
    if (isWeb && process.env.NODE_ENV === 'development') {
      console.log('✅ Game state loaded from storage')
    }
  } else if (isWeb && process.env.NODE_ENV === 'development') {
    console.log('ℹ️ No saved game state found, starting fresh')
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
