/**
 * Composant ItemCardStack pour conteneur éventail
 * Scroll horizontal avec animations de focus
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ItemCard } from './ItemCard'
import type { Item } from '../../types/item'
import { colors } from '../../design/tokens'

export interface ItemCardStackProps {
  items: Item[]
  onItemClick?: (item: Item) => void
  className?: string
  style?: React.CSSProperties
}

export function ItemCardStack({
  items,
  onItemClick,
  className,
  style,
}: ItemCardStackProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: '1rem',
    scrollSnapType: 'x proximity',
    scrollbarWidth: 'thin',
    scrollbarColor: `${colors.neutral.soot} ${colors.neutral.charcoal}`,
    ...style,
  }

  const handleItemClick = (item: Item, index: number) => {
    setFocusedIndex(focusedIndex === index ? null : index)
    onItemClick?.(item)
  }

  return (
    <div className={className} style={baseStyle}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          style={{
            scrollSnapAlign: 'start',
            flexShrink: 0,
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <ItemCard
            item={item}
            isFocused={focusedIndex === index}
            onClick={() => handleItemClick(item, index)}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default ItemCardStack
