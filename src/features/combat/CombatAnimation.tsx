import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { audioManager } from '../audio/audioManager'
import { hapticManager } from '../audio/hapticManager'

interface CombatAnimationProps {
  onComplete: () => void
}

export default function CombatAnimation({ onComplete }: CombatAnimationProps) {
  const [impacts, setImpacts] = useState(0)
  
  useEffect(() => {
    // Générer 3-5 impacts pendant 2 secondes
    const numImpacts = 4
    const interval = 2000 / numImpacts
    
    const timers: number[] = []
    
    for (let i = 0; i < numImpacts; i++) {
      const timer = window.setTimeout(() => {
        setImpacts(prev => prev + 1)
        
        // Son et haptic pour chaque impact
        const hitSounds: Array<'hit_01' | 'hit_02' | 'hit_03'> = ['hit_01', 'hit_02', 'hit_03']
        const randomHit = hitSounds[Math.floor(Math.random() * hitSounds.length)]
        audioManager.playSound(randomHit, 0.8)
        hapticManager.play('combat_hit')
      }, i * interval)
      timers.push(timer)
    }
    
    // Appeler onComplete après 2 secondes
    const completeTimer = window.setTimeout(() => {
      onComplete()
    }, 2000)
    
    return () => {
      timers.forEach(t => clearTimeout(t))
      clearTimeout(completeTimer)
    }
  }, [onComplete])
  
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Flash d'impact */}
      {Array.from({ length: impacts }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{ 
            duration: 0.3,
            times: [0, 0.5, 1]
          }}
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      ))}
      
      {/* Shake de l'écran */}
      <motion.div
        animate={{
          x: [0, -5, 5, -5, 5, 0],
          y: [0, -3, 3, -3, 3, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          fontSize: '3rem',
          color: '#fff'
        }}
      >
        ⚔️
      </motion.div>
      
      {/* Particules */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: 0,
            y: 0,
            opacity: 0
          }}
          animate={{
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1,
            delay: Math.random() * 1,
            repeat: Infinity
          }}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: '#fff',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  )
}
