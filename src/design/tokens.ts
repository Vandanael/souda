/**
 * Tokens de design pour Bourg-Creux
 * Palette "Noir & Sang & Or"
 */

import type {
  ColorPalette,
  ColorToken,
  SurfaceLevel,
  SurfaceConfig,
  SpacingToken,
  BorderConfig,
  BorderStyle,
} from './types'

// ============================================================================
// Couleurs
// ============================================================================

export const colors: ColorPalette = {
  neutral: {
    charcoal: '#0B0B0D', // fond principal (écran)
    ink: '#121216', // panneaux/cartes secondaires
    slate: '#1D1E24', // surfaces interactives
    soot: '#2B2D36', // séparateurs, traits fins
    ash: '#8B8E98', // texte secondaire, légendes
    ivory: '#E7E1D6', // texte principal
  },
  blood: {
    deep: '#7A0F1B', // états critiques, dette, blessures
    carmine: '#B61D2E', // accent danger (hover, flash, erreurs)
    rust: '#4C1418', // fond panneaux "menace" / alertes
  },
  gold: {
    tarnished: '#B88A2B', // accent "valeur" (or, rareté, focus)
    burnt: '#D6A13A', // highlight (glow court, particules)
    bone: '#F1D58A', // micro-accents (icônes, chiffres "+")
  },
  green: {
    forest: '#4A7C59', // vert foncé pour contraste lisible
    moss: '#6B9B7A', // vert moyen
    mint: '#8FC4A3', // vert clair pour accents
  },
}

/**
 * Fonction utilitaire pour obtenir une couleur par token
 */
export function getColor(token: ColorToken): string {
  const [category, name] = token.split('.') as [keyof ColorPalette, string]
  return (colors[category] as Record<string, string>)[name] || colors.neutral.ivory
}

/**
 * Mappage des tokens de couleur vers les valeurs hex
 */
export const colorMap: Record<ColorToken, string> = {
  'neutral.charcoal': colors.neutral.charcoal,
  'neutral.ink': colors.neutral.ink,
  'neutral.slate': colors.neutral.slate,
  'neutral.soot': colors.neutral.soot,
  'neutral.ash': colors.neutral.ash,
  'neutral.ivory': colors.neutral.ivory,
  'blood.deep': colors.blood.deep,
  'blood.carmine': colors.blood.carmine,
  'blood.rust': colors.blood.rust,
  'gold.tarnished': colors.gold.tarnished,
  'gold.burnt': colors.gold.burnt,
  'gold.bone': colors.gold.bone,
  'green.forest': colors.green.forest,
  'green.moss': colors.green.moss,
  'green.mint': colors.green.mint,
}

// ============================================================================
// Surfaces
// ============================================================================

export const surfaces: Record<SurfaceLevel, SurfaceConfig> = {
  L0: {
    background: colors.neutral.charcoal,
    grain: false,
  },
  L1: {
    background: colors.neutral.ink,
    border: colors.neutral.soot,
    borderStyle: 'ink',
    grain: true,
    grainIntensity: 0.1,
  },
  L2: {
    background: colors.neutral.slate,
    border: colors.neutral.soot,
    borderStyle: 'ink',
    grain: true,
    grainIntensity: 0.15,
  },
  L3: {
    background: colors.blood.rust,
    border: colors.blood.carmine,
    borderStyle: 'ink',
    grain: true,
    grainIntensity: 0.2,
  },
}

/**
 * Fonction utilitaire pour obtenir la config d'une surface
 */
export function getSurface(level: SurfaceLevel): SurfaceConfig {
  return surfaces[level]
}

// ============================================================================
// Espacements
// ============================================================================

export const spacing: Record<SpacingToken, string> = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '3rem', // 48px
  '4xl': '4rem', // 64px
}

/**
 * Fonction utilitaire pour obtenir un espacement
 */
export function getSpacing(token: SpacingToken): string {
  return spacing[token]
}

// ============================================================================
// Bordures
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '2px',
  md: '4px',
  lg: '6px',
  xl: '8px',
  '2xl': '12px',
  full: '9999px',
}

export const borderWidth = {
  none: '0',
  thin: '1px',
  base: '2px',
  thick: '3px',
}

/**
 * Fonction utilitaire pour créer une config de bordure
 */
export function createBorder(
  style: BorderStyle,
  color: string,
  width: number = 2
): BorderConfig {
  return {
    style,
    width,
    color,
  }
}

// ============================================================================
// Ombres
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 2px 4px rgba(0, 0, 0, 0.4)',
  lg: '0 4px 8px rgba(0, 0, 0, 0.5)',
  xl: '0 8px 16px rgba(0, 0, 0, 0.6)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  glow: {
    gold: `0 0 8px ${colors.gold.burnt}40`,
    carmine: `0 0 8px ${colors.blood.carmine}40`,
  },
}

// ============================================================================
// Z-index
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 100,
  overlay: 2000,
  modal: 3000,
  tooltip: 4000,
  debug: 9999,
}

// ============================================================================
// Breakpoints (mobile-first)
// ============================================================================

export const breakpoints = {
  mobile: '360px',
  tablet: '768px',
  desktop: '1024px',
}

// ============================================================================
// Export par défaut
// ============================================================================

export const designTokens = {
  colors,
  colorMap,
  getColor,
  surfaces,
  getSurface,
  spacing,
  getSpacing,
  borderRadius,
  borderWidth,
  createBorder,
  shadows,
  zIndex,
  breakpoints,
}
