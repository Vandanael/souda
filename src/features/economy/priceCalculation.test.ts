import { describe, it, expect } from 'vitest'
import { calculateSellPrice, calculateBuyPrice, getSellMultiplier, getBuyMultiplier } from './priceCalculation'
import { Item } from '../../types/item'

const createTestItem = (value: number, rarity: 'common' | 'uncommon' | 'rare' | 'legendary' = 'common'): Item => ({
  id: 'test_item',
  name: 'Test Item',
  slot: 'weapon',
  rarity,
  stats: { atk: 10, def: 5, vit: 3 },
  durability: 100,
  maxDurability: 100,
  properties: [],
  value,
  description: 'Test'
})

describe('Price Calculation', () => {
  describe('getSellMultiplier', () => {
    it('retourne les bons multiplicateurs selon réputation', () => {
      expect(getSellMultiplier(1)).toBe(0.6)
      expect(getSellMultiplier(2)).toBe(0.8)
      expect(getSellMultiplier(3)).toBe(1.0)
      expect(getSellMultiplier(4)).toBe(1.1)
      expect(getSellMultiplier(5)).toBe(1.2)
    })
  })
  
  describe('getBuyMultiplier', () => {
    it('retourne les bons multiplicateurs selon réputation (inversés)', () => {
      expect(getBuyMultiplier(1)).toBe(1.4)
      expect(getBuyMultiplier(2)).toBe(1.2)
      expect(getBuyMultiplier(3)).toBe(1.0)
      expect(getBuyMultiplier(4)).toBe(0.9)
      expect(getBuyMultiplier(5)).toBe(0.8)
    })
  })
  
  describe('calculateSellPrice', () => {
    it('calcule le prix de vente correctement (common, réputation 3)', () => {
      const item = createTestItem(10, 'common')
      const price = calculateSellPrice(item, 3)
      
      // 10 × 1.0 (common) × 1.0 (réputation 3) = 10
      expect(price).toBe(10)
    })
    
    it('applique multiplicateur rareté', () => {
      const item = createTestItem(10, 'rare')
      const price = calculateSellPrice(item, 3)
      
      // 10 × 2.5 (rare) × 1.0 (réputation 3) = 25
      expect(price).toBe(25)
    })
    
    it('applique multiplicateur réputation faible', () => {
      const item = createTestItem(10, 'common')
      const price = calculateSellPrice(item, 1)
      
      // 10 × 1.0 (common) × 0.6 (réputation 1) = 6
      expect(price).toBe(6)
    })
    
    it('applique multiplicateur réputation élevée', () => {
      const item = createTestItem(10, 'common')
      const price = calculateSellPrice(item, 5)
      
      // 10 × 1.0 (common) × 1.2 (réputation 5) = 12
      expect(price).toBe(12)
    })
    
    it('combine rareté et réputation', () => {
      const item = createTestItem(10, 'legendary')
      const price = calculateSellPrice(item, 5)
      
      // 10 × 5.0 (legendary) × 1.2 (réputation 5) = 60
      expect(price).toBe(60)
    })
  })
  
  describe('calculateBuyPrice', () => {
    it('calcule le prix d\'achat correctement (common, réputation 3)', () => {
      const item = createTestItem(10, 'common')
      const price = calculateBuyPrice(item, 3)
      
      // 10 × 1.5 (base achat) × 1.0 (common) × 1.0 (réputation 3) = 15
      expect(price).toBe(15)
    })
    
    it('applique multiplicateur rareté', () => {
      const item = createTestItem(10, 'rare')
      const price = calculateBuyPrice(item, 3)
      
      // 10 × 1.5 × 2.5 (rare) × 1.0 (réputation 3) = 37.5 → 37
      expect(price).toBe(37)
    })
    
    it('applique multiplicateur réputation faible (prix plus élevé)', () => {
      const item = createTestItem(10, 'common')
      const price = calculateBuyPrice(item, 1)
      
      // 10 × 1.5 × 1.0 (common) × 1.4 (réputation 1) = 21
      expect(price).toBe(21)
    })
    
    it('applique multiplicateur réputation élevée (prix réduit)', () => {
      const item = createTestItem(10, 'common')
      const price = calculateBuyPrice(item, 5)
      
      // 10 × 1.5 × 1.0 (common) × 0.8 (réputation 5) = 12
      expect(price).toBe(12)
    })
  })
  
  describe('Prix varient selon réputation', () => {
    it('vente : meilleure réputation = meilleur prix', () => {
      const item = createTestItem(10, 'common')
      const price1 = calculateSellPrice(item, 1)
      const price3 = calculateSellPrice(item, 3)
      const price5 = calculateSellPrice(item, 5)
      
      expect(price1).toBeLessThan(price3)
      expect(price3).toBeLessThan(price5)
    })
    
    it('achat : meilleure réputation = meilleur prix (inversé)', () => {
      const item = createTestItem(10, 'common')
      const price1 = calculateBuyPrice(item, 1)
      const price3 = calculateBuyPrice(item, 3)
      const price5 = calculateBuyPrice(item, 5)
      
      expect(price1).toBeGreaterThan(price3)
      expect(price3).toBeGreaterThan(price5)
    })
  })
})
