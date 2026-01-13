/**
 * Particules d'ambiance pour les fins
 */

import { motion } from 'framer-motion'
import { EndingAmbiance } from './types'

interface EndingParticlesProps {
  ambiance: EndingAmbiance
}

export default function EndingParticles({ ambiance }: EndingParticlesProps) {
  if (ambiance.particles === 'none' || !ambiance.particles) {
    return null
  }
  
  const particleCount = 20
  
  if (ambiance.particles === 'gold') {
    return (
      <>
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0
            }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: 360
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear'
            }}
            style={{
              position: 'fixed',
              width: '8px',
              height: '8px',
              background: '#ca8',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 1,
              boxShadow: '0 0 10px #ca8'
            }}
          />
        ))}
      </>
    )
  }
  
  if (ambiance.particles === 'ashes') {
    return (
      <>
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: -50,
              opacity: 0,
              rotate: 0
            }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [0, 0.5, 0],
              rotate: 360
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear'
            }}
            style={{
              position: 'fixed',
              width: '6px',
              height: '6px',
              background: '#333',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        ))}
      </>
    )
  }
  
  if (ambiance.particles === 'mist') {
    return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              x: (Math.random() - 0.5) * 200 + (Math.random() * window.innerWidth),
              y: (Math.random() - 0.5) * 200 + (Math.random() * window.innerHeight),
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut'
            }}
            style={{
              position: 'fixed',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(200,200,200,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        ))}
      </>
    )
  }
  
  if (ambiance.particles === 'light') {
    return (
      <>
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut'
            }}
            style={{
              position: 'fixed',
              width: '20px',
              height: '20px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        ))}
      </>
    )
  }
  
  return null
}
