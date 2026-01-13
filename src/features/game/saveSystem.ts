const DB_NAME = 'souda_save'
const DB_VERSION = 1
const STORE_NAME = 'gameState'

/**
 * Ouvre la base de données IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  // Vérifier si IndexedDB est disponible (pas dans les tests)
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB not available'))
  }
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

/**
 * Filtre l'état pour ne garder que les données sérialisables (pas les fonctions)
 */
function serializeState(state: any): any {
  const serializable: any = {}
  
  // Liste des clés à sauvegarder (données uniquement, pas les fonctions)
  const dataKeys = [
    'phase', 'day', 'debt', 'gold', 'reputation',
    'playerStats', 'inventory', 'equipment',
    'currentEnemy', 'combatResult', 'lootedItem',
    'currentEvent', 'eventResult', 'dailyLocations', 'persistentLocations',
    'actionsRemaining', 'marketStock', 'marketStockDay',
    'forgeStock', 'forgeStockDay', 'npcFlags', 'rumors', 'hasEatenToday',
    'narrativeCounters', 'triggeredEvents', 'eventCooldowns', 'recentMonologues', 'selectedOrigin',
    'audioSettings', 'combatsWon', 'combatsFled', 'combatsLost',
    'legendaryItemsFound', 'characterArcs'
  ]
  
  for (const key of dataKeys) {
    if (key in state && typeof state[key] !== 'function') {
      serializable[key] = state[key]
    }
  }
  
  return serializable
}

/**
 * Sauvegarde l'état du jeu
 */
export async function saveGameState(state: any): Promise<void> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    // Sérialiser l'état pour ne garder que les données (pas les fonctions)
    const serializedState = serializeState(state)
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put({
        id: 'current',
        ...serializedState,
        savedAt: Date.now()
      })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

/**
 * Charge l'état du jeu sauvegardé
 */
export async function loadGameState(): Promise<any | null> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise<any | null>((resolve, reject) => {
      const request = store.get('current')
      request.onsuccess = () => {
        const result = request.result
        if (result) {
          // Retirer l'id et savedAt
          const { id, savedAt, ...state } = result
          resolve(state)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    return null
  }
}

/**
 * Supprime la sauvegarde
 */
export async function deleteSave(): Promise<void> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    await new Promise<void>((resolve, reject) => {
      const request = store.delete('current')
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

/**
 * Sauvegarde automatique asynchrone (non-bloquante)
 * Gère les erreurs silencieusement pour ne pas corrompre la save
 */
export async function autoSave(state: any): Promise<void> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    // Sérialiser l'état pour ne garder que les données (pas les fonctions)
    const serializedState = serializeState(state)
    
    await new Promise<void>((resolve, _reject) => {
      const request = store.put({
        id: 'current',
        ...serializedState,
        savedAt: Date.now(),
        day: state.day || 1 // Inclure le jour pour l'affichage
      })
      request.onsuccess = () => {
        resolve()
        // Log silencieux en dev uniquement
        if (process.env.NODE_ENV === 'development') {
          console.log('💾 Auto-save réussie (Jour', state.day || 1, ')')
        }
      }
      request.onerror = () => {
        // Ne pas rejeter pour ne pas bloquer l'UI
        console.warn('⚠️ Erreur auto-save (non-bloquante):', request.error)
        resolve() // Résoudre quand même pour ne pas bloquer
      }
    })
  } catch (error) {
    // Gérer les erreurs silencieusement
    console.warn('⚠️ Erreur auto-save (non-bloquante):', error)
    // Ne pas throw pour ne pas corrompre l'état
  }
}

/**
 * Vérifie si une sauvegarde existe
 */
export async function hasSave(): Promise<boolean> {
  try {
    const savedState = await loadGameState()
    return savedState !== null && savedState.phase !== 'start'
  } catch (error) {
    console.warn('Erreur vérification save:', error)
    return false
  }
}

/**
 * Obtient les informations de la sauvegarde (jour, phase) sans charger tout l'état
 */
export async function getSaveInfo(): Promise<{ day: number; phase: string } | null> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise<{ day: number; phase: string } | null>((resolve) => {
      const request = store.get('current')
      request.onsuccess = () => {
        const result = request.result
        if (result && result.day && result.phase) {
          resolve({
            day: result.day,
            phase: result.phase
          })
        } else {
          resolve(null)
        }
      }
      request.onerror = () => {
        console.warn('Erreur lecture save info:', request.error)
        resolve(null)
      }
    })
  } catch (error) {
    console.warn('Erreur getSaveInfo:', error)
    return null
  }
}
