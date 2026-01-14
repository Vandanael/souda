import { create } from 'zustand'
import { type CombatResult, type DurabilityLoss } from '../features/combat'
import { generateLoot } from '../features/loot'
import { CURSED_ITEMS } from '../features/items/cursedItems'
import { applyDurabilityLoss, isItemBroken } from '../features/durability'
import { generateDailyLocations, resolveExploration } from '../features/exploration'
import { GameManager } from '../features/game/gameManager'
import { saveGameState, autoSave } from '../features/game/saveSystem'
import { calculateSellPrice, calculateBuyPrice } from '../features/economy/priceCalculation'
import { calculateRepairCost, repairItem as repairItemLogic } from '../features/forge/forge.logic'
import { generateDailyRumors, type Rumor } from '../features/taverne/rumors.logic'
import { type CharacterArc, initializeCharacterArc, getCurrentStoryStage, updateTrustLevel, MORTEN_ARC_CONFIG } from '../features/narrative/characterArcs'
import { eventManager } from '../features/events/eventManager'
import { getRandomEnemy, type Enemy } from '../types/enemy'
import { Item } from '../types/item'
import { Location, ExplorationResult, normalizeLocation, LOCATION_TYPES } from '../types/location'
import { calculateStatsFromEquipment, type PlayerStats } from '../utils/stats'
import { audioManager } from '../features/audio/audioManager'
import { getOriginById } from '../features/meta/origins'
import { RelicInstance } from '../types/relic'
import { addFragmentsAndMaybeCreate, gainRelicXp } from '../features/relics/relics.logic'
import { getRelicGoldMultiplier, getRelicReputationModifier } from '../features/relics/relics.bonus'
import { BALANCE_CONFIG } from '../config/balance'

export type GamePhase = 'start' | 'origin' | 'tutorial' | 'aube' | 'exploration' | 'crepuscule' | 'defeat' | 'victory' | 'inventory' | 'marche' | 'morten' | 'forge' | 'taverne' | 'narrative' | 'hallOfFame' | 'settings' | 'reliques' | 'fragmentCollection'

export interface GameState {
  // Progression
  day: number
  phase: GamePhase
  
  // Économie
  debt: number
  gold: number
  reputation: 1 | 2 | 3 | 4 | 5 // Réputation (⭐)
  
  // Marché
  marketStock: Item[]
  marketStockDay: number // Jour où le stock a été généré
  
  // Forge
  forgeStock: Item | null // Item rare/légendaire disponible (20% chance/jour)
  forgeStockDay: number
  
  // Taverne
  npcFlags: Record<string, boolean> // Flags de dialogues PNJ
  rumors: Rumor[] // Rumeurs du jour
  hasEatenToday: boolean // Si le joueur a mangé aujourd'hui
  
  // Événements narratifs
  narrativeCounters: Record<string, number> // cynisme, humanite, pragmatisme
  triggeredEvents: string[] // IDs des événements one-time déjà déclenchés
  eventCooldowns: Record<string, number> // Jour de dernier déclenchement par événement (pour cooldown)
  recentMonologues: string[] // Historique des monologues récents (max 5, pour éviter répétitions)
  
  // Arcs narratifs des personnages
  characterArcs: Record<string, CharacterArc> // Suivi des arcs narratifs par characterId
  
  // Méta-progression
  selectedOrigin: string // ID de l'origine sélectionnée
  
  // Reliques
  relics: RelicInstance[]
  relicFragments: Record<string, number>
  
  // Équipement et inventaire
  equipment: Partial<Record<string, Item>>
  inventory: Item[]
  
  // Stats calculées (dérivées de l'équipement)
  playerStats: PlayerStats
  
  // Actions
  actionsRemaining: number
  
  // Exploration
  dailyLocations: Location[]
  persistentLocations: Location[] // Lieux persistants entre les jours
  
  // Événement en cours
  currentEvent: 'none' | 'loot' | 'combat' | 'choice' | 'empty'
  eventResult: any | null
  combatResult: CombatResult | null
  lootedItem: Item | null
  currentEnemy: Enemy | null
  explorationResult: ExplorationResult | null
  
  // Statistiques de run
  combatsWon: number
  combatsFled: number
  combatsLost: number
  legendaryItemsFound: number
  
  // Actions
  setPhase: (phase: GamePhase) => void
  startNewGame: (originId: string) => void
  startDay: () => void
  goToExploration: () => void
  exploreLocation: (location: Location) => void
  finishEvent: () => void
  endDay: () => void
  handleDefeat: () => void
  resetGame: () => void
  addItemToInventory: (item: Item) => void
  equipItem: (item: Item) => void
  unequipItem: (slot: string) => void
  openInventory: () => void
  closeInventory: () => void
  
  // Actions économie
  sellItem: (item: Item) => void
  buyItem: (item: Item) => boolean
  repayDebt: (amount: number) => boolean
  buyMeal: () => boolean // Acheter un repas à la taverne
  generateMarketStock: () => void
  
  // Actions forge
  repairItem: (item: Item) => boolean
  buyForgeItem: (item: Item) => boolean
  generateForgeStock: () => void
  
  // Actions taverne
  setNPCFlag: (flag: string, value: boolean) => void
  generateRumors: () => void
  
  // Actions événements
  triggerNarrativeEvent: (eventId: string) => void
  applyEventConsequence: (consequence: any) => void
  incrementCounter: (counter: string, amount: number) => void
  
  // Actions arcs narratifs
  initCharacterArc: (characterId: string) => void
  updateCharacterArc: (characterId: string, updates: Partial<CharacterArc>) => void
  getCharacterArc: (characterId: string) => CharacterArc | null
  updateCharacterTrust: (characterId: string, action: 'repay' | 'ignore' | 'negotiate', amount?: number) => void
}

// Équipement de départ
const STARTING_EQUIPMENT: Partial<Record<string, Item>> = {
  weapon: {
    id: 'sword_chipped',
    name: 'Épée Ébréchée',
    slot: 'weapon',
    rarity: 'common',
    stats: { atk: 8, def: 0, vit: 0 },
    durability: 100,
    maxDurability: 100,
    properties: [],
    value: 10,
    description: 'Ton épée de départ. Elle a vu des combats.'
  },
  torso: {
    id: 'leather_armor',
    name: 'Armure de Cuir',
    slot: 'torso',
    rarity: 'common',
    stats: { atk: 0, def: 6, vit: 0 },
    durability: 100,
    maxDurability: 100,
    properties: [],
    value: 8,
    description: 'Une armure usée mais solide.'
  },
  legs: {
    id: 'boots_worn',
    name: 'Bottes Usées',
    slot: 'legs',
    rarity: 'common',
    stats: { atk: 0, def: 2, vit: 3 },
    durability: 100,
    maxDurability: 100,
    properties: ['light'],
    value: 10,
    description: 'Usées mais confortables. Tu bouges mieux.'
  }
}

