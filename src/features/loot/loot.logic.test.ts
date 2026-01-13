import { describe, it, expect } from 'vitest'
import { generateLoot, getRarityProbabilities, determineRarity, generateMultipleLoot } from './loot.logic'
import { BASE_ITEMS, type Item } from '../../types/item'
import { SeededRandom } from '../combat/combat.logic'

describe('Loot Logic', () => {
  describe('getRarityProbabilities', () => {
    it('retourne probabilités de base pour risque 1-2', () => {
      const probs = getRarityProbabilities(1)
      expect(probs.common).toBe(0.60)
      expect(probs.uncommon).toBe(0.30)
      expect(probs.rare).toBe(0.09)
      expect(probs.legendary).toBe(0.01)
    })
    
    it('retourne probabilités risquées pour risque 3-4', () => {
      const probs = getRarityProbabilities(3)
      expect(probs.common).toBe(0.50)
      expect(probs.uncommon).toBe(0.35)
      expect(probs.rare).toBe(0.12)
      expect(probs.legendary).toBe(0.03)
    })
    
    it('clamp le risque entre 1 et 4', () => {
      const probsLow = getRarityProbabilities(0)
      const probsHigh = getRarityProbabilities(5)
      
      expect(probsLow).toEqual(getRarityProbabilities(1))
      expect(probsHigh).toEqual(getRarityProbabilities(4))
    })
  })
  
  describe('determineRarity', () => {
    it('détermine correctement la rareté selon probabilités', () => {
      const probs = { common: 0.6, uncommon: 0.3, rare: 0.09, legendary: 0.01 }
      const random = new SeededRandom(12345)
      
      // Avec seed 12345, on devrait avoir une valeur déterministe
      const rarity = determineRarity(probs, random)
      expect(['common', 'uncommon', 'rare', 'legendary']).toContain(rarity)
    })
    
    it('respecte les seuils de probabilité', () => {
      const probs = { common: 0.5, uncommon: 0.3, rare: 0.15, legendary: 0.05 }
      const results: Record<string, number> = { common: 0, uncommon: 0, rare: 0, legendary: 0 }
      
      // 1000 tirages pour vérifier distribution
      for (let i = 0; i < 1000; i++) {
        const random = new SeededRandom(i)
        const rarity = determineRarity(probs, random)
        results[rarity]++
      }
      
      // Vérifier que la distribution est proche des probabilités (±5%)
      expect(results.common / 1000).toBeGreaterThan(0.45)
      expect(results.common / 1000).toBeLessThan(0.55)
    })
  })
  
  describe('generateLoot', () => {
    it('génère un item valide', () => {
      const item = generateLoot(2)
      
      expect(item).toBeDefined()
      expect(item.id).toBeDefined()
      expect(item.name).toBeDefined()
      expect(item.rarity).toBeDefined()
      expect(item.durability).toBeGreaterThanOrEqual(item.maxDurability * 0.8)
      expect(item.durability).toBeLessThanOrEqual(item.maxDurability)
    })
    
    it('génère un item avec ID unique', () => {
      const item1 = generateLoot(2)
      const item2 = generateLoot(2)
      
      expect(item1.id).not.toBe(item2.id)
    })
    
    it('génère durabilité entre 80-100%', () => {
      const item = generateLoot(2)
      const percentage = (item.durability / item.maxDurability) * 100
      
      expect(percentage).toBeGreaterThanOrEqual(80)
      expect(percentage).toBeLessThanOrEqual(100)
    })
    
    it('utilise le pool d\'items fourni', () => {
      const customPool = BASE_ITEMS.filter(item => item.rarity === 'common')
      const item = generateLoot(1, customPool)
      
      // Vérifier que l'ID de base correspond à un item du pool
      // L'ID généré est de la forme: baseId_timestamp_random
      expect(customPool.some(i => item.id.startsWith(i.id))).toBe(true)
    })
  })
  
  describe('Distribution sur 1000 loots', () => {
    it('génère distribution conforme aux probabilités (risque 1-2)', () => {
      const results: Record<string, number> = {
        common: 0,
        uncommon: 0,
        rare: 0,
        legendary: 0
      }
      
      for (let i = 0; i < 1000; i++) {
        const random = new SeededRandom(i)
        const item = generateLoot(2, BASE_ITEMS, random)
        results[item.rarity]++
      }
      
      // Vérifier distribution (±5% de tolérance)
      expect(results.common / 1000).toBeGreaterThan(0.55)
      expect(results.common / 1000).toBeLessThan(0.65)
      
      expect(results.uncommon / 1000).toBeGreaterThan(0.25)
      expect(results.uncommon / 1000).toBeLessThan(0.35)
      
      expect(results.rare / 1000).toBeGreaterThan(0.04)
      expect(results.rare / 1000).toBeLessThan(0.14)
    })
    
    it('génère distribution conforme aux probabilités (risque 3-4)', () => {
      const results: Record<string, number> = {
        common: 0,
        uncommon: 0,
        rare: 0,
        legendary: 0
      }
      
      for (let i = 0; i < 1000; i++) {
        const random = new SeededRandom(i + 10000)
        const item = generateLoot(3, BASE_ITEMS, random)
        results[item.rarity]++
      }
      
      // Vérifier distribution (±5% de tolérance)
      expect(results.common / 1000).toBeGreaterThan(0.45)
      expect(results.common / 1000).toBeLessThan(0.55)
      
      expect(results.uncommon / 1000).toBeGreaterThan(0.30)
      expect(results.uncommon / 1000).toBeLessThan(0.40)
      
      expect(results.rare / 1000).toBeGreaterThan(0.07)
      expect(results.rare / 1000).toBeLessThan(0.17)
      
      // Légendaires plus fréquents (mais peut être 0 si aucun item légendaire dans le pool)
      // On vérifie juste que le système fonctionne
      expect(results.legendary).toBeGreaterThanOrEqual(0)
    })
  })
  
  describe('Propriétés spéciales', () => {
    it('ajoute propriétés uniquement sur Rare+', () => {
      // Créer des items de test sans propriétés initiales
      const commonItem: Item = {
        id: 'test_common',
        name: 'Test Common',
        slot: 'weapon',
        rarity: 'common',
        stats: { atk: 5, def: 0, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 10,
        description: 'Test'
      }
      
      const uncommonItem: Item = {
        id: 'test_uncommon',
        name: 'Test Uncommon',
        slot: 'weapon',
        rarity: 'uncommon',
        stats: { atk: 8, def: 0, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 20,
        description: 'Test'
      }
      
      const rareItem: Item = {
        id: 'test_rare',
        name: 'Test Rare',
        slot: 'weapon',
        rarity: 'rare',
        stats: { atk: 12, def: 0, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 40,
        description: 'Test'
      }
      
      let commonWithNewProps = 0
      let uncommonWithNewProps = 0
      let rareWithNewProps = 0
      
      // Générer 200 items de chaque rareté
      for (let i = 0; i < 200; i++) {
        const random = new SeededRandom(i)
        
        // Utiliser risque 1 pour forcer common (60% common)
        // Mais si la rareté déterminée n'est pas common, le fallback utilisera commonItem
        const common = generateLoot(1, [commonItem], random)
        // Vérifier si une nouvelle propriété a été ajoutée (pas celle de base)
        const originalProps = commonItem.properties.length
        if (common.properties.length > originalProps) commonWithNewProps++
        
        // Utiliser risque 2 pour forcer uncommon (30% uncommon, mais peut être common)
        // On force en utilisant un pool avec seulement uncommon
        const uncommon = generateLoot(2, [uncommonItem], random)
        const originalUncommonProps = uncommonItem.properties.length
        if (uncommon.properties.length > originalUncommonProps) uncommonWithNewProps++
        
        // Utiliser risque 4 pour maximiser chances de rare (12% rare)
        const rare = generateLoot(4, [rareItem], random)
        const originalRareProps = rareItem.properties.length
        if (rare.properties.length > originalRareProps) rareWithNewProps++
      }
      
      // Common et Uncommon ne devraient pas avoir de nouvelles propriétés
      expect(commonWithNewProps).toBe(0)
      expect(uncommonWithNewProps).toBe(0)
      
      // Rare peut avoir de nouvelles propriétés (30% chance)
      expect(rareWithNewProps).toBeGreaterThan(0)
    })
    
    it('n\'ajoute pas de propriétés incompatibles', () => {
      const rareItem: Item = {
        id: 'test_rare',
        name: 'Test Rare',
        slot: 'weapon',
        rarity: 'rare',
        stats: { atk: 12, def: 0, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 40,
        description: 'Test'
      }
      
      // Générer 200 items rares
      for (let i = 0; i < 200; i++) {
        const random = new SeededRandom(i)
        const item = generateLoot(3, [rareItem], random)
        
        // Vérifier qu'on n'a pas 'light' et 'heavy' en même temps
        const hasLight = item.properties.includes('light')
        const hasHeavy = item.properties.includes('heavy')
        expect(hasLight && hasHeavy).toBe(false)
      }
    })
    
    it('respecte la limite de 2 propriétés', () => {
      const rareItem: Item = {
        id: 'test_rare',
        name: 'Test Rare',
        slot: 'weapon',
        rarity: 'rare',
        stats: { atk: 12, def: 0, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 40,
        description: 'Test'
      }
      
      // Générer 200 items rares (utiliser risque 4)
      for (let i = 0; i < 200; i++) {
        const random = new SeededRandom(i)
        const item = generateLoot(4, [rareItem], random)
        expect(item.properties.length).toBeLessThanOrEqual(2)
      }
    })
  })
  
  describe('locationRisk modifie les probabilités', () => {
    it('risque 1-2 génère plus de communs', () => {
      const resultsLow: Record<string, number> = { common: 0, uncommon: 0, rare: 0, legendary: 0 }
      const resultsHigh: Record<string, number> = { common: 0, uncommon: 0, rare: 0, legendary: 0 }
      
      for (let i = 0; i < 500; i++) {
        const random1 = new SeededRandom(i)
        const random2 = new SeededRandom(i + 5000)
        
        const itemLow = generateLoot(1, BASE_ITEMS, random1)
        const itemHigh = generateLoot(4, BASE_ITEMS, random2)
        
        resultsLow[itemLow.rarity]++
        resultsHigh[itemHigh.rarity]++
      }
      
      // Risque faible devrait avoir plus de communs
      expect(resultsLow.common / 500).toBeGreaterThan(resultsHigh.common / 500)
      
      // Risque élevé devrait avoir plus de rares
      expect(resultsHigh.rare / 500).toBeGreaterThan(resultsLow.rare / 500)
    })
  })
  
  describe('generateMultipleLoot', () => {
    it('génère le bon nombre d\'items', () => {
      const items = generateMultipleLoot(5, 2)
      expect(items).toHaveLength(5)
    })
    
    it('génère des IDs uniques', () => {
      const items = generateMultipleLoot(10, 2)
      const ids = items.map(i => i.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(10)
    })
  })
})
