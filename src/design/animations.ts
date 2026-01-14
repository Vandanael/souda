/**
 * Animations typées pour le Design System Bourg-Creux
 * Micro-interactions selon les spécifications
 */

import type { AnimationType, AnimationConfig } from './types'
import { colors } from './tokens'

// ============================================================================
// Configurations d'animations
// ============================================================================

export const animations: Record<AnimationType, AnimationConfig> = {
  buttonPress: {
    type: 'buttonPress',
    duration: 0.1,
    easing: 'ease-out',
    scale: 0.98,
  },
  buttonRelease: {
    type: 'buttonRelease',
    duration: 0.15,
    easing: 'ease-out',
    scale: 1,
  },
  itemEquipped: {
    type: 'itemEquipped',
    duration: 0.3,
    easing: 'ease-out',
    scale: 1,
  },
  personnageHighlight: {
    type: 'personnageHighlight',
    duration: 0.3,
    easing: 'ease-out',
    opacity: 0.8,
  },
  cardFocus: {
    type: 'cardFocus',
    duration: 0.2,
    easing: 'ease-out',
    scale: 1.05,
  },
  cardUnfocus: {
    type: 'cardUnfocus',
    duration: 0.2,
    easing: 'ease-out',
    scale: 1,
  },
}

// ============================================================================
// Animations Framer Motion
// ============================================================================

/**
 * Animation pour le press d'un bouton
 * Scale 0.98, ombre écrasée, liseré or → trace d'encre
 */
export const buttonPressAnimation = {
  scale: 0.98,
  boxShadow: `0 1px 2px ${colors.neutral.charcoal}80`,
  transition: {
    duration: 0.1,
    ease: 'easeOut',
  },
}

/**
 * Animation pour le release d'un bouton
 * Rebond minimal, flash or brûlé #D6A13A
 */
export const buttonReleaseAnimation = {
  scale: 1,
  transition: {
    duration: 0.15,
    ease: 'easeOut',
  },
}

/**
 * Flash or brûlé au release (à appliquer séparément)
 */
export const buttonFlashAnimation = {
  boxShadow: `0 0 8px ${colors.gold.burnt}60`,
  transition: {
    duration: 0.1,
    ease: 'easeOut',
  },
}

/**
 * Animation "claque" pour item équipé
 * De travers → aligné
 */
export const itemEquippedAnimation = {
  rotate: [5, -2, 0],
  scale: [1, 1.05, 1],
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
}

/**
 * Highlight localisé personnage (~300ms)
 */
export const personnageHighlightAnimation = {
  opacity: [1, 0.8, 1],
  filter: `brightness(1.2)`,
  transition: {
    duration: 0.3,
    ease: 'easeInOut',
  },
}

/**
 * Animation focus carte (éventail)
 */
export const cardFocusAnimation = {
  scale: 1.05,
  zIndex: 10,
  transition: {
    duration: 0.2,
    ease: 'easeOut',
  },
}

/**
 * Animation unfocus carte (éventail)
 */
export const cardUnfocusAnimation = {
  scale: 1,
  zIndex: 1,
  transition: {
    duration: 0.2,
    ease: 'easeOut',
  },
}

// ============================================================================
// Variantes d'animation pour Framer Motion
// ============================================================================

export const animationVariants = {
  buttonPress: buttonPressAnimation,
  buttonRelease: buttonReleaseAnimation,
  itemEquipped: itemEquippedAnimation,
  personnageHighlight: personnageHighlightAnimation,
  cardFocus: cardFocusAnimation,
  cardUnfocus: cardUnfocusAnimation,
}

// ============================================================================
// Fonctions utilitaires
// ============================================================================

/**
 * Obtient une animation par type
 */
export function getAnimation(type: AnimationType): AnimationConfig {
  return animations[type]
}

/**
 * Obtient les props d'animation Framer Motion par type
 */
export function getAnimationProps(type: AnimationType) {
  switch (type) {
    case 'buttonPress':
      return buttonPressAnimation
    case 'buttonRelease':
      return buttonReleaseAnimation
    case 'itemEquipped':
      return itemEquippedAnimation
    case 'personnageHighlight':
      return personnageHighlightAnimation
    case 'cardFocus':
      return cardFocusAnimation
    case 'cardUnfocus':
      return cardUnfocusAnimation
    default:
      return {}
  }
}

// ============================================================================
// Export par défaut
// ============================================================================

export const animationSystem = {
  animations,
  buttonPressAnimation,
  buttonReleaseAnimation,
  buttonFlashAnimation,
  itemEquippedAnimation,
  personnageHighlightAnimation,
  cardFocusAnimation,
  cardUnfocusAnimation,
  animationVariants,
  getAnimation,
  getAnimationProps,
}
