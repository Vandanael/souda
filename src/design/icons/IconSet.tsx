/**
 * Set d'icônes héraldiques/occultes pour Bourg-Creux
 * Style : silhouettes pleines (noir) + liseré ivoire sale
 */

import type { IconName, IconSize } from '../types'
import type { IconConfig } from './types'

// ============================================================================
// Définitions des icônes (SVG paths)
// ============================================================================

const iconDefinitions: Record<IconName, IconConfig> = {
  // Héraldique/Occulte
  lock: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2C9.24 2 7 4.24 7 7v2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v2H9V7c0-1.66 1.34-3 3-3z',
    ],
  },
  mask: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V19c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 1.88-1.12 3.53-2.79 4.29L13 14h-2l-1.21-.71C8.12 12.53 7 10.88 7 9c0-2.76 2.24-5 5-5z',
    ],
  },
  crow: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2C8.69 2 6 4.69 6 8c0 1.5.6 2.86 1.58 3.85L6 18h4l-1-4h2l-1 4h4l-1.58-6.15C13.4 10.86 14 9.5 14 8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4 0 1.1-.45 2.1-1.17 2.83L13 12h-2l-.83-1.17C9.45 10.1 9 9.1 9 8c0-2.21 1.79-4 4-4z',
      'M18 20c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-12 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
    ],
  },
  blade: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    ],
  },
  purse: {
    viewBox: '0 0 24 24',
    paths: [
      'M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm11 14H4V8h16v10zm-8-2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z',
    ],
  },
  key: {
    viewBox: '0 0 24 24',
    paths: [
      'M17 8h-1V6c0-2.76-2.24-5-5-5S6 3.24 6 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H8V6zm9 14H5V10h12v10z',
      'M11 13h2v2h-2v-2z',
    ],
  },
  rune: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
      'M7 7l5 2.5L17 7M7 12l5 2.5L17 12M7 17l5 2.5L17 17',
    ],
  },
  // Équipement
  weapon: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    ],
  },
  armor: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V19c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z',
    ],
  },
  accessory: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
      'M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
    ],
  },
  // Interface
  inventory: {
    viewBox: '0 0 24 24',
    paths: [
      'M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm11 14H4V8h16v10z',
    ],
  },
  market: {
    viewBox: '0 0 24 24',
    paths: [
      'M7 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
    ],
  },
  forge: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    ],
  },
  tavern: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V19c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z',
    ],
  },
  relics: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
      'M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
    ],
  },
}

// ============================================================================
// Composant IconSet (rendu des SVG)
// ============================================================================

interface IconSetProps {
  name: IconName
  size: IconSize
  style: 'filled' | 'outline' | 'bordered'
  color: string
  borderColor: string
}

export function IconSet({ name, size, style, color, borderColor }: IconSetProps) {
  const config = iconDefinitions[name]
  if (!config) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  const sizePx = size
  const strokeWidth = config.strokeWidth || 1.5

  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox={config.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {config.paths.map((path, index) => (
        <path
          key={index}
          d={path}
          fill={style === 'filled' ? color : 'none'}
          stroke={style === 'outline' || style === 'bordered' ? color : 'none'}
          strokeWidth={style === 'outline' || style === 'bordered' ? strokeWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {style === 'bordered' && (
        <path
          d={config.paths[0]}
          fill="none"
          stroke={borderColor}
          strokeWidth={strokeWidth * 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.3}
        />
      )}
    </svg>
  )
}

// Export des définitions pour utilisation externe
export { iconDefinitions }
