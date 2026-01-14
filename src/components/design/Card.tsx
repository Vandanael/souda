/**
 * Composant Card selon le Design System Bourg-Creux
 * Style "papier encré + métal usé"
 */

import React from 'react'
import { motion } from 'framer-motion'
import type { SurfaceLevel } from '../../design/types'
import { getPanelStyle } from '../../design/surfaces'
import { getGrainBackgroundStyle, grainIntensities } from '../../design/grain'
import { colors } from '../../design/tokens'

export interface CardProps {
  variant?: 'default' | 'equipped' | 'interactive'
  surface?: SurfaceLevel
  interactive?: boolean
  equipped?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
  'data-tutorial-location'?: string
}

export function Card({
  surface = 'L1',
  interactive = false,
  equipped = false,
  children,
  onClick,
  className,
  style,
  'data-tutorial-location': dataTutorialLocation,
}: CardProps) {
  const surfaceStyle = getPanelStyle(surface)
  const grainStyle = getGrainBackgroundStyle(
    surface === 'L1' ? grainIntensities.light : grainIntensities.medium
  )

  const baseStyle: React.CSSProperties = {
    ...surfaceStyle,
    ...grainStyle,
    position: 'relative',
    cursor: interactive || onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    ...style,
  }

  return (
    <motion.div
      className={className}
      style={baseStyle}
      onClick={onClick}
      whileHover={interactive || onClick ? { scale: 1.02 } : {}}
      animate={equipped ? {
        rotate: [0, 5, -2, 0],
        scale: [1, 1.05, 1],
        transition: { duration: 0.3, ease: 'easeOut' }
      } : {}}
      data-tutorial-location={dataTutorialLocation}
    >
      {equipped && (
        <div
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: colors.neutral.charcoal,
            color: colors.gold.tarnished,
            padding: '0.25rem 0.5rem',
            borderRadius: '2px',
            fontSize: '0.75rem',
            fontWeight: 600,
            fontFamily: "'Cormorant Garamond', serif",
            border: `1px solid ${colors.gold.tarnished}`,
            zIndex: 1,
          }}
        >
          ÉQUIPÉ
        </div>
      )}
      {children}
    </motion.div>
  )
}

export default Card
