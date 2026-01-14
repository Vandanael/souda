/**
 * Types TypeScript pour le Design System Bourg-Creux
 * Style Grimdark / Tactical Noir
 */

// ============================================================================
// Couleurs
// ============================================================================

export type ColorToken =
  // Neutres
  | 'neutral.charcoal' // #0B0B0D - fond principal
  | 'neutral.ink' // #121216 - panneaux secondaires
  | 'neutral.slate' // #1D1E24 - surfaces interactives
  | 'neutral.soot' // #2B2D36 - séparateurs, traits fins
  | 'neutral.ash' // #8B8E98 - texte secondaire
  | 'neutral.ivory' // #E7E1D6 - texte principal
  // Sang (danger / dette / perte)
  | 'blood.deep' // #7A0F1B - états critiques, dette
  | 'blood.carmine' // #B61D2E - accent danger
  | 'blood.rust' // #4C1418 - fond panneaux menace
  // Or (valeur / action / loot)
  | 'gold.tarnished' // #B88A2B - accent valeur
  | 'gold.burnt' // #D6A13A - highlight, glow
  | 'gold.bone' // #F1D58A - micro-accents
  // Vert (sur / localisation / position)
  | 'green.forest' // #4A7C59 - vert foncé pour contraste lisible
  | 'green.moss' // #6B9B7A - vert moyen
  | 'green.mint' // #8FC4A3 - vert clair pour accents

export interface ColorPalette {
  neutral: {
    charcoal: string
    ink: string
    slate: string
    soot: string
    ash: string
    ivory: string
  }
  blood: {
    deep: string
    carmine: string
    rust: string
  }
  gold: {
    tarnished: string
    burnt: string
    bone: string
  }
  green: {
    forest: string
    moss: string
    mint: string
  }
}

// ============================================================================
// Surfaces
// ============================================================================

export type SurfaceLevel = 'L0' | 'L1' | 'L2' | 'L3'

export interface SurfaceConfig {
  background: string
  border?: string
  borderStyle?: BorderStyle
  grain?: boolean
  grainIntensity?: number
}

// ============================================================================
// Bordures
// ============================================================================

export type BorderStyle = 'ink' | 'metal' | 'none'

export interface BorderConfig {
  style: BorderStyle
  width: number
  color: string
  radius?: number
}

// ============================================================================
// Typographie
// ============================================================================

export type FontFamily = 'serif' | 'sans'

export type TypographyScale =
  | 'xs' // 0.75rem
  | 'sm' // 0.875rem
  | 'base' // 1rem
  | 'lg' // 1.125rem
  | 'xl' // 1.25rem
  | '2xl' // 1.5rem
  | '3xl' // 1.875rem
  | '4xl' // 2.25rem

export type FontWeight = 300 | 400 | 500 | 600 | 700

export interface TypographyConfig {
  fontFamily: FontFamily
  fontSize: TypographyScale
  fontWeight: FontWeight
  lineHeight: number | string
  letterSpacing?: number | string
}

// ============================================================================
// Espacements
// ============================================================================

export type SpacingToken =
  | 'xs' // 0.25rem (4px)
  | 'sm' // 0.5rem (8px)
  | 'md' // 0.75rem (12px)
  | 'lg' // 1rem (16px)
  | 'xl' // 1.5rem (24px)
  | '2xl' // 2rem (32px)
  | '3xl' // 3rem (48px)
  | '4xl' // 4rem (64px)

// ============================================================================
// Composants
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'pillage'

export interface ButtonConfig {
  variant: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export type CardVariant = 'default' | 'equipped' | 'interactive'

export interface CardConfig {
  variant: CardVariant
  surface: SurfaceLevel
  interactive?: boolean
}

export type BadgeShape = 'circle' | 'square' | 'diamond' | 'star'

export interface BadgeConfig {
  shape: BadgeShape
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary'
}

// ============================================================================
// Animations
// ============================================================================

export type AnimationType =
  | 'buttonPress'
  | 'buttonRelease'
  | 'itemEquipped'
  | 'personnageHighlight'
  | 'cardFocus'
  | 'cardUnfocus'

export interface AnimationConfig {
  type: AnimationType
  duration: number
  easing: string
  scale?: number
  opacity?: number
  color?: string
}

// ============================================================================
// Icônes
// ============================================================================

export type IconName =
  | 'lock' // cadenas
  | 'mask' // masque
  | 'crow' // corbeau
  | 'blade' // lame
  | 'purse' // bourse
  | 'key' // clef
  | 'rune' // rune
  | 'weapon'
  | 'armor'
  | 'accessory'
  | 'inventory'
  | 'market'
  | 'forge'
  | 'tavern'
  | 'relics'

export type IconSize = 16 | 20 | 24 | 32 | 40 | 48

export type IconStyle = 'filled' | 'outline' | 'bordered'

export interface IconProps {
  name: IconName
  size?: IconSize
  style?: IconStyle
  color?: string
  className?: string
}

// ============================================================================
// Styles React
// ============================================================================

export type ReactStyle = React.CSSProperties

export interface StyleProps {
  className?: string
  style?: ReactStyle
}

// ============================================================================
// Utilitaires
// ============================================================================

export interface GrainConfig {
  intensity: number // 0-1
  size?: number // taille du grain en px
  opacity?: number // 0-1
}

export interface InkBorderConfig {
  irregularity: number // 0-1, niveau d'irrégularité
  thickness: number // épaisseur en px
  color: string
}
