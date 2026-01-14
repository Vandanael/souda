/**
 * FeedbackBroker - Système Pub/Sub pour les événements de jeu
 * 
 * Centralise la distribution des événements vers les différents systèmes de feedback
 * (audio, haptic, screen effects, particles, etc.)
 */

import { CombatOutcome } from '../combat'
import { GamePhase } from '../../store/gameStore'

// Types d'événements de jeu
export type JuiceEventType = 
  // Combat
  | 'COMBAT_START'
  | 'COMBAT_HIT'
  | 'COMBAT_VICTORY'
  | 'COMBAT_DEFEAT'
  | 'COMBAT_FLEE'
  
  // Loot
  | 'LOOT_REVEAL_START'
  | 'LOOT_REVEAL_FLIP'
  | 'LOOT_REVEAL_COMPLETE'
  
  // Économie
  | 'GOLD_GAIN'
  | 'GOLD_LOSS'
  | 'DEBT_REPAY'
  | 'DEBT_INCREASE'
  
  // Progression
  | 'PHASE_TRANSITION'
  | 'DAY_START'
  | 'DAY_END'
  
  // Items
  | 'ITEM_EQUIP'
  | 'ITEM_BREAK'
  | 'ITEM_REPAIR'
  
  // UI
  | 'BUTTON_PRESS'
  | 'MENU_OPEN'
  | 'MENU_CLOSE'

// Payloads pour chaque type d'événement
export interface JuiceEventPayloads {
  COMBAT_START: { enemyName: string; risk: number }
  COMBAT_HIT: { intensity: number; isPlayer: boolean }
  COMBAT_VICTORY: { outcome: CombatOutcome; ratio: number }
  COMBAT_DEFEAT: { enemyName: string }
  COMBAT_FLEE: { durabilityLoss: number }
  
  LOOT_REVEAL_START: { rarity: 'common' | 'uncommon' | 'rare' | 'legendary' }
  LOOT_REVEAL_FLIP: { rarity: 'common' | 'uncommon' | 'rare' | 'legendary' }
  LOOT_REVEAL_COMPLETE: { rarity: 'common' | 'uncommon' | 'rare' | 'legendary'; itemName: string }
  
  GOLD_GAIN: { amount: number; source: 'combat' | 'loot' | 'sell' | 'event' }
  GOLD_LOSS: { amount: number; reason: 'buy' | 'rent' | 'repair' | 'event' }
  DEBT_REPAY: { amount: number; remainingDebt: number }
  DEBT_INCREASE: { amount: number; totalDebt: number }
  
  PHASE_TRANSITION: { from: GamePhase; to: GamePhase }
  DAY_START: { day: number }
  DAY_END: { day: number; goldEarned: number; combats: number }
  
  ITEM_EQUIP: { slot: string; material: 'metal' | 'leather' | 'cloth' }
  ITEM_BREAK: { itemName: string }
  ITEM_REPAIR: { itemName: string }
  
  BUTTON_PRESS: { importance: 'low' | 'medium' | 'high' }
  MENU_OPEN: { menuType: string }
  MENU_CLOSE: { menuType: string }
}

// Événement générique avec type et payload
export type JuiceEvent<T extends JuiceEventType = JuiceEventType> = {
  type: T
  payload: T extends keyof JuiceEventPayloads ? JuiceEventPayloads[T] : never
  timestamp: number
}

// Handler pour un type d'événement
export type EventHandler<T extends JuiceEventType> = (
  payload: JuiceEventPayloads[T]
) => void

// Handler générique
export type GenericEventHandler = (event: JuiceEvent) => void

// Priorités des handlers (les hauts sont appelés en premier)
export type HandlerPriority = 'critical' | 'high' | 'normal' | 'low'

interface RegisteredHandler<T extends JuiceEventType = JuiceEventType> {
  id: number
  type: T | '*'
  handler: EventHandler<T> | GenericEventHandler
  priority: HandlerPriority
  once: boolean
}

const PRIORITY_ORDER: Record<HandlerPriority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3
}

class FeedbackBrokerSingleton {
  private static instance: FeedbackBrokerSingleton | null = null
  
  private handlerIdCounter: number = 0
  private handlers: Map<JuiceEventType | '*', RegisteredHandler[]> = new Map()
  private eventHistory: JuiceEvent[] = []
  private maxHistoryLength: number = 100
  
  // Pour le debug
  private isDebugMode: boolean = false
  
  private constructor() {}
  
  static getInstance(): FeedbackBrokerSingleton {
    if (!FeedbackBrokerSingleton.instance) {
      FeedbackBrokerSingleton.instance = new FeedbackBrokerSingleton()
    }
    return FeedbackBrokerSingleton.instance
  }
  
