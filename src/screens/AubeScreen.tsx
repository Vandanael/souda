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
import { Button } from '../components/design/Button'
import { Panel } from '../components/design/Panel'
import { IconButton } from '../components/design/IconButton'
import { colors } from '../design/tokens'
import { getTypographyStyleByName } from '../design/typography'

export default function AubeScreen() {
  const { playerStats, equipment, goToExploration, openInventory, setPhase } = useGameStore()
  const { playSound, playHaptic } = useAudio()
  const isMobile = useIsMobile()
  const [isNavigating, setIsNavigating] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  
  const openMarche = () => {
    playSound('ui_open')
    playHaptic('button_press')
    setPhase('marche')
  }
  
  const openMorten = () => {
    playSound('ui_open')
    playHaptic('button_press')
    setPhase('morten')
  }
  
  const handleOpenInventory = () => {
    playSound('ui_open')
    playHaptic('button_press')
    openInventory()
  }

  const openForge = () => {
    playSound('ui_open')
    playHaptic('button_press')
    setPhase('forge')
  }

  const openTaverne = () => {
    playSound('ui_open')
    playHaptic('button_press')
    setPhase('taverne')
  }
  
  const openReliques = () => {
    playSound('ui_open')
    playHaptic('button_press')
    setPhase('reliques')
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
        gap: isMobile ? '1rem' : '1.5rem',
        flex: 1,
        padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem',
        paddingTop: isMobile ? '0.25rem' : '0.5rem',
        paddingBottom: isMobile ? '1rem' : '1rem',
        overflowY: 'auto',
        justifyContent: 'center'
      }}>
        {/* Titre discret */}
        <div style={{
          textAlign: 'center',
          ...getTypographyStyleByName('uiBold'),
          fontSize: isMobile ? '1rem' : '1.1rem',
          color: colors.neutral.ash,
          opacity: 0.7,
          marginBottom: isMobile ? '0.25rem' : '0.5rem'
        }}>
          AUBE
        </div>
        
        {/* Texte narratif - priorité visuelle */}
        <div style={{
          ...getTypographyStyleByName('narrative'),
          fontSize: isMobile ? '1rem' : '1.1rem',
          color: colors.neutral.ivory,
          marginBottom: isMobile ? '0.75rem' : '1rem',
          padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem',
          background: colors.neutral.ink,
          borderRadius: '4px',
          fontStyle: 'italic'
        }}>
          "Bourg-Creux. Des murs. Un toit. Ça fera l'affaire. Pour l'instant."
        </div>
      
      <Panel level="L1" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
        {/* Personnage + Stats */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '0.75rem' : '1rem',
          alignItems: 'center',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          marginBottom: '1rem'
        }}>
          <CharacterCanvas equipment={equipment} size={isMobile ? 80 : 96} />
          
          <Panel level="L2" style={{
            padding: isMobile ? '0.75rem' : '1rem',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            color: colors.neutral.ivory,
            lineHeight: '1.6',
            flex: 1,
            minWidth: isMobile ? '100%' : 'auto'
          }}>
            <div style={{ marginBottom: '0.3rem' }}>{statsDesc.attack}</div>
            <div style={{ marginBottom: '0.3rem' }}>{statsDesc.defense}</div>
            <div>{statsDesc.speed}</div>
          </Panel>
        </div>
        
        {/* FIX: Audit 3 - Progression et objectifs dans un accordéon */}
        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ 
            cursor: 'pointer', 
            color: colors.neutral.ash,
            fontSize: '0.9rem',
            padding: '0.5rem',
            userSelect: 'none'
          }}>
            Progression et objectifs
          </summary>
          <div style={{ marginTop: '0.75rem' }}>
            <EndingProgress compact={isMobile} />
            <DailyObjectives />
          </div>
        </details>
      </Panel>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.75rem' : '1rem' }}>
        {isMobile ? (
          // Version mobile : icônes des boutons secondaires + bouton principal
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <IconButton
                icon="inventory"
                onClick={handleOpenInventory}
              />
              <IconButton
                icon="market"
                onClick={openMarche}
              />
              <IconButton
                icon="key"
                onClick={openMorten}
              />
              <IconButton
                icon="forge"
                onClick={openForge}
              />
              <IconButton
                icon="tavern"
                onClick={openTaverne}
              />
              <IconButton
                icon="relics"
                onClick={openReliques}
                style={{
                  border: `2px solid ${colors.gold.tarnished}40`,
                  color: colors.gold.tarnished
                }}
              />
            </div>
            <Button
              variant="pillage"
              size="lg"
              fullWidth
              onClick={handleGoToExploration}
              disabled={isExplorationDisabled || isNavigating}
              style={{
                width: isMobile ? '92%' : '100%',
                margin: '0 auto',
                minHeight: isMobile ? '56px' : '60px',
              }}
            >
              {isNavigating ? 'CHARGEMENT...' : 'ALLER PILLER →'}
            </Button>
          </>
        ) : (
          // Version desktop : tous les boutons visibles
          <>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
              <Button onClick={handleOpenInventory} style={{ flex: 1 }}>
                INVENTAIRE
              </Button>
              <Button onClick={openMarche} style={{ flex: 1 }}>
                MARCHÉ
              </Button>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
              <Button onClick={openMorten} style={{ flex: 1 }}>
                USURIER
              </Button>
              <Button onClick={openForge} style={{ flex: 1 }}>
                FORGE
              </Button>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
              <Button onClick={openTaverne} style={{ flex: 1 }}>
                TAVERNE
              </Button>
              <Button
                variant="pillage"
                onClick={handleGoToExploration}
                disabled={isExplorationDisabled || isNavigating}
                style={{ flex: 2 }}
              >
                {isNavigating ? 'CHARGEMENT...' : 'ALLER PILLER →'}
              </Button>
            </div>
          </>
        )}
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
                background: colors.neutral.slate,
                padding: '2rem',
                borderRadius: '8px',
                border: `2px solid ${colors.blood.carmine}`,
                maxWidth: '400px',
                width: '100%'
              }}
            >
              <div style={{
                ...getTypographyStyleByName('uiLarge'),
                fontSize: '1.3rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: colors.blood.carmine,
                textAlign: 'center'
              }}>
                ⚠️ ATTENTION
              </div>
              <div style={{
                ...getTypographyStyleByName('ui'),
                fontSize: '1rem',
                color: colors.neutral.ivory,
                lineHeight: '1.6',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                Tes stats sont faibles (ATK: {playerStats.atk}). 
                <br /><br />
                Explorer sans équipement adéquat est très dangereux. 
                Tu risques de perdre au combat.
                <br /><br />
                <strong style={{ color: colors.gold.tarnished }}>Équipe-toi d'abord dans l'inventaire.</strong>
              </div>
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
              }}>
                <Button
                  variant="danger"
                  onClick={handleConfirmExploration}
                >
                  CONTINUER QUAND MÊME
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowWarning(false)}
                >
                  ANNULER
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
