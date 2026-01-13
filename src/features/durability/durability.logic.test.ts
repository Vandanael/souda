import { describe, it, expect } from 'vitest'
import {
  applyDurabilityLoss,
  getDurabilityState,
  getDurabilityMultiplier,
  getEffectiveStats,
  selectItemsForDamage,
  applyCombatDamage,
  isItemBroken,
  getDurabilityColor
} from './durability.logic'
import { Item } from '../../types/item'
import { SeededRandom } from '../combat/combat.logic'

const createTestItem = (durability: number, maxDurability: number = 100, properties: string[] = []): Item => ({
  id: 'test_item',
  name: 'Test Item',
  slot: 'weapon',
  rarity: 'common',
  stats: { atk: 10, def: 5, vit: 3 },
  durability,
  maxDurability,
  properties: properties as any[],
  value: 10,
  description: 'Test'
})

describe('Durability Logic', () => {
  describe('applyDurabilityLoss', () => {
    it('réduit la durabilité du pourcentage donné', () => {
      const item = createTestItem(100)
      const result = applyDurabilityLoss(item, 15)
      
      expect(result.durability).toBe(85)
      expect(result.maxDurability).toBe(100)
    })
    
    it('ne peut pas descendre en dessous de 0', () => {
      const item = createTestItem(10)
      const result = applyDurabilityLoss(item, 50)
      
      expect(result.durability).toBe(0)
    })
    
    it('ne modifie pas les items avec propriété "solid"', () => {
      const item = createTestItem(100, 100, ['solid'])
      const result = applyDurabilityLoss(item, 50)
      
      expect(result.durability).toBe(100)
    })
  })
  
  describe('getDurabilityState', () => {
    it('retourne "normal" pour 100-51%', () => {
      expect(getDurabilityState(createTestItem(100))).toBe('normal')
      expect(getDurabilityState(createTestItem(75))).toBe('normal')
      expect(getDurabilityState(createTestItem(51))).toBe('normal')
    })
    
    it('retourne "worn" pour 50-26%', () => {
      expect(getDurabilityState(createTestItem(50))).toBe('worn')
      expect(getDurabilityState(createTestItem(38))).toBe('worn')
      expect(getDurabilityState(createTestItem(26))).toBe('worn')
    })
    
    it('retourne "damaged" pour 25-1%', () => {
      expect(getDurabilityState(createTestItem(25))).toBe('damaged')
      expect(getDurabilityState(createTestItem(13))).toBe('damaged')
      expect(getDurabilityState(createTestItem(1))).toBe('damaged')
    })
    
    it('retourne "broken" pour 0%', () => {
      expect(getDurabilityState(createTestItem(0))).toBe('broken')
    })
  })
  
  describe('getDurabilityMultiplier', () => {
    it('retourne 1.0 pour normal', () => {
      expect(getDurabilityMultiplier('normal')).toBe(1.0)
    })
    
    it('retourne 0.8 pour worn', () => {
      expect(getDurabilityMultiplier('worn')).toBe(0.8)
    })
    
    it('retourne 0.5 pour damaged', () => {
      expect(getDurabilityMultiplier('damaged')).toBe(0.5)
    })
    
    it('retourne 0.0 pour broken', () => {
      expect(getDurabilityMultiplier('broken')).toBe(0.0)
    })
  })
  
  describe('getEffectiveStats', () => {
    it('applique multiplicateur 1.0 pour normal', () => {
      const item = createTestItem(100)
      const stats = getEffectiveStats(item)
      
      expect(stats.atk).toBe(10)
      expect(stats.def).toBe(5)
      expect(stats.vit).toBe(3)
    })
    
    it('applique multiplicateur 0.8 pour worn', () => {
      const item = createTestItem(40) // 40% = worn
      const stats = getEffectiveStats(item)
      
      expect(stats.atk).toBe(8) // 10 * 0.8
      expect(stats.def).toBe(4) // 5 * 0.8
      expect(stats.vit).toBe(2) // 3 * 0.8
    })
    
    it('applique multiplicateur 0.5 pour damaged', () => {
      const item = createTestItem(20) // 20% = damaged
      const stats = getEffectiveStats(item)
      
      expect(stats.atk).toBe(5) // 10 * 0.5
      expect(stats.def).toBe(2) // 5 * 0.5
      expect(stats.vit).toBe(1) // 3 * 0.5
    })
    
    it('applique multiplicateur 0.0 pour broken', () => {
      const item = createTestItem(0)
      const stats = getEffectiveStats(item)
      
      expect(stats.atk).toBe(0)
      expect(stats.def).toBe(0)
      expect(stats.vit).toBe(0)
    })
  })
  
  describe('selectItemsForDamage', () => {
    it('sélectionne le bon nombre d\'items', () => {
      const equipment = {
        weapon: createTestItem(100),
        torso: createTestItem(100),
        head: createTestItem(100)
      }
      
      const selected = selectItemsForDamage(equipment, 2)
      expect(selected.length).toBeLessThanOrEqual(2)
      expect(selected.length).toBeGreaterThan(0)
    })
    
    it('exclut les items "solid"', () => {
      const equipment = {
        weapon: createTestItem(100, 100, ['solid']),
        torso: createTestItem(100)
      }
      
      const selected = selectItemsForDamage(equipment, 1)
      expect(selected.length).toBe(1)
      expect(selected[0].id).toBe('test_item') // Le torso, pas le weapon
    })
    
    it('retourne liste vide si tous les items sont "solid"', () => {
      const equipment = {
        weapon: createTestItem(100, 100, ['solid']),
        torso: createTestItem(100, 100, ['solid'])
      }
      
      const selected = selectItemsForDamage(equipment, 1)
      expect(selected.length).toBe(0)
    })
  })
  
  describe('applyCombatDamage', () => {
    it('applique -10 à -20% pour "costly"', () => {
      const equipment = {
        weapon: createTestItem(100)
      }
      const random = new SeededRandom(12345)
      
      const results = applyCombatDamage(equipment, 'costly', random)
      
      expect(results.length).toBe(1)
      expect(results[0].newDurability).toBeLessThan(100)
      expect(results[0].newDurability).toBeGreaterThanOrEqual(80)
    })
    
    it('applique -15% pour "flee" sur 1-2 items', () => {
      const equipment = {
        weapon: createTestItem(100),
        torso: createTestItem(100)
      }
      const random = new SeededRandom(54321)
      
      const results = applyCombatDamage(equipment, 'flee', random)
      
      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results.length).toBeLessThanOrEqual(2)
      
      results.forEach(result => {
        expect(result.newDurability).toBe(85) // 100 - 15%
      })
    })
  })
  
  describe('isItemBroken', () => {
    it('retourne true pour durabilité 0', () => {
      expect(isItemBroken(createTestItem(0))).toBe(true)
    })
    
    it('retourne false pour durabilité > 0', () => {
      expect(isItemBroken(createTestItem(1))).toBe(false)
      expect(isItemBroken(createTestItem(100))).toBe(false)
    })
  })
  
  describe('getDurabilityColor', () => {
    it('retourne les bonnes couleurs', () => {
      expect(getDurabilityColor('normal')).toBe('#4a8')
      expect(getDurabilityColor('worn')).toBe('#ca8')
      expect(getDurabilityColor('damaged')).toBe('#c84')
      expect(getDurabilityColor('broken')).toBe('#c44')
    })
  })
})
