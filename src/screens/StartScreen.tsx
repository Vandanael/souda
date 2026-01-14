import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { getSaveInfo, loadGameState } from '../features/game/saveSystem'
import NarrativeIntro from '../components/NarrativeIntro'
import { Button } from '../components/design/Button'
import { HUD } from '../components/design/HUD'
import { colors } from '../design/tokens'
import { getTypographyStyleByName } from '../design/typography'
import { useIsMobile } from '../hooks/useIsMobile'

export default function StartScreen() {
  const { setPhase, day, debt, gold, reputation } = useGameStore()
  const isMobile = useIsMobile()
  const [showIntro, setShowIntro] = useState(true)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)
  const [saveInfo, setSaveInfo] = useState<{ day: number; phase: string } | null>(null)
  const [loadingSave, setLoadingSave] = useState(true)
  
  // Vérifier si l'intro a déjà été vue (dans le localStorage)
  useEffect(() => {
    const seen = localStorage.getItem('souda_intro_seen')
    if (seen === 'true') {
      setShowIntro(false)
      setHasSeenIntro(true)
    }
  }, [])
  
  // Vérifier si une sauvegarde existe
  useEffect(() => {
    const checkSave = async () => {
      try {
        const info = await getSaveInfo()
        setSaveInfo(info)
      } catch (error) {
        console.warn('Erreur vérification save:', error)
      } finally {
        setLoadingSave(false)
      }
    }
    checkSave()
  }, [])
  
  const handleContinue = async () => {
    try {
      const savedState = await loadGameState()
      if (savedState) {
        // Restaurer l'état sauvegardé
        useGameStore.setState(savedState)
        // Aller à la phase sauvegardée
        setPhase(savedState.phase || 'aube')
      }
    } catch (error) {
      console.error('Erreur chargement save:', error)
    }
  }
  
  const handleIntroComplete = () => {
    localStorage.setItem('souda_intro_seen', 'true')
    setShowIntro(false)
    setHasSeenIntro(true)
  }
  
  const handleNewGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🔵 Bouton NOUVELLE PARTIE cliqué')
    console.log('🔵 setPhase disponible:', typeof setPhase)
    console.log('🔵 Phase actuelle:', useGameStore.getState().phase)
    
    try {
      console.log('🔵 Appel de setPhase("origin")...')
      setPhase('origin')
      console.log('✅ setPhase appelé, nouvelle phase:', useGameStore.getState().phase)
      
      // Vérifier après un court délai
      setTimeout(() => {
        const currentPhase = useGameStore.getState().phase
        console.log('🔵 Phase après 100ms:', currentPhase)
        if (currentPhase !== 'origin') {
          console.error('❌ La phase n\'a pas changé ! Phase actuelle:', currentPhase)
        }
      }, 100)
    } catch (error) {
      console.error('❌ Erreur lors du changement de phase:', error)
    }
  }

  // Afficher l'intro cinématique si elle n'a pas été vue
  if (showIntro && !hasSeenIntro) {
    return <NarrativeIntro onComplete={handleIntroComplete} />
  }
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%'
    }}>
      {/* HUD en haut (10-15%) */}
      {isMobile && (
        <HUD
          day={day}
          debt={debt}
          gold={gold}
          reputation={reputation}
        />
      )}
      
      {/* Contenu principal (portrait 45-55% sur mobile, centré sur desktop) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '1.5rem' : '2rem',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: isMobile ? '1.5rem 1rem' : '2rem',
        height: isMobile ? '50%' : 'auto',
        overflowY: 'auto',
        minHeight: 0
      }}>
        {/* Titre - Hiérarchie principale */}
        <div style={{
          ...getTypographyStyleByName('narrativeTitle'),
          fontSize: isMobile ? '2.5rem' : '3rem',
          color: colors.neutral.ivory,
          textShadow: `2px 2px 4px ${colors.neutral.charcoal}80`,
          marginBottom: isMobile ? '0.5rem' : '1rem',
          lineHeight: 1.2
        }}>
          SOUDA
        </div>
        
        {/* Citation narrative - Hiérarchie secondaire */}
        <div style={{
          ...getTypographyStyleByName('narrative'),
          fontSize: isMobile ? '1.1rem' : '1.25rem',
          color: colors.neutral.ivory,
          maxWidth: isMobile ? '100%' : '500px',
          padding: isMobile ? '0 0.5rem' : '0',
          lineHeight: 1.6,
          opacity: 0.9
        }}>
          "Bourg-Creux. Des murs. Un toit. Ça fera l'affaire. Pour l'instant."
        </div>
        
        {/* Bouton Continuer si sauvegarde existe */}
        {!loadingSave && saveInfo && (
          <Button
            variant="primary"
            size={isMobile ? 'md' : 'lg'}
            onClick={handleContinue}
            style={{
              minWidth: isMobile ? '100%' : '280px',
              maxWidth: isMobile ? '100%' : '280px',
              marginTop: isMobile ? '1rem' : '1.5rem'
            }}
          >
            CONTINUER (Jour {saveInfo.day})
          </Button>
        )}
      </div>
      
      {/* Actions en bas (30-35% sur mobile) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '0.75rem' : '1rem',
        width: '100%',
        maxWidth: isMobile ? '100%' : '300px',
        margin: isMobile ? 'auto 0 0 0' : '0 auto',
        padding: isMobile ? '1rem 1rem 1.5rem 1rem' : '0 0 2rem 0',
        height: isMobile ? '40%' : 'auto',
        justifyContent: isMobile ? 'flex-start' : 'center',
        alignItems: 'stretch',
        minHeight: 0
      }}>
        {/* Bouton principal - NOUVELLE PARTIE */}
        <Button
          variant="primary"
          size={isMobile ? 'lg' : 'lg'}
          onClick={handleNewGame}
          fullWidth
          style={{
            minHeight: isMobile ? '56px' : '52px'
          }}
        >
          NOUVELLE PARTIE
        </Button>
        
        {/* Boutons secondaires */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '0.5rem' : '0.75rem',
          marginTop: isMobile ? '0.5rem' : '0'
        }}>
          <Button
            variant="secondary"
            size={isMobile ? 'md' : 'md'}
            onClick={() => setPhase('hallOfFame')}
            fullWidth
          >
            Hall of Fame
          </Button>
          
          <Button
            variant="secondary"
            size={isMobile ? 'md' : 'md'}
            onClick={() => setPhase('fragmentCollection')}
            fullWidth
            style={{
              borderColor: colors.gold.tarnished,
              color: colors.gold.tarnished
            }}
          >
            Collection de Fragments
          </Button>
        </div>
      </div>
    </div>
  )
}
