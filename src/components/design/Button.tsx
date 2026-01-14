/**
 * Composant Button selon le Design System Bourg-Creux
 * Variant "ALLER PILLER" : or terni avec sous-couche sang
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { ButtonVariant } from '../../design/types'
import { colors } from '../../design/tokens'
import { getTypographyStyleByName } from '../../design/typography'
import { hapticManager } from '../../features/audio/hapticManager'
import { audioManager } from '../../features/audio/audioManager'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  onClick,
  disabled = false,
  className,
  style,
  ...props
}: ButtonProps) {
  const [, setIsPressed] = useState(false)
  const [showFlash, setShowFlash] = useState(false)

  // Styles selon le variant
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'pillage':
        // Variant "ALLER PILLER" : or terni avec sous-couche sang
        return {
          background: `linear-gradient(135deg, ${colors.gold.tarnished} 0%, ${colors.gold.tarnished} 100%)`,
          boxShadow: `inset 0 2px 4px ${colors.blood.deep}40, 0 2px 4px ${colors.neutral.charcoal}80`,
          border: `2px solid ${colors.gold.tarnished}`,
          color: colors.neutral.charcoal,
          fontWeight: 700,
        }
      case 'primary':
        return {
          background: colors.neutral.slate,
          border: `2px solid ${colors.neutral.soot}`,
          color: colors.neutral.ivory,
        }
      case 'secondary':
        return {
          background: colors.neutral.ink,
          border: `2px solid ${colors.neutral.soot}`,
          color: colors.neutral.ivory,
        }
      case 'danger':
        return {
          background: colors.blood.rust,
          border: `2px solid ${colors.blood.carmine}`,
          color: colors.neutral.ivory,
        }
      default:
        return {}
    }
  }

  // Tailles
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          minHeight: '36px',
        }
      case 'md':
        return {
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          minHeight: '44px',
        }
      case 'lg':
        return {
          padding: '1rem 2rem',
          fontSize: '1.125rem',
          minHeight: '52px',
        }
      default:
        return {}
    }
  }

  const baseStyle: React.CSSProperties = {
    ...getTypographyStyleByName('button'),
    ...getVariantStyles(),
    ...getSizeStyles(),
    width: fullWidth ? '100%' : 'auto',
    minWidth: '44px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    ...style,
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    setIsPressed(true)
    setShowFlash(true)
    
    // Haptic : impulsion courte et ferme
    hapticManager.play('button_metal')
    
    // Audio : clic métallique sourd
    audioManager.playSound('button_metal_click').catch(() => {
      // Ignorer si le son n'existe pas encore
    })
    
    // Flash or brûlé au release
    setTimeout(() => {
      setShowFlash(false)
      setIsPressed(false)
    }, 150)
    
    onClick?.(e)
  }

  return (
    <motion.button
      {...(props as any)}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={baseStyle}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
    >
      {showFlash && variant === 'pillage' && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${colors.gold.burnt}40 0%, transparent 100%)`,
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.15 }}
        />
      )}
      {children}
    </motion.button>
  )
}

export default Button
