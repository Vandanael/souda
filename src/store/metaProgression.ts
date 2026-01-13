import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Store de méta-progression (persistant entre les runs)
 * Gère l'XP globale, les niveaux et les unlocks
 */

export interface MetaProgressionState {
  // Progression
  globalXP: number
  playerLevel: number // 1-30
  
  // Unlocks
  unlockedOrigins: string[] // IDs des origines débloquées
  unlockedItems: string[] // IDs des items débloqués
  
  // Actions
  addXP: (amount: number) => { leveledUp: boolean; newLevel?: number; unlockedContent?: string[] }
  calculateRunXP: (daysSurvived: number, goldEarned: number, narrativeChoicesCount: number) => number
  levelUp: () => { leveledUp: boolean; newLevel?: number; unlockedContent?: string[] }
  unlockOrigin: (originId: string) => void
  unlockItem: (itemId: string) => void
  reset: () => void
}

/**
 * Calcule l'XP nécessaire pour un niveau donné
 * Formule généreuse au début : niveau 1→2 = 100 XP, puis croissance progressive
 */
function getXPForLevel(level: number): number {
  if (level <= 1) return 0
  if (level === 2) return 100 // Très généreux pour le premier niveau
  if (level <= 5) return 100 + (level - 2) * 150 // 100, 250, 400, 550
  if (level <= 10) return 550 + (level - 5) * 200 // 550, 750, 950, 1150, 1350, 1550
  if (level <= 20) return 1550 + (level - 10) * 300 // Croissance plus rapide
  return 4550 + (level - 20) * 500 // Niveaux élevés
}

/**
 * Calcule l'XP totale nécessaire pour atteindre un niveau
 */
function getTotalXPForLevel(level: number): number {
  let total = 0
  for (let i = 2; i <= level; i++) {
    total += getXPForLevel(i)
  }
  return total
}

const INITIAL_STATE = {
  globalXP: 0,
  playerLevel: 1,
  unlockedOrigins: ['deserteur'], // Déserteur toujours débloqué
  unlockedItems: []
}

export const useMetaProgressionStore = create<MetaProgressionState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      
      /**
       * Ajoute de l'XP et vérifie le level up
       */
      addXP: (amount: number) => {
        const state = get()
        const newXP = state.globalXP + amount
        set({ globalXP: newXP })
        
        // Vérifier le level up après avoir mis à jour l'XP
        return get().levelUp()
      },
      
      /**
       * Calcule l'XP gagnée pour une run
       * Formule : (Jours * 50) + (Or * 0.5) + (Choix * 20)
       */
      calculateRunXP: (daysSurvived: number, goldEarned: number, narrativeChoicesCount: number) => {
        const daysXP = daysSurvived * 50
        const goldXP = Math.floor(goldEarned * 0.5)
        const choicesXP = narrativeChoicesCount * 20
        
        return daysXP + goldXP + choicesXP
      },
      
      /**
       * Vérifie si le joueur peut level up et le fait si possible
       * Retourne les informations sur le level up et les unlocks
       */
      levelUp: () => {
        const state = get()
        let currentLevel = state.playerLevel
        let currentXP = state.globalXP
        const unlockedContent: string[] = []
        
        // Vérifier si on peut monter de niveau
        while (currentLevel < 30) {
          const xpNeededForNextLevel = getTotalXPForLevel(currentLevel + 1)
          
          if (currentXP >= xpNeededForNextLevel) {
            currentLevel++
            
            // Débloquer du contenu selon le niveau
            const unlocks = getUnlocksForLevel(currentLevel)
            unlockedContent.push(...unlocks)
            
            // Débloquer automatiquement
            unlocks.forEach(unlock => {
              if (unlock.startsWith('origin:')) {
                const originId = unlock.replace('origin:', '')
                if (!state.unlockedOrigins.includes(originId)) {
                  get().unlockOrigin(originId)
                }
              } else if (unlock.startsWith('item:')) {
                const itemId = unlock.replace('item:', '')
                if (!state.unlockedItems.includes(itemId)) {
                  get().unlockItem(itemId)
                }
              }
            })
          } else {
            break
          }
        }
        
        // Mettre à jour le niveau si nécessaire
        if (currentLevel > state.playerLevel) {
          set({ playerLevel: currentLevel })
          return {
            leveledUp: true,
            newLevel: currentLevel,
            unlockedContent
          }
        }
        
        return { leveledUp: false }
      },
      
      /**
       * Débloque une origine
       */
      unlockOrigin: (originId: string) => {
        const state = get()
        if (!state.unlockedOrigins.includes(originId)) {
          set({
            unlockedOrigins: [...state.unlockedOrigins, originId]
          })
        }
      },
      
      /**
       * Débloque un item
       */
      unlockItem: (itemId: string) => {
        const state = get()
        if (!state.unlockedItems.includes(itemId)) {
          set({
            unlockedItems: [...state.unlockedItems, itemId]
          })
        }
      },
      
      /**
       * Réinitialise la progression (pour les tests)
       */
      reset: () => {
        set(INITIAL_STATE)
      }
    }),
    {
      name: 'souda-meta-progression',
      storage: createJSONStorage(() => ({
        getItem: async (name: string): Promise<string | null> => {
          try {
            const db = await openMetaDB()
            const transaction = db.transaction(['metaProgression'], 'readonly')
            const store = transaction.objectStore('metaProgression')
            return new Promise((resolve, reject) => {
              const request = store.get(name)
              request.onsuccess = () => {
                const result = request.result
                resolve(result ? JSON.stringify(result.value) : null)
              }
              request.onerror = () => reject(request.error)
            })
          } catch (error) {
            console.error('Erreur chargement méta-progression:', error)
            return null
          }
        },
        setItem: async (name: string, value: string): Promise<void> => {
          try {
            const db = await openMetaDB()
            const transaction = db.transaction(['metaProgression'], 'readwrite')
            const store = transaction.objectStore('metaProgression')
            return new Promise((resolve, reject) => {
              const request = store.put({ key: name, value: JSON.parse(value) })
              request.onsuccess = () => resolve()
              request.onerror = () => reject(request.error)
            })
          } catch (error) {
            console.error('Erreur sauvegarde méta-progression:', error)
          }
        },
        removeItem: async (name: string): Promise<void> => {
          try {
            const db = await openMetaDB()
            const transaction = db.transaction(['metaProgression'], 'readwrite')
            const store = transaction.objectStore('metaProgression')
            return new Promise((resolve, reject) => {
              const request = store.delete(name)
              request.onsuccess = () => resolve()
              request.onerror = () => reject(request.error)
            })
          } catch (error) {
            console.error('Erreur suppression méta-progression:', error)
          }
        }
      }))
    }
  )
)

