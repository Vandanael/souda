import { GameState, GamePhase } from '../../store/gameStore'
import { NarrativeEvent } from '../../types/event'
import { EVENT_POOL } from './eventPool'

/**
 * Gère les événements narratifs et leur déclenchement selon les phases
 */
export class EventManager {
  private readonly COOLDOWN_DAYS = 3 // Jours minimum entre deux déclenchements du même événement (sauf one-time)

  /**
   * Vérifie et retourne un événement éligible pour une phase donnée
   * @param state État actuel du jeu
   * @param phase Phase actuelle du jeu
   * @returns Événement éligible ou null
   */
  checkEvents(state: GameState, phase: GamePhase): NarrativeEvent | null {
    // Filtrer les événements selon la phase
    const phaseEvents = this.getEventsForPhase(phase)
    
    if (phaseEvents.length === 0) {
      return null
    }

    // Filtrer les événements éligibles selon les conditions
    const eligibleEvents = phaseEvents.filter(event => {
      // Vérifier si l'événement one-time a déjà été déclenché
      if (event.oneTime && state.triggeredEvents.includes(event.id)) {
        return false
      }

      // Vérifier le cooldown (sauf pour les événements one-time)
      if (!event.oneTime) {
        const lastDay = state.eventCooldowns?.[event.id]
        if (lastDay !== undefined && state.day - lastDay < this.COOLDOWN_DAYS) {
          return false
        }
      }

      // Vérifier la condition de déclenchement
      return event.triggerCondition(state)
    })

    if (eligibleEvents.length === 0) {
      return null
    }

    // Prioriser les événements one-time
    const oneTimeEvents = eligibleEvents.filter(e => e.oneTime)
    const eventsToChoose = oneTimeEvents.length > 0 ? oneTimeEvents : eligibleEvents

    // Sélectionner un événement aléatoire parmi les éligibles
    const selectedEvent = eventsToChoose[Math.floor(Math.random() * eventsToChoose.length)]

    // Vérification de sécurité : s'assurer que l'événement existe dans le pool
    if (selectedEvent && !EVENT_POOL.find(e => e.id === selectedEvent.id)) {
      console.error('Événement sélectionné non trouvé dans EVENT_POOL:', selectedEvent.id)
      return null
    }

    return selectedEvent
  }
  
  /**
   * Marque un événement comme déclenché (appelé après déclenchement)
   * @param eventId ID de l'événement
   * @param day Jour actuel
   * @param state État actuel (pour mettre à jour)
   */
  markEventTriggered(eventId: string, day: number, state: GameState): { triggeredEvents: string[], eventCooldowns: Record<string, number> } {
    const event = EVENT_POOL.find(e => e.id === eventId)
    if (!event) {
      return { triggeredEvents: state.triggeredEvents, eventCooldowns: state.eventCooldowns || {} }
    }
    
    let newTriggeredEvents = [...state.triggeredEvents]
    let newEventCooldowns = { ...(state.eventCooldowns || {}) }
    
    // Si one-time, ajouter à triggeredEvents
    if (event.oneTime && !newTriggeredEvents.includes(eventId)) {
      newTriggeredEvents.push(eventId)
    }
    
    // Sinon, mettre à jour le cooldown
    if (!event.oneTime) {
      newEventCooldowns[eventId] = day
    }
    
    return { triggeredEvents: newTriggeredEvents, eventCooldowns: newEventCooldowns }
  }

  /**
   * Retourne les événements qui peuvent se déclencher dans une phase donnée
   */
  private getEventsForPhase(phase: GamePhase): NarrativeEvent[] {
    switch (phase) {
      case 'aube':
        // Événements de début de jour : convoi, marchand
        // Le marchand a une probabilité dans sa triggerCondition, donc on les inclut tous
        return EVENT_POOL.filter(e => 
          e.id === 'convoi' || 
          e.id === 'marchand'
        )

      case 'exploration':
        // Événements pendant l'exploration : refugies
        // La probabilité est gérée dans la triggerCondition
        return EVENT_POOL.filter(e => e.id === 'refugies')

      case 'crepuscule':
        // Événements de fin de jour : collecteurs, peste
        // Les probabilités sont gérées dans les triggerConditions
        return EVENT_POOL.filter(e => 
          e.id === 'collecteurs' || 
          e.id === 'peste'
        )

      case 'taverne':
        // Événements à la taverne : marchand, collecteurs
        return EVENT_POOL.filter(e => 
          e.id === 'marchand' || 
          e.id === 'collecteurs'
        )

      default:
        return []
    }
  }

}

// Instance singleton
export const eventManager = new EventManager()
