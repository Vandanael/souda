/**
 * Composant Badge selon le Design System Bourg-Creux
 * Formes (cercle, carré, losange, étoile) pour accessibilité
 */

import React from 'react'
import type { BadgeShape } from '../../design/types'
import { colors } from '../../design/tokens'

export interface BadgeProps {
  shape: BadgeShape
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary'
  size?: number
  className?: string
  style?: React.CSSProperties
}

export function Badge({
  shape,
  rarity,
  size = 16,
  className,
  style,
}: BadgeProps) {
  // Couleur selon la rareté
  const getRarityColor = (): string => {
    switch (rarity) {
      case 'common':
        return colors.neutral.ash
      case 'uncommon':
        return colors.neutral.ivory
      case 'rare':
        return colors.gold.tarnished
      case 'legendary':
        return colors.gold.burnt
      default:
        return colors.neutral.ivory
    }
  }

  // Génère le SVG de la forme
  const renderShape = () => {
    const color = getRarityColor()
    const strokeColor = rarity === 'legendary' ? colors.gold.bone : colors.neutral.soot
    const strokeWidth = rarity === 'legendary' ? 1.5 : 1

    switch (shape) {
      case 'circle':
        return (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 1}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )
      case 'square':
        return (
          <rect
            x={1}
            y={1}
            width={size - 2}
            height={size - 2}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )
      case 'diamond':
        return (
          <polygon
            points={`${size / 2},1 ${size - 1},${size / 2} ${size / 2},${size - 1} 1,${size / 2}`}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )
      case 'star':
        // Étoile à 5 branches
        const centerX = size / 2
        const centerY = size / 2
        const outerRadius = size / 2 - 1
        const innerRadius = outerRadius * 0.4
        const points: string[] = []
        
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5 - Math.PI / 2
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          points.push(`${x},${y}`)
        }
        
        return (
          <polygon
            points={points.join(' ')}
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        )
      default:
        return null
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {renderShape()}
    </svg>
  )
}

export default Badge
