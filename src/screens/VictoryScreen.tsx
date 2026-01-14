import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { saveRun } from '../features/meta/hallOfFame'
import { determineEnding } from '../features/endings/endings.logic'
import { useMetaProgressionStore } from '../store/metaProgression'
import { loadUnlockState, checkUnlocks, saveUnlockState } from '../features/meta/unlocks'
import EndingScreen from './EndingScreen'

export default function VictoryScreen() {
  const gameState = useGameStore()
  const { calculateRunXP } = useMetaProgressionStore()
  const [ending, setEnding] = useState<ReturnType<typeof determineEnding> | null>(null)
  const [xpGained, setXpGained] = useState<number | null>(null)
  
  useEffect(() => {
    // Déterminer la fin
    const determinedEnding = determineEnding(gameState)
    setEnding(determinedEnding)
    
    // Sauvegarder la run et vérifier les unlocks
    const saveAndCheckUnlocks = async () => {
      const { 
        day, 
        gold, 
        reputation,
        inventory,
        combatsWon,
        combatsFled,
        combatsLost,
        narrativeCounters,
        triggeredEvents,
        relicFragments,
        relics
      } = gameState
      
      const legendaryItems = inventory.filter(item => item.rarity === 'legendary').map(item => item.name)
      
      // Estimer les choix narratifs (nombre d'événements déclenchés)
      const narrativeChoicesCount = triggeredEvents.length
      
      // Calculer l'XP gagnée
      const xp = calculateRunXP(day, gold, narrativeChoicesCount)
      setXpGained(xp)
      
      const runData = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        characterName: 'Soudard', // Placeholder
        origin: gameState.selectedOrigin || 'deserteur',
        daysLived: day,
        finalGold: gold,
        finalDebt: 0, // Victory means debt is 0
        finalReputation: reputation,
        endType: 'victory' as const,
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
        },
        relicFragments: relicFragments,
        relicsCount: relics.length
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
    <EndingScreen ending={ending} xpGained={xpGained ?? undefined} />
  )
}