const INITIAL_STATE = {
  day: 1,
  phase: 'start' as GamePhase,
  debt: 80,
  gold: 0,
  reputation: 3 as 1 | 2 | 3 | 4 | 5,
  marketStock: [] as Item[],
  marketStockDay: 0,
  equipment: STARTING_EQUIPMENT,
  inventory: [] as Item[],
  playerStats: calculateStatsFromEquipment(STARTING_EQUIPMENT),
  actionsRemaining: 3,
  dailyLocations: [] as Location[],
  currentEvent: 'none' as const,
  eventResult: null,
  combatResult: null as CombatResult | null,
  lootedItem: null as Item | null,
  currentEnemy: null as Enemy | null,
  explorationResult: null as ExplorationResult | null,
  combatsWon: 0,
  combatsFled: 0,
  combatsLost: 0,
  legendaryItemsFound: 0,
  forgeStock: null as Item | null,
  forgeStockDay: 0,
  npcFlags: {} as Record<string, boolean>,
  rumors: [] as Rumor[],
  hasEatenToday: false,
  persistentLocations: [] as Location[],
  narrativeCounters: {} as Record<string, number>,
  triggeredEvents: [] as string[],
  eventCooldowns: {} as Record<string, number>,
  recentMonologues: [] as string[],
  selectedOrigin: 'deserteur' as string,
  characterArcs: {} as Record<string, CharacterArc>,
  relics: [] as RelicInstance[],
  relicFragments: {} as Record<string, number>
}

/**
 * Calcule la progression de la dette vers l'objectif
 * @param debt Dette actuelle
 * @param _day Jour actuel (non utilisé actuellement)
 * @returns Progression avec current, target, percentage, et status
 */
