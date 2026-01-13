/**
 * Types pour le système de tutorial
 */

export type TutorialStep = 0 | 1 | 2 | 3 | 4

export interface TutorialState {
  currentStep: TutorialStep
  isActive: boolean
  tutorialCompleted: boolean
}

export interface TutorialStepConfig {
  duration: number // en millisecondes
  title?: string
  description?: string
  highlightSelector?: string
  actionRequired?: boolean
  onComplete?: () => void
}
