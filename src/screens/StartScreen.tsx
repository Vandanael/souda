import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { getSaveInfo, loadGameState } from '../features/game/saveSystem'
import NarrativeIntro from '../components/NarrativeIntro'

export default function StartScreen() {
  const setPhase = useGameStore((state) => state.setPhase)
  const [showIntro, setShowIntro] = useState(true)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)
  const [saveInfo, setSaveInfo] = useState<{ day: number; phase: string } | null>(null)
  const [loadingSave, setLoadingSave] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  
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
      gap: '2rem',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#fff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        SOUDA
      </div>
      
      <div style={{
        fontSize: '1.1rem',
        color: '#ccc',
        fontStyle: 'italic',
        marginBottom: '2rem',
        maxWidth: '400px',
        lineHeight: '1.6'
      }}>
        "Bourg-Creux. Des murs. Un toit. Ça fera l'affaire. Pour l'instant."
      </div>
      
      <div style={{
        background: '#2a2a2a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '2px solid #555',
        marginBottom: '2rem',
        maxWidth: '400px'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
          Règles du jeu
        </div>
        <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6', textAlign: 'left' }}>
          <strong style={{ color: '#ca8' }}>Exploration :</strong> Pille les ruines, trouve de l'or et des équipements<br />
          <strong style={{ color: '#ca8' }}>Combat :</strong> Perdre un combat signifie la mort définitive<br />
          <strong style={{ color: '#ca8' }}>Dette :</strong> Rembourse Morten avant le 20ème jour<br />
          <strong style={{ color: '#ca8' }}>Progression :</strong> Même en perdant, tu gagnes de l'XP pour débloquer de nouveaux contenus
        </div>
      </div>
      
      {!loadingSave && saveInfo && (
        <button
          onClick={handleContinue}
          type="button"
          style={{
            fontSize: '1.3rem',
            padding: '1.2rem 2.5rem',
            minWidth: '250px',
            background: '#3a5a3a',
            border: '2px solid #5a7a5a',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 10,
            marginBottom: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#4a6a4a'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#3a5a3a'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          CONTINUER (Jour {saveInfo.day})
        </button>
      )}
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '250px'
      }}>
        <button
          onClick={handleNewGame}
          type="button"
          style={{
            fontSize: '1.3rem',
            padding: '1.2rem 2.5rem',
            width: '100%',
            background: '#555',
            border: '2px solid #777',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            color: '#fff',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#666'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#555'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          NOUVELLE PARTIE
        </button>
        
        <button
          onClick={() => setShowHelp(true)}
          type="button"
          style={{
            fontSize: '1rem',
            padding: '0.8rem 1.5rem',
            width: '100%',
            background: 'transparent',
            border: '1px solid #666',
            cursor: 'pointer',
            color: '#aaa',
            fontWeight: 'normal',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#888'
            e.currentTarget.style.color = '#ccc'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#666'
            e.currentTarget.style.color = '#aaa'
          }}
        >
          ❓ Comment jouer
        </button>
      </div>
      
      {/* Modal d'aide */}
      {showHelp && (
        <div
          onClick={() => setShowHelp(false)}
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
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#2a2a2a',
              border: '2px solid #555',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#fff',
              textAlign: 'center'
            }}>
              COMMENT JOUER
            </div>
            
            <div style={{
              fontSize: '1rem',
              lineHeight: '1.8',
              color: '#ddd',
              marginBottom: '1.5rem'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#ca8' }}>Le défi :</strong> Tu dois rembourser ta dette à Morten avant le 20ème jour. Chaque jour, les intérêts augmentent de 5💰.
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#ca8' }}>Chaque jour à Bourg-Creux :</strong>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  <li><strong>Aube :</strong> Équipe-toi, vends tes trouvailles au Marché aux Charognes, mange à la Taverne du Pendu</li>
                  <li><strong>Journée :</strong> Explore 5 lieux avec 3 actions (ruines, champs de bataille, monastères pillés...)</li>
                  <li><strong>Crépuscule :</strong> Les intérêts de la dette s'ajoutent. Rembourse Morten si tu peux.</li>
                </ul>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#ca8' }}>Le danger :</strong> Perdre un combat signifie la mort définitive. Équipe-toi bien avant d'explorer les lieux risqués.
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#ca8' }}>La progression :</strong> Même en perdant, chaque run te rapporte de l'XP méta pour débloquer de nouvelles origines, équipements et événements.
              </div>
            </div>
            
            <button
              onClick={() => setShowHelp(false)}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: '#555',
                border: '2px solid #777',
                color: '#fff',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#666'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#555'
              }}
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
