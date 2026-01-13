import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../../store/gameStore'
import { calculateSellPrice, calculateBuyPrice } from './priceCalculation'
import { Item } from '../../types/item'

describe('Economy Integration', () => {
  beforeEach(() => {
    // Reset le store avant chaque test
    useGameStore.getState().resetGame()
  })
  
  describe('Vente d\'items', () => {
    it('vend un item et crédite le bon montant', () => {
      const store = useGameStore.getState()
      
      // Ajouter un item à l'inventaire
      const item: Item = {
        id: 'test_item',
        name: 'Test Item',
        slot: 'weapon',
        rarity: 'common',
        stats: { atk: 10, def: 0, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 10,
        description: 'Test'
      }
      
      store.addItemToInventory(item)
      const initialGold = store.gold
      const expectedPrice = calculateSellPrice(item, store.reputation)
      
      // Vendre l'item
      store.sellItem(item)
      
      // Vérifier que l'or a augmenté (peut être 0 si initialGold était 0)
      const newGold = useGameStore.getState().gold
      expect(newGold).toBe(initialGold + expectedPrice)
      
      // Vérifier que l'item a été retiré de l'inventaire
      expect(store.inventory.find(i => i.id === item.id)).toBeUndefined()
    })
    
    it('ne peut pas vendre un item équipé', () => {
      const store = useGameStore.getState()
      const equippedItem = Object.values(store.equipment)[0]
      
      if (equippedItem) {
        const initialGold = store.gold
        const initialInventoryLength = store.inventory.length
        
        // Essayer de vendre l'item équipé (ne devrait pas être dans l'inventaire)
        store.sellItem(equippedItem)
        
        // L'or ne devrait pas avoir changé
        expect(store.gold).toBe(initialGold)
        expect(store.inventory.length).toBe(initialInventoryLength)
      }
    })
    
    it('prix varie selon réputation', () => {
      const item: Item = {
        id: 'test_item',
        name: 'Test Item',
        slot: 'weapon',
        rarity: 'common',
        stats: { atk: 10, def: 0, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 10,
        description: 'Test'
      }
      
      const price1 = calculateSellPrice(item, 1)
      const price3 = calculateSellPrice(item, 3)
      const price5 = calculateSellPrice(item, 5)
      
      expect(price1).toBeLessThan(price3)
      expect(price3).toBeLessThan(price5)
    })
  })
  
  describe('Achat d\'items', () => {
    it('achète un item et débite le bon montant', () => {
      const store = useGameStore.getState()
      
      // Générer le stock du marché
      store.generateMarketStock()
      
      if (store.marketStock.length > 0) {
        const item = store.marketStock[0]
        const buyPrice = calculateBuyPrice(item, store.reputation)
        
        // Donner assez d'or au joueur
        useGameStore.setState({ gold: buyPrice + 10 })
        
        const initialGold = store.gold
        const initialInventoryLength = store.inventory.length
        
        // Acheter l'item
        const success = store.buyItem(item)
        
        expect(success).toBe(true)
        expect(store.gold).toBe(initialGold - buyPrice)
        expect(store.inventory.length).toBe(initialInventoryLength + 1)
        expect(store.inventory.find(i => i.id === item.id)).toBeDefined()
        expect(store.marketStock.find(i => i.id === item.id)).toBeUndefined()
      }
    })
    
    it('ne peut pas acheter si or insuffisant', () => {
      const store = useGameStore.getState()
      
      // Générer le stock du marché
      store.generateMarketStock()
      
      if (store.marketStock.length > 0) {
        const item = store.marketStock[0]
        const buyPrice = calculateBuyPrice(item, store.reputation)
        
        // Donner moins d'or que nécessaire
        useGameStore.setState({ gold: buyPrice - 1 })
        
        const initialGold = store.gold
        const initialInventoryLength = store.inventory.length
        
        // Essayer d'acheter
        const success = store.buyItem(item)
        
        expect(success).toBe(false)
        expect(store.gold).toBe(initialGold)
        expect(store.inventory.length).toBe(initialInventoryLength)
      }
    })
    
    it('ne peut pas acheter si inventaire plein', () => {
      const store = useGameStore.getState()
      
      // Remplir l'inventaire
      const fullInventory: Item[] = Array.from({ length: 10 }, (_, i) => ({
        id: `item_${i}`,
        name: `Item ${i}`,
        slot: 'weapon',
        rarity: 'common',
        stats: { atk: 5, def: 0, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 5,
        description: 'Test'
      }))
      
      useGameStore.setState({ inventory: fullInventory })
      
      // Générer le stock du marché
      store.generateMarketStock()
      
      if (store.marketStock.length > 0) {
        const item = store.marketStock[0]
        const buyPrice = calculateBuyPrice(item, store.reputation)
        
        // Donner assez d'or
        useGameStore.setState({ gold: buyPrice + 10 })
        
        // Essayer d'acheter
        const success = store.buyItem(item)
        
        expect(success).toBe(false)
        expect(store.inventory.length).toBe(10)
      }
    })
  })
  
  describe('Remboursement dette', () => {
    it('rembourse la dette et réduit l\'or', () => {
      // Donner de l'or au joueur
      useGameStore.setState({ gold: 50, debt: 100 })
      
      const state = useGameStore.getState()
      const initialGold = state.gold
      const initialDebt = state.debt
      const repayAmount = 30
      
      // Rembourser
      const success = state.repayDebt(repayAmount)
      
      expect(success).toBe(true)
      const newState = useGameStore.getState()
      expect(newState.gold).toBe(initialGold - repayAmount)
      expect(newState.debt).toBe(initialDebt - repayAmount)
    })
    
    it('ne peut pas rembourser plus que l\'or disponible', () => {
      const store = useGameStore.getState()
      
      useGameStore.setState({ gold: 20, debt: 100 })
      
      const initialGold = store.gold
      const initialDebt = store.debt
      
      // Essayer de rembourser plus que l'or disponible
      const success = store.repayDebt(50)
      
      expect(success).toBe(false)
      expect(store.gold).toBe(initialGold)
      expect(store.debt).toBe(initialDebt)
    })
    
    it('ne peut pas rembourser plus que la dette', () => {
      useGameStore.setState({ gold: 200, debt: 50 })
      
      const state = useGameStore.getState()
      const initialGold = state.gold
      
      // Essayer de rembourser plus que la dette
      const success = state.repayDebt(100)
      
      expect(success).toBe(true)
      const newState = useGameStore.getState()
      // La dette devrait être à 0, pas négative
      expect(newState.debt).toBe(0)
      // L'or devrait être réduit de 50 (le montant réellement remboursé)
      expect(newState.gold).toBe(initialGold - 50)
    })
    
    it('or ne peut pas devenir négatif', () => {
      const store = useGameStore.getState()
      
      useGameStore.setState({ gold: 10, debt: 100 })
      
      // Essayer de rembourser plus que l'or disponible
      const success = store.repayDebt(20)
      
      expect(success).toBe(false)
      expect(store.gold).toBeGreaterThanOrEqual(0)
    })
  })
  
  describe('Stock marché', () => {
    it('génère 3-5 items', () => {
      const store = useGameStore.getState()
      
      // S'assurer qu'on est au jour 1
      useGameStore.setState({ day: 1, marketStockDay: 0 })
      store.generateMarketStock()
      
      const newState = useGameStore.getState()
      expect(newState.marketStock.length).toBeGreaterThanOrEqual(3)
      expect(newState.marketStock.length).toBeLessThanOrEqual(5)
    })
    
    it('ne régénère pas le stock le même jour', () => {
      const store = useGameStore.getState()
      
      useGameStore.setState({ day: 5 })
      store.generateMarketStock()
      
      const firstStockDay = store.marketStockDay
      const firstStockLength = store.marketStock.length
      
      // Régénérer (ne devrait pas changer)
      store.generateMarketStock()
      
      expect(store.marketStockDay).toBe(firstStockDay)
      expect(store.marketStock.length).toBe(firstStockLength)
    })
    
    it('régénère le stock un nouveau jour', () => {
      const store = useGameStore.getState()
      
      useGameStore.setState({ day: 5 })
      store.generateMarketStock()
      
      // Passer au jour suivant
      useGameStore.setState({ day: 6 })
      store.generateMarketStock()
      
      const newState = useGameStore.getState()
      // Le stock devrait être régénéré
      expect(newState.marketStockDay).toBe(6)
      // Le stock peut être différent (nouveaux items générés)
    })
  })
})
