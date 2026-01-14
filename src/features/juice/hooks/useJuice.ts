/**
 * useJuice - Hook React pour utiliser le système de juice
 */

import { useCallback, useEffect } from 'react'
import { juiceController } from '../JuiceController'
import { feedbackBroker, JuiceEventType, JuiceEventPayloads } from '../FeedbackBroker'

/**
 * Hook principal pour émettre des événements de juice
 */
export function useJuice() {
  // Initialiser le JuiceController au montage
  useEffect(() => {
    juiceController.init()
  }, [])
  
  /**
   * Émet un événement de jeu avec les effets associés
   */
  const emit = useCallback(<T extends JuiceEventType>(
    type: T,
    payload: JuiceEventPayloads[T]
  ) => {
    juiceController.emit(type, payload)
  }, [])
  
  /**
   * Raccourcis pour les événements courants
   */
  const juice = {
    // Combat
    combatStart: (enemyName: string, risk: number) => 
      emit('COMBAT_START', { enemyName, risk }),
    
    combatHit: (intensity: number, isPlayer: boolean = true) => 
      emit('COMBAT_HIT', { intensity, isPlayer }),
    
    combatVictory: (outcome: 'crushing' | 'victory' | 'costly', ratio: number) => 
      emit('COMBAT_VICTORY', { outcome, ratio }),
    
    combatDefeat: (enemyName: string) => 
      emit('COMBAT_DEFEAT', { enemyName }),
    
    combatFlee: (durabilityLoss: number) => 
      emit('COMBAT_FLEE', { durabilityLoss }),
    
    // Loot
    lootRevealStart: (rarity: 'common' | 'uncommon' | 'rare' | 'legendary') => 
      emit('LOOT_REVEAL_START', { rarity }),
    
    lootRevealFlip: (rarity: 'common' | 'uncommon' | 'rare' | 'legendary') => 
      emit('LOOT_REVEAL_FLIP', { rarity }),
    
    lootRevealComplete: (rarity: 'common' | 'uncommon' | 'rare' | 'legendary', itemName: string) => 
      emit('LOOT_REVEAL_COMPLETE', { rarity, itemName }),
    
    // Économie
    goldGain: (amount: number, source: 'combat' | 'loot' | 'sell' | 'event' = 'loot') => 
      emit('GOLD_GAIN', { amount, source }),
    
    goldLoss: (amount: number, reason: 'buy' | 'rent' | 'repair' | 'event' = 'buy') => 
      emit('GOLD_LOSS', { amount, reason }),
    
    debtRepay: (amount: number, remainingDebt: number) => 
      emit('DEBT_REPAY', { amount, remainingDebt }),
    
    debtIncrease: (amount: number, totalDebt: number) => 
      emit('DEBT_INCREASE', { amount, totalDebt }),
    
    // Items
    itemEquip: (slot: string, material: 'metal' | 'leather' | 'cloth' = 'metal') => 
      emit('ITEM_EQUIP', { slot, material }),
    
    itemBreak: (itemName: string) => 
      emit('ITEM_BREAK', { itemName }),
    
    itemRepair: (itemName: string) => 
      emit('ITEM_REPAIR', { itemName }),
    
    // UI
    buttonPress: (importance: 'low' | 'medium' | 'high' = 'medium') => 
      emit('BUTTON_PRESS', { importance }),
    
    menuOpen: (menuType: string) => 
      emit('MENU_OPEN', { menuType }),
    
    menuClose: (menuType: string) => 
      emit('MENU_CLOSE', { menuType }),
  }
  
  return { emit, juice }
}

/**
 * Hook pour s'abonner à un type d'événement spécifique
 */
export function useJuiceEvent<T extends JuiceEventType>(
  type: T,
  handler: (payload: JuiceEventPayloads[T]) => void,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const unsubscribe = feedbackBroker.on(type, handler)
    return unsubscribe
  }, [type, ...deps])
}

/**
 * Hook pour s'abonner à tous les événements (debug/monitoring)
 */
export function useAllJuiceEvents(
  handler: (event: { type: JuiceEventType; payload: unknown; timestamp: number }) => void,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const unsubscribe = feedbackBroker.onAll((event) => {
      handler(event as { type: JuiceEventType; payload: unknown; timestamp: number })
    })
    return unsubscribe
  }, deps)
}
