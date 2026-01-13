import { GameState } from '../../store/gameStore'
import { NarrativeEvent, EventChoice } from '../../types/event'
import { EVENT_POOL } from './eventPool'

/**
 * Résout les événements narratifs
 */

/**
 * Trouve un événement éligible selon les conditions
 * @deprecated Remplacé par EventManager.checkEvents() - à supprimer
 * @internal Fonction dépréciée, conservée pour compatibilité
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
// @ts-ignore - Fonction dépréciée, non utilisée
function _findEligibleEvent(state: GameState): NarrativeEvent | null {
  // Filtrer les événements éligibles
  const eligibleEvents = EVENT_POOL.filter(event => {
    // Vérifier si l'événement one-time a déjà été déclenché
    if (event.oneTime && state.triggeredEvents.includes(event.id)) {
      return false
    }
    
    // Vérifier la condition de déclenchement
    return event.triggerCondition(state)
  })
  
  if (eligibleEvents.length === 0) {
    return null
  }
  
  // Sélectionner un événement aléatoire parmi les éligibles
  return eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)]
}

/**
 * Vérifie si un choix est disponible selon les requirements
 */
export function isChoiceAvailable(choice: EventChoice, state: GameState): boolean {
  if (!choice.requirements) {
    return true
  }
  
  if (choice.requirements.gold && state.gold < choice.requirements.gold) {
    return false
  }
  
  if (choice.requirements.reputation && state.reputation < choice.requirements.reputation) {
    return false
  }
  
  if (choice.requirements.item) {
    const hasItem = Object.values(state.equipment).some(item => item?.id === choice.requirements!.item) ||
                    state.inventory.some(item => item.id === choice.requirements!.item)
    if (!hasItem) {
      return false
    }
  }
  
  if (choice.requirements.flag) {
    if (!state.npcFlags[choice.requirements.flag]) {
      return false
    }
  }
  
  // Vérifier les compteurs narratifs
  if (choice.requirements.humanite) {
    const humanite = state.narrativeCounters.humanite || 0
    if (humanite < choice.requirements.humanite) {
      return false
    }
  }
  
  if (choice.requirements.cynisme) {
    const cynisme = state.narrativeCounters.cynisme || 0
    if (cynisme < choice.requirements.cynisme) {
      return false
    }
  }
  
  if (choice.requirements.pragmatisme) {
    const pragmatisme = state.narrativeCounters.pragmatisme || 0
    if (pragmatisme < choice.requirements.pragmatisme) {
      return false
    }
  }
  
  return true
}
