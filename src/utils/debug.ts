/**
 * Utilitaires de debug pour nettoyer le cache et réinitialiser le jeu
 */

import { clearHallOfFame } from '../features/meta/hallOfFame'

/**
 * Supprime toutes les bases de données IndexedDB
 */
async function clearIndexedDB(): Promise<void> {
  if (typeof indexedDB === 'undefined') {
    console.warn('IndexedDB not available')
    return
  }

  const databases = ['souda_save', 'souda_meta', 'hallOfFame']
  
  for (const dbName of databases) {
    try {
      const deleteRequest = indexedDB.deleteDatabase(dbName)
      await new Promise<void>((resolve, reject) => {
        deleteRequest.onsuccess = () => {
          console.log(`IndexedDB ${dbName} supprimée`)
          resolve()
        }
        deleteRequest.onerror = () => {
          console.error(`Erreur suppression ${dbName}:`, deleteRequest.error)
          reject(deleteRequest.error)
        }
        deleteRequest.onblocked = () => {
          console.warn(`${dbName} est bloquée, réessayez`)
          resolve() // Continue même si bloquée
        }
      })
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${dbName}:`, error)
    }
  }
}

/**
 * Supprime tout le localStorage
 */
function clearLocalStorage(): void {
  try {
    localStorage.clear()
    console.log('localStorage nettoyé')
  } catch (error) {
    console.error('Erreur lors du nettoyage localStorage:', error)
  }
}

/**
 * Nettoie tout le cache (IndexedDB + localStorage + Hall of Fame) et recharge la page
 */
export async function clearAllCacheAndReload(): Promise<void> {
  console.log('🧹 Nettoyage du cache en cours...')
  
  try {
    // Nettoyer IndexedDB
    await clearIndexedDB()
    
    // Nettoyer localStorage
    clearLocalStorage()
    
    // Nettoyer Hall of Fame
    await clearHallOfFame()
    
    console.log('✅ Cache nettoyé, rechargement de la page...')
    
    // Attendre un peu pour que les opérations se terminent
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Recharger la page
    window.location.reload()
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
    // Recharger quand même
    window.location.reload()
  }
}

/**
 * Reset le jeu et nettoie le cache (sans recharger)
 */
export async function resetGameAndCache(): Promise<void> {
  console.log('🔄 Reset du jeu et nettoyage du cache...')
  
  try {
    // Nettoyer IndexedDB
    await clearIndexedDB()
    
    // Nettoyer localStorage
    clearLocalStorage()
    
    // Nettoyer Hall of Fame
    await clearHallOfFame()
    
    console.log('✅ Cache nettoyé')
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
  }
}
