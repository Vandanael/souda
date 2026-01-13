import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveRun, getRuns, getBestRun, getStats } from './hallOfFame'
import { checkUnlocks, loadUnlockState, saveUnlockState } from './unlocks'
import { isOriginUnlocked, getOriginById } from './origins'
import { ArchivedRun, UnlockState } from './types'

// Mock IndexedDB
const mockStores: Record<string, Record<string, any>> = {
  hallOfFame: {},
  unlocks: {}
}

beforeEach(() => {
  // Reset mocks
  mockStores.hallOfFame = {}
  mockStores.unlocks = {}
  
  // Mock IndexedDB
  global.indexedDB = {
    open: vi.fn((_name: string, _version?: number) => {
      const request: any = {
        result: null,
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null
      }
      
      // Simulate database creation
      const db: any = {
        transaction: vi.fn((_stores: string[], _mode: string = 'readonly') => {
          const transaction: any = {
            objectStore: vi.fn((storeName: string) => {
              const store = mockStores[storeName] || {}
              
              return {
                add: (data: any) => {
                  const id = data.id || crypto.randomUUID()
                  store[id] = data
                  const addRequest: any = {
                    onsuccess: null,
                    onerror: null
                  }
                  setTimeout(() => {
                    if (addRequest.onsuccess) {
                      addRequest.onsuccess({ target: addRequest } as any)
                    }
                  }, 0)
                  return addRequest
                },
                put: (data: any, key?: string) => {
                  const id = key || data.id || 'state'
                  store[id] = data
                  const putRequest: any = {
                    onsuccess: null,
                    onerror: null
                  }
                  setTimeout(() => {
                    if (putRequest.onsuccess) {
                      putRequest.onsuccess({ target: putRequest } as any)
                    }
                  }, 0)
                  return putRequest
                },
                get: (key: string) => {
                  const getRequest: any = {
                    result: store[key],
                    onsuccess: null,
                    onerror: null
                  }
                  setTimeout(() => {
                    if (getRequest.onsuccess) {
                      getRequest.onsuccess({ target: getRequest } as any)
                    }
                  }, 0)
                  return getRequest
                },
                getAll: () => {
                  const getAllRequest: any = {
                    result: Object.values(store),
                    onsuccess: null,
                    onerror: null
                  }
                  setTimeout(() => {
                    if (getAllRequest.onsuccess) {
                      getAllRequest.onsuccess({ target: getAllRequest } as any)
                    }
                  }, 0)
                  return getAllRequest
                }
              }
            })
          }
          return transaction
        })
      }
      
      // Create object stores if needed
      if (request.onupgradeneeded) {
        const upgradeEvent: any = {
          target: { result: db }
        }
        request.onupgradeneeded(upgradeEvent)
      }
      
      request.result = db
      
      // Simulate success
      setTimeout(() => {
        if (request.onsuccess) {
          request.onsuccess({ target: request } as any)
        }
      }, 0)
      
      return request
    })
  } as any
})

