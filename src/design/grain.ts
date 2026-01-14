/**
 * Système de grain papier en CSS pur
 * Implémentation via radial-gradient et noise patterns
 */

import React from 'react'
import type { GrainConfig } from './types'

// ============================================================================
// Génération de grain CSS
// ============================================================================

/**
 * Génère un pattern de grain via radial-gradient
 * Technique : multiples petits gradients radiaux pour simuler le grain
 */
function generateGrainPattern(intensity: number = 0.1, size: number = 1): string {
  const opacity = Math.min(intensity, 0.3) // Limiter l'opacité max
  const grainSize = Math.max(size, 0.5) // Taille minimale
  
  // Créer plusieurs points de grain aléatoires via gradients radiaux
  const gradients: string[] = []
  const pointCount = Math.floor(50 * intensity) // Plus d'intensité = plus de points
  
  for (let i = 0; i < pointCount; i++) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const radius = grainSize + Math.random() * grainSize
    const pointOpacity = opacity * (0.5 + Math.random() * 0.5)
    
    gradients.push(
      `radial-gradient(circle at ${x}% ${y}%, rgba(0,0,0,${pointOpacity}) 0%, transparent ${radius}px)`
    )
  }
  
  return gradients.join(', ')
}

/**
 * Génère un style de grain pour un élément
 * Note: Pour utiliser ::before, il faut utiliser une classe CSS ou un wrapper
 */
export function getGrainStyle(config: GrainConfig = { intensity: 0.1 }): React.CSSProperties {
  // Retourne juste le style de background, pas de ::before
  // Pour ::before, utiliser une classe CSS ou un composant wrapper
  return getGrainBackgroundStyle(config)
}

/**
 * Génère une classe CSS de grain (pour utilisation dans CSS)
 * Retourne un objet de style React directement utilisable
 */
export function getGrainBackgroundStyle(
  config: GrainConfig = { intensity: 0.1 }
): React.CSSProperties {
  const { intensity = 0.1, size = 1 } = config
  
  return {
    backgroundImage: generateGrainPattern(intensity, size),
    backgroundSize: '200% 200%',
    backgroundPosition: '0 0',
  }
}

// ============================================================================
// Intensités prédéfinies
// ============================================================================

export const grainIntensities = {
  none: { intensity: 0 },
  light: { intensity: 0.05, size: 0.8 },
  medium: { intensity: 0.1, size: 1 },
  heavy: { intensity: 0.15, size: 1.2 },
  veryHeavy: { intensity: 0.2, size: 1.5 },
}

/**
 * Obtient un style de grain par nom d'intensité
 */
export function getGrainByIntensity(
  name: keyof typeof grainIntensities
): React.CSSProperties {
  return getGrainBackgroundStyle(grainIntensities[name])
}

// ============================================================================
// Grain avec couleur de base
// ============================================================================

/**
 * Génère un style de grain avec une couleur de fond
 */
export function getGrainWithBackground(
  backgroundColor: string,
  config: GrainConfig = { intensity: 0.1 }
): React.CSSProperties {
  return {
    background: backgroundColor,
    ...getGrainBackgroundStyle(config),
  }
}

// ============================================================================
// Classes CSS pour utilisation directe
// ============================================================================

/**
 * Génère les classes CSS de grain pour index.css
 * À utiliser dans le fichier CSS global
 */
export function generateGrainCSSClasses(): string {
  return `
    /* Grain papier - intensités prédéfinies */
    .grain-none {
      background-image: none;
    }
    
    .grain-light {
      ${getGrainBackgroundStyle(grainIntensities.light).backgroundImage ? 
        `background-image: ${getGrainBackgroundStyle(grainIntensities.light).backgroundImage};` : ''}
      background-size: 200% 200%;
      background-position: 0 0;
    }
    
    .grain-medium {
      ${getGrainBackgroundStyle(grainIntensities.medium).backgroundImage ? 
        `background-image: ${getGrainBackgroundStyle(grainIntensities.medium).backgroundImage};` : ''}
      background-size: 200% 200%;
      background-position: 0 0;
    }
    
    .grain-heavy {
      ${getGrainBackgroundStyle(grainIntensities.heavy).backgroundImage ? 
        `background-image: ${getGrainBackgroundStyle(grainIntensities.heavy).backgroundImage};` : ''}
      background-size: 200% 200%;
      background-position: 0 0;
    }
  `
}

// ============================================================================
// Export par défaut
// ============================================================================

export const grainSystem = {
  getGrainStyle,
  getGrainBackgroundStyle,
  getGrainByIntensity,
  getGrainWithBackground,
  grainIntensities,
  generateGrainCSSClasses,
}