  /**
   * Émet un événement vers tous les handlers enregistrés
   */
  emit<T extends JuiceEventType>(
    type: T, 
    payload: JuiceEventPayloads[T]
  ): void {
    const event: JuiceEvent<T> = {
      type,
      payload: payload as T extends keyof JuiceEventPayloads ? JuiceEventPayloads[T] : never,
      timestamp: performance.now()
    }
    
    // Ajouter à l'historique
    this.eventHistory.push(event as JuiceEvent)
    if (this.eventHistory.length > this.maxHistoryLength) {
      this.eventHistory.shift()
    }
    
    // Debug log
    if (this.isDebugMode) {
      console.log(`[FeedbackBroker] ${type}`, payload)
    }
    
    // Récupérer les handlers pour ce type + les handlers génériques (*)
    const specificHandlers = this.handlers.get(type) || []
    const genericHandlers = this.handlers.get('*') || []
    
    // Combiner et trier par priorité
    const allHandlers = [...specificHandlers, ...genericHandlers]
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    
    // Exécuter les handlers
    const handlersToRemove: number[] = []
    
    allHandlers.forEach(registered => {
      try {
        if (registered.type === '*') {
          (registered.handler as GenericEventHandler)(event as JuiceEvent)
        } else {
          (registered.handler as EventHandler<T>)(payload)
        }
        
        if (registered.once) {
          handlersToRemove.push(registered.id)
        }
      } catch (error) {
        console.error(`[FeedbackBroker] Error in handler for ${type}:`, error)
      }
    })
    
    // Retirer les handlers "once"
    handlersToRemove.forEach(id => this.removeHandler(id))
  }
  
  /**
   * S'abonne à un type d'événement spécifique
   */
  on<T extends JuiceEventType>(
    type: T,
    handler: EventHandler<T>,
    options: { priority?: HandlerPriority; once?: boolean } = {}
  ): () => void {
    const { priority = 'normal', once = false } = options
    
    const id = ++this.handlerIdCounter
    const registered: RegisteredHandler<T> = {
      id,
      type,
      handler,
      priority,
      once
    }
    
    const existingHandlers = this.handlers.get(type) || []
    this.handlers.set(type, [...existingHandlers, registered as unknown as RegisteredHandler])
    
    // Retourner une fonction de désinscription
    return () => this.removeHandler(id)
  }
  
  /**
   * S'abonne à un événement une seule fois
   */
  once<T extends JuiceEventType>(
    type: T,
    handler: EventHandler<T>,
    priority: HandlerPriority = 'normal'
  ): () => void {
    return this.on(type, handler, { priority, once: true })
  }
  
  /**
   * S'abonne à TOUS les événements
   */
  onAll(
    handler: GenericEventHandler,
    options: { priority?: HandlerPriority; once?: boolean } = {}
  ): () => void {
    const { priority = 'normal', once = false } = options
    
    const id = ++this.handlerIdCounter
    const registered: RegisteredHandler = {
      id,
      type: '*',
      handler,
      priority,
      once
    }
    
    const existingHandlers = this.handlers.get('*') || []
    this.handlers.set('*', [...existingHandlers, registered])
    
    return () => this.removeHandler(id)
  }
  
  /**
   * Retire un handler par son ID
   */
  private removeHandler(id: number): void {
    this.handlers.forEach((handlers, type) => {
      const filtered = handlers.filter(h => h.id !== id)
      if (filtered.length !== handlers.length) {
        this.handlers.set(type, filtered)
      }
    })
  }
  
  /**
   * Retire tous les handlers pour un type d'événement
   */
  off(type: JuiceEventType): void {
    this.handlers.delete(type)
  }
  
  /**
   * Retire TOUS les handlers
   */
  clear(): void {
    this.handlers.clear()
  }
  
  /**
   * Active/désactive le mode debug
   */
  setDebugMode(enabled: boolean): void {
    this.isDebugMode = enabled
  }
  
  /**
   * Obtient l'historique des événements récents
   */
  getEventHistory(): JuiceEvent[] {
    return [...this.eventHistory]
  }
  
  /**
   * Obtient les N derniers événements d'un type
   */
  getRecentEvents<T extends JuiceEventType>(
    type: T, 
    count: number = 10
  ): JuiceEvent<T>[] {
    return this.eventHistory
      .filter((e): e is JuiceEvent<T> => e.type === type)
      .slice(-count)
  }
  
  /**
   * Pour les tests : reset l'instance
   */
  destroy(): void {
    this.clear()
    this.eventHistory = []
    FeedbackBrokerSingleton.instance = null
  }
}

export const feedbackBroker = FeedbackBrokerSingleton.getInstance()
