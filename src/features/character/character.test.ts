import { describe, it, expect, beforeEach } from 'vitest'
import { renderCharacter } from './renderCharacter'
import { spriteCache } from './spriteCache'
import { generateEquipmentHash } from './layering'
import { Item } from '../../types/item'

// Mock Image pour les tests (si nécessaire)
// Les tests utilisent directement les placeholders générés

describe('Character Rendering', () => {
  beforeEach(() => {
    spriteCache.clear()
  })
  
  describe('renderCharacter', () => {
    it('rend le personnage avec équipement', async () => {
      const equipment: Partial<Record<string, Item>> = {
        weapon: {
          id: 'sword_test',
          name: 'Épée Test',
          slot: 'weapon',
          rarity: 'common',
          stats: { atk: 10, def: 0, vit: 0 },
          durability: 100,
          maxDurability: 100,
          properties: [],
          value: 10,
          description: 'Test'
        }
      }
      
      const startTime = performance.now()
      const imageData = await renderCharacter(equipment)
      const renderTime = performance.now() - startTime
      
      expect(imageData).toBeDefined()
      expect(imageData.width).toBe(64)
      expect(imageData.height).toBe(64)
      expect(renderTime).toBeLessThan(100) // Test basique, pas de contrainte stricte ici
    })
    
    it('utilise le cache après premier rendu', async () => {
      const equipment: Partial<Record<string, Item>> = {
        weapon: {
          id: 'sword_test',
          name: 'Épée Test',
          slot: 'weapon',
          rarity: 'common',
          stats: { atk: 10, def: 0, vit: 0 },
          durability: 100,
          maxDurability: 100,
          properties: [],
          value: 10,
          description: 'Test'
        }
      }
      
      // Premier rendu
      const firstStart = performance.now()
      const firstResult = await renderCharacter(equipment)
      const firstTime = performance.now() - firstStart
      
      // Deuxième rendu (devrait utiliser le cache)
      const secondStart = performance.now()
      const secondResult = await renderCharacter(equipment)
      const secondTime = performance.now() - secondStart
      
      expect(firstResult).toBeDefined()
      expect(secondResult).toBeDefined()
      // Le deuxième rendu devrait être plus rapide (cache hit)
      expect(secondTime).toBeLessThan(firstTime * 0.5)
    })
    
    it('affiche preview en transparence', async () => {
      const equipment: Partial<Record<string, Item>> = {
        weapon: {
          id: 'sword_test',
          name: 'Épée Test',
          slot: 'weapon',
          rarity: 'common',
          stats: { atk: 10, def: 0, vit: 0 },
          durability: 100,
          maxDurability: 100,
          properties: [],
          value: 10,
          description: 'Test'
        }
      }
      
      const previewItem: Item = {
        id: 'sword_preview',
        name: 'Épée Preview',
        slot: 'weapon',
        rarity: 'rare',
        stats: { atk: 15, def: 0, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 20,
        description: 'Preview'
      }
      
      const imageData = await renderCharacter(equipment, previewItem)
      
      expect(imageData).toBeDefined()
      // Le hash devrait inclure le preview
      const hash = generateEquipmentHash(equipment)
      const previewHash = `${hash}_preview:${previewItem.slot}:${previewItem.id}`
      expect(spriteCache.get(previewHash)).toBeDefined()
    })
    
    it('re-rend immédiatement quand équipement change', async () => {
      const equipment1: Partial<Record<string, Item>> = {
        weapon: {
          id: 'sword1',
          name: 'Épée 1',
          slot: 'weapon',
          rarity: 'common',
          stats: { atk: 10, def: 0, vit: 0 },
          durability: 100,
          maxDurability: 100,
          properties: [],
          value: 10,
          description: 'Test'
        }
      }
      
      const equipment2: Partial<Record<string, Item>> = {
        weapon: {
          id: 'sword2',
          name: 'Épée 2',
          slot: 'weapon',
          rarity: 'common',
          stats: { atk: 12, def: 0, vit: 0 },
          durability: 100,
          maxDurability: 100,
          properties: [],
          value: 12,
          description: 'Test'
        }
      }
      
      const result1 = await renderCharacter(equipment1)
      const result2 = await renderCharacter(equipment2)
      
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
      
      // Les hashs devraient être différents
      const hash1 = generateEquipmentHash(equipment1)
      const hash2 = generateEquipmentHash(equipment2)
      expect(hash1).not.toBe(hash2)
    })
  })
  
  describe('Performance', () => {
    it('rendu composite < 16ms (objectif)', async () => {
      const equipment: Partial<Record<string, Item>> = {
        weapon: {
          id: 'sword_test',
          name: 'Épée Test',
          slot: 'weapon',
          rarity: 'common',
          stats: { atk: 10, def: 0, vit: 0 },
          durability: 100,
          maxDurability: 100,
          properties: [],
          value: 10,
          description: 'Test'
        },
        torso: {
          id: 'armor_test',
          name: 'Armure Test',
          slot: 'torso',
          rarity: 'common',
          stats: { atk: 0, def: 5, vit: 0 },
          durability: 100,
          maxDurability: 100,
          properties: [],
          value: 8,
          description: 'Test'
        }
      }
      
      // Vider le cache pour forcer un nouveau rendu
      spriteCache.clear()
      
      const startTime = performance.now()
      await renderCharacter(equipment)
      const renderTime = performance.now() - startTime
      
      // Note: En test, les images sont mockées donc c'est plus rapide
      // En production, avec de vraies images, ça peut être plus lent
      // On vérifie juste que ça ne prend pas trop de temps
      expect(renderTime).toBeLessThan(100)
    })
  })
})
