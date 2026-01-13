import { describe, it, expect } from 'vitest'
import { determineEnding, injectEndingVariables } from './endings.logic'
import { GameState } from '../../store/gameStore'

// Helper pour créer un GameState minimal
function createGameState(overrides: Partial<GameState>): GameState {
  const defaultState: GameState = {
    day: 1,
    phase: 'aube',
    debt: 0,
    gold: 0,
    reputation: 3,
    marketStock: [],
    marketStockDay: 0,
    forgeStock: null,
    forgeStockDay: 0,
    npcFlags: {},
    rumors: [],
    narrativeCounters: {},
    triggeredEvents: [],
    selectedOrigin: 'deserteur',
    equipment: {},
    inventory: [],
    playerStats: { atk: 10, def: 10, vit: 10 },
    actionsRemaining: 3,
    dailyLocations: [],
    currentEvent: 'none',
    eventResult: null,
    combatResult: null,
    lootedItem: null,
    currentEnemy: null,
    explorationResult: null,
    combatsWon: 0,
    combatsFled: 0,
    combatsLost: 0,
    legendaryItemsFound: 0,
    setPhase: () => {},
    startNewGame: () => {},
    startDay: () => {},
    goToExploration: () => {},
    exploreLocation: () => {},
    finishEvent: () => {},
    endDay: () => {},
    handleDefeat: () => {},
    resetGame: () => {},
    addItemToInventory: () => {},
    equipItem: () => {},
    unequipItem: () => {},
    openInventory: () => {},
    closeInventory: () => {},
    sellItem: () => {},
    buyItem: () => false,
    repayDebt: () => false,
    generateMarketStock: () => {},
    repairItem: () => false,
    buyForgeItem: () => false,
    generateForgeStock: () => {},
    setNPCFlag: () => {},
    generateRumors: () => {},
    triggerNarrativeEvent: () => {},
    applyEventConsequence: () => {},
    incrementCounter: () => {}
  }
  
  return { ...defaultState, ...overrides }
}

