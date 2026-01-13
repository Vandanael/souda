/**
 * Composant pour les transitions entre écrans
 */

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'
import { useIsMobile, useIsLowEndDevice } from '../hooks/useIsMobile'

interface PageTransitionProps {
  children: ReactNode
  phase: string
}

export default function PageTransition({ children, phase }: PageTransitionProps) {
  const isMobile = useIsMobile()
  const isLowEnd = useIsLowEndDevice()
  
  // Désactiver les animations sur mobile ou appareils bas de gamme
  const disableAnimations = isMobile || isLowEnd
  
  // Utiliser fade pour transitions principales, slide pour navigation hub
  const isHubNavigation = ['marche', 'morten', 'forge', 'taverne', 'inventory', 'settings'].includes(phase)
  
  // Si animations désactivées, afficher directement sans transition
  if (disableAnimations) {
    return (
      <div style={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {children}
      </div>
    )
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={isHubNavigation ? { opacity: 0, x: 20 } : { opacity: 0 }}
        animate={isHubNavigation ? { opacity: 1, x: 0 } : { opacity: 1 }}
        exit={isHubNavigation ? { opacity: 0, x: -20 } : { opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }} // Réduit de 0.3 à 0.2
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
