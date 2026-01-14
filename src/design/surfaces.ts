/**
 * Système de surfaces pour Bourg-Creux
 * "Papier encré + métal usé"
 */

import React from 'react'
import type { SurfaceLevel } from './types'
import { getSurface, colors } from './tokens'

// ============================================================================
// Styles de bordures
// ============================================================================

/**
 * Génère un style de bordure "encrage" (irrégulier)
 * Utilise clip-path ou border-image pour créer un effet irrégulier
 */
export function getInkBorderStyle(
  color: string = colors.neutral.soot,
  width: number = 2
): React.CSSProperties {
  return {
    border: `${width}px solid ${color}`,
    borderImage: `linear-gradient(90deg, ${color} 0%, ${color} 100%) 1`,
    // Effet d'irrégularité via box-shadow multiple
    boxShadow: `
      ${width}px ${width}px 0 -${width}px ${color},
      -${width}px -${width}px 0 -${width}px ${color},
      ${width}px -${width}px 0 -${width}px ${color},
      -${width}px ${width}px 0 -${width}px ${color}
    `,
  }
}

/**
 * Génère un style de bordure "métal usé" (biseau subtil)
 */
export function getMetalBorderStyle(
  color: string = colors.neutral.soot,
  width: number = 1
): React.CSSProperties {
  return {
    border: `${width}px solid ${color}`,
    boxShadow: `
      inset 0 1px 0 ${colors.neutral.ivory}20,
      inset 0 -1px 0 ${colors.neutral.charcoal}40
    `,
  }
}

// ============================================================================
// Styles de surface complets
// ============================================================================

/**
 * Génère le style complet d'une surface selon son niveau
 */
export function getSurfaceStyle(level: SurfaceLevel): React.CSSProperties {
  const config = getSurface(level)
  const style: React.CSSProperties = {
    background: config.background,
  }

  // Ajouter la bordure selon le style
  if (config.border && config.borderStyle) {
    switch (config.borderStyle) {
      case 'ink':
        Object.assign(style, getInkBorderStyle(config.border))
        break
      case 'metal':
        Object.assign(style, getMetalBorderStyle(config.border))
        break
    }
  }

  return style
}

// ============================================================================
// Coins (border-radius)
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '2px',
  md: '4px',
  lg: '6px',
  xl: '8px',
  '2xl': '12px',
  // Coins émoussés/coupés pour style grimdark
  chipped: '2px 6px 2px 6px', // Coins alternés
  worn: '3px 4px 2px 5px', // Coins irréguliers
}

// ============================================================================
// Styles de panneaux prédéfinis
// ============================================================================

export const panelStyles: Record<SurfaceLevel, React.CSSProperties> = {
  L0: {
    ...getSurfaceStyle('L0'),
  },
  L1: {
    ...getSurfaceStyle('L1'),
    borderRadius: borderRadius.lg,
    padding: '1rem',
  },
  L2: {
    ...getSurfaceStyle('L2'),
    borderRadius: borderRadius.xl,
    padding: '1.5rem',
  },
  L3: {
    ...getSurfaceStyle('L3'),
    borderRadius: borderRadius.xl,
    padding: '2rem',
  },
}

/**
 * Obtient le style d'un panneau par niveau
 */
export function getPanelStyle(level: SurfaceLevel): React.CSSProperties {
  return panelStyles[level]
}

// ============================================================================
// Effets de relief (pour métal usé)
// ============================================================================

export const reliefEffects = {
  inset: {
    boxShadow: `
      inset 0 2px 4px ${colors.neutral.charcoal}80,
      inset 0 -1px 2px ${colors.neutral.ivory}10
    `,
  },
  raised: {
    boxShadow: `
      0 2px 4px ${colors.neutral.charcoal}80,
      0 -1px 2px ${colors.neutral.ivory}10
    `,
  },
  pressed: {
    boxShadow: `
      inset 0 2px 4px ${colors.neutral.charcoal}80,
      inset 0 1px 2px ${colors.neutral.ivory}10
    `,
  },
}

// ============================================================================
// Export par défaut
// ============================================================================

export const surfaceSystem = {
  getInkBorderStyle,
  getMetalBorderStyle,
  getSurfaceStyle,
  getPanelStyle,
  borderRadius,
  panelStyles,
  reliefEffects,
}