describe('Hall of Fame', () => {
  it('sauvegarde une run', async () => {
    const runData: ArchivedRun = {
      id: 'test-run-1',
      timestamp: Date.now(),
      characterName: 'Test',
      origin: 'deserteur',
      daysLived: 10,
      finalGold: 100,
      finalDebt: 0,
      finalReputation: 3,
      endType: 'victory',
      endTitle: 'Le Survivant',
      legendaryItems: [],
      combatsWon: 5,
      combatsFled: 2,
      combatsLost: 1,
      totalGoldEarned: 200,
      counters: { cynisme: 0, humanite: 0, pragmatisme: 0 }
    }
    
    await saveRun(runData)
    const runs = await getRuns()
    
    expect(runs.length).toBeGreaterThan(0)
    expect(runs.find(r => r.id === runData.id)).toBeDefined()
  })
  
  it('récupère toutes les runs', async () => {
    const run1: ArchivedRun = {
      id: 'test-run-1',
      timestamp: Date.now() - 1000,
      characterName: 'Test 1',
      origin: 'deserteur',
      daysLived: 5,
      finalGold: 50,
      finalDebt: 0,
      finalReputation: 2,
      endType: 'victory',
      endTitle: 'Le Survivant',
      legendaryItems: [],
      combatsWon: 3,
      combatsFled: 1,
      combatsLost: 0,
      totalGoldEarned: 100,
      counters: { cynisme: 0, humanite: 0, pragmatisme: 0 }
    }
    
    const run2: ArchivedRun = {
      id: 'test-run-2',
      timestamp: Date.now(),
      characterName: 'Test 2',
      origin: 'veteran',
      daysLived: 15,
      finalGold: 150,
      finalDebt: 0,
      finalReputation: 4,
      endType: 'victory',
      endTitle: 'Le Seigneur',
      legendaryItems: ['Lame des Anciens'],
      combatsWon: 10,
      combatsFled: 0,
      combatsLost: 2,
      totalGoldEarned: 300,
      counters: { cynisme: 1, humanite: 2, pragmatisme: 0 }
    }
    
    await saveRun(run1)
    await saveRun(run2)
    const runs = await getRuns()
    
    expect(runs.length).toBeGreaterThanOrEqual(2)
    // Vérifier que les runs sont triées par date (récent en haut)
    expect(runs[0].timestamp).toBeGreaterThanOrEqual(runs[1].timestamp)
  })
  
  it('récupère la meilleure run', async () => {
    const run1: ArchivedRun = {
      id: 'test-run-1',
      timestamp: Date.now(),
      characterName: 'Test 1',
      origin: 'deserteur',
      daysLived: 5,
      finalGold: 50,
      finalDebt: 0,
      finalReputation: 2,
      endType: 'victory',
      endTitle: 'Le Survivant',
      legendaryItems: [],
      combatsWon: 3,
      combatsFled: 1,
      combatsLost: 0,
      totalGoldEarned: 100,
      counters: { cynisme: 0, humanite: 0, pragmatisme: 0 }
    }
    
    const run2: ArchivedRun = {
      id: 'test-run-2',
      timestamp: Date.now(),
      characterName: 'Test 2',
      origin: 'veteran',
      daysLived: 20,
      finalGold: 200,
      finalDebt: 0,
      finalReputation: 5,
      endType: 'victory',
      endTitle: 'Le Seigneur',
      legendaryItems: ['Lame des Anciens'],
      combatsWon: 15,
      combatsFled: 0,
      combatsLost: 1,
      totalGoldEarned: 400,
      counters: { cynisme: 2, humanite: 3, pragmatisme: 1 }
    }
    
    await saveRun(run1)
    await saveRun(run2)
    const bestRun = await getBestRun()
    
    expect(bestRun).toBeDefined()
    expect(bestRun!.daysLived).toBe(20)
    expect(bestRun!.finalGold).toBe(200)
  })
  
  it('calcule les statistiques globales', async () => {
    const run1: ArchivedRun = {
      id: 'test-run-1',
      timestamp: Date.now(),
      characterName: 'Test 1',
      origin: 'deserteur',
      daysLived: 10,
      finalGold: 100,
      finalDebt: 0,
      finalReputation: 3,
      endType: 'victory',
      endTitle: 'Le Survivant',
      legendaryItems: ['Item 1'],
      combatsWon: 5,
      combatsFled: 2,
      combatsLost: 1,
      totalGoldEarned: 200,
      counters: { cynisme: 0, humanite: 0, pragmatisme: 0 }
    }
    
    const run2: ArchivedRun = {
      id: 'test-run-2',
      timestamp: Date.now(),
      characterName: 'Test 2',
      origin: 'veteran',
      daysLived: 5,
      finalGold: 50,
      finalDebt: 100,
      finalReputation: 2,
      endType: 'death',
      endTitle: 'Mort au Combat',
      legendaryItems: [],
      combatsWon: 2,
      combatsFled: 1,
      combatsLost: 3,
      totalGoldEarned: 100,
      counters: { cynisme: 1, humanite: 0, pragmatisme: 0 }
    }
    
    await saveRun(run1)
    await saveRun(run2)
    const stats = await getStats()
    
    expect(stats.totalRuns).toBeGreaterThanOrEqual(2)
    expect(stats.victories).toBeGreaterThanOrEqual(1)
    expect(stats.defeats).toBeGreaterThanOrEqual(1)
    expect(stats.bestDays).toBeGreaterThanOrEqual(10)
    expect(stats.totalLegendaryItems).toBeGreaterThanOrEqual(1)
  })
})