describe('Endings Logic', () => {
  describe('Victory Endings', () => {
    it('détermine "Le Seigneur" avec conditions remplies', () => {
      const state = createGameState({
        day: 20,
        debt: 0,
        gold: 250,
        reputation: 5,
        narrativeCounters: {
          humanite: 8,
          cynisme: 3
        }
      })
      
      const ending = determineEnding(state)
      
      expect(ending.id).toBe('seigneur')
      expect(ending.type).toBe('victory')
      expect(ending.title).toBe('Le Seigneur des Ruines')
      expect(ending.ambiance.particles).toBe('gold')
    })
    
    it('détermine "Le Marchand" si or >= 300', () => {
      const state = createGameState({
        day: 20,
        debt: 0,
        gold: 350,
        reputation: 3,
        narrativeCounters: {}
      })
      
      const ending = determineEnding(state)
      
      expect(ending.id).toBe('marchand')
      expect(ending.type).toBe('victory')
      expect(ending.title).toBe('Le Roi des Charognes')
    })
    
    it('priorise "Le Seigneur" sur "Le Marchand" si conditions remplies', () => {
      const state = createGameState({
        day: 20,
        debt: 0,
        gold: 350, // Suffisant pour Marchand
        reputation: 5, // Suffisant pour Seigneur
        narrativeCounters: {
          humanite: 8,
          cynisme: 3
        }
      })
      
      const ending = determineEnding(state)
      
      // Le Seigneur a priorité plus haute
      expect(ending.id).toBe('seigneur')
    })
    
    it('détermine "Le Rédempteur" avec humanité >= 10 et cynisme < 3', () => {
      const state = createGameState({
        day: 20,
        debt: 0,
        gold: 100,
        reputation: 3,
        narrativeCounters: {
          humanite: 12,
          cynisme: 2
        }
      })
      
      const ending = determineEnding(state)
      
      expect(ending.id).toBe('redempteur')
      expect(ending.type).toBe('victory')
      expect(ending.title).toBe('Le Rédempteur')
      expect(ending.ambiance.particles).toBe('light')
    })
    
    it('détermine "Le Fantôme" avec réputation <= 2 et pragmatisme dominant', () => {
      const state = createGameState({
        day: 20,
        debt: 0,
        gold: 50,
        reputation: 2,
        narrativeCounters: {
          pragmatisme: 8,
          humanite: 3,
          cynisme: 2
        }
      })
      
      const ending = determineEnding(state)
      
      expect(ending.id).toBe('fantome')
      expect(ending.type).toBe('victory')
      expect(ending.title).toBe('Le Fantôme')
      expect(ending.ambiance.particles).toBe('mist')
    })
    
    it('détermine "Le Survivant" par défaut', () => {
      const state = createGameState({
        day: 20,
        debt: 0,
        gold: 50,
        reputation: 3,
        narrativeCounters: {}
      })
      
      const ending = determineEnding(state)
      
      expect(ending.id).toBe('survivant')
      expect(ending.type).toBe('victory')
      expect(ending.title).toBe('Le Survivant')
    })
  })
  
  describe('Defeat Endings', () => {
    it('détermine "Mort au Combat" si combatResult.outcome === defeat', () => {
      const state = createGameState({
        day: 10,
        debt: 50,
        gold: 20,
        combatResult: {
          outcome: 'defeat',
          ratio: 0.3,
          playerPower: 10,
          enemyPower: 30,
          gold: 0,
          durabilityLoss: [],
          lootEarned: false,
          message: 'Tu es mort'
        },
        currentEnemy: {
          id: 'bandit',
          name: 'Bandit',
          type: 'bandit',
          atk: 15,
          def: 5,
          vit: 8,
          description: 'Un bandit agressif',
          lootGold: { min: 5, max: 15 }
        }
      })
      
      const ending = determineEnding(state)
      
      expect(ending.id).toBe('mort_combat')
      expect(ending.type).toBe('defeat')
      expect(ending.title).toBe('Mort au Combat')
      expect(ending.variables?.enemyName).toBe('Bandit')
    })
    
    it('détermine "La Dette de Sang" si jour 20+, dette > 0, réputation < 4', () => {
      const state = createGameState({
        day: 20,
        debt: 50,
        gold: 20,
        reputation: 3
      })
      
      const ending = determineEnding(state)
      
      expect(ending.id).toBe('dette_sang')
      expect(ending.type).toBe('defeat')
      expect(ending.title).toBe('La Dette de Sang')
    })
    
    it('détermine "La Fuite" si jour 20+, dette > 0, réputation >= 4', () => {
      const state = createGameState({
        day: 20,
        debt: 50,
        gold: 20,
        reputation: 4
      })
      
      const ending = determineEnding(state)
      
      expect(ending.id).toBe('fuite')
      expect(ending.type).toBe('defeat')
      expect(ending.title).toBe('La Fuite')
    })
  })
  
  describe('Priority', () => {
    it('priorise défaite sur victoire', () => {
      const state = createGameState({
        day: 20,
        debt: 50, // Dette non payée
        gold: 350, // Suffisant pour Marchand
        reputation: 5,
        narrativeCounters: {
          humanite: 8,
          cynisme: 3
        }
      })
      
      const ending = determineEnding(state)
      
      // Devrait être une défaite (dette non payée)
      expect(ending.type).toBe('defeat')
    })
    
    it('priorise "Mort au Combat" sur autres défaites', () => {
      const state = createGameState({
        day: 20,
        debt: 50,
        gold: 20,
        reputation: 3,
        combatResult: {
          outcome: 'defeat',
          ratio: 0.3,
          playerPower: 10,
          enemyPower: 30,
          gold: 0,
          durabilityLoss: [],
          lootEarned: false,
          message: 'Tu es mort'
        },
        currentEnemy: {
          id: 'bandit',
          name: 'Bandit',
          type: 'bandit',
          atk: 15,
          def: 5,
          vit: 8,
          description: 'Un bandit',
          lootGold: { min: 5, max: 15 }
        }
      })
      
      const ending = determineEnding(state)
      
      // Mort au combat a priorité
      expect(ending.id).toBe('mort_combat')
    })
  })
  
  describe('Variable Injection', () => {
    it('injecte les variables dans le texte', () => {
      const text = '[enemyName] a eu raison de vous.'
      const variables = { enemyName: 'Bandit' }
      
      const result = injectEndingVariables(text, variables)
      
      expect(result).toBe('Bandit a eu raison de vous.')
    })
    
    it('ne modifie pas le texte si pas de variables', () => {
      const text = 'Vous avez survécu.'
      
      const result = injectEndingVariables(text)
      
      expect(result).toBe('Vous avez survécu.')
    })
  })
})
