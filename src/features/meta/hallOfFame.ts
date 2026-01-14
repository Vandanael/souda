import { ArchivedRun, GlobalStats } from './types'

const DB_NAME = 'souda_meta'
const STORE_NAME = 'hallOfFame'

/**
 * Ouvre la base de données IndexedDB pour le Hall of Fame
 */
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 4)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
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
 * Sauvegarde une run dans le Hall of Fame
 */
export async function saveRun(runData: ArchivedRun): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(runData)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

/**
 * Récupère toutes les runs archivées
 */
export async function getRuns(): Promise<ArchivedRun[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const runs = request.result as ArchivedRun[]
      // Trier par date (récent en haut)
      runs.sort((a, b) => b.timestamp - a.timestamp)
      resolve(runs)
    }
  })
}

/**
 * Récupère la meilleure run (plus de jours, puis plus d'or)
 */
export async function getBestRun(): Promise<ArchivedRun | null> {
  const runs = await getRuns()
  if (runs.length === 0) return null
  
  return runs.reduce((best, current) => {
    if (current.daysLived > best.daysLived) return current
    if (current.daysLived === best.daysLived && current.finalGold > best.finalGold) return current
    return best
  })
}

/**
 * Calcule les statistiques globales
 */
export async function getStats(): Promise<GlobalStats> {
  const runs = await getRuns()
  
  if (runs.length === 0) {
    return {
      totalRuns: 0,
      victories: 0,
      defeats: 0,
      bestDays: 0,
      bestGold: 0,
      totalLegendaryItems: 0,
      totalCombatsWon: 0,
      totalCombatsLost: 0
    }
  }
  
  const victories = runs.filter(r => r.endType === 'victory').length
  const defeats = runs.filter(r => r.endType !== 'victory').length
  const bestDays = Math.max(...runs.map(r => r.daysLived))
  const bestGold = Math.max(...runs.map(r => r.finalGold))
  const totalLegendaryItems = runs.reduce((sum, r) => sum + r.legendaryItems.length, 0)
  const totalCombatsWon = runs.reduce((sum, r) => sum + r.combatsWon, 0)
  const totalCombatsLost = runs.reduce((sum, r) => sum + r.combatsLost, 0)
  
  return {
    totalRuns: runs.length,
    victories,
    defeats,
    bestDays,
    bestGold,
    totalLegendaryItems,
    totalCombatsWon,
    totalCombatsLost
  }
}

/**
 * Efface toutes les runs du Hall of Fame
 */
export async function clearHallOfFame(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}
