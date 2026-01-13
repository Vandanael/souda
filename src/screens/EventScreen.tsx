import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { EventChoice } from '../types/event'
import { EVENT_POOL } from '../features/events/eventPool'
import { isChoiceAvailable } from '../features/events/eventResolver'
import { useIsMobile } from '../hooks/useIsMobile'
import { ScreenShakeWrapper } from '../hooks/useScreenShake'

export default function EventScreen() {
  const {
    eventResult,
    applyEventConsequence,
    finishEvent
  } = useGameStore()
  const isMobile = useIsMobile()
  
  const [selectedChoice, setSelectedChoice] = useState<EventChoice | null>(null)
  const [consequenceShown, setConsequenceShown] = useState(false)
  const [shouldShake, setShouldShake] = useState(false)
  
  // Trouver l'événement
  const eventId = eventResult?.eventId
  const event = EVENT_POOL.find(e => e.id === eventId)
  
  if (!event) {
    console.error('Événement non trouvé:', {
      eventId,
      availableIds: EVENT_POOL.map(e => e.id),
      eventResult
    })
    
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ccc' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#c44' }}>
          Événement non trouvé
        </div>
        <div style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#888' }}>
          ID: {eventId || 'undefined'}
        </div>
        <button 
          onClick={finishEvent}
          style={{ 
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: '#2a2a2a',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#ccc',
            cursor: 'pointer'
          }}
        >
          RETOUR
        </button>
      </div>
    )
  }
  
  const handleChoice = (choice: EventChoice) => {
    setSelectedChoice(choice)
    setConsequenceShown(true)
    
    // Appliquer les conséquences
    applyEventConsequence(choice.consequences)
    
    // Déclencher shake si choix critique (dette, dégâts, ou conséquences importantes)
    const isCritical = choice.consequences.debt || 
                      choice.consequences.durabilityLoss || 
                      (choice.consequences.gold && choice.consequences.gold < -10)
    if (isCritical) {
      setShouldShake(true)
      setTimeout(() => setShouldShake(false), 500)
    }
    
    // L'événement est déjà marqué comme déclenché dans le store lors du déclenchement
    // (géré par eventManager.markEventTriggered)
  }
  
  const handleContinue = () => {
    setSelectedChoice(null)
    setConsequenceShown(false)
    finishEvent()
  }
  
  return (
    <ScreenShakeWrapper intensity={3} duration={400} trigger={shouldShake}>
      {/* Conteneur Principal - SafeAreaView */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        position: 'relative',
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Zone de Contenu Scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: '140px', // Hauteur footer + marge
          WebkitOverflowScrolling: 'touch' // Smooth scroll iOS
        }}>
          {/* Titre */}
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#fff'
          }}>
            {event.title}
          </div>
          
          {/* Description */}
          <div style={{
            background: '#2a2a2a',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #555',
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#ccc',
            marginBottom: '1.5rem'
          }}>
            {event.description}
          </div>
          
          {/* Conséquence narrative */}
          {consequenceShown && selectedChoice && (
            <div style={{
              background: '#2a1a1a',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #555',
              fontSize: isMobile ? '1rem' : '0.95rem',
              lineHeight: '1.6',
              color: '#ca8',
              fontStyle: 'italic',
              marginBottom: '1.5rem'
            }}>
              {selectedChoice.consequences.narrative || 'Tu as fait ton choix.'}
            </div>
          )}
        </div>
        
        {/* Footer Sticky - Zone d'Actions */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '1rem',
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 70%, transparent 100%)',
          borderTop: '1px solid #333'
        }}>
          {/* Choix */}
          {!consequenceShown && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {event.choices.map((choice) => {
                const available = isChoiceAvailable(choice, useGameStore.getState())
                
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice)}
                    disabled={!available}
                    style={{
                      padding: isMobile ? '1rem' : '1rem',
                      fontSize: isMobile ? '1rem' : '1rem',
                      minHeight: isMobile ? '48px' : '44px',
                      textAlign: 'left',
                      background: available ? '#1a1a1a' : '#0a0a0a',
                      border: `1px solid ${available ? '#555' : '#333'}`,
                      borderRadius: '4px',
                      color: available ? '#ddd' : '#999',
                      cursor: available ? 'pointer' : 'not-allowed',
                      opacity: available ? 1 : 0.5,
                      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {choice.text}
                    {!available && choice.requirements && (
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#888',
                        marginTop: '0.25rem'
                      }}>
                        {choice.requirements.gold && `(Besoin: ${choice.requirements.gold}💰)`}
                        {choice.requirements.reputation && `(Besoin: ${choice.requirements.reputation}⭐)`}
                        {choice.requirements.item && `(Besoin: ${choice.requirements.item})`}
                        {choice.requirements.humanite && `(Besoin: Humanité ${choice.requirements.humanite}+)`}
                        {choice.requirements.cynisme && `(Besoin: Cynisme ${choice.requirements.cynisme}+)`}
                        {choice.requirements.pragmatisme && `(Besoin: Pragmatisme ${choice.requirements.pragmatisme}+)`}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
          
          {/* Bouton continuer */}
          {consequenceShown && (
            <button
              onClick={handleContinue}
              style={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                padding: isMobile ? '1rem' : '1rem',
                minHeight: isMobile ? '48px' : '44px',
                width: '100%',
                background: '#2a2a2a',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              CONTINUER
            </button>
          )}
        </div>
      </div>
    </ScreenShakeWrapper>
  )
}
