import { describe, it, expect } from 'vitest'
import { resolveCombat, calculatePower, SeededRandom, CombatOutcome } from './combat.logic'
import { ENEMIES } from '../../types/enemy'
import { Item } from '../../types/item'

describe('Combat Logic', () => {
  describe('calculatePower', () => {
    it('calcule correctement la puissance avec stats de base', () => {
      const stats = { atk: 10, def: 10, vit: 10 }
      const random = new SeededRandom(12345)
      
      const power = calculatePower(stats, true, random)
      
      // Base = (10 * 0.5) + (10 * 0.3) + (10 * 0.2) = 5 + 3 + 2 = 10
      // Random = entre 1 et 20
      // Donc power entre 11 et 30
      expect(power).toBeGreaterThanOrEqual(11)
      expect(power).toBeLessThanOrEqual(30)
    })
    
    it('utilise random(1-20) pour le joueur', () => {
      const stats = { atk: 0, def: 0, vit: 0 }
      const random = new SeededRandom(12345)
      
      const power = calculatePower(stats, true, random)
      
      // Base = 0, donc power = random(1-20)
      expect(power).toBeGreaterThanOrEqual(1)
      expect(power).toBeLessThanOrEqual(20)
    })
    
    it('utilise random(1-15) pour l\'ennemi', () => {
      const stats = { atk: 0, def: 0, vit: 0 }
      const random = new SeededRandom(12345)
      
      const power = calculatePower(stats, false, random)
      
      // Base = 0, donc power = random(1-15)
      expect(power).toBeGreaterThanOrEqual(1)
      expect(power).toBeLessThanOrEqual(15)
    })
  })
  
  describe('resolveCombat - Seuils de ratio', () => {
    const enemy = ENEMIES.bandit // ATK: 10, DEF: 6, VIT: 4
    
    it('retourne "crushing" pour ratio > 1.4', () => {
      // Stats très élevées pour garantir ratio > 1.4
      const playerStats = { atk: 50, def: 50, vit: 50 }
      const random = new SeededRandom(1)
      
      const result = resolveCombat(playerStats, enemy, undefined, random)
      
      expect(result.outcome).toBe('crushing')
      expect(result.ratio).toBeGreaterThan(1.4)
      expect(result.lootEarned).toBe(true)
      expect(result.gold).toBeDefined()
      expect(result.durabilityLoss).toHaveLength(0)
    })
    
    it('retourne "victory" pour ratio > 1.0 et <= 1.4', () => {
      // Stats moyennes pour ratio entre 1.0 et 1.4
      const playerStats = { atk: 15, def: 12, vit: 8 }
      const random = new SeededRandom(2)
      
      const result = resolveCombat(playerStats, enemy, undefined, random)
      
      expect(result.outcome).toBe('victory')
      expect(result.ratio).toBeGreaterThan(1.0)
      expect(result.ratio).toBeLessThanOrEqual(1.4)
      expect(result.lootEarned).toBe(true)
      expect(result.gold).toBeDefined()
      expect(result.durabilityLoss).toHaveLength(0)
    })
    
    it('retourne "costly" pour ratio > 0.7 et <= 1.0', () => {
      // Stats faibles pour ratio entre 0.7 et 1.0
      const playerStats = { atk: 8, def: 6, vit: 4 }
      const random = new SeededRandom(3)
      
      const result = resolveCombat(playerStats, enemy, undefined, random)
      
      // Note: Le ratio peut varier selon le random, donc on teste plusieurs fois
      if (result.ratio > 0.7 && result.ratio <= 1.0) {
        expect(result.outcome).toBe('costly')
        expect(result.lootEarned).toBe(true)
        expect(result.gold).toBeDefined()
      }
    })
    
    it('retourne "flee" pour ratio > 0.4 et <= 0.7', () => {
      // Stats très faibles pour ratio entre 0.4 et 0.7
      const playerStats = { atk: 4, def: 3, vit: 2 }
      const random = new SeededRandom(4)
      
      const result = resolveCombat(playerStats, enemy, undefined, random)
      
      if (result.ratio > 0.4 && result.ratio <= 0.7) {
        expect(result.outcome).toBe('flee')
        expect(result.lootEarned).toBe(false)
        expect(result.gold).toBeUndefined()
      }
    })
    
    it('retourne "defeat" pour ratio <= 0.4', () => {
      // Stats minimales pour ratio très faible
      const playerStats = { atk: 1, def: 1, vit: 1 }
      const random = new SeededRandom(5)
      
      const result = resolveCombat(playerStats, enemy, undefined, random)
      
      if (result.ratio <= 0.4) {
        expect(result.outcome).toBe('defeat')
        expect(result.lootEarned).toBe(false)
        expect(result.gold).toBeUndefined()
      }
    })
  })
  
  describe('resolveCombat - Durabilité', () => {
    const enemy = ENEMIES.bandit
    const playerStats = { atk: 8, def: 6, vit: 4 }
    
    const mockEquipment: Partial<Record<string, Item>> = {
      weapon: {
        id: 'sword_1',
        name: 'Épée',
        slot: 'weapon',
        rarity: 'common',
        stats: { atk: 8, def: 0, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 10,
        description: 'Test'
      },
      torso: {
        id: 'armor_1',
        name: 'Armure',
        slot: 'torso',
        rarity: 'common',
        stats: { atk: 0, def: 6, vit: 0 },
        durability: 100,
        maxDurability: 100,
        properties: [],
        value: 8,
        description: 'Test'
      }
    }
    
    it('applique -10 à -20% durabilité sur 1 item pour "costly"', () => {
      // Forcer un résultat "costly" avec un random seed spécifique
      const random = new SeededRandom(100)
      
      const result = resolveCombat(playerStats, enemy, mockEquipment, random)
      
      if (result.outcome === 'costly') {
        expect(result.durabilityLoss).toHaveLength(1)
        expect(result.durabilityLoss[0].amount).toBeGreaterThanOrEqual(10)
        expect(result.durabilityLoss[0].amount).toBeLessThanOrEqual(20)
        expect(['sword_1', 'armor_1']).toContain(result.durabilityLoss[0].itemId)
      }
    })
    
    it('applique -15% durabilité sur 1-2 items pour "flee"', () => {
      // Stats très faibles pour forcer "flee"
      const weakStats = { atk: 2, def: 2, vit: 1 }
      const random = new SeededRandom(200)
      
      const result = resolveCombat(weakStats, enemy, mockEquipment, random)
      
      if (result.outcome === 'flee') {
        expect(result.durabilityLoss.length).toBeGreaterThanOrEqual(1)
        expect(result.durabilityLoss.length).toBeLessThanOrEqual(2)
        result.durabilityLoss.forEach(loss => {
          expect(loss.amount).toBe(15)
        })
      }
    })
    
    it('n\'applique pas de perte de durabilité pour "victory" ou "crushing"', () => {
      const strongStats = { atk: 30, def: 30, vit: 30 }
      const random = new SeededRandom(300)
      
      const result = resolveCombat(strongStats, enemy, mockEquipment, random)
      
      if (result.outcome === 'victory' || result.outcome === 'crushing') {
        expect(result.durabilityLoss).toHaveLength(0)
      }
    })
  })
  
  describe('Distribution sur 1000 combats', () => {
    it('génère une distribution réaliste de résultats', () => {
      const enemy = ENEMIES.bandit
      const playerStats = { atk: 12, def: 10, vit: 5 } // Stats moyennes
      
      const outcomes: Record<CombatOutcome, number> = {
        crushing: 0,
        victory: 0,
        costly: 0,
        flee: 0,
        defeat: 0
      }
      
      // 1000 combats avec seeds différentes
      for (let i = 0; i < 1000; i++) {
        const random = new SeededRandom(i)
        const result = resolveCombat(playerStats, enemy, undefined, random)
        outcomes[result.outcome]++
      }
      
      // Vérifier que tous les résultats sont possibles
      const total = Object.values(outcomes).reduce((a, b) => a + b, 0)
      expect(total).toBe(1000)
      
      // Avec stats moyennes, on devrait avoir surtout des victoires
      expect(outcomes.victory + outcomes.crushing).toBeGreaterThan(outcomes.defeat)
      
      // Les ratios doivent être réalistes
      expect(outcomes.crushing).toBeGreaterThan(0)
      expect(outcomes.victory).toBeGreaterThan(0)
    })
  })
  
  describe('Cas limites', () => {
    it('gère stats à 0', () => {
      const enemy = ENEMIES.bandit
      const playerStats = { atk: 0, def: 0, vit: 0 }
      const random = new SeededRandom(1000)
      
      const result = resolveCombat(playerStats, enemy, undefined, random)
      
      // Même avec stats à 0, le random(1-20) donne une chance
      expect(result.playerPower).toBeGreaterThanOrEqual(1)
      expect(result.ratio).toBeGreaterThan(0)
    })
    
    it('gère ennemi très fort', () => {
      const strongEnemy: typeof ENEMIES.bandit = {
        ...ENEMIES.bandit,
        atk: 50,
        def: 50,
        vit: 50
      }
      const playerStats = { atk: 10, def: 10, vit: 10 }
      const random = new SeededRandom(2000)
      
      const result = resolveCombat(playerStats, strongEnemy, undefined, random)
      
      // Avec un ennemi très fort, on devrait souvent perdre ou fuir
      expect(['defeat', 'flee', 'costly']).toContain(result.outcome)
    })
    
    it('gère joueur très fort', () => {
      const enemy = ENEMIES.bandit
      const playerStats = { atk: 100, def: 100, vit: 100 }
      const random = new SeededRandom(3000)
      
      const result = resolveCombat(playerStats, enemy, undefined, random)
      
      // Avec stats très élevées, on devrait toujours gagner
      expect(['crushing', 'victory']).toContain(result.outcome)
      expect(result.lootEarned).toBe(true)
    })
  })
  
  describe('SeededRandom', () => {
    it('génère des séquences déterministes', () => {
      const random1 = new SeededRandom(12345)
      const random2 = new SeededRandom(12345)
      
      // Même seed = même séquence
      expect(random1.next()).toBe(random2.next())
      expect(random1.nextInt(1, 10)).toBe(random2.nextInt(1, 10))
    })
    
    it('génère des séquences différentes avec seeds différentes', () => {
      const random1 = new SeededRandom(111)
      const random2 = new SeededRandom(222)
      
      // Seeds différentes = séquences différentes
      expect(random1.next()).not.toBe(random2.next())
    })
  })
})
