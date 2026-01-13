import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMetaProgressionStore, getXPProgress } from '../store/metaProgression'

interface MetaProgressionDisplayProps {
  xpGained: number
  onAnimationComplete?: () => void
}

export default function MetaProgressionDisplay({ 
  xpGained, 
  onAnimationComplete 
}: MetaProgressionDisplayProps) {
  const { globalXP, playerLevel, addXP } = useMetaProgressionStore()
  const [animatedXP, setAnimatedXP] = useState(globalXP)
  const [currentLevel, setCurrentLevel] = useState(playerLevel)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [unlockedContent, setUnlockedContent] = useState<string[]>([])
  const [xpAdded, setXpAdded] = useState(false)

  useEffect(() => {
    // Animer la barre d'XP d'abord
    const startXP = globalXP
    const endXP = globalXP + xpGained
    const duration = 2000 // 2 secondes
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(1, elapsed / duration)
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentXP = Math.floor(startXP + (endXP - startXP) * eased)
      
      setAnimatedXP(currentXP)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Une fois l'animation terminée, ajouter l'XP réellement et vérifier le level up
        if (!xpAdded) {
          setXpAdded(true)
          const levelUpResult = addXP(xpGained)
          
          // Mettre à jour le niveau si level up
          if (levelUpResult.leveledUp && levelUpResult.newLevel) {
            setCurrentLevel(levelUpResult.newLevel)
            setShowLevelUp(true)
            setUnlockedContent(levelUpResult.unlockedContent || [])
          }
        }
        
        if (onAnimationComplete) {
          setTimeout(onAnimationComplete, 500)
        }
      }
    }
    
    requestAnimationFrame(animate)
  }, [xpGained, globalXP, addXP, onAnimationComplete, xpAdded])

  const progress = getXPProgress(animatedXP, currentLevel)

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10001,
      width: '90%',
      maxWidth: '500px',
      background: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #555',
      borderRadius: '8px',
      padding: '1.5rem'
    }}>
      <div style={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        color: '#fff',
        textAlign: 'center'
      }}>
        XP Gagnée : +{xpGained}
      </div>
      
      <div style={{
        marginBottom: '0.5rem',
        fontSize: '0.9rem',
        color: '#aaa',
        textAlign: 'center'
      }}>
        Niveau {currentLevel}
      </div>
      
      {/* Barre d'XP */}
      <div style={{
        width: '100%',
        height: '30px',
        background: '#2a2a2a',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid #555',
        position: 'relative'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress.progress * 100}%` }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #4a9eff 0%, #2ecc71 100%)',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Effet de brillance */}
          <motion.div
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
            }}
          />
        </motion.div>
        
        {/* Texte de progression */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          pointerEvents: 'none'
        }}>
          {progress.currentLevelXP} / {progress.nextLevelXP} XP
        </div>
      </div>
      
      {/* Pop-up Level Up */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, type: 'spring' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)',
              border: '3px solid #f39c12',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '400px',
              width: '90%',
              zIndex: 10002,
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
              textAlign: 'center'
            }}
            onClick={() => setShowLevelUp(false)}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                repeatType: 'reverse' as const
              }}
              style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}
            >
              🎉
            </motion.div>
            
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#f39c12',
              marginBottom: '1rem',
              textShadow: '0 0 10px rgba(243, 156, 18, 0.5)'
            }}>
              NIVEAU {currentLevel} ATTEINT !
            </div>
            
            {unlockedContent.length > 0 && (
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #555'
              }}>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#2ecc71',
                  marginBottom: '1rem'
                }}>
                  NOUVEAU CONTENU DÉBLOQUÉ
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {unlockedContent.map((unlock, index) => {
                    const isOrigin = unlock.startsWith('origin:')
                    const isItem = unlock.startsWith('item:')
                    const name = isOrigin 
                      ? unlock.replace('origin:', '').charAt(0).toUpperCase() + unlock.replace('origin:', '').slice(1)
                      : isItem
                      ? unlock.replace('item:', '').replace(/_/g, ' ').toUpperCase()
                      : unlock
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          background: 'rgba(46, 204, 113, 0.2)',
                          border: '1px solid #2ecc71',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontSize: '1rem',
                          color: '#2ecc71'
                        }}
                      >
                        {isOrigin ? `Origine : ${name}` : `Item : ${name}`}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
            
            <button
              onClick={() => setShowLevelUp(false)}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: '#f39c12',
                border: 'none',
                borderRadius: '6px',
                color: '#000',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e67e22'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f39c12'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              CONTINUER
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
