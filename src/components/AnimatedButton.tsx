/**
 * Bouton avec animations de micro-interaction
 */

import { motion } from 'framer-motion'
import { ReactNode, ButtonHTMLAttributes } from 'react'

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function AnimatedButton({ 
  children, 
  variant = 'primary',
  style,
  ...props 
}: AnimatedButtonProps) {
  const baseStyle = {
    fontFamily: 'inherit',
    fontSize: '1rem',
    padding: '0.75rem 1.5rem',
    minHeight: '44px', // Touch target minimum
    minWidth: '44px',
    background: variant === 'primary' ? '#555' : variant === 'danger' ? '#c44' : '#2a2a2a',
    color: '#e0e0e0',
    border: `2px solid ${variant === 'primary' ? '#777' : variant === 'danger' ? '#e66' : '#444'}`,
    borderRadius: '4px',
    cursor: 'pointer',
    ...style
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      style={baseStyle}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}
