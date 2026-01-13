import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Item } from '../../types/item'
import ItemCard from './ItemCard'
import ParticleEffect from './ParticleEffect'
import { audioManager } from '../audio/audioManager'
import { hapticManager } from '../audio/hapticManager'

interface LootRevealProps {
  item: Item
  onRevealComplete: () => void
  autoStart?: boolean
}

type RevealPhase = 'hidden' | 'shaking' | 'flipping' | 'revealed' | 'complete'

export default function LootReveal({ 
  item, 
  onRevealComplete, 
  autoStart = true 
}: LootRevealProps) {
  const [phase, setPhase] = useState<RevealPhase>(autoStart ? 'hidden' : 'revealed')
  
  // Phase 1 : Carte cachée (0.3s)
  useEffect(() => {
    if (!autoStart) return
    
    const timer = setTimeout(() => {
      setPhase('shaking')
    }, 300)
    
    return () => clearTimeout(timer)
  }, [autoStart])
  
  // Phase 2 : Tremblement (0.5s)
  useEffect(() => {
    if (phase !== 'shaking') return
    
    const timer = setTimeout(() => {
      setPhase('flipping')
      
      // Audio et haptic au moment du flip selon rareté
      const soundMap: Record<string, 'loot_common' | 'loot_uncommon' | 'loot_rare' | 'loot_legendary'> = {
        common: 'loot_common',
        uncommon: 'loot_uncommon',
        rare: 'loot_rare',
        legendary: 'loot_legendary'
      }
      
      const hapticMap: Record<string, 'loot_common' | 'loot_uncommon' | 'loot_rare' | 'loot_legendary'> = {
        common: 'loot_common',
        uncommon: 'loot_uncommon',
        rare: 'loot_rare',
        legendary: 'loot_legendary'
      }
      
      const soundId = soundMap[item.rarity]
      const hapticPattern = hapticMap[item.rarity]
      
      if (soundId) {
        audioManager.playSound(soundId)
      }
      if (hapticPattern) {
        hapticManager.play(hapticPattern)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [phase])
  
  // Phase 3 : Flip (0.4s)
  useEffect(() => {
    if (phase !== 'flipping') return
    
    const timer = setTimeout(() => {
      setPhase('revealed')
    }, 400)
    
    return () => clearTimeout(timer)
  }, [phase])
  
  // Phase 4 : Particules (0.3s)
  useEffect(() => {
    if (phase !== 'revealed') return
    
    const timer = setTimeout(() => {
      setPhase('complete')
      onRevealComplete()
    }, 300)
    
    return () => clearTimeout(timer)
  }, [phase, onRevealComplete])
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      flex: 1,
      minHeight: '100vh',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Carte */}
      <div style={{
        perspective: '1000px',
        perspectiveOrigin: 'center center'
      }}>
        <motion.div
          animate={{
            rotateY: phase === 'flipping' || phase === 'revealed' || phase === 'complete' ? 180 : 0,
            scale: phase === 'shaking' ? [1, 1.05, 1] : 1,
            x: phase === 'shaking' ? [0, -5, 5, -5, 5, 0] : 0
          }}
          transition={{
            rotateY: {
              duration: 0.4,
              ease: 'easeOut'
            },
            scale: {
              duration: 0.5,
              repeat: Infinity,
              repeatType: 'reverse' as const
            },
            x: {
              duration: 0.1,
              repeat: 5,
              ease: 'easeInOut'
            }
          }}
          style={{
            transformStyle: 'preserve-3d',
            position: 'relative',
            width: '200px',
            height: '280px'
          }}
        >
          {/* Face verso (cachée) */}
          <motion.div
            animate={{
              opacity: phase === 'hidden' || phase === 'shaking' ? 1 : 0,
              scale: phase === 'shaking' ? [1, 1.02, 1] : 1
            }}
            transition={{
              opacity: { duration: 0.1 },
              scale: {
                duration: 0.5,
                repeat: phase === 'shaking' ? Infinity : 0,
                repeatType: 'reverse' as const
              }
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)'
            }}
          >
            <ItemCard item={item} showBack={true} />
          </motion.div>
          
          {/* Face recto (révélée) */}
          <motion.div
            animate={{
              opacity: phase === 'flipping' || phase === 'revealed' || phase === 'complete' ? 1 : 0
            }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <ItemCard item={item} showBack={false} />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Particules */}
      <AnimatePresence>
        {(phase === 'revealed' || phase === 'complete') && (
          <ParticleEffect rarity={item.rarity} />
        )}
      </AnimatePresence>
      
      {/* Message */}
      {phase === 'revealed' || phase === 'complete' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            color: '#ccc'
          }}
        >
          {item.name} trouvé !
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#666',
            fontStyle: 'italic'
          }}
        >
          ...
        </motion.div>
      )}
    </div>
  )
}
