import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { saveRun } from '../features/meta/hallOfFame'
import { determineEnding } from '../features/endings/endings.logic'
import { useMetaProgressionStore } from '../store/metaProgression'
import { loadUnlockState, checkUnlocks, saveUnlockState } from '../features/meta/unlocks'
import EndingScreen from './EndingScreen'
import MetaProgressionDisplay from '../components/MetaProgressionDisplay'

export default function DefeatScreen() {
  const gameState = useGameStore()
  const { calculateRunXP } = useMetaProgressionStore()
  const [ending, setEnding] = useState<ReturnType<typeof determineEnding> | null>(null)
  const [xpGained, setXpGained] = useState<number | null>(null)
  const [showProgression, setShowProgression] = useState(false)
  
  useEffect(() => {
    // Déterminer la fin
    const determinedEnding = determineEnding(gameState)
    setEnding(determinedEnding)
    
    // Sauvegarder la run et vérifier les unlocks
    const saveAndCheckUnlocks = async () => {
      const { 
        day, 
        debt,
        gold, 
        reputation,
        inventory,
        combatsWon,
        combatsFled,
        combatsLost,
        narrativeCounters,
        triggeredEvents
      } = gameState
      
      const legendaryItems = inventory.filter(item => item.rarity === 'legendary').map(item => item.name)
      
      // Estimer les choix narratifs (nombre d'événements déclenchés)
      const narrativeChoicesCount = triggeredEvents.length
      
      // Calculer l'XP gagnée
      const xp = calculateRunXP(day, gold, narrativeChoicesCount)
      setXpGained(xp)
      setShowProgression(true)
      
      const runData = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        characterName: 'Soudard', // Placeholder
        origin: gameState.selectedOrigin || 'deserteur',
        daysLived: day,
        finalGold: gold,
        finalDebt: debt,
        finalReputation: reputation,
        endType: (determinedEnding.type === 'defeat' ? (determinedEnding.id === 'mort_combat' ? 'death' as const : 'debt' as const) : 'victory' as const),
        endTitle: determinedEnding.title,
        legendaryItems,
        combatsWon,
        combatsFled,
        combatsLost,
        totalGoldEarned: gold, // Simplifié pour l'instant
        counters: {
          cynisme: narrativeCounters.cynisme || 0,
          humanite: narrativeCounters.humanite || 0,
          pragmatisme: narrativeCounters.pragmatisme || 0
        }
      }
      
      await saveRun(runData)
      
      const currentUnlocks = await loadUnlockState()
      const newUnlocks = await checkUnlocks(runData, currentUnlocks)
      await saveUnlockState(newUnlocks)
    }
    
    saveAndCheckUnlocks()
  }, [])
  
  if (!ending) {
    return null // Loading
  }
  
  return (
    <>
      {/* Afficher l'XP immédiatement AVANT l'ending screen */}
      {showProgression && xpGained !== null && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#ca8'
          }}>
            Tu as survécu {gameState.day} jour{gameState.day > 1 ? 's' : ''}
          </div>
          <div style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            color: '#ddd'
          }}>
            Tu as gagné <span style={{ color: '#4a9eff', fontWeight: 'bold' }}>{xpGained} XP</span> !
          </div>
          <div style={{
            fontSize: '1rem',
            color: '#aaa',
            marginBottom: '2rem',
            fontStyle: 'italic',
            maxWidth: '400px'
          }}>
            Continue pour débloquer de nouveaux contenus et améliorer tes prochaines runs.
          </div>
          <MetaProgressionDisplay 
            xpGained={xpGained}
            onAnimationComplete={() => {
              // Après l'animation, afficher l'ending screen
              setTimeout(() => {
                setShowProgression(false)
              }, 1000)
            }}
          />
        </div>
      )}
      {!showProgression && <EndingScreen ending={ending} />}
    </>
  )
}
