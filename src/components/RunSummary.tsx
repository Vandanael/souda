import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Item } from '../types/item'
import { useMetaProgressionStore, getXPProgress } from '../store/metaProgression'

export interface RunData {
  day: number
  gold: number
  reputation: number
  equipment: Partial<Record<string, Item>>
  inventory: Item[]
  combatsWon?: number
  combatsFled?: number
  combatsLost?: number
  legendaryItemsFound?: number
}

interface RunSummaryProps {
  runData: RunData
  showTitle?: boolean
  compact?: boolean
  xpGained?: number
}

export default function RunSummary({ runData, showTitle = true, compact = false, xpGained }: RunSummaryProps) {
  const { globalXP, playerLevel, addXP } = useMetaProgressionStore()
  const [animatedXP, setAnimatedXP] = useState(globalXP)
  const [currentLevel, setCurrentLevel] = useState(playerLevel)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [unlockedContent, setUnlockedContent] = useState<string[]>([])
  const [xpAdded, setXpAdded] = useState(false)

  // Animer l'XP si fournie
  useEffect(() => {
    if (xpGained === undefined || xpGained === null) return

    const startXP = globalXP
    const endXP = globalXP + xpGained
    const duration = 2000
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentXP = Math.floor(startXP + (endXP - startXP) * eased)
      
      setAnimatedXP(currentXP)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        if (!xpAdded) {
          setXpAdded(true)
          const levelUpResult = addXP(xpGained)
          
          if (levelUpResult.leveledUp && levelUpResult.newLevel) {
            setCurrentLevel(levelUpResult.newLevel)
            setShowLevelUp(true)
            setUnlockedContent(levelUpResult.unlockedContent || [])
          }
        }
      }
    }
    
    requestAnimationFrame(animate)
  }, [xpGained, globalXP, addXP, xpAdded])

  const progress = getXPProgress(animatedXP, currentLevel)

  // Compter les items légendaires
  const legendaryItems = [
    ...Object.values(runData.equipment),
    ...runData.inventory
  ].filter(item => item && item.rarity === 'legendary').length
  
  const legendaryCount = runData.legendaryItemsFound ?? legendaryItems
  
  return (
    <div style={{
      background: compact ? 'transparent' : '#2a2a2a',
      padding: compact ? '0' : '1.5rem',
      borderRadius: '8px',
      border: compact ? 'none' : '2px solid #555',
      width: '100%'
    }}>
      {showTitle && !compact && (
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          RÉCAPITULATIF
        </div>
      )}
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* Jours survécus */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.5rem',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          <span style={{ color: '#aaa' }}>Jours survécus :</span>
          <span style={{ color: '#ddd', fontWeight: 'bold' }}>{runData.day}/20</span>
        </div>
        
        {/* Or final */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.5rem',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          <span style={{ color: '#aaa' }}>Or final :</span>
          <span style={{ color: '#ca8', fontWeight: 'bold' }}>{runData.gold}💰</span>
        </div>
        
        {/* Réputation finale */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.5rem',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          <span style={{ color: '#aaa' }}>Réputation :</span>
          <span style={{ color: '#ddd', fontWeight: 'bold' }}>
            {'⭐'.repeat(runData.reputation)}
          </span>
        </div>
        
        {/* Items légendaires */}
        {legendaryCount > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            border: '1px solid #ca8'
          }}>
            <span style={{ color: '#aaa' }}>Items légendaires :</span>
            <span style={{ color: '#ca8', fontWeight: 'bold' }}>{legendaryCount}</span>
          </div>
        )}
        
        {/* Combats */}
        {(runData.combatsWon !== undefined || runData.combatsFled !== undefined || runData.combatsLost !== undefined) && (
          <div style={{
            padding: '0.5rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            marginTop: '0.5rem'
          }}>
            <div style={{ color: '#aaa', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Combats :
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              fontSize: '0.85rem'
            }}>
              {runData.combatsWon !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4a8' }}>Victoires :</span>
                  <span style={{ color: '#4a8' }}>{runData.combatsWon}</span>
                </div>
              )}
              {runData.combatsFled !== undefined && runData.combatsFled > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#ca8' }}>Fuit :</span>
                  <span style={{ color: '#ca8' }}>{runData.combatsFled}</span>
                </div>
              )}
              {runData.combatsLost !== undefined && runData.combatsLost > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#c44' }}>Défaites :</span>
                  <span style={{ color: '#c44' }}>{runData.combatsLost}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* XP Gagnée */}
        {xpGained !== undefined && xpGained !== null && (
          <div style={{
            padding: '0.75rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            marginTop: '0.75rem',
            border: '1px solid #4a9eff40'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ color: '#aaa' }}>XP Gagnée :</span>
              <span style={{ color: '#4a9eff', fontWeight: 'bold' }}>+{xpGained}</span>
            </div>
            
            <div style={{
              fontSize: '0.85rem',
              color: '#888',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              Niveau {currentLevel}
            </div>

            {/* Barre d'XP */}
            <div style={{
              width: '100%',
              height: '24px',
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
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                pointerEvents: 'none'
              }}>
                {progress.currentLevelXP} / {progress.nextLevelXP} XP
              </div>
            </div>

            {/* Level up info */}
            {showLevelUp && unlockedContent.length > 0 && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: 'rgba(46, 204, 113, 0.1)',
                border: '1px solid #2ecc71',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: '#2ecc71'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Niveau {currentLevel} - Nouveau contenu débloqué
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem' }}>
                  {unlockedContent.map((unlock, index) => {
                    const isOrigin = unlock.startsWith('origin:')
                    const isItem = unlock.startsWith('item:')
                    const name = isOrigin 
                      ? unlock.replace('origin:', '').charAt(0).toUpperCase() + unlock.replace('origin:', '').slice(1)
                      : isItem
                      ? unlock.replace('item:', '').replace(/_/g, ' ').toUpperCase()
                      : unlock
                    
                    return (
                      <div key={index}>
                        {isOrigin ? `Origine : ${name}` : `Item : ${name}`}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
