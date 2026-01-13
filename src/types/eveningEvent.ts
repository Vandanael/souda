/**
 * Types pour les événements du soir
 */

export type EveningEventType = 'text' | 'interactive'

export interface EveningEventChoice {
  text: string
  consequence: () => void // Action à exécuter
  description?: string // Description de la conséquence (optionnel)
}

export interface EveningEvent {
  id: string
  text: string
  type: EveningEventType
  choices?: EveningEventChoice[] // Pour les événements interactifs
}