export function calculateDebtProgress(debt: number, _day: number): {
  current: number
  target: number
  percentage: number
  status: 'ahead' | 'behind' | 'on_track'
  difference: number
  message: string
} {
  const TOTAL_DAYS = 20
  const INITIAL_DEBT = BALANCE_CONFIG.economy.initialDebt
  const DAILY_INTEREST = BALANCE_CONFIG.economy.dailyInterest
  
  // Objectif : 0💰 au Jour 20
  // Dette finale si rien payé : 80 + (5 × 19) = 175💰
  const targetDebt = INITIAL_DEBT + (DAILY_INTEREST * (TOTAL_DAYS - 1)) // 175💰
  
  // Différence par rapport à l'objectif final
  const difference = debt - targetDebt
  
  // Status basé sur la différence
  let status: 'ahead' | 'behind' | 'on_track'
  if (difference < -20) {
    status = 'ahead' // En avance de plus de 20💰
  } else if (difference > 20) {
    status = 'behind' // En retard de plus de 20💰
  } else {
    status = 'on_track' // Dans la marge
  }
  
  // Pourcentage : 0% = dette actuelle, 100% = objectif final
  // Mais on veut afficher le pourcentage de progression vers 0
  const percentage = Math.max(0, Math.min(100, ((targetDebt - debt) / targetDebt) * 100))
  
  // Message
  let message = ''
  if (status === 'ahead') {
    message = `En avance de ${Math.abs(difference).toFixed(0)}💰`
  } else if (status === 'behind') {
    message = `En retard de ${difference.toFixed(0)}💰`
  } else {
    message = 'Sur la bonne voie'
  }
  
  return {
    current: debt,
    target: targetDebt,
    percentage,
    status,
    difference,
    message
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  ...INITIAL_STATE,
  
  // Actions
  setPhase: (phase: GamePhase) => {
    console.log('🟢 setPhase appelé avec:', phase)
    const state = get()
    
    // Vérifier les événements si on passe à la taverne
    if (phase === 'taverne') {
      const event = eventManager.checkEvents(state, 'taverne')
      if (event) {
        const { triggeredEvents, eventCooldowns } = eventManager.markEventTriggered(event.id, state.day, state)
        set({
          phase: 'narrative',
          currentEvent: 'choice',
          eventResult: {
            type: 'narrative',
            eventId: event.id
          },
          triggeredEvents,
          eventCooldowns
        })
        saveGameState(get())
        return
      }
    }
    
    set({ phase })
    console.log('🟢 Phase mise à jour dans le store:', get().phase)
    
    // Sauvegarder de manière asynchrone pour ne pas bloquer
    saveGameState(get()).catch(err => {
      console.error('Erreur sauvegarde après setPhase:', err)
    })
    
    // Auto-save pour les phases critiques (narrative, etc.)
    const criticalPhases: GamePhase[] = ['narrative', 'defeat', 'victory']
    if (criticalPhases.includes(phase)) {
      autoSave(get()).catch(() => {}) // Ignorer les erreurs silencieusement
    }
  },
  
  startNewGame: (originId: string) => {
    const origin = getOriginById(originId)
    
    // Plus de tutorial pour l'instant - aller directement à l'aube
    let initialEquipment = { ...STARTING_EQUIPMENT }
    let initialInventory: Item[] = []
    
    let newState = {
      ...INITIAL_STATE,
      phase: 'aube' as GamePhase,
      selectedOrigin: originId,
      equipment: initialEquipment,
      inventory: initialInventory,
      playerStats: calculateStatsFromEquipment(initialEquipment)
    }
    
    // Appliquer les bonus/malus de l'origine
    if (origin) {
      if (origin.bonuses.gold) {
        newState.gold += origin.bonuses.gold
      }
      if (origin.maluses.gold) {
        newState.gold = Math.max(0, newState.gold + origin.maluses.gold)
      }
      if (origin.maluses.debt) {
        newState.debt += origin.maluses.debt
      }
      if (origin.bonuses.reputation) {
        newState.reputation = Math.min(5, Math.max(1, newState.reputation + origin.bonuses.reputation)) as 1 | 2 | 3 | 4 | 5
      }
      if (origin.maluses.reputation) {
        newState.reputation = Math.min(5, Math.max(1, newState.reputation - origin.maluses.reputation)) as 1 | 2 | 3 | 4 | 5
      }
      
      // Appliquer les bonus/malus de stats sur l'équipement
      if (origin.bonuses.stats || origin.maluses.stats) {
        const newEquipment = { ...newState.equipment }
        Object.entries(newEquipment).forEach(([slot, item]) => {
          if (item) {
            const newStats = { ...item.stats }
            if (origin.bonuses.stats) {
              newStats.atk = (newStats.atk || 0) + (origin.bonuses.stats.atk || 0)
              newStats.def = (newStats.def || 0) + (origin.bonuses.stats.def || 0)
              newStats.vit = (newStats.vit || 0) + (origin.bonuses.stats.vit || 0)
            }
            if (origin.maluses.stats) {
              newStats.atk = Math.max(0, (newStats.atk || 0) + (origin.maluses.stats.atk || 0))
              newStats.def = Math.max(0, (newStats.def || 0) + (origin.maluses.stats.def || 0))
              newStats.vit = Math.max(0, (newStats.vit || 0) + (origin.maluses.stats.vit || 0))
            }
            newEquipment[slot] = { ...item, stats: newStats }
          }
        })
        newState.equipment = newEquipment
        newState.playerStats = calculateStatsFromEquipment(newEquipment)
      }
    }
    
    // Initialiser l'arc narratif de Morten
    newState.characterArcs = {
      morten: initializeCharacterArc('morten', newState.day)
    }
    
    // Mettre à jour le stage initial de Morten
    const mortenArc = newState.characterArcs.morten
    mortenArc.storyStage = getCurrentStoryStage(
      MORTEN_ARC_CONFIG,
      newState.day,
      newState.debt,
      mortenArc.trustLevel,
      mortenArc.flags
    )
    
    set(newState)
    saveGameState(newState)
  },
  
  startDay: () => {
    const state = get()
    
    // P0.4 - Mécanisme de secours : Anti-soft-lock (Or = 0 + Faim = 0)
    // Si or = 0 et actions = 0 et pas mangé, forcer 1 action gratuite (mendicité)
    if (state.gold === 0 && state.actionsRemaining === 0 && !state.hasEatenToday && state.day > 1) {
      set({
        hasEatenToday: false,
        actionsRemaining: 1 // Action gratuite pour éviter soft-lock
      })
      console.log('⚠️ Mécanisme de secours activé : 1 action gratuite (mendicité)')
      return // Sortir pour éviter la pénalité de faim
    }
    
    // Réinitialiser hasEatenToday au début du jour
    // Si le joueur n'a pas mangé hier, appliquer pénalité
    if (!state.hasEatenToday && state.day > 1) {
      // FIX: Audit 2 - Pénalité augmentée de -1 à -2 actions pour équilibrer le système de faim
      // Pénalité : -2 actions pour le jour (fatigue sévère)
      set({
        hasEatenToday: false,
        actionsRemaining: Math.max(1, state.actionsRemaining - 2) // Minimum 1 action
      })
    } else {
      set({ hasEatenToday: false })
    }
    
    // Vérifier les événements de l'aube
    const event = eventManager.checkEvents(state, 'aube')
    if (event) {
      const { triggeredEvents, eventCooldowns } = eventManager.markEventTriggered(event.id, state.day, state)
      set({
        phase: 'narrative',
        currentEvent: 'choice',
        eventResult: {
          type: 'narrative',
          eventId: event.id
        },
        triggeredEvents,
        eventCooldowns
      })
      saveGameState(get())
      return
    }
    
    set({ phase: 'aube' })
    // Auto-save au début de journée (Aube)
    autoSave(get()).catch(() => {}) // Ignorer les erreurs silencieusement
  },
  
  goToExploration: () => {
    const state = get()
    
    // Générer ou réutiliser les lieux
    let locations: Location[]
    
    // Normaliser les lieux persistants existants pour s'assurer qu'ils ont toutes les propriétés
    const normalizedPersistent = state.persistentLocations.map(loc => normalizeLocation(loc, state.day))
    
    // Si on a moins de 5 lieux persistants non explorés, générer de nouveaux lieux
    const unexploredPersistent = normalizedPersistent.filter(loc => !loc.explored)
    
    if (unexploredPersistent.length >= 5) {
      // Réutiliser les lieux existants
      locations = [...unexploredPersistent.slice(0, 5)]
      // Mettre à jour persistentLocations avec les lieux normalisés
      set({ persistentLocations: normalizedPersistent })
    } else {
      // Générer de nouveaux lieux
      const newLocations = generateDailyLocations(state.day, undefined, state.persistentLocations)
      
      // Ajouter les nouveaux lieux aux lieux persistants normalisés
      const updatedPersistent = [...normalizedPersistent, ...newLocations]
      
      // Garder seulement les 10 derniers lieux pour éviter accumulation
      // Note: trimmedPersistent calculé mais non utilisé directement (gardé pour référence future)
      updatedPersistent.slice(-10)
      const allAvailable = normalizedPersistent.filter(loc => !loc.explored)
      if (allAvailable.length >= 5) {
        locations = allAvailable.slice(0, 5)
      } else {
        locations = [...allAvailable, ...newLocations.slice(0, 5 - allAvailable.length)]
      }
      
      // Mettre à jour persistentLocations avec les lieux normalisés
      set({ persistentLocations: normalizedPersistent })
    }
    
    // P1.2 - Si la carte est révélée (événement "marchand"), ajouter le lieu spécial cache_tresor
    // Le flag carteRevelee est défini dans eventPool.ts (événement "marchand", choix "carte")
    if (state.npcFlags.carteRevelee && !locations.some(loc => loc.type === 'cache_tresor')) {
      const cacheTresorConfig = LOCATION_TYPES.cache_tresor
      const cacheTresor: Location = {
        id: `cache_tresor_${state.day}_${Date.now()}`,
        type: 'cache_tresor',
        name: cacheTresorConfig.name,
        description: cacheTresorConfig.description,
        risk: 4, // Risque maximum
        richness: 5, // Richesse maximum
        explored: false,
        explorationCount: 0,
        firstSeenDay: state.day,
      }
      
      // Remplacer un lieu aléatoire par le cache au trésor
      const randomIndex = Math.floor(Math.random() * locations.length)
      locations[randomIndex] = cacheTresor
    }
    
    // Générer les rumeurs avec les lieux disponibles
    const rumors = generateDailyRumors(state.day, state.rumors, locations.map(loc => ({ id: loc.id, type: loc.type })))
    
    set({ 
      phase: 'exploration',
      actionsRemaining: 3,
      dailyLocations: locations,
      rumors: [...state.rumors.filter(r => r.day >= state.day - 3), ...rumors]
    })
  },

      exploreLocation: (location: Location) => {
        const state = get()
        
        if (state.actionsRemaining < 1) return
        if (state.phase !== 'exploration') return
        
        // Vérifier si un événement narratif doit se déclencher pendant l'exploration
        const event = eventManager.checkEvents(state, 'exploration')
        if (event) {
          const { triggeredEvents, eventCooldowns } = eventManager.markEventTriggered(event.id, state.day, state)
          set({
            phase: 'narrative',
            currentEvent: 'choice',
            eventResult: {
              type: 'narrative',
              eventId: event.id
            },
            triggeredEvents,
            eventCooldowns
          })
          saveGameState(get())
          return
        }
        
        // Filtrer les rumeurs actives (du jour actuel ou des 2 jours précédents)
        const activeRumors = state.rumors.filter(r => 
          r.day >= state.day - 2 && 
          (r.targetLocationId === location.id || !r.targetLocationId)
        )
        
        // Résoudre l'exploration avec le nouveau système (incluant rumeurs et scaling par jour)
        const explorationResult = resolveExploration(
          location,
          state.playerStats,
          state.equipment,
          activeRumors,
          undefined,
          undefined, // lockedEvent retiré (scout supprimé)
          state.day, // Passer le jour pour scaling
          state.relics // Passer les reliques pour appliquer les bonus
        )
        
        // Normaliser le lieu d'abord pour s'assurer qu'il a toutes les propriétés
        const normalizedLocation = normalizeLocation(location, state.day)
        
        // Marquer le lieu comme exploré
        const updatedLocation: Location = {
          ...normalizedLocation,
          explored: true,
          explorationCount: (normalizedLocation.explorationCount || 0) + 1
        }
        
        // Mettre à jour dans dailyLocations et persistentLocations
        const updatedDailyLocations = state.dailyLocations.map(loc => 
          loc.id === location.id ? updatedLocation : loc
        )
        const updatedPersistentLocations = state.persistentLocations.map(loc => 
          loc.id === location.id ? updatedLocation : loc
        )
    
        // Mettre à jour le state avec les lieux mis à jour
        set({
          dailyLocations: updatedDailyLocations,
          persistentLocations: updatedPersistentLocations
        })
    
    // Traiter le résultat selon le type d'événement
    if (explorationResult.event === 'combat') {
      const combatResult = explorationResult.combatResult!
      const enemy = getRandomEnemy(location.risk)
      
      // Gagner de l'XP de relique selon l'issue
      if (combatResult.outcome === 'crushing' || combatResult.outcome === 'victory') {
        set({ relics: gainRelicXp(state.relics, 2) })
      } else if (combatResult.outcome === 'costly') {
        set({ relics: gainRelicXp(state.relics, 1) })
      }
      
      // Si défaite, on gère la mort
      if (combatResult.outcome === 'defeat') {
        set({
          actionsRemaining: state.actionsRemaining - 1,
          currentEvent: 'combat',
          eventResult: {
            type: 'combat',
            enemy: enemy.name,
            enemyDescription: enemy.description,
            outcome: combatResult.outcome
          },
          combatResult: combatResult,
          currentEnemy: enemy,
          explorationResult: explorationResult
        })
        return
      }
      
      // Sinon, on ajoute l'or gagné (avec réduction si armure maudite équipée, bonus si reliques)
      if (combatResult.gold) {
        const equippedItems = Object.values(state.equipment).filter(Boolean) as Item[]
        const hasCursedArmor = equippedItems.some(item => item.cursed && item.id === 'armor_compromised')
        const cursedMultiplier = hasCursedArmor ? 0.9 : 1.0 // -10% si armure maudite
        const relicGoldMultiplier = getRelicGoldMultiplier(state.relics) // Bonus or des reliques
        const goldEarned = Math.floor(combatResult.gold * cursedMultiplier * relicGoldMultiplier)
        set({ gold: state.gold + goldEarned })
      }
      
      // Appliquer la perte de durabilité
      if (combatResult.durabilityLoss.length > 0) {
        const newEquipment = { ...state.equipment }
        combatResult.durabilityLoss.forEach((loss: DurabilityLoss) => {
          let itemToUpdate: Item | undefined
          let slotToUpdate: string | undefined
          
          Object.entries(newEquipment).forEach(([slot, item]) => {
            if (item?.id === loss.itemId) {
              itemToUpdate = item
              slotToUpdate = slot
            }
          })
          
          if (itemToUpdate && slotToUpdate) {
            const updatedItem = applyDurabilityLoss(itemToUpdate, loss.amount)
            
            if (isItemBroken(updatedItem)) {
              delete newEquipment[slotToUpdate]
            } else {
              newEquipment[slotToUpdate] = updatedItem
            }
          }
        })
        
        const newStats = calculateStatsFromEquipment(newEquipment)
        set({ equipment: newEquipment, playerStats: newStats })
      }
      
      // Loot d'item après combat (30% chance si victoire)
      if (combatResult.lootEarned && Math.random() < 0.3) {
        const item = generateLoot(location.risk)
        explorationResult.item = item
      }
      
      // Incrémenter les stats de combat
      let newCombatsWon = state.combatsWon
      let newCombatsFled = state.combatsFled
      
      if (combatResult.outcome === 'flee') {
        newCombatsFled = state.combatsFled + 1
      } else if (combatResult.outcome === 'victory' || combatResult.outcome === 'crushing' || combatResult.outcome === 'costly') {
        newCombatsWon = state.combatsWon + 1
      }
      
      // Vérifier si l'item looté est légendaire
      let newLegendaryCount = state.legendaryItemsFound
      if (explorationResult.item && explorationResult.item.rarity === 'legendary') {
        newLegendaryCount = state.legendaryItemsFound + 1
      }
      
      set({
        actionsRemaining: state.actionsRemaining - 1,
        currentEvent: 'combat',
        eventResult: {
          type: 'combat',
          enemy: enemy.name,
          enemyDescription: enemy.description,
          outcome: combatResult.outcome
        },
        combatResult: combatResult,
        currentEnemy: enemy,
        explorationResult: explorationResult,
        lootedItem: explorationResult.item || null,
        combatsWon: newCombatsWon,
        combatsFled: newCombatsFled,
        legendaryItemsFound: newLegendaryCount
      })
    } else if (explorationResult.event === 'loot') {
      set({
        actionsRemaining: state.actionsRemaining - 1,
        currentEvent: 'loot',
        eventResult: {
          type: 'loot',
          item: explorationResult.item,
          gold: explorationResult.gold,
          relicFragmentId: explorationResult.relicFragmentId,
          relicFragmentAmount: explorationResult.relicFragmentAmount,
          message: explorationResult.specialMessage 
            ? `${explorationResult.specialMessage} ${explorationResult.item 
              ? `Tu trouves ${explorationResult.item.name}.`
              : `Tu trouves ${explorationResult.gold} pièces d'or.`}`
            : explorationResult.item 
              ? `Tu trouves ${explorationResult.item.name}.`
              : `Tu trouves ${explorationResult.gold} pièces d'or.`
        },
        lootedItem: explorationResult.item || null,
        explorationResult: explorationResult
      })
      
      // Ajouter l'or si présent et vérifier items légendaires
      // Appliquer réduction d'or si armure maudite équipée
      const equippedItems = Object.values(state.equipment).filter(Boolean) as Item[]
      const hasCursedArmor = equippedItems.some(item => item.cursed && item.id === 'armor_cursed')
      let newGold = state.gold
      if (explorationResult.gold) {
        const goldEarned = hasCursedArmor ? Math.floor(explorationResult.gold * 0.9) : explorationResult.gold // -10% si armure maudite
        newGold = state.gold + goldEarned
      }
      
      // Ajouter fragments de relique si drop
      let newRelicFragments = state.relicFragments
      let newRelics = state.relics
      if (explorationResult.relicFragmentId && explorationResult.relicFragmentAmount) {
        const res = addFragmentsAndMaybeCreate(
          state.relicFragments,
          state.relics,
          explorationResult.relicFragmentId,
          explorationResult.relicFragmentAmount,
          state.day
        )
        newRelicFragments = res.fragments
        newRelics = res.relics
        
        // Donner un petit XP de découverte à toutes les reliques
        newRelics = gainRelicXp(newRelics, 1)
      }
      
      let newLegendaryCount = state.legendaryItemsFound
      if (explorationResult.item && explorationResult.item.rarity === 'legendary') {
        newLegendaryCount = state.legendaryItemsFound + 1
      }
      
      set({ 
        gold: newGold,
        legendaryItemsFound: newLegendaryCount,
        relicFragments: newRelicFragments,
        relics: newRelics
      })
    } else if (explorationResult.event === 'empty') {
      set({
        actionsRemaining: state.actionsRemaining - 1,
        currentEvent: 'empty',
        eventResult: {
          type: 'empty',
          message: explorationResult.atmosphereText
        },
        explorationResult: explorationResult
      })
    } else if (explorationResult.event === 'choice') {
      set({
        actionsRemaining: state.actionsRemaining - 1,
        currentEvent: 'choice',
        eventResult: {
          type: 'choice',
          choiceId: explorationResult.choiceId,
          choiceText: explorationResult.choiceText,
          choices: explorationResult.choices
        },
        explorationResult: explorationResult
      })
    }
  },
  
  finishEvent: () => {
    const state = get()
    
    // Si c'était une défaite, on passe à l'écran de défaite
    if (state.combatResult?.outcome === 'defeat') {
      // P1.1 - Incrémenter combatsLost correctement
      set({ 
        phase: 'defeat',
        combatsLost: state.combatsLost + 1
      })
      saveGameState(get())
      return
    }
    
    // Si on était en phase narrative et qu'on finit l'événement, retourner à l'aube
    const newPhase = state.phase === 'narrative' ? 'aube' : state.phase
    
    set({ 
      phase: newPhase,
      currentEvent: 'none',
      eventResult: null,
      combatResult: null
    })
    // Auto-save après fin de dialogue/événement
    autoSave(get()).catch(() => {}) // Ignorer les erreurs silencieusement
  },
  
  endDay: () => {
    const state = get()
    const gameManager = new GameManager()
    
    // Vérifier les événements du crépuscule AVANT de passer au jour suivant
    const event = eventManager.checkEvents(state, 'crepuscule')
    if (event) {
      const { triggeredEvents, eventCooldowns } = eventManager.markEventTriggered(event.id, state.day, state)
      set({
        phase: 'narrative',
        currentEvent: 'choice',
        eventResult: {
          type: 'narrative',
          eventId: event.id
        },
        triggeredEvents,
        eventCooldowns
      })
      saveGameState(get())
      return
    }
    
    // P0.2 - Payer le logement (2💰/nuit obligatoire)
    const RENT_COST = 2
    let newGold = state.gold
    let debtWithRent = state.debt
    
    if (state.gold >= RENT_COST) {
      newGold = state.gold - RENT_COST
    } else {
      // Option A : Dette supplémentaire si pas assez d'or
      debtWithRent = state.debt + RENT_COST
    }
    
    // Avancer au jour suivant (avec dette incluant le loyer si non payé)
    const { day: newDay, debt: newDebt, actionsRemaining } = gameManager.advanceDay(state.day, debtWithRent)
    
    // Vérifier conditions de fin
    const endCondition = gameManager.checkEndConditions({
      day: newDay,
      debt: newDebt,
      gold: state.gold,
      phase: state.phase
    })
    
    if (endCondition === 'victory') {
      set({ phase: 'victory' })
      saveGameState(get())
      return
    } else if (endCondition === 'defeat') {
      set({ phase: 'defeat' })
      saveGameState(get())
      return
    }
    
    // Bonus final au J20 : Si compteur >= 9, ajouter +1 pour atteindre la fin
    let updatedCounters = { ...state.narrativeCounters }
    if (newDay === 20) {
      const humanite = updatedCounters.humanite || 0
      const cynisme = updatedCounters.cynisme || 0
      const pragmatisme = updatedCounters.pragmatisme || 0
      
      // Si proche d'une fin (>= 9), ajouter +1
      if (humanite >= 9 && humanite < 10) {
        updatedCounters.humanite = 10
      } else if (cynisme >= 9 && cynisme < 10) {
        updatedCounters.cynisme = 10
      } else if (pragmatisme >= 9 && pragmatisme < 10) {
        updatedCounters.pragmatisme = 10
      }
    }
    
    // Passer au jour suivant
    set({
      day: newDay,
      debt: newDebt,
      gold: newGold, // Or mis à jour (loyer déduit si payé)
      actionsRemaining,
      phase: 'aube',
      narrativeCounters: updatedCounters
    })
    
    // Sauvegarder
    saveGameState(get())
  },
  
  handleDefeat: () => {
    set({ phase: 'defeat' })
  },
  
  resetGame: () => {
    set({
      ...INITIAL_STATE,
      phase: 'start'
    })
  },
  
  addItemToInventory: (item: Item) => {
    const state = get()
    if (state.inventory.length >= 10) {
      // Inventaire plein
      return false
    }
    set({ inventory: [...state.inventory, item] })
    return true
  },
  
  equipItem: (item: Item) => {
    const state = get()
    const newEquipment = { ...state.equipment }
    
    // Vérifier si l'item est déjà équipé (même ID)
    const isAlreadyEquipped = Object.values(newEquipment).some(eq => eq?.id === item.id)
    if (isAlreadyEquipped) {
      // Item déjà équipé, ne rien faire
      return
    }
    
    // Déséquiper l'item actuel du slot si présent
    let oldItem: Item | null = null
    if (newEquipment[item.slot]) {
      oldItem = newEquipment[item.slot]!
    }
    
    // Vérifier si on peut remettre l'ancien item dans l'inventaire
    // (si inventaire plein et qu'on a un ancien item, on ne peut pas équiper)
    if (oldItem && state.inventory.length >= 10) {
      // Inventaire plein, impossible d'équiper sans perdre l'ancien item
      console.warn('Inventaire plein, impossible d\'équiper sans perdre l\'ancien item')
      return
    }
    
    // Équiper le nouvel item
    newEquipment[item.slot] = item
    
    // Retirer de l'inventaire (si présent)
    let newInventory = state.inventory.filter(i => i.id !== item.id)
    
    // Remettre l'ancien item dans l'inventaire
    if (oldItem) {
      newInventory = [...newInventory, oldItem]
    }
    
    // Recalculer les stats
    const newStats = calculateStatsFromEquipment(newEquipment)
    
    set({
      equipment: newEquipment,
      inventory: newInventory,
      playerStats: newStats
    })
    
    saveGameState(get())
  },
  
  unequipItem: (slot: string) => {
    const state = get()
    if (!state.equipment[slot]) return
    
    const item = state.equipment[slot]!
    if (state.inventory.length >= 10) {
      // Inventaire plein
      return
    }
    
    const newEquipment = { ...state.equipment }
    delete newEquipment[slot]
    
    const newStats = calculateStatsFromEquipment(newEquipment)
    
    set({
      equipment: newEquipment,
      inventory: [...state.inventory, item],
      playerStats: newStats
    })
  },
  
  openInventory: () => {
    set({ phase: 'inventory' })
  },
  
  closeInventory: () => {
    const state = get()
    // Retourner à la phase précédente (aube ou exploration)
    if (state.currentEvent === 'none') {
      set({ phase: 'aube' })
    } else {
      set({ phase: 'exploration' })
    }
  },
  
  // Actions économie
  sellItem: (item: Item) => {
    const state = get()
    
    // Vérifier que l'item est dans l'inventaire (pas équipé)
    const itemIndex = state.inventory.findIndex(i => i.id === item.id)
    if (itemIndex === -1) {
      console.warn('Item non trouvé dans l\'inventaire')
      return
    }
    
    // Calculer le prix de vente (avec bonus humanité si applicable)
    const sellPrice = calculateSellPrice(item, state.reputation, state.narrativeCounters)
    
    // Retirer l'item de l'inventaire
    const newInventory = state.inventory.filter(i => i.id !== item.id)
    
    // Ajouter l'or
    set({
      inventory: newInventory,
      gold: state.gold + sellPrice
    })
    
    // Auto-save après transaction commerciale (vente)
    autoSave(get()).catch(() => {}) // Ignorer les erreurs silencieusement
  },
  
  buyItem: (item: Item) => {
    const state = get()
    
    // Calculer le prix d'achat (avec bonus cynisme si applicable)
    const buyPrice = calculateBuyPrice(item, state.reputation, state.narrativeCounters)
    
    // Vérifier que le joueur a assez d'or
    if (state.gold < buyPrice) {
      console.warn('Or insuffisant')
      return false
    }
    
    // Vérifier que l'inventaire n'est pas plein
    if (state.inventory.length >= 10) {
      console.warn('Inventaire plein')
      return false
    }
    
    // Retirer l'or
    // Retirer l'item du stock du marché
    const newMarketStock = state.marketStock.filter(i => i.id !== item.id)
    
    // Ajouter l'item à l'inventaire
    set({
      gold: state.gold - buyPrice,
      marketStock: newMarketStock,
      inventory: [...state.inventory, item]
    })
    
    // Son de perte d'or
    audioManager.playSound('coins_loss', 0.7).catch(() => {})
    
    // Auto-save après transaction commerciale (achat)
    autoSave(get()).catch(() => {}) // Ignorer les erreurs silencieusement
    return true
  },
  
  repayDebt: (amount: number) => {
    const state = get()
    
    // Vérifier que le joueur a assez d'or
    if (state.gold < amount) {
      console.warn('Or insuffisant')
      return false
    }
    
    // Vérifier que le montant ne dépasse pas la dette
    const repayAmount = Math.min(amount, state.debt)
    
    // Mettre à jour l'arc narratif de Morten (augmenter la confiance)
    const updatedCharacterArcs = { ...state.characterArcs }
    if (updatedCharacterArcs.morten) {
      const newTrustLevel = updateTrustLevel(
        updatedCharacterArcs.morten.trustLevel,
        'repay',
        repayAmount
      )
      updatedCharacterArcs.morten.trustLevel = newTrustLevel
      updatedCharacterArcs.morten.lastInteractionDay = state.day
      
      // Mettre à jour le stage selon les nouvelles conditions
      updatedCharacterArcs.morten.storyStage = getCurrentStoryStage(
        MORTEN_ARC_CONFIG,
        state.day,
        state.debt - repayAmount,
        newTrustLevel,
        updatedCharacterArcs.morten.flags
      )
    }
    
    // Retirer l'or et réduire la dette
    set({
      gold: state.gold - repayAmount,
      debt: state.debt - repayAmount,
      characterArcs: updatedCharacterArcs
    })
    
    // Son de perte d'or
    audioManager.playSound('coins_loss', 0.7).catch(() => {})
    
    // Auto-save après transaction commerciale (remboursement dette)
    autoSave(get()).catch(() => {}) // Ignorer les erreurs silencieusement
    return true
  },
  
  buyMeal: () => {
    const state = get()
    const MEAL_COST = 4 // Réduit de 5 à 4 (-20%)
    
    if (state.gold < MEAL_COST) {
      console.warn('Or insuffisant pour le repas')
      return false
    }
    
    if (state.hasEatenToday) {
      console.warn('Déjà mangé aujourd\'hui')
      return false
    }
    
    set(s => ({
      gold: s.gold - MEAL_COST,
      hasEatenToday: true,
      narrativeCounters: {
        ...s.narrativeCounters,
        humanite: (s.narrativeCounters.humanite || 0) + 1 // Bonus humanité
      }
    }))
    saveGameState(get())
    return true
  },
  
  generateMarketStock: () => {
    const state = get()
    
    // Si le stock a déjà été généré aujourd'hui, ne pas le régénérer
    if (state.marketStockDay === state.day && state.marketStock.length > 0) {
      return
    }
    
    // Générer 3-5 items selon le jour
    const stockSize = Math.floor(Math.random() * 3) + 3 // 3-5 items
    const items: Item[] = []
    
    for (let i = 0; i < stockSize; i++) {
      // Risque selon le jour (meilleurs items plus tard)
      const riskLevel = Math.min(4, Math.floor(state.day / 5) + 1)
      const item = generateLoot(riskLevel)
      items.push(item)
    }
    
    set({
      marketStock: items,
      marketStockDay: state.day
    })
  },
  
  // Actions forge
  repairItem: (item: Item) => {
    const state = get()
    
    // Calculer le coût (avec bonus pragmatisme et reliques si applicable)
    const cost = calculateRepairCost(item, state.narrativeCounters, state.relics)
    
    // Vérifier que le joueur a assez d'or
    if (state.gold < cost) {
      console.warn('Or insuffisant pour réparer')
      return false
    }
    
    // Vérifier que l'item a besoin de réparation
    if (item.durability >= item.maxDurability) {
      console.warn('Item déjà à 100%')
      return false
    }
    
    // Répare l'item
    const repairedItem = repairItemLogic(item)
    
    // Mettre à jour l'équipement ou l'inventaire
    let newEquipment = { ...state.equipment }
    let newInventory = [...state.inventory]
    let updated = false
    
    // Chercher dans l'équipement
    Object.entries(newEquipment).forEach(([slot, equippedItem]) => {
      if (equippedItem?.id === item.id) {
        newEquipment[slot] = repairedItem
        updated = true
      }
    })
    
    // Chercher dans l'inventaire
    if (!updated) {
      const itemIndex = newInventory.findIndex(i => i.id === item.id)
      if (itemIndex > -1) {
        newInventory[itemIndex] = repairedItem
        updated = true
      }
    }
    
    if (!updated) {
      console.warn('Item non trouvé')
      return false
    }
    
    // Recalculer les stats si équipé
    let newStats = state.playerStats
    if (Object.values(newEquipment).some(i => i?.id === item.id)) {
      newStats = calculateStatsFromEquipment(newEquipment)
    }
    
    // Débiter l'or
    set({
      gold: state.gold - cost,
      equipment: newEquipment,
      inventory: newInventory,
      playerStats: newStats
    })
    
    saveGameState(get())
    return true
  },
  
  buyForgeItem: (item: Item) => {
    const state = get()
    
    // Prix = valeur × 2 (artisan quality)
    const buyPrice = item.value * 2
    
    // Vérifier que le joueur a assez d'or
    if (state.gold < buyPrice) {
      console.warn('Or insuffisant')
      return false
    }
    
    // Vérifier que l'inventaire n'est pas plein
    if (state.inventory.length >= 10) {
      console.warn('Inventaire plein')
      return false
    }
    
    // Retirer l'or et l'item du stock
    set({
      gold: state.gold - buyPrice,
      forgeStock: null,
      inventory: [...state.inventory, item]
    })
    
    saveGameState(get())
    return true
  },
  
  generateForgeStock: () => {
    const state = get()
    
    // Si le stock a déjà été généré aujourd'hui, ne pas le régénérer
    if (state.forgeStockDay === state.day && state.forgeStock !== null) {
      return
    }
    
    // 20% chance d'avoir un item rare/légendaire
    if (Math.random() < 0.2) {
      // Risque élevé pour avoir des items rares
      const riskLevel = Math.min(4, Math.floor(state.day / 3) + 2)
      const item = generateLoot(riskLevel)
      
      // Forcer rare ou légendaire
      if (item.rarity !== 'rare' && item.rarity !== 'legendary') {
        // Régénérer jusqu'à obtenir rare ou légendaire (max 5 tentatives)
        for (let i = 0; i < 5; i++) {
          const newItem = generateLoot(riskLevel)
          if (newItem.rarity === 'rare' || newItem.rarity === 'legendary') {
            set({
              forgeStock: newItem,
              forgeStockDay: state.day
            })
            return
          }
        }
      } else {
        set({
          forgeStock: item,
          forgeStockDay: state.day
        })
      }
    } else {
      // Pas d'item aujourd'hui
      set({
        forgeStock: null,
        forgeStockDay: state.day
      })
    }
  },
  
  // Actions taverne
  setNPCFlag: (flag: string, value: boolean) => {
    set(s => ({
      npcFlags: {
        ...s.npcFlags,
        [flag]: value
      }
    }))
    saveGameState(get())
  },
  
  generateRumors: () => {
    const state = get()
    
    // Utiliser les lieux disponibles (dailyLocations ou persistentLocations)
    const availableLocations = state.dailyLocations.length > 0 
      ? state.dailyLocations 
      : state.persistentLocations.filter(loc => !loc.explored)
    
    // Générer les rumeurs pour aujourd'hui avec les lieux disponibles
    const newRumors = generateDailyRumors(
      state.day, 
      state.rumors,
      availableLocations.map(loc => ({ id: loc.id, type: loc.type }))
    )
    
    // Garder les rumeurs des 3 derniers jours
    const recentRumors = state.rumors.filter(r => r.day >= state.day - 3)
    
    // Éviter les doublons : ne garder que les nouvelles rumeurs qui n'existent pas déjà
    const existingRumorIds = new Set(recentRumors.map(r => r.id))
    const uniqueNewRumors = newRumors.filter(r => !existingRumorIds.has(r.id))
    
    set({
      rumors: [...recentRumors, ...uniqueNewRumors]
    })
  },
  
  // Actions événements
  triggerNarrativeEvent: (eventId: string) => {
    set({
      phase: 'narrative' as GamePhase,
      currentEvent: 'choice' as const,
      eventResult: {
        type: 'narrative',
        eventId
      }
    })
    saveGameState(get())
  },
  
  applyEventConsequence: (consequence: any) => {
    const state = get()
    let newState = { ...state }
    
    // Appliquer les conséquences
    if (consequence.gold) {
      // Appliquer réduction d'or si armure maudite équipée
      const equippedItems = Object.values(newState.equipment).filter(Boolean) as Item[]
      const hasCursedArmor = equippedItems.some(item => item.cursed && item.id === 'armor_cursed')
      const goldAmount = hasCursedArmor && consequence.gold > 0 
        ? Math.floor(consequence.gold * 0.9) 
        : consequence.gold // -10% si armure maudite et or positif
      newState.gold = Math.max(0, newState.gold + goldAmount)
    }
    
    if (consequence.reputation) {
      // Appliquer réduction de réputation si amulette maudite équipée
      const equippedItems = Object.values(newState.equipment).filter(Boolean) as Item[]
      const hasCursedAmulet = equippedItems.some(item => item.cursed && item.id === 'amulet_compromised')
      let repChange = consequence.reputation
      if (hasCursedAmulet && repChange > 0) {
        repChange = Math.max(0, repChange - 1) // -1 réputation si amulette compromis et réputation positive
      }
      
      // Impact des compteurs narratifs sur la réputation
      // Humanité élevée : +1 réputation bonus (max 5)
      // Cynisme élevé : -1 réputation malus (min 1)
      const humanite = newState.narrativeCounters.humanite || 0
      const cynisme = newState.narrativeCounters.cynisme || 0
      
      if (humanite >= 15 && repChange >= 0) {
        repChange += 1 // Bonus humanité
      }
      if (cynisme >= 15 && repChange > 0) {
        repChange = Math.max(0, repChange - 1) // Malus cynisme
      }
      
      // Modificateur de réputation des reliques
      const relicRepModifier = getRelicReputationModifier(newState.relics)
      repChange += relicRepModifier
      
      newState.reputation = Math.max(1, Math.min(5, newState.reputation + repChange)) as 1 | 2 | 3 | 4 | 5
    }
    
    if (consequence.debt) {
      newState.debt = Math.max(0, newState.debt + consequence.debt)
    }
    
    if (consequence.actionsRemaining) {
      newState.actionsRemaining = Math.max(0, newState.actionsRemaining + consequence.actionsRemaining)
    }
    
    if (consequence.items) {
      // Générer les items
      consequence.items.forEach((itemId: string) => {
        let item: Item
        
        // Si c'est un item compromis, sélectionner dans le pool
        if (itemId === 'cursed_item') {
          const randomCursedItem = CURSED_ITEMS[Math.floor(Math.random() * CURSED_ITEMS.length)]
          // Créer une copie avec ID unique
          item = {
            ...randomCursedItem,
            id: `${randomCursedItem.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            durability: randomCursedItem.maxDurability
          }
        } else {
          // Sinon, générer un item normal
          item = generateLoot(4) // Risque élevé pour items spéciaux
        }
        
        if (newState.inventory.length < 10) {
          newState.inventory.push(item)
        }
      })
    }
    
    if (consequence.durabilityLoss) {
      // Appliquer perte de durabilité sur un item aléatoire équipé
      const equippedItems = Object.values(newState.equipment).filter(Boolean) as Item[]
      if (equippedItems.length > 0) {
        const randomItem = equippedItems[Math.floor(Math.random() * equippedItems.length)]
        const updatedItem = applyDurabilityLoss(randomItem, consequence.durabilityLoss)
        // Mettre à jour l'équipement
        Object.entries(newState.equipment).forEach(([slot, item]) => {
          if (item?.id === randomItem.id) {
            newState.equipment[slot] = updatedItem
          }
        })
        newState.playerStats = calculateStatsFromEquipment(newState.equipment)
      }
    }
    
    if (consequence.flags) {
      newState.npcFlags = { ...newState.npcFlags, ...consequence.flags }
    }
    
    if (consequence.counters) {
      Object.entries(consequence.counters).forEach(([counter, amount]) => {
        newState.narrativeCounters[counter] = (newState.narrativeCounters[counter] || 0) + (amount as number)
      })
    }
    
    set(newState)
    // Auto-save après choix narratif (consequence d'événement)
    autoSave(get()).catch(() => {}) // Ignorer les erreurs silencieusement
  },
  
  incrementCounter: (counter: string, amount: number) => {
    const state = get()
    const oldValue = state.narrativeCounters[counter] || 0
    const newValue = oldValue + amount
    
    set(s => ({
      narrativeCounters: {
        ...s.narrativeCounters,
        [counter]: newValue
      }
    }))
    
    // Notification si un seuil important est atteint (8 ou 12)
    if ((oldValue < 8 && newValue >= 8) || (oldValue < 12 && newValue >= 12)) {
      const threshold = newValue >= 12 ? 12 : 8
      const counterName = counter === 'humanite' ? 'Humanité' : 
                         counter === 'cynisme' ? 'Cynisme' : 
                         counter === 'pragmatisme' ? 'Pragmatisme' : counter
      
      // Afficher une notification (console pour l'instant, peut être amélioré avec un système de toast)
      console.log(`🎯 ${counterName} atteint ${threshold}! Bonus activé.`)
      
      if (threshold === 8) {
        if (counter === 'humanite') {
          console.log('💚 Bonus : +10% prix de vente au marché')
        } else if (counter === 'cynisme') {
          console.log('💔 Bonus : -15% prix d\'achat au marché')
        } else if (counter === 'pragmatisme') {
          console.log('💙 Bonus : -15% coût de réparation à la forge')
        }
      } else if (threshold === 12) {
        const endingName = counter === 'humanite' ? 'La Rédemption' :
                          counter === 'cynisme' ? 'La Survie' :
                          counter === 'pragmatisme' ? 'L\'Efficacité' : ''
        if (endingName) {
          console.log(`🏆 Fin disponible : ${endingName}`)
        }
      }
    }
    
    saveGameState(get())
  },
  
  // Actions arcs narratifs
  initCharacterArc: (characterId: string) => {
    const state = get()
    if (state.characterArcs[characterId]) {
      return // Déjà initialisé
    }
    
    const newArc = initializeCharacterArc(characterId, state.day)
    set({
      characterArcs: {
        ...state.characterArcs,
        [characterId]: newArc
      }
    })
    saveGameState(get())
  },
  
  updateCharacterArc: (characterId: string, updates: Partial<CharacterArc>) => {
    const state = get()
    const currentArc = state.characterArcs[characterId]
    if (!currentArc) {
      console.warn(`Arc narratif non trouvé pour ${characterId}`)
      return
    }
    
    const updatedArc = { ...currentArc, ...updates }
    set({
      characterArcs: {
        ...state.characterArcs,
        [characterId]: updatedArc
      }
    })
    saveGameState(get())
  },
  
  getCharacterArc: (characterId: string) => {
    const state = get()
    return state.characterArcs[characterId] || null
  },
  
  updateCharacterTrust: (characterId: string, action: 'repay' | 'ignore' | 'negotiate', amount?: number) => {
    const state = get()
    const currentArc = state.characterArcs[characterId]
    if (!currentArc) {
      console.warn(`Arc narratif non trouvé pour ${characterId}`)
      return
    }
    
    const newTrustLevel = updateTrustLevel(currentArc.trustLevel, action, amount)
    const updatedArc = {
      ...currentArc,
      trustLevel: newTrustLevel,
      lastInteractionDay: state.day
    }
    
    // Mettre à jour le stage si c'est Morten
    if (characterId === 'morten') {
      updatedArc.storyStage = getCurrentStoryStage(
        MORTEN_ARC_CONFIG,
        state.day,
        state.debt,
        newTrustLevel,
        updatedArc.flags
      )
    }
    
    set({
      characterArcs: {
        ...state.characterArcs,
        [characterId]: updatedArc
      }
    })
    saveGameState(get())
  }
}))
