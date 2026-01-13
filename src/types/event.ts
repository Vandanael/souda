import { GameState } from '../store/gameStore'

/**
 * Types pour le système d'événements narratifs
 */

export interface EventConsequence {
  gold?: number // + ou -
  reputation?: number // + ou -
  items?: string[] // itemIds gagnés (pour l'instant, on génère des items)
  durabilityLoss?: number // % sur item aléatoire
  flags?: Record<string, boolean> // flags à set
  counters?: Record<string, number> // cynisme +1, humanité +1, etc.
  narrative?: string // texte de résultat
  actionsRemaining?: number // modifier actions restantes
  debt?: number // modifier dette
}

export interface EventChoice {
  id: string
  text: string
  requirements?: {
    gold?: number
    reputation?: number
    item?: string // itemId requis
    flag?: string // flag requis
    humanite?: number // Compteur humanité minimum requis
    cynisme?: number // Compteur cynisme minimum requis
    pragmatisme?: number // Compteur pragmatisme minimum requis
  }
  consequences: EventConsequence
}

export interface NarrativeEvent {
  id: string
  title: string
  description: string
  triggerCondition: (state: GameState) => boolean
  choices: EventChoice[]
  oneTime: boolean // si true, ne peut arriver qu'une fois
}
