/**
 * Card avec animation au hover/touch
 * Migré pour utiliser le nouveau composant Card du design system
 */

import { ReactNode } from 'react'
import { Card } from './design/Card'
import type { SurfaceLevel, CardVariant } from '../design/types'

interface AnimatedCardProps {
  children: ReactNode
  onClick?: () => void
  style?: React.CSSProperties
  surface?: SurfaceLevel
  variant?: CardVariant
  equipped?: boolean
}

export default function AnimatedCard({
  children,
  onClick,
  style,
  surface = 'L1',
  variant = 'default',
  equipped = false,
}: AnimatedCardProps) {
  return (
    <Card
      variant={variant}
      surface={surface}
      interactive={!!onClick}
      equipped={equipped}
      onClick={onClick}
      style={style}
    >
      {children}
    </Card>
  )
}
