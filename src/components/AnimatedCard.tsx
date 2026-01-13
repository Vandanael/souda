/**
 * Card avec animation au hover/touch
 */

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  onClick?: () => void
  style?: React.CSSProperties
}

export default function AnimatedCard({ children, onClick, style }: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={onClick ? { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      style={{
        background: '#2a2a2a',
        border: '2px solid #555',
        borderRadius: '8px',
        padding: '1rem',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </motion.div>
  )
}
