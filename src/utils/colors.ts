/**
 * Fonctions utilitaires typées pour manipulation de couleurs
 * Dégradés selon le design system
 */

import { colors } from '../design/tokens'

/**
 * Génère un dégradé linéaire
 */
export function createLinearGradient(
  color1: string,
  color2: string,
  angle: number = 135
): string {
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`
}

/**
 * Génère un dégradé radial
 */
export function createRadialGradient(
  color1: string,
  color2: string,
  position: string = 'center'
): string {
  return `radial-gradient(circle at ${position}, ${color1} 0%, ${color2} 100%)`
}

/**
 * Dégradé or terni vers or brûlé (pour boutons)
 */
export function createGoldGradient(): string {
  return createLinearGradient(colors.gold.tarnished, colors.gold.burnt, 135)
}

/**
 * Dégradé or avec sous-couche sang (pour variant "ALLER PILLER")
 */
export function createPillageGradient(): string {
  return `linear-gradient(135deg, ${colors.gold.tarnished} 0%, ${colors.gold.tarnished} 50%, ${colors.blood.deep}40 100%)`
}

/**
 * Dégradé vers le noir (pour illustrations)
 */
export function createBlackFadeGradient(direction: 'top' | 'bottom' | 'left' | 'right' = 'bottom'): string {
  const positions: Record<string, string> = {
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right',
  }
  
  return `linear-gradient(${positions[direction]}, transparent 0%, ${colors.neutral.charcoal} 100%)`
}

/**
 * Ajuste l'opacité d'une couleur hex
 */
export function addOpacity(hexColor: string, opacity: number): string {
  // Convertit hex en rgba
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Assombrit une couleur
 */
export function darken(hexColor: string, amount: number = 0.1): string {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  
  const newR = Math.max(0, Math.floor(r * (1 - amount)))
  const newG = Math.max(0, Math.floor(g * (1 - amount)))
  const newB = Math.max(0, Math.floor(b * (1 - amount)))
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

/**
 * Éclaircit une couleur
 */
export function lighten(hexColor: string, amount: number = 0.1): string {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  
  const newR = Math.min(255, Math.floor(r + (255 - r) * amount))
  const newG = Math.min(255, Math.floor(g + (255 - g) * amount))
  const newB = Math.min(255, Math.floor(b + (255 - b) * amount))
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

/**
 * Mélange deux couleurs
 */
export function mix(color1: string, color2: string, weight: number = 0.5): string {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)
  
  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)
  
  const r = Math.floor(r1 * (1 - weight) + r2 * weight)
  const g = Math.floor(g1 * (1 - weight) + g2 * weight)
  const b = Math.floor(b1 * (1 - weight) + b2 * weight)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
