/**
 * Fonctions utilitaires typées pour générer les styles selon les tokens
 * Bordures encrage et textures grain CSS
 */

import React from 'react'
import type { InkBorderConfig, GrainConfig } from '../design/types'
import { colors } from '../design/tokens'
import { getGrainBackgroundStyle } from '../design/grain'

/**
 * Génère un style de bordure "encrage" (irrégulière)
 * Utilise clip-path pour créer un effet irrégulier
 */
export function createInkBorderStyle(config: InkBorderConfig): React.CSSProperties {
  const { irregularity = 0.3, thickness = 2, color } = config
  
  // Génère des points irréguliers pour le clip-path
  const points: string[] = []
  const segments = 8 // Nombre de segments sur chaque côté
  
  // Top
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * 100
    const y = irregularity * (Math.random() - 0.5) * 2
    points.push(`${x}% ${Math.max(0, y)}%`)
  }
  
  // Right
  for (let i = 1; i <= segments; i++) {
    const y = (i / segments) * 100
    const x = irregularity * (Math.random() - 0.5) * 2
    points.push(`${Math.min(100, 100 + x)}% ${y}%`)
  }
  
  // Bottom
  for (let i = segments - 1; i >= 0; i--) {
    const x = (i / segments) * 100
    const y = irregularity * (Math.random() - 0.5) * 2
    points.push(`${x}% ${Math.min(100, 100 + y)}%`)
  }
  
  // Left
  for (let i = segments - 1; i > 0; i--) {
    const y = (i / segments) * 100
    const x = irregularity * (Math.random() - 0.5) * 2
    points.push(`${Math.max(0, x)}% ${y}%`)
  }
  
  return {
    border: `${thickness}px solid ${color}`,
    clipPath: `polygon(${points.join(', ')})`,
  }
}

/**
 * Génère un style de bordure encrage simplifié (sans clip-path dynamique)
 * Utilise une bordure avec box-shadow pour l'effet irrégulier
 */
export function createInkBorderSimple(
  color: string = colors.neutral.soot,
  thickness: number = 2
): React.CSSProperties {
  return {
    border: `${thickness}px solid ${color}`,
    position: 'relative' as const,
    boxShadow: `
      ${thickness}px ${thickness}px 0 -${thickness}px ${color}40,
      -${thickness}px -${thickness}px 0 -${thickness}px ${color}40,
      ${thickness}px -${thickness}px 0 -${thickness}px ${color}40,
      -${thickness}px ${thickness}px 0 -${thickness}px ${color}40
    `,
  }
}

/**
 * Génère un style avec texture de grain CSS
 */
export function createGrainStyle(config: GrainConfig): React.CSSProperties {
  return getGrainBackgroundStyle(config)
}

/**
 * Combine bordure encrage et grain
 */
export function createInkBorderWithGrain(
  borderConfig: InkBorderConfig,
  grainConfig: GrainConfig
): React.CSSProperties {
  return {
    ...createInkBorderSimple(borderConfig.color, borderConfig.thickness),
    ...createGrainStyle(grainConfig),
  }
}

/**
 * Génère un style de surface complète (bordure + grain + background)
 */
export function createSurfaceStyle(
  background: string,
  borderColor: string = colors.neutral.soot,
  grainIntensity: number = 0.1
): React.CSSProperties {
  return {
    background,
    ...createInkBorderSimple(borderColor),
    ...createGrainStyle({ intensity: grainIntensity }),
  }
}
