/**
 * Composant ItemCard pour éventail horizontal compact
 * Cartes chevauchées avec animation de focus
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from './Card'
import { Badge } from './Badge'
import { Icon } from '../../design/icons/Icon'
import type { Item } from '../../types/item'
import type { IconName } from '../../design/types'
import { colors } from '../../design/tokens'
import { getTypographyStyleByName } from '../../design/typography'

export interface ItemCardProps {
  item: Item
  isFocused?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

// Mappage slot -> icon
const slotIcons: Record<string, IconName> = {
  weapon: 'blade',
  armor: 'armor',
  accessory: 'accessory',
  head: 'mask',
  torso: 'armor',
  legs: 'armor',
  hands: 'armor',
  offhand: 'blade',
}

// Mappage rareté -> forme badge
const rarityShapes: Record<string, 'circle' | 'square' | 'diamond' | 'star'> = {
  common: 'circle',
  uncommon: 'square',
  rare: 'diamond',
  legendary: 'star',
}

export function ItemCard({
  item,
  isFocused = false,
  onClick,
  className,
  style,
}: ItemCardProps) {
  const baseStyle: React.CSSProperties = {
    minWidth: '120px',
    width: '120px',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    ...style,
  }

  const iconName = slotIcons[item.slot] || 'blade'
  const badgeShape = rarityShapes[item.rarity] || 'circle'

  return (
    <motion.div
      className={className}
      style={baseStyle}
      onClick={onClick}
      animate={isFocused ? {
        scale: 1.05,
        zIndex: 10,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : {
        scale: 1,
        zIndex: 1,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
    >
      <Card
        variant={isFocused ? 'interactive' : 'default'}
        surface="L1"
        interactive
        equipped={false}
      >
        {/* Icône slot */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <Icon
            name={iconName}
            size={32}
            style="filled"
            color={colors.neutral.ivory}
          />
        </div>

        {/* Badge rareté */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <Badge
            shape={badgeShape}
            rarity={item.rarity}
            size={16}
          />
        </div>

        {/* Nom */}
        <div
          style={{
            ...getTypographyStyleByName('uiSmall'),
            textAlign: 'center',
            fontWeight: 600,
            color: colors.neutral.ivory,
            marginBottom: '0.25rem',
          }}
        >
          {item.name}
        </div>

        {/* Stats clés (1-2) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            fontSize: '0.75rem',
            color: colors.neutral.ash,
          }}
        >
          {item.stats?.atk && (
            <div>ATK: {item.stats.atk}</div>
          )}
          {item.stats?.def && (
            <div>DEF: {item.stats.def}</div>
          )}
          {!item.stats?.atk && !item.stats?.def && item.stats?.vit && (
            <div>VIT: {item.stats.vit}</div>
          )}
        </div>

        {/* Actions si focused */}
        {isFocused && (
          <div
            style={{
              marginTop: '0.5rem',
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
            }}
          >
            <button
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                background: colors.gold.tarnished,
                color: colors.neutral.charcoal,
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              Équiper
            </button>
            <button
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                background: colors.neutral.slate,
                color: colors.neutral.ivory,
                border: `1px solid ${colors.neutral.soot}`,
                borderRadius: '2px',
                cursor: 'pointer',
              }}
            >
              Vendre
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default ItemCard
