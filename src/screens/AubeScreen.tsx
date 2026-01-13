import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getStatsDescription } from '../utils/stats'
import CharacterCanvas from '../features/character/CharacterCanvas'
import { useAudio } from '../features/audio/useAudio'
import EndingProgress from '../components/EndingProgress'
import DailyObjectives from '../components/DailyObjectives'
import { useIsMobile } from '../hooks/useIsMobile'
import { useButtonProtection } from '../hooks/useDebounce'
import CompactHUD from '../components/CompactHUD'

export default function AubeScreen() {
  const { playerStats, equipment, goToExploration, openInventory } = useGameStore()
  const { playSound, playHaptic } = useAudio()
  const isMobile = useIsMobile()
  const [isNavigating, setIsNavigating] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  
  const openMarche = () => {
    playSound('ui_open')
    playHaptic('button_press')
    useGameStore.setState({ phase: 'marche' })
  }
  
  const openMorten = () => {
    playSound('ui_open')
    playHaptic('button_press')
    useGameStore.setState({ phase: 'morten' })
  }
  
  const openSettings = () => {
    playSound('ui_open')
    playHaptic('button_press')
    useGameStore.setState({ phase: 'settings' })
  }
  
  const handleOpenInventory = () => {
    playSound('ui_open')
    playHaptic('button_press')
    openInventory()
  }
  
  const handleGoToExplorationBase = () => {
    if (isNavigating) return
    
    // Vérifier si les stats sont trop faibles
    if (playerStats.atk < 8) {
      setShowWarning(true)
      return
    }
    
    setIsNavigating(true)
    playSound('ui_open')
    playHaptic('button_press')
    goToExploration()
    // Réactiver après 500ms
    setTimeout(() => setIsNavigating(false), 500)
  }
  
  const handleConfirmExploration = () => {
    setShowWarning(false)
    setIsNavigating(true)
    playSound('ui_open')
    playHaptic('button_press')
    goToExploration()
    setTimeout(() => setIsNavigating(false), 500)
  }
  
  const [handleGoToExploration, isExplorationDisabled] = useButtonProtection(handleGoToExplorationBase, 500)
  
  const statsDesc = getStatsDescription(playerStats)
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    }}>
      {/* HUD Compact en haut */}
      <CompactHUD showHunger={true} />
      
      {/* Contenu scrollable */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        justifyContent: 'center'
      }}>
        {/* Titre discret */}
        <div style={{
          textAlign: 'center',
          fontSize: isMobile ? '1rem' : '1.1rem',
          fontWeight: 'bold',
          color: '#888',
          opacity: 0.7,
          marginBottom: '0.5rem'
        }}>
          AUBE
        </div>
        
        {/* Texte narratif - priorité visuelle */}
        <div style={{
          fontSize: isMobile ? '1.1rem' : '1.2rem',
          lineHeight: '1.8',
          color: '#ddd',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'rgba(26, 26, 26, 0.6)',
          borderRadius: '4px',
          fontStyle: 'italic'
        }}>
          "Bourg-Creux. Des murs. Un toit. Ça fera l'affaire. Pour l'instant."
        </div>
      
      <div style={{
        background: '#2a2a2a',
        padding: isMobile ? '1rem' : '1.5rem',
        borderRadius: '8px',
        border: '2px solid #555'
      }}>
        {/* Personnage + Stats */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '0.75rem' : '1rem',
          alignItems: 'center',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          marginBottom: '1rem'
        }}>
          <CharacterCanvas equipment={equipment} size={isMobile ? 80 : 96} />
          
          <div style={{
            padding: isMobile ? '0.75rem' : '1rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            color: '#ccc',
            lineHeight: '1.6',
            flex: 1,
            minWidth: isMobile ? '100%' : 'auto'
          }}>
            <div style={{ marginBottom: '0.3rem' }}>{statsDesc.attack}</div>
            <div style={{ marginBottom: '0.3rem' }}>{statsDesc.defense}</div>
            <div>{statsDesc.speed}</div>
          </div>
        </div>
        
        {/* FIX: Audit 3 - Progression et objectifs dans un accordéon */}
        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ 
            cursor: 'pointer', 
            color: '#aaa',
            fontSize: '0.9rem',
            padding: '0.5rem',
            userSelect: 'none'
          }}>
            📊 Progression et objectifs
          </summary>
          <div style={{ marginTop: '0.75rem' }}>
            <EndingProgress compact={isMobile} />
            <DailyObjectives />
          </div>
        </details>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.75rem' : '1rem' }}>
        <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <button
            onClick={handleOpenInventory}
            style={{
              fontSize: isMobile ? '1rem' : '1rem',
              padding: isMobile ? '1rem' : '1rem',
              minHeight: isMobile ? '48px' : '44px',
              flex: 1,
              minWidth: isMobile ? 'calc(50% - 0.25rem)' : 'auto'
            }}
          >
            INVENTAIRE
          </button>
          <button
            onClick={openMarche}
            style={{
              fontSize: isMobile ? '1rem' : '1rem',
              padding: isMobile ? '1rem' : '1rem',
              minHeight: isMobile ? '48px' : '44px',
              flex: 1,
              minWidth: isMobile ? 'calc(50% - 0.25rem)' : 'auto'
            }}
          >
            MARCHÉ
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <button
            onClick={openMorten}
            style={{
              fontSize: isMobile ? '1rem' : '1rem',
              padding: isMobile ? '1rem' : '1rem',
              minHeight: isMobile ? '48px' : '44px',
              flex: 1,
              minWidth: isMobile ? 'calc(50% - 0.25rem)' : 'auto'
            }}
          >
            USURIER
          </button>
          <button
            onClick={() => {
              playSound('ui_open')
              playHaptic('button_press')
              useGameStore.setState({ phase: 'forge' })
            }}
            style={{
              fontSize: isMobile ? '1rem' : '1rem',
              padding: isMobile ? '1rem' : '1rem',
              minHeight: isMobile ? '48px' : '44px',
              flex: 1,
              minWidth: isMobile ? 'calc(50% - 0.25rem)' : 'auto'
            }}
          >
            FORGE
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <button
            onClick={() => {
              playSound('ui_open')
              playHaptic('button_press')
              useGameStore.setState({ phase: 'taverne' })
            }}
            style={{
              fontSize: isMobile ? '1rem' : '1rem',
              padding: isMobile ? '1rem' : '1rem',
              minHeight: isMobile ? '48px' : '44px',
              flex: isMobile ? '1 1 100%' : 1,
              minWidth: isMobile ? '100%' : 'auto'
            }}
          >
            TAVERNE
          </button>
          <button
            onClick={openSettings}
            style={{
              fontSize: isMobile ? '0.9rem' : '1.1rem',
              padding: isMobile ? '0.875rem 1rem' : '0.75rem 1.5rem',
              minHeight: isMobile ? '48px' : '44px',
              background: '#2a2a2a',
              border: '2px solid #444',
              flex: isMobile ? '1 1 calc(50% - 0.25rem)' : 'none'
            }}
          >
            PARAMÈTRES
          </button>
          <button
            onClick={handleGoToExploration}
            disabled={isExplorationDisabled || isNavigating}
            style={{
              fontSize: isMobile ? '1rem' : '1.1rem',
              padding: isMobile ? '1rem' : '1rem',
              minHeight: isMobile ? '48px' : '44px',
              flex: isMobile ? '1 1 100%' : 2,
              opacity: (isExplorationDisabled || isNavigating) ? 0.6 : 1,
              cursor: (isExplorationDisabled || isNavigating) ? 'not-allowed' : 'pointer'
            }}
          >
            {isNavigating ? 'CHARGEMENT...' : 'PARTIR EN MISSION →'}
          </button>
        </div>
      </div>
      </div>
      
      {/* Modal de warning si stats trop faibles */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              padding: '1rem'
            }}
            onClick={() => setShowWarning(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#2a2a2a',
                padding: '2rem',
                borderRadius: '8px',
                border: '2px solid #c44',
                maxWidth: '400px',
                width: '100%'
              }}
            >
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#c44',
                textAlign: 'center'
              }}>
                ⚠️ ATTENTION
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#ccc',
                lineHeight: '1.6',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                Tes stats sont faibles (ATK: {playerStats.atk}). 
                <br /><br />
                Explorer sans équipement adéquat est très dangereux. 
                Tu risques de perdre au combat.
                <br /><br />
                <strong style={{ color: '#ca8' }}>Équipe-toi d'abord dans l'inventaire.</strong>
              </div>
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
              }}>
                <button
                  onClick={handleConfirmExploration}
                  style={{
                    fontSize: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: '#c44',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  CONTINUER QUAND MÊME
                </button>
                <button
                  onClick={() => setShowWarning(false)}
                  style={{
                    fontSize: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: '#555',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  ANNULER
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
