import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { selectMonologue } from '../features/narrative/monologueSelector'
import { selectEveningEvent } from '../features/events/eveningEvents'
import { EveningEvent } from '../types/eveningEvent'
import DayTransition from '../components/DayTransition'
import { useScreenShake } from '../hooks/useScreenShake'
import { BALANCE_CONFIG } from '../config/balance'
import { useIsMobile } from '../hooks/useIsMobile'

export default function CrepusculeScreen() {
  const { day, debt, endDay, narrativeCounters, recentMonologues, gold, reputation, inventory } = useGameStore()
  const isMobile = useIsMobile()
  const [eveningEvent, setEveningEvent] = useState<EveningEvent | null>(null)
  const [_selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [choiceResult, setChoiceResult] = useState<string | null>(null)
  const [debtAnimation, setDebtAnimation] = useState(false)
  const [monologue, setMonologue] = useState<string | null>(null)
  const [showTransition, setShowTransition] = useState(false)
  const { triggerShake } = useScreenShake()
  
  useEffect(() => {
    // Générer événement du soir avec le nouveau système
    const event = selectEveningEvent(day)
    setEveningEvent(event)
    setSelectedChoice(null)
    setChoiceResult(null)
    
    // Animation dette qui augmente + screen shake
    setDebtAnimation(true)
    triggerShake(2, 400) // Shake léger quand la dette augmente
    setTimeout(() => setDebtAnimation(false), 1000)
    
    // Générer monologue intérieur avec le sélecteur intelligent
    const selectedMonologue = selectMonologue(narrativeCounters, recentMonologues || [])
    setMonologue(selectedMonologue)
    
    // Ajouter le monologue à l'historique (géré dans le store)
    if (selectedMonologue) {
      useGameStore.setState({
        recentMonologues: [...(recentMonologues || []).slice(-4), selectedMonologue] // Garder max 5
      })
    }
  }, [day, narrativeCounters, recentMonologues, triggerShake])
  
  const handleChoice = (choiceIndex: number) => {
    if (!eveningEvent || !eveningEvent.choices) return
    
    const choice = eveningEvent.choices[choiceIndex]
    setSelectedChoice(choiceIndex)
    
    // Exécuter la conséquence
    choice.consequence()
    
    // Afficher le résultat
    setChoiceResult(choice.description || 'Tu as fait ton choix.')
  }
  
  // FIX: Audit 3 - Utiliser la valeur depuis BALANCE_CONFIG au lieu de hardcoder +5
  const interest = BALANCE_CONFIG.economy.dailyInterest
  const RENT_COST = 2
  // P2.1 - Calculer si le loyer peut être payé (or actuel >= 2)
  const couldPayRent = gold >= RENT_COST
  // Nouvelle dette = dette actuelle + intérêts + loyer (si non payé)
  const newDebt = debt + interest + (couldPayRent ? 0 : RENT_COST)
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      position: 'relative',
      padding: '1rem',
      width: '100%'
    }}>
      {/* Zone de Contenu Scrollable */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '100px', // Hauteur footer + marge
        WebkitOverflowScrolling: 'touch' // Smooth scroll iOS
      }}>
        <div style={{
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#fff'
        }}>
          CRÉPUSCULE — JOUR {day}/20
        </div>
        
        <div style={{
          background: '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '2px solid #555'
        }}>
          <div style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            RÉSUMÉ DU JOUR
          </div>
          
          {/* Résumé activités (simplifié pour l'instant) */}
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#aaa'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              • 3 lieux explorés
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              • {Math.floor(Math.random() * 3)} items trouvés
            </div>
            <div>
              • {Math.floor(Math.random() * 2)} combats
            </div>
          </div>
          
          {/* Dette avec animation */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#1a1a1a',
            borderRadius: '4px'
          }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>
              Dette actuelle : <span style={{ color: '#c44' }}>{debt}💰</span>
            </div>
            
            {/* P2.1 - Feedback visuel paiement loyer */}
            <div style={{
              marginBottom: '0.75rem',
              padding: '0.5rem',
              background: couldPayRent ? '#1a2a1a' : '#2a1a1a',
              borderRadius: '4px',
              fontSize: '0.85rem',
              color: couldPayRent ? '#4a8' : '#c84',
              border: `1px solid ${couldPayRent ? '#4a8' : '#c84'}`
            }}>
              {couldPayRent ? (
                <>✓ Logement payé : -{RENT_COST}💰</>
              ) : (
                <>⚠ Logement ajouté à la dette : +{RENT_COST}💰</>
              )}
            </div>
            
            <motion.div
              animate={debtAnimation ? { scale: [1, 1.1, 1], color: ['#c44', '#f44', '#c44'] } : {}}
              transition={{ duration: 0.5 }}
              style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
            >
              Nouvelle dette : <span style={{ color: '#c44' }}>{newDebt}💰</span>
              <span style={{ color: '#888', fontSize: '0.9rem', marginLeft: '0.5rem', fontWeight: 'normal' }}>
                (+{interest} intérêts{!couldPayRent ? ` + ${RENT_COST} logement` : ''})
              </span>
            </motion.div>
          </div>
          
          {/* Événement du soir */}
          {eveningEvent && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#2a1a1a',
              borderRadius: '4px',
              border: '1px solid #555'
            }}>
              <div style={{
                fontSize: '0.9rem',
                color: '#ca8',
                fontStyle: 'italic',
                lineHeight: '1.6',
                marginBottom: eveningEvent.type === 'interactive' ? '1rem' : '0'
              }}>
                {eveningEvent.text}
              </div>
              
              {/* Résultat du choix (dans le contenu scrollable) */}
              {choiceResult && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: '#1a1a1a',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  color: '#ca8',
                  fontStyle: 'italic'
                }}>
                  {choiceResult}
                </div>
              )}
            </div>
          )}
          
          {/* Monologue intérieur */}
          {monologue && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#1a1a2a',
              borderRadius: '4px',
              border: '1px solid #444',
              fontSize: '0.9rem',
              color: '#888',
              fontStyle: 'italic',
              lineHeight: '1.6'
            }}>
              {monologue}
            </div>
          )}
          
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#aaa',
            fontStyle: 'italic'
          }}>
            "La nuit tombe. Demain, tu recommences."
          </div>
        </div>
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
        {/* Choix interactifs (dans le footer si interactif) */}
        {eveningEvent && eveningEvent.type === 'interactive' && eveningEvent.choices && !choiceResult && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            {eveningEvent.choices.map((choice, index) => {
              // Vérifier les requirements (simplifié)
              const canAfford = !choice.text.includes('15💰') || gold >= 15
              const canAfford10 = !choice.text.includes('10💰') || gold >= 10
              const hasReputation = !choice.text.includes('⭐⭐⭐') || reputation >= 3
              const hasSpace = !choice.text.includes('équipement') || inventory.length < 10
              const isAvailable = canAfford && canAfford10 && hasReputation && hasSpace
              
              return (
                <button
                  key={index}
                  onClick={() => handleChoice(index)}
                  disabled={!isAvailable}
                  style={{
                    padding: isMobile ? '1rem' : '0.875rem',
                    fontSize: isMobile ? '1rem' : '0.95rem',
                    minHeight: isMobile ? '48px' : '44px',
                    textAlign: 'left',
                    background: isAvailable ? '#1a1a1a' : '#0a0a0a',
                    border: `1px solid ${isAvailable ? '#555' : '#333'}`,
                    borderRadius: '4px',
                    color: isAvailable ? '#ccc' : '#666',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    opacity: isAvailable ? 1 : 0.5,
                    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {choice.text}
                </button>
              )
            })}
          </div>
        )}
        
        {/* Bouton principal */}
        <button
          onClick={() => {
            if (day >= 20) {
              endDay()
            } else {
              // Afficher la transition avant de passer au jour suivant
              setShowTransition(true)
            }
          }}
          style={{
            fontSize: '1.1rem',
            padding: '1rem',
            width: '100%',
            background: '#2a2a2a',
            border: '1px solid #555',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          {day >= 20 ? 'TERMINER' : `DORMIR → JOUR ${day + 1}`}
        </button>
      </div>
      
      {/* Transition de jour */}
      {showTransition && (
        <DayTransition
          currentDay={day}
          nextDay={day + 1}
          onComplete={() => {
            setShowTransition(false)
            endDay()
          }}
        />
      )}
    </div>
  )
}
