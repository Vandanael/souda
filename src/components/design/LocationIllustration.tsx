/**
 * Composant LocationIllustration selon le Design System Bourg-Creux
 * Traitement des illustrations de lieux : vignette, dégradé, contraste, halftone
 * Tout en CSS pur
 */

import React from 'react'
import { colors } from '../../design/tokens'
import { createBlackFadeGradient, addOpacity } from '../../utils/colors'

export interface LocationIllustrationProps {
  imageUrl?: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function LocationIllustration({
  imageUrl,
  children,
  className,
  style,
}: LocationIllustrationProps) {
  // Style de base avec traitement CSS
  const baseStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    ...style,
  }

  // Style pour l'image avec traitement
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    // Baisse de contraste (désaturation + midtones écrasés)
    filter: 'contrast(0.7) saturate(0.6) brightness(0.8)',
    // Opacité perçue 20-35%
    opacity: 0.25,
    // Trame halftone légère (via background pattern)
    background: `
      repeating-linear-gradient(
        0deg,
        ${addOpacity(colors.neutral.charcoal, 0.1)} 0px,
        transparent 1px,
        transparent 2px,
        ${addOpacity(colors.neutral.charcoal, 0.1)} 3px
      ),
      repeating-linear-gradient(
        90deg,
        ${addOpacity(colors.neutral.charcoal, 0.1)} 0px,
        transparent 1px,
        transparent 2px,
        ${addOpacity(colors.neutral.charcoal, 0.1)} 3px
      )
    `,
    backgroundBlendMode: 'overlay',
  }

  // Masque vignette (bords noirs)
  const vignetteStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(
        ellipse at center,
        transparent 0%,
        transparent 40%,
        ${colors.neutral.charcoal} 100%
      )
    `,
    pointerEvents: 'none',
    zIndex: 1,
  }

  // Dégradé vers le noir en bas
  const fadeStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: createBlackFadeGradient('bottom'),
    pointerEvents: 'none',
    zIndex: 2,
  }

  return (
    <div className={className} style={baseStyle}>
      {imageUrl && (
        <img src={imageUrl} alt="" style={imageStyle} aria-hidden="true" />
      )}
      {children && (
        <div style={{ position: 'relative', zIndex: 3 }}>
          {children}
        </div>
      )}
      <div style={vignetteStyle} />
      <div style={fadeStyle} />
    </div>
  )
}

export default LocationIllustration
