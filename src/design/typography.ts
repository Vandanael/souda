/**
 * Système typographique pour Bourg-Creux
 * Duo "immersion + ultra-lisible"
 */

import type {
  FontFamily,
  TypographyScale,
  FontWeight,
  TypographyConfig,
} from './types'
import { colors } from './tokens'

// ============================================================================
// Familles de polices
// ============================================================================

export const fontFamilies: Record<FontFamily, string> = {
  serif: "'Cormorant Garamond', serif", // Narratif, immersion
  sans: "'Inter', sans-serif", // UI, lisibilité mobile
}

// ============================================================================
// Tailles de texte
// ============================================================================

export const fontSize: Record<TypographyScale, string> = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
}

// ============================================================================
// Poids de police
// ============================================================================

export const fontWeight: Record<FontWeight, string> = {
  300: '300',
  400: '400',
  500: '500',
  600: '600',
  700: '700',
}

// ============================================================================
// Hauteurs de ligne
// ============================================================================

export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
}

// ============================================================================
// Espacement des lettres
// ============================================================================

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
}

// ============================================================================
// Configurations typographiques prédéfinies
// ============================================================================

export const typography: Record<string, TypographyConfig> = {
  // Narratif (serif)
  narrative: {
    fontFamily: 'serif',
    fontSize: 'lg',
    fontWeight: 400,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  narrativeTitle: {
    fontFamily: 'serif',
    fontSize: '3xl',
    fontWeight: 600,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  narrativeQuote: {
    fontFamily: 'serif',
    fontSize: 'xl',
    fontWeight: 400,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.wide,
  },
  // UI (sans-serif)
  ui: {
    fontFamily: 'sans',
    fontSize: 'base',
    fontWeight: 400,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  uiSmall: {
    fontFamily: 'sans',
    fontSize: 'sm',
    fontWeight: 400,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  uiLarge: {
    fontFamily: 'sans',
    fontSize: 'lg',
    fontWeight: 500,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  uiBold: {
    fontFamily: 'sans',
    fontSize: 'base',
    fontWeight: 600,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  // HUD
  hud: {
    fontFamily: 'sans',
    fontSize: 'xs',
    fontWeight: 500,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },
  hudLarge: {
    fontFamily: 'sans',
    fontSize: 'sm',
    fontWeight: 600,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  },
  // Boutons
  button: {
    fontFamily: 'sans',
    fontSize: 'base',
    fontWeight: 600,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.wide,
  },
  buttonLarge: {
    fontFamily: 'sans',
    fontSize: 'lg',
    fontWeight: 700,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.wider,
  },
}

// ============================================================================
// Fonctions utilitaires
// ============================================================================

/**
 * Convertit une config typographique en style React
 */
export function getTypographyStyle(config: TypographyConfig): React.CSSProperties {
  return {
    fontFamily: fontFamilies[config.fontFamily],
    fontSize: fontSize[config.fontSize],
    fontWeight: fontWeight[config.fontWeight],
    lineHeight: config.lineHeight,
    letterSpacing: config.letterSpacing || letterSpacing.normal,
  }
}

/**
 * Obtient une config typographique par nom
 */
export function getTypography(name: keyof typeof typography): TypographyConfig {
  return typography[name]
}

/**
 * Obtient le style typographique par nom
 */
export function getTypographyStyleByName(
  name: keyof typeof typography
): React.CSSProperties {
  return getTypographyStyle(getTypography(name))
}

// ============================================================================
// Couleurs de texte
// ============================================================================

export const textColors = {
  primary: colors.neutral.ivory,
  secondary: colors.neutral.ash,
  muted: colors.neutral.soot,
  danger: colors.blood.carmine,
  warning: colors.gold.tarnished,
  success: colors.gold.bone,
  accent: colors.gold.burnt,
}

// ============================================================================
// Export par défaut
// ============================================================================

export const typographySystem = {
  fontFamilies,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typography,
  getTypographyStyle,
  getTypography,
  getTypographyStyleByName,
  textColors,
}
