import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getRuns } from '../features/meta/hallOfFame'
import { ArchivedRun } from '../features/meta/types'
import { RELIC_DEFINITIONS } from '../features/relics/relics.data'
import { useAudio } from '../features/audio/useAudio'
import { useIsMobile } from '../hooks/useIsMobile'

export default function FragmentCollectionScreen() {
  const { setPhase } = useGameStore()
  const { playSound, playHaptic } = useAudio()
  const isMobile = useIsMobile()
  const [runs, setRuns] = useState<ArchivedRun[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFragment, setSelectedFragment] = useState<string | null>(null)
  
  useEffect(() => {
    loadRuns()
  }, [])
  
  const loadRuns = async () => {
    setLoading(true)
    try {
      const runsData = await getRuns()
      setRuns(runsData)
    } catch (error) {
      console.error('Erreur chargement runs:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Calculer la progression des fragments
  const fragmentProgress = useMemo(() => {
    const totalFragments: Record<string, number> = {}
    let totalRelicsCreated = 0
    
    runs.forEach(run => {
      // Compter les fragments collectés
      if (run.relicFragments) {
        Object.entries(run.relicFragments).forEach(([fragmentId, count]) => {
          totalFragments[fragmentId] = (totalFragments[fragmentId] || 0) + count
        })
      }
      
      // Compter les reliques créées
      if (run.relicsCount) {
        totalRelicsCreated += run.relicsCount
      }
    })
    
    // Créer les cartes de fragments avec progression
    const fragmentCards = RELIC_DEFINITIONS.map(def => {
      const fragmentCount = totalFragments[def.fragmentId] || 0
      const progress = (fragmentCount / 3) * 100
      const canComplete = fragmentCount >= 3
      const completedCount = Math.floor(fragmentCount / 3)
      const remainingFragments = fragmentCount % 3
      
      return {
        definition: def,
        fragmentId: def.fragmentId,
        fragmentCount,
        progress,
        canComplete,
        completedCount,
        remainingFragments
      }
    })
    
    return {
      totalFragments,
      totalRelicsCreated,
      fragmentCards: fragmentCards.sort((a, b) => b.fragmentCount - a.fragmentCount)
    }
  }, [runs])
  
  const handleClose = () => {
    playSound('ui_close')
    playHaptic('button_press')
    setPhase('start')
  }
  
  const handleFragmentClick = (fragmentId: string) => {
    playSound('ui_open')
    playHaptic('button_press')
    setSelectedFragment(selectedFragment === fragmentId ? null : fragmentId)
  }
  
  const selectedCard = fragmentProgress.fragmentCards.find(c => c.fragmentId === selectedFragment)
  
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Chargement...</div>
      </div>
    )
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
          COLLECTION DE FRAGMENTS
        </div>
        <button 
          onClick={handleClose}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.9rem'
          }}
        >
          RETOUR
        </button>
      </div>
      
      {/* Résumé global */}
      <div style={{
        background: '#2a2a2a',
        padding: '1rem',
        borderRadius: '8px',
        border: '2px solid #555',
        marginBottom: '1rem'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: '#aaa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Reliques créées au total :</span>
          <span style={{ color: '#4a9eff', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {fragmentProgress.totalRelicsCreated}
          </span>
        </div>
      </div>
      
      {/* Grille de cartes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: '1rem'
      }}>
        {fragmentProgress.fragmentCards.map((card) => {
          const isSelected = selectedFragment === card.fragmentId
          
          return (
            <motion.div
              key={card.fragmentId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFragmentClick(card.fragmentId)}
              style={{
                background: '#2a2a2a',
                padding: '1rem',
                borderRadius: '8px',
                border: `2px solid ${isSelected ? '#4a9eff' : card.canComplete ? '#4a9eff80' : '#4a9eff40'}`,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Nom de la relique */}
              <div style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#4a9eff',
                textAlign: 'center'
              }}>
                {card.definition.name}
              </div>
              
              {/* Icône ou illustration (placeholder) */}
              <div style={{
                width: '100%',
                height: '80px',
                background: 'linear-gradient(135deg, #4a9eff20 0%, #2ecc7120 100%)',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '2rem',
                border: '1px solid #4a9eff40'
              }}>
                ⚡
              </div>
              
              {/* Compteur de fragments */}
              <div style={{
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: card.canComplete ? '#2ecc71' : '#ca8'
              }}>
                {card.fragmentCount} / 3
              </div>
              
              {/* Barre de progression */}
              <div style={{
                width: '100%',
                height: '8px',
                background: '#1a1a1a',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid #555'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ duration: 0.5 }}
                  style={{
                    height: '100%',
                    background: card.canComplete 
                      ? 'linear-gradient(90deg, #4a9eff 0%, #2ecc71 100%)'
                      : 'linear-gradient(90deg, #4a9eff 0%, #2ecc71 100%)',
                    borderRadius: '4px',
                    opacity: card.canComplete ? 1 : 0.6
                  }}
                />
              </div>
              
              {/* Badge "Complétable" */}
              {card.canComplete && (
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: '#2ecc71',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  ✓
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
      
      {/* Détail de la carte sélectionnée */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              background: '#2a2a2a',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '2px solid #4a9eff',
              marginTop: '1rem'
            }}
          >
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#4a9eff',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{selectedCard.definition.name}</span>
              <button
                onClick={() => setSelectedFragment(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#aaa',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              fontSize: '0.9rem',
              color: '#ccc',
              fontStyle: 'italic',
              marginBottom: '1rem'
            }}>
              {selectedCard.definition.description}
            </div>
            
            {/* Stats de progression */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9rem'
              }}>
                <span style={{ color: '#aaa' }}>Fragments collectés :</span>
                <span style={{ color: '#4a9eff', fontWeight: 'bold' }}>
                  {selectedCard.fragmentCount}
                </span>
              </div>
              
              {selectedCard.canComplete && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: '#aaa' }}>Reliques créées :</span>
                  <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                    {selectedCard.completedCount}
                  </span>
                </div>
              )}
              
              {selectedCard.remainingFragments > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: '#aaa' }}>Fragments restants :</span>
                  <span style={{ color: '#ca8', fontWeight: 'bold' }}>
                    {selectedCard.remainingFragments} / 3
                  </span>
                </div>
              )}
            </div>
            
            {/* Stages de la relique */}
            <div style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #555'
            }}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#aaa',
                marginBottom: '0.5rem'
              }}>
                Stages :
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {selectedCard.definition.stages.map((stage) => (
                  <div
                    key={stage.id}
                    style={{
                      padding: '0.5rem',
                      background: '#1a1a1a',
                      borderRadius: '4px',
                      border: '1px solid #555',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{
                      color: '#4a9eff',
                      fontWeight: 'bold',
                      marginBottom: '0.25rem'
                    }}>
                      {stage.id} (XP requis: {stage.xpRequired})
                    </div>
                    <div style={{ color: '#ccc' }}>
                      {stage.bonus}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            {selectedCard.definition.tags.length > 0 && (
              <div style={{
                marginTop: '1rem',
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {selectedCard.definition.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      background: '#1a1a1a',
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
        )}
      </AnimatePresence>
    </div>
  )
}
