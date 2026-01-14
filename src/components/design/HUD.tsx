/**
 * Composant HUD ultra-compact selon le Design System Bourg-Creux
 * Bande de 10-15% en haut, style "métal froid"
 */

import React from 'react'
import { colors } from '../../design/tokens'
import { getTypographyStyleByName } from '../../design/typography'

export interface HUDProps {
  day: number
  debt: number
  gold: number
  reputation: number
  actionsRemaining?: number
  className?: string
  style?: React.CSSProperties
}

export function HUD({
  day,
  debt,
  gold,
  reputation,
  actionsRemaining,
  className,
  style,
}: HUDProps) {
  const baseStyle: React.CSSProperties = {
    ...getTypographyStyleByName('hud'),
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: `linear-gradient(180deg, ${colors.neutral.charcoal} 0%, ${colors.neutral.charcoal}E6 100%)`,
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    borderBottom: `1px solid ${colors.neutral.soot}`,
    padding: '0.4rem 0.6rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.75rem',
    minHeight: 'auto',
    ...style,
  }

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: colors.neutral.ivory,
    flexShrink: 0,
  }

  const separatorStyle: React.CSSProperties = {
    width: '1px',
    height: '16px',
    background: colors.neutral.soot,
    flexShrink: 0,
  }

  return (
    <div className={className} style={baseStyle}>
      {/* Jour */}
      <div style={itemStyle}>
        <span style={{ opacity: 0.7, fontSize: '0.65rem' }}>J</span>
        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{day}</span>
        <span style={{ opacity: 0.5, fontSize: '0.65rem' }}>/20</span>
      </div>

      <div style={separatorStyle} />

      {/* Dette */}
      <div style={itemStyle}>
        <span style={{ fontSize: '0.7rem' }}>⚖️</span>
        <span style={{ fontSize: '0.8rem', color: debt > 150 ? colors.blood.carmine : colors.gold.tarnished }}>
          {debt}
        </span>
      </div>

      <div style={separatorStyle} />

      {/* Or */}
      <div style={itemStyle}>
        <span style={{ fontSize: '0.7rem' }}>💰</span>
        <span style={{ fontSize: '0.8rem', color: colors.gold.tarnished }}>
          {gold}
        </span>
      </div>

      <div style={separatorStyle} />

      {/* Réputation */}
      <div style={itemStyle}>
        <span style={{ fontSize: '0.7rem' }}>⭐</span>
        <span style={{ fontSize: '0.8rem' }}>{'⭐'.repeat(reputation)}</span>
      </div>

      {/* Actions restantes (optionnel) */}
      {actionsRemaining !== undefined && (
        <>
          <div style={separatorStyle} />
          <div style={itemStyle}>
            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>⚡</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              {actionsRemaining}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default HUD
