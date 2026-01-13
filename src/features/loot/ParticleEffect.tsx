import { motion } from 'framer-motion'
import { ItemRarity } from '../../types/item'

interface ParticleEffectProps {
  rarity: ItemRarity
}

export default function ParticleEffect({ rarity }: ParticleEffectProps) {
  const getParticleConfig = () => {
    switch (rarity) {
      case 'common':
        return {
          count: 8,
          color: '#888',
          size: 3,
          speed: 50,
          duration: 0.3
        }
      case 'uncommon':
        return {
          count: 15,
          color: '#4a8',
          size: 4,
          speed: 80,
          duration: 0.4
        }
      case 'rare':
        return {
          count: 25,
          color: '#4af',
          size: 5,
          speed: 120,
          duration: 0.5
        }
      case 'legendary':
        return {
          count: 40,
          color: '#ffd700',
          size: 6,
          speed: 150,
          duration: 0.6
        }
    }
  }
  
  const config = getParticleConfig()
  
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '200px',
      height: '280px',
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)'
    }}>
      {/* Particules */}
      {Array.from({ length: config.count }).map((_, i) => {
        const angle = (360 / config.count) * i
        const radians = (angle * Math.PI) / 180
        
        return (
          <motion.div
            key={i}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1
            }}
            animate={{
              x: Math.cos(radians) * config.speed,
              y: Math.sin(radians) * config.speed,
              opacity: [1, 1, 0],
              scale: [1, 1.5, 0]
            }}
            transition={{
              duration: config.duration,
              times: [0, 0.5, 1],
              ease: 'easeOut'
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${config.size}px`,
              height: `${config.size}px`,
              background: config.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${config.size * 2}px ${config.color}`
            }}
          />
        )
      })}
      
      {/* Halo pour Rare+ */}
      {(rarity === 'rare' || rarity === 'legendary') && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.6, 0] }}
          transition={{ duration: config.duration, times: [0, 0.5, 1] }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '300px',
            height: '300px',
            border: `2px solid ${config.color}`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.3
          }}
        />
      )}
      
      {/* Rayons pour Legendary */}
      {rarity === 'legendary' && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (360 / 8) * i
            
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: angle
                }}
                transition={{
                  duration: config.duration,
                  times: [0, 0.3, 1]
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '4px',
                  height: '100px',
                  background: `linear-gradient(to bottom, ${config.color}, transparent)`,
                  transformOrigin: 'top center',
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`
                }}
              />
            )
          })}
        </>
      )}
    </div>
  )
}
