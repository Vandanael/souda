import { GamePhase } from '../../store/gameStore'
import { GameState } from '../../store/gameStore'
import { BALANCE_CONFIG } from '../../config/balance'

export type GameManagerState = 'aube' | 'journee' | 'crepuscule' | 'gameover' | 'victory'

export interface DaySummary {
  itemsFound: number
  combatsWon: number
  combatsFled: number
  goldEarned: number
  goldSpent: number
  events: string[]
}

/**
 * Gère les transitions de phase et la progression du jeu
 */
export class GameManager {
  private daySummary: DaySummary = {
    itemsFound: 0,
    combatsWon: 0,
    combatsFled: 0,
    goldEarned: 0,
    goldSpent: 0,
    events: []
  }

  /**
   * Avance à la phase suivante
   */
  advancePhase(currentPhase: GamePhase, gameState: Partial<GameState>): GamePhase {
    switch (currentPhase) {
      case 'aube':
        return 'exploration'
      case 'exploration':
        // Si plus d'actions, passer au crépuscule
        if (gameState.actionsRemaining === 0) {
          return 'crepuscule'
        }
        return 'exploration'
      case 'crepuscule':
        // Vérifier conditions de fin
        const endCondition = this.checkEndConditions(gameState)
        if (endCondition === 'victory') {
          return 'victory'
        } else if (endCondition === 'defeat') {
          return 'defeat'
        }
        // Sinon, nouveau jour
        return 'aube'
      default:
        return currentPhase
    }
  }

  /**
   * Avance au jour suivant
   */
  advanceDay(currentDay: number, currentDebt: number): {
    day: number
    debt: number
    actionsRemaining: number
  } {
    const newDay = currentDay + 1
    
    // Intérêts progressifs selon le jour
    let interest: number
    if (newDay <= 5) {
      interest = BALANCE_CONFIG.economy.progressiveInterest.day1to5
    } else if (newDay <= 10) {
      interest = BALANCE_CONFIG.economy.progressiveInterest.day6to10
    } else if (newDay <= 15) {
      interest = BALANCE_CONFIG.economy.progressiveInterest.day11to15
    } else {
      interest = BALANCE_CONFIG.economy.progressiveInterest.day16to20
    }
    
    // P0.3 - Système de sécurité : Si dette > 150💰 au J15+, réduire intérêts à 3💰/jour
    // (Désactivé avec intérêts progressifs, mais gardé comme fallback)
    if (newDay >= 15 && currentDebt > 150 && interest > 3) {
      interest = 3 // Réduction de sécurité
    }
    
    const newDebt = currentDebt + interest
    
    return {
      day: newDay,
      debt: newDebt,
      actionsRemaining: 3
    }
  }

  /**
   * Vérifie les conditions de fin de partie
   * P0.5 - Clarification : Jour 20 inclus, vérification se fait APRÈS advanceDay(), donc au crépuscule du J20
   */
  checkEndConditions(gameState: Partial<GameState>): 'victory' | 'defeat' | null {
    const day = gameState.day || 1
    const debt = gameState.debt || 0
    
    // Jour 20 atteint (>= car vérification après advanceDay, donc day = 20 signifie crépuscule du J20)
    if (day >= 20) {
      if (debt <= 0) {
        return 'victory'
      } else {
        return 'defeat'
      }
    }
    
    // Défaite par combat (géré ailleurs)
    if (gameState.phase === 'defeat') {
      return 'defeat'
    }
    
    return null
  }

  /**
   * Génère un événement du soir (30% chance)
   */
  generateEveningEvent(_day: number): string | null {
    if (Math.random() < 0.3) {
      const events = [
        'Un marchand passe par le camp. Il propose des équipements.',
        'Tu entends des rumeurs sur un trésor caché dans les ruines.',
        'Un groupe de voyageurs partage des nouvelles du royaume.',
        'La nuit est calme. Trop calme.',
        'Des lumières dans la forêt. Quelqu\'un d\'autre explore.',
        'Un message est accroché à un arbre. Une offre de travail.',
        'Le vent apporte l\'odeur de la guerre. Pas loin.',
        'Des traces de pas. Récentes. Tu n\'es pas seul ici.'
      ]
      return events[Math.floor(Math.random() * events.length)]
    }
    return null
  }

  /**
   * Réinitialise le résumé du jour
   */
  resetDaySummary(): void {
    this.daySummary = {
      itemsFound: 0,
      combatsWon: 0,
      combatsFled: 0,
      goldEarned: 0,
      goldSpent: 0,
      events: []
    }
  }

  /**
   * Ajoute un événement au résumé du jour
   */
  addToDaySummary(event: Partial<DaySummary>): void {
    this.daySummary = {
      ...this.daySummary,
      ...event
    }
  }

  /**
   * Obtient le résumé du jour
   */
  getDaySummary(): DaySummary {
    return { ...this.daySummary }
  }
}
