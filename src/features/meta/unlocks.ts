import { UnlockState, ArchivedRun } from './types'
import { getRuns } from './hallOfFame'
import { ORIGINS } from './origins'

/**
 * Vérifie et met à jour les unlocks selon les conditions
 */
export async function checkUnlocks(
  runData: Partial<ArchivedRun>,
  currentUnlocks: UnlockState
): Promise<UnlockState> {
  const newUnlocks = { ...currentUnlocks }
  
  // Mettre à jour les compteurs globaux
  if (runData.daysLived) {
    newUnlocks.globalCounters.totalDaysSurvived += runData.daysLived
  }
  if (runData.combatsFled) {
    newUnlocks.globalCounters.totalFlees += runData.combatsFled
  }
  if (runData.totalGoldEarned) {
    newUnlocks.globalCounters.totalGoldEarned += runData.totalGoldEarned
  }
  if (runData.endType === 'victory') {
    newUnlocks.globalCounters.victories += 1
  } else {
    newUnlocks.globalCounters.defeats += 1
  }
  
  // Vérifier les origines
  for (const origin of ORIGINS) {
    if (!newUnlocks.origins.includes(origin.id)) {
      if (origin.id === 'noble') {
        // Vérifier dans les runs archivées si une run a atteint > 200 or
        const runs = await getRuns()
        const hasHighGoldRun = runs.some(r => r.finalGold > 200)
        if (hasHighGoldRun && !newUnlocks.origins.includes('noble')) {
          newUnlocks.origins.push('noble')
        }
      } else if (origin.unlockCondition(newUnlocks)) {
        if (!newUnlocks.origins.includes(origin.id)) {
          newUnlocks.origins.push(origin.id)
        }
      }
    }
  }
  
  // Vérifier les items débloqués
  // Jour 5 atteint (1×) → Armes lourdes
  if (runData.daysLived && runData.daysLived >= 5) {
    if (!newUnlocks.itemPoolAdditions.includes('heavy_weapons')) {
      newUnlocks.itemPoolAdditions.push('heavy_weapons')
    }
  }
  
  // Jour 10 atteint (1×) → Armures plaques
  if (runData.daysLived && runData.daysLived >= 10) {
    if (!newUnlocks.itemPoolAdditions.includes('plate_armor')) {
      newUnlocks.itemPoolAdditions.push('plate_armor')
    }
  }
  
  // 20 jours survécus total → Items légendaires
  if (newUnlocks.globalCounters.totalDaysSurvived >= 20) {
    if (!newUnlocks.itemPoolAdditions.includes('legendary_items')) {
      newUnlocks.itemPoolAdditions.push('legendary_items')
    }
  }
  
  // Victoire "Le Seigneur" → Set "Noble"
  if (runData.endTitle === 'Le Seigneur') {
    if (!newUnlocks.itemPoolAdditions.includes('noble_set')) {
      newUnlocks.itemPoolAdditions.push('noble_set')
    }
  }
  
  return newUnlocks
}

/**
 * Charge l'état des unlocks depuis IndexedDB
 */
export async function loadUnlockState(): Promise<UnlockState> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('souda_meta', 4)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['unlocks'], 'readonly')
      const store = transaction.objectStore('unlocks')
      const getRequest = store.get('state')
      
      getRequest.onerror = () => reject(getRequest.error)
      getRequest.onsuccess = () => {
        const result = getRequest.result
        if (result) {
          resolve(result as UnlockState)
        } else {
          // État initial
          resolve({
            origins: ['deserteur'], // Déserteur toujours débloqué
            itemPoolAdditions: [],
            achievements: [],
            globalCounters: {
              totalLoots: 0,
              totalMonasteries: 0,
              totalDaysSurvived: 0,
              totalFlees: 0,
              totalGoldEarned: 0,
              victories: 0,
              defeats: 0
            }
          })
        }
      }
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
  })
}

/**
 * Sauvegarde l'état des unlocks dans IndexedDB
 */
export async function saveUnlockState(unlockState: UnlockState): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('souda_meta', 4)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['unlocks'], 'readwrite')
      const store = transaction.objectStore('unlocks')
      const putRequest = store.put(unlockState, 'state')
      
      putRequest.onerror = () => reject(putRequest.error)
      putRequest.onsuccess = () => resolve()
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
  })
}
