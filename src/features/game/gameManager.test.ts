import { describe, it, expect } from 'vitest'
import { GameManager } from './gameManager'

describe('GameManager', () => {
  describe('advancePhase', () => {
    it('passe de aube à exploration', () => {
      const manager = new GameManager()
      const nextPhase = manager.advancePhase('aube', {})
      expect(nextPhase).toBe('exploration')
    })
    
    it('reste en exploration si actions restantes', () => {
      const manager = new GameManager()
      const nextPhase = manager.advancePhase('exploration', { actionsRemaining: 2 })
      expect(nextPhase).toBe('exploration')
    })
    
    it('passe de exploration à crepuscule si plus d\'actions', () => {
      const manager = new GameManager()
      const nextPhase = manager.advancePhase('exploration', { actionsRemaining: 0 })
      expect(nextPhase).toBe('crepuscule')
    })
    
    it('passe de crepuscule à aube si pas jour 20', () => {
      const manager = new GameManager()
      const nextPhase = manager.advancePhase('crepuscule', { day: 5, debt: 100, gold: 50 })
      expect(nextPhase).toBe('aube')
    })
  })
  
  describe('advanceDay', () => {
    it('incrémente le jour et ajoute 5 à la dette', () => {
      const manager = new GameManager()
      const result = manager.advanceDay(1, 80)
      
      expect(result.day).toBe(2)
      expect(result.debt).toBe(85)
      expect(result.actionsRemaining).toBe(3)
    })
    
    it('applique correctement les intérêts sur plusieurs jours', () => {
      const manager = new GameManager()
      let day = 1
      let debt = 80
      
      for (let i = 0; i < 5; i++) {
        const result = manager.advanceDay(day, debt)
        day = result.day
        debt = result.debt
      }
      
      expect(day).toBe(6)
      expect(debt).toBe(105) // 80 + (5 * 5)
    })
  })
  
  describe('checkEndConditions', () => {
    it('retourne victory si jour 20 et dette remboursée', () => {
      const manager = new GameManager()
      const result = manager.checkEndConditions({
        day: 20,
        debt: 0,
        gold: 100
      })
      
      expect(result).toBe('victory')
    })
    
    it('retourne defeat si jour 20 et dette non remboursée', () => {
      const manager = new GameManager()
      const result = manager.checkEndConditions({
        day: 20,
        debt: 100,
        gold: 50
      })
      
      expect(result).toBe('defeat')
    })
    
    it('retourne null si pas jour 20', () => {
      const manager = new GameManager()
      const result = manager.checkEndConditions({
        day: 10,
        debt: 100,
        gold: 50
      })
      
      expect(result).toBe(null)
    })
    
    it('retourne defeat si phase defeat', () => {
      const manager = new GameManager()
      const result = manager.checkEndConditions({
        day: 5,
        debt: 100,
        gold: 50,
        phase: 'defeat'
      })
      
      expect(result).toBe('defeat')
    })
  })
  
  describe('generateEveningEvent', () => {
    it('retourne un événement 30% du temps', () => {
      const manager = new GameManager()
      let eventsGenerated = 0
      
      // Tester 100 fois pour vérifier la probabilité
      for (let i = 0; i < 100; i++) {
        const event = manager.generateEveningEvent(1)
        if (event) eventsGenerated++
      }
      
      // Devrait être autour de 30% (±10%)
      expect(eventsGenerated).toBeGreaterThan(20)
      expect(eventsGenerated).toBeLessThan(40)
    })
    
    it('retourne null 70% du temps', () => {
      const manager = new GameManager()
      let nullCount = 0
      
      for (let i = 0; i < 100; i++) {
        const event = manager.generateEveningEvent(1)
        if (!event) nullCount++
      }
      
      expect(nullCount).toBeGreaterThan(60)
      expect(nullCount).toBeLessThan(80)
    })
  })
  
  describe('Simulation 20 jours', () => {
    it('simule une run complète de 20 jours', () => {
      const manager = new GameManager()
      let day = 1
      let debt = 80
      let gold = 0
      
      // Simuler 20 jours
      for (let i = 0; i < 20; i++) {
        // Avancer au jour suivant
        const dayResult = manager.advanceDay(day, debt)
        day = dayResult.day
        debt = dayResult.debt
        
        // Simuler quelques actions (gain d'or)
        gold += Math.floor(Math.random() * 20) + 10
        
        // Vérifier conditions de fin
        const endCondition = manager.checkEndConditions({
          day,
          debt,
          gold,
          phase: 'aube'
        })
        
        if (endCondition === 'victory' || endCondition === 'defeat') {
          break
        }
      }
      
      // Vérifier que la simulation s'est terminée
      expect(day).toBeGreaterThanOrEqual(20)
      
      // Vérifier que la dette a augmenté
      expect(debt).toBeGreaterThan(80)
      
      // Vérifier conditions de fin
      const finalCondition = manager.checkEndConditions({
        day,
        debt,
        gold,
        phase: 'aube'
      })
      
      expect(['victory', 'defeat']).toContain(finalCondition)
    })
  })
})
