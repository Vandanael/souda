/**
 * Persistance du flag tutorialCompleted
 */

const DB_NAME = 'souda_meta'
const STORE_NAME = 'tutorial'

/**
 * Charge l'état du tutorial depuis IndexedDB
 */
export async function loadTutorialState(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(false)
      return
    }
    
    const request = indexedDB.open(DB_NAME, 4) // Version 4 pour créer tous les object stores
    
    request.onerror = () => {
      console.error('Erreur chargement tutorial state')
      resolve(false)
    }
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      // Créer tous les object stores nécessaires
      if (!db.objectStoreNames.contains('tutorial')) {
        db.createObjectStore('tutorial')
      }
      if (!db.objectStoreNames.contains('unlocks')) {
        db.createObjectStore('unlocks')
      }
      if (!db.objectStoreNames.contains('hallOfFame')) {
        db.createObjectStore('hallOfFame', { keyPath: 'id' })
      }
    }
    
    request.onsuccess = () => {
      const db = request.result
      
      // Vérifier si l'object store existe
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.warn('Object store tutorial n\'existe pas, retour false')
        resolve(false)
        return
      }
      
      try {
        const transaction = db.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const getRequest = store.get('completed')
        
        getRequest.onerror = () => {
          console.error('Erreur lecture tutorial state')
          resolve(false)
        }
        
        getRequest.onsuccess = () => {
          const result = getRequest.result
          resolve(result === true)
        }
      } catch (error) {
        console.error('Erreur lors de l\'accès à l\'object store tutorial:', error)
        resolve(false)
      }
    }
  })
}

/**
 * Sauvegarde l'état du tutorial dans IndexedDB
 */
export async function saveTutorialState(completed: boolean): Promise<void> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve()
      return
    }
    
    const request = indexedDB.open(DB_NAME, 4) // Version 4 pour créer tous les object stores
    
    request.onerror = () => {
      console.error('Erreur sauvegarde tutorial state')
      resolve()
    }
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      // Créer tous les object stores nécessaires
      if (!db.objectStoreNames.contains('metaProgression')) {
        db.createObjectStore('metaProgression')
      }
      if (!db.objectStoreNames.contains('tutorial')) {
        db.createObjectStore('tutorial')
      }
      if (!db.objectStoreNames.contains('unlocks')) {
        db.createObjectStore('unlocks')
      }
      if (!db.objectStoreNames.contains('hallOfFame')) {
        db.createObjectStore('hallOfFame', { keyPath: 'id' })
      }
    }
    
    request.onsuccess = () => {
      const db = request.result
      
      // Vérifier si l'object store existe
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.warn('Object store tutorial n\'existe pas, impossible de sauvegarder')
        resolve()
        return
      }
      
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const putRequest = store.put(completed, 'completed')
        
        putRequest.onerror = () => {
          console.error('Erreur écriture tutorial state')
          resolve()
        }
        
        putRequest.onsuccess = () => {
          resolve()
        }
      } catch (error) {
        console.error('Erreur lors de l\'accès à l\'object store tutorial:', error)
        resolve()
      }
    }
  })
}