/**
 * Ouvre la base de données IndexedDB pour la méta-progression
 */
function openMetaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'))
      return
    }
    
    const request = indexedDB.open('souda_meta', 4)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      // Créer les object stores nécessaires
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
 * Retourne les unlocks pour un niveau donné
 */
function getUnlocksForLevel(level: number): string[] {
  const unlocks: string[] = []
  
  // Niveau 2 : Origine Vétéran
  if (level === 2) {
    unlocks.push('origin:veteran')
  }
  
  // Niveau 5 : Origine Pillard
  if (level === 5) {
    unlocks.push('origin:pillard')
  }
  
  // Niveau 8 : Origine Moine
  if (level === 8) {
    unlocks.push('origin:moine')
  }
  
  // Niveau 12 : Origine Noble
  if (level === 12) {
    unlocks.push('origin:noble')
  }
  
  // Niveau 15 : Origine Survivant
  if (level === 15) {
    unlocks.push('origin:survivant')
  }
  
  // Niveaux 10, 15, 20, 25, 30 : Items spéciaux
  if (level === 10) {
    unlocks.push('item:heavy_weapons')
  }
  if (level === 15) {
    unlocks.push('item:plate_armor')
  }
  if (level === 20) {
    unlocks.push('item:legendary_items')
  }
  if (level === 25) {
    unlocks.push('item:noble_set')
  }
  if (level === 30) {
    unlocks.push('item:master_set')
  }
  
  return unlocks
}

/**
 * Utilitaires pour obtenir les informations de progression
 */
export function getXPProgress(globalXP: number, level: number): {
  currentLevelXP: number
  nextLevelXP: number
  progress: number // 0-1
} {
  const currentLevelTotalXP = getTotalXPForLevel(level)
  const nextLevelTotalXP = getTotalXPForLevel(level + 1)
  
  const currentLevelXP = globalXP - currentLevelTotalXP
  const nextLevelXP = nextLevelTotalXP - currentLevelTotalXP
  
  const progress = level >= 30 ? 1 : currentLevelXP / nextLevelXP
  
  return {
    currentLevelXP,
    nextLevelXP,
    progress: Math.max(0, Math.min(1, progress))
  }
}
