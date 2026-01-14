/**
 * Composant Panel selon le Design System Bourg-Creux
 * Panneaux secondaires avec surfaces L1-L3
 */

import React from 'react'
import type { SurfaceLevel } from '../../design/types'
import { getPanelStyle } from '../../design/surfaces'
import { getGrainBackgroundStyle, grainIntensities } from '../../design/grain'

export interface PanelProps {
  level?: SurfaceLevel
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Panel({
  level = 'L1',
  children,
  className,
  style,
}: PanelProps) {
  const panelStyle = getPanelStyle(level)
  const grainStyle = getGrainBackgroundStyle(
    level === 'L1'
      ? grainIntensities.light
      : level === 'L2'
      ? grainIntensities.medium
      : grainIntensities.heavy
  )

  const baseStyle: React.CSSProperties = {
    ...panelStyle,
    ...grainStyle,
    ...style,
  }

  return (
    <div className={className} style={baseStyle}>
      {children}
    </div>
  )
}

export default Panel
