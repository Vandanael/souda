import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { RELIC_DEFS_BY_ID } from '../features/relics/relics.logic'
import { useAudio } from '../features/audio/useAudio'
import { useIsMobile } from '../hooks/useIsMobile'

export default function RelicsScreen() {
  const { 
    relics, 
    relicFragments,
    setPhase 
  } = useGameStore()
  
  const { playSound, playHaptic } = useAudio()
  const isMobile = useIsMobile()
  
  const handleClose = () => {
    playSound('ui_close')
    playHaptic('button_press')
    setPhase('aube')
  }
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      flex: 1,
      padding: isMobile ? '1rem' : '1.5rem',
      overflowY: 'auto'
    }}>
      {/* En-tête */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          RELIQUES
        </div>
        <button 
          onClick={handleClose}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.9rem'
          }}
        >
          FERMER
        </button>
      </div>
      
      {/* Fragments collectés */}
      {Object.keys(relicFragments).length > 0 && (
        <div style={{
          background: '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '2px solid #555',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            Fragments collectés
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {Object.entries(relicFragments).map(([fragmentId, count]) => {
              const def = Object.values(RELIC_DEFS_BY_ID).find(d => d.fragmentId === fragmentId)
              if (!def) return null
              
              return (
                <div
                  key={fragmentId}
                  style={{
                    padding: '0.75rem',
                    background: '#1a1a1a',
                    borderRadius: '4px',
                    border: '1px solid #4a9eff40',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ color: '#4a9eff', fontWeight: 'bold' }}>
                      {def.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
                      {count}/3 fragments
                    </div>
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    color: '#4a9eff',
                    fontWeight: 'bold'
                  }}>
                    {count}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Reliques possédées */}
      <div style={{
        background: '#2a2a2a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '2px solid #555',
        flex: 1
      }}>
        <div style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Reliques possédées ({relics.length})
        </div>
        
        {relics.length === 0 ? (
          <div style={{ 
            color: '#888', 
            fontStyle: 'italic', 
            textAlign: 'center', 
            padding: '2rem' 
          }}>
            Aucune relique. Collecte 3 fragments du même type pour créer une relique.
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {relics.map((relic) => {
              const def = RELIC_DEFS_BY_ID[relic.definitionId]
              if (!def) return null
              
              const currentStage = def.stages[relic.stageIndex]
              const nextStage = def.stages[relic.stageIndex + 1]
              const xpProgress = nextStage 
                ? (relic.xp / nextStage.xpRequired) * 100 
                : 100
              
              return (
                <motion.div
                  key={relic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    padding: '1rem',
                    background: '#1a1a1a',
                    borderRadius: '6px',
                    border: '2px solid #4a9eff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  {/* Nom et stage */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: '#4a9eff'
                      }}>
                        {def.name}
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#888',
                        marginTop: '0.25rem'
                      }}>
                        Stage: {currentStage.id}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#aaa',
                      fontStyle: 'italic'
                    }}>
                      J{relic.acquiredDay}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#ccc',
                    fontStyle: 'italic'
                  }}>
                    {def.description}
                  </div>
                  
                  {/* Bonus actuel */}
                  <div style={{
                    padding: '0.5rem',
                    background: '#2a2a2a',
                    borderRadius: '4px',
                    border: '1px solid #4a9eff40'
                  }}>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#4a9eff',
                      fontWeight: 'bold',
                      marginBottom: '0.25rem'
                    }}>
                      Bonus actuel:
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#ddd'
                    }}>
                      {currentStage.bonus}
                    </div>
                  </div>
                  
                  {/* Progression XP */}
                  {nextStage && (
                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem',
                        color: '#aaa',
                        marginBottom: '0.5rem'
                      }}>
                        <span>XP: {relic.xp} / {nextStage.xpRequired}</span>
                        <span>Prochain: {nextStage.bonus}</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '20px',
                        background: '#2a2a2a',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        border: '1px solid #555',
                        position: 'relative'
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${xpProgress}%` }}
                          transition={{ duration: 0.5 }}
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #4a9eff 0%, #2ecc71 100%)',
                            borderRadius: '4px'
                          }}
                        />
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
                          {Math.round(xpProgress)}%
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {def.tags.length > 0 && (
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      {def.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            background: '#2a2a2a',
                            border: '1px solid #555',
                            borderRadius: '3px',
                            color: '#aaa'
                          }}
                        >
                          {tag === 'greed' ? 'Cupidité' :
                           tag === 'survival' ? 'Survie' :
                           tag === 'violence' ? 'Violence' :
                           tag === 'faith' ? 'Foi' : tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
