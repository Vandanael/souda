/**
 * Bouton avec icône selon le design system
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '../../design/icons/Icon'
import type { IconName, IconSize, IconStyle } from '../../design/types'
import { colors } from '../../design/tokens'
import { getTypographyStyleByName } from '../../design/typography'

export interface IconButtonProps {
  icon: IconName
  iconSize?: IconSize
  iconStyle?: IconStyle
  onClick?: () => void
  disabled?: boolean
  'aria-label'?: string
  className?: string
  style?: React.CSSProperties
}

export function IconButton({
  icon,
  iconSize = 24,
  iconStyle = 'filled',
  onClick,
  disabled = false,
  className,
  style,
}: IconButtonProps) {
  const baseStyle: React.CSSProperties = {
    ...getTypographyStyleByName('button'),
    minWidth: '44px',
    minHeight: '44px',
    padding: '0.5rem',
    background: colors.neutral.slate,
    border: `2px solid ${colors.neutral.soot}`,
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.neutral.ivory,
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    ...style,
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={baseStyle}
      whileHover={disabled ? {} : { scale: 1.05, borderColor: colors.neutral.ash }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      <Icon name={icon} size={iconSize} style={iconStyle} />
    </motion.button>
  )
}

export default IconButton
