/**
 * Juice System - Système centralisé pour le Game Feel
 * 
 * Ce module fournit tous les outils pour ajouter du "juice" au jeu :
 * - TimeController : gestion du temps (hit-stop, slow-mo)
 * - FeedbackBroker : pub/sub pour les événements de jeu
 * - JuiceController : orchestrateur des effets
 * - ScreenEffects : shake, flash, vignette
 * - Hooks React : useJuice, useScreenShake, useTimeScale
 */

// Core
export { timeController, EASINGS } from './TimeController'
export type { EasingFunction } from './TimeController'

export { feedbackBroker } from './FeedbackBroker'
export type { 
  JuiceEventType, 
  JuiceEventPayloads, 
  JuiceEvent,
  EventHandler,
  GenericEventHandler,
  HandlerPriority 
} from './FeedbackBroker'

export { juiceController } from './JuiceController'

export { screenEffects } from './ScreenEffects'
export type { ShakePreset } from './ScreenEffects'

// Hooks
export { useJuice, useJuiceEvent, useAllJuiceEvents } from './hooks/useJuice'
export { useScreenShake, useShakeStyle } from './hooks/useScreenShake'
export { useTimeScale, useGameDelay } from './hooks/useTimeScale'