describe('Unlocks', () => {
  it('charge l\'état initial des unlocks', async () => {
    const unlocks = await loadUnlockState()
    
    expect(unlocks.origins).toContain('deserteur')
    expect(unlocks.itemPoolAdditions).toEqual([])
    expect(unlocks.globalCounters.totalLoots).toBe(0)
  })
  
  it('sauvegarde et charge l\'état des unlocks', async () => {
    const unlocks: UnlockState = {
      origins: ['deserteur', 'veteran'],
      itemPoolAdditions: ['heavy_weapons'],
      achievements: [],
      globalCounters: {
        totalLoots: 50,
        totalMonasteries: 5,
        totalDaysSurvived: 20,
        totalFlees: 3,
        totalGoldEarned: 500,
        victories: 1,
        defeats: 0
      }
    }
    
    await saveUnlockState(unlocks)
    const loaded = await loadUnlockState()
    
    expect(loaded.origins).toContain('deserteur')
    expect(loaded.origins).toContain('veteran')
    expect(loaded.itemPoolAdditions).toContain('heavy_weapons')
    expect(loaded.globalCounters.totalLoots).toBe(50)
  })
  
  it('vérifie et met à jour les unlocks après une run', async () => {
    const currentUnlocks: UnlockState = {
      origins: ['deserteur'],
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
    }
    
    const runData: Partial<ArchivedRun> = {
      daysLived: 10,
      combatsFled: 3,
      totalGoldEarned: 250,
      endType: 'victory',
      endTitle: 'Le Seigneur'
    }
    
    const newUnlocks = await checkUnlocks(runData, currentUnlocks)
    
    expect(newUnlocks.globalCounters.totalDaysSurvived).toBe(10)
    expect(newUnlocks.globalCounters.totalFlees).toBe(3)
    expect(newUnlocks.globalCounters.totalGoldEarned).toBe(250)
    expect(newUnlocks.globalCounters.victories).toBe(1)
    expect(newUnlocks.itemPoolAdditions).toContain('heavy_weapons') // Jour 5 atteint
    expect(newUnlocks.itemPoolAdditions).toContain('plate_armor') // Jour 10 atteint
    expect(newUnlocks.itemPoolAdditions).toContain('noble_set') // Victoire "Le Seigneur"
  })
  
  it('débloque l\'origine Vétéran après 1 victoire', async () => {
    const currentUnlocks: UnlockState = {
      origins: ['deserteur'],
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
    }
    
    const runData: Partial<ArchivedRun> = {
      daysLived: 20,
      endType: 'victory',
      endTitle: 'Le Survivant'
    }
    
    const newUnlocks = await checkUnlocks(runData, currentUnlocks)
    
    expect(newUnlocks.origins).toContain('veteran')
  })
})

describe('Origins', () => {
  it('vérifie si une origine est débloquée', () => {
    const unlockState: UnlockState = {
      origins: ['deserteur', 'veteran'],
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
    }
    
    expect(isOriginUnlocked('deserteur', unlockState)).toBe(true)
    expect(isOriginUnlocked('veteran', unlockState)).toBe(true)
    expect(isOriginUnlocked('pillard', unlockState)).toBe(false)
  })
  
  it('récupère une origine par son ID', () => {
    const origin = getOriginById('deserteur')
    
    expect(origin).toBeDefined()
    expect(origin!.id).toBe('deserteur')
    expect(origin!.name).toBe('Déserteur')
  })
  
  it('retourne undefined pour une origine inexistante', () => {
    const origin = getOriginById('inexistant')
    
    expect(origin).toBeUndefined()
  })
})
