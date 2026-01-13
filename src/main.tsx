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

// Désactiver complètement le service worker pour éviter les problèmes de cache
if (isWeb && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Désinscrire TOUS les service workers existants
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().then((success) => {
          if (success && process.env.NODE_ENV === 'development') {
            console.log('✅ Service Worker désinscrit:', registration.scope)
          }
        }).catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Erreur désinscription Service Worker:', error)
          }
        })
      })
    }).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Erreur récupération Service Workers:', error)
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
