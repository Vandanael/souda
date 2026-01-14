/**
 * Bouton avec animations de micro-interaction
 * Migré pour utiliser le nouveau composant Button du design system
 */

import { ReactNode, ButtonHTMLAttributes } from 'react'
import { Button } from './design/Button'
import type { ButtonVariant } from '../design/types'

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'pillage'
}

export default function AnimatedButton({ 
  children, 
  variant = 'primary',
  style,
  ...props 
}: AnimatedButtonProps) {
  // Mapper les anciens variants vers les nouveaux
  const mappedVariant: ButtonVariant = variant === 'pillage' ? 'pillage' : variant
  
  return (
    <Button
      variant={mappedVariant}
      style={style}
      {...props}
    >
      {children}
    </Button>
  )
}
