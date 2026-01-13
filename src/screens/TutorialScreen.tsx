import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import Tutorial from '../features/tutorial/Tutorial'
import InventoryScreen from './InventoryScreen'
import MapScreen from './MapScreen'
import { generateDailyLocations } from '../features/exploration'
import { highlightElement, createOverlay, cleanupTutorial } from '../features/tutorial/tutorialManager'
import { saveTutorialState } from '../features/tutorial/tutorialPersistence'

export default function TutorialScreen() {
  const { setPhase, dailyLocations, equipment, currentEvent } = useGameStore()
  // Commencer directement à l'étape 2 (inventaire) car l'intro est maintenant dans NarrativeIntro
  const [tutorialStep, setTutorialStep] = useState<0 | 1 | 2 | 3>(2)
  
  // Initialiser l'état du tutorial
  useEffect(() => {
    // Pour l'étape 2 (équipement), on doit être sur l'écran inventaire
    if (tutorialStep === 2) {
      setPhase('inventory')
      // Attendre que l'inventaire soit rendu
      setTimeout(() => {
        highlightElement('[data-tutorial-inventory]')
        createOverlay(['[data-tutorial-inventory]', '[data-tutorial-equip-button]'])
      }, 500)
    }
    // Pour l'étape 3 (exploration), on doit être sur l'écran exploration
    else if (tutorialStep === 3) {
      if (dailyLocations.length === 0) {
        const locations = generateDailyLocations(1)
        useGameStore.setState({ dailyLocations: locations, phase: 'exploration', actionsRemaining: 3 })
      } else {
        setPhase('exploration')
      }
      // Attendre que la carte soit rendue
      setTimeout(() => {
        highlightElement('[data-tutorial-location="true"]')
        createOverlay(['[data-tutorial-location="true"]', '[data-tutorial-explore-button="true"]'])
      }, 500)
    }
  }, [tutorialStep, setPhase, dailyLocations.length])
  
  // Vérifier si une arme est équipée (étape 2 → 3)
  useEffect(() => {
    if (tutorialStep === 2 && equipment.weapon) {
      cleanupTutorial()
      setTimeout(() => {
        setTutorialStep(3)
      }, 2000)
    }
  }, [tutorialStep, equipment.weapon])
  
  // Vérifier si une exploration a été effectuée (étape 3 → fin)
  useEffect(() => {
    if (tutorialStep === 3 && (currentEvent === 'loot' || currentEvent === 'combat')) {
      cleanupTutorial()
      setTimeout(() => {
        handleTutorialComplete()
      }, 2000)
    }
  }, [tutorialStep, currentEvent])
  
  const handleTutorialComplete = async () => {
    cleanupTutorial()
    // Sauvegarder dans IndexedDB que le tutorial est complété
    await saveTutorialState(true)
    setPhase('aube')
  }
  
  const handleTutorialSkip = async () => {
    // Ne pas permettre le skip pour les étapes 0-1 (obligatoires)
    if (tutorialStep < 2) {
      return
    }
    cleanupTutorial()
    // Sauvegarder dans IndexedDB que le tutorial est complété
    await saveTutorialState(true)
    setPhase('aube')
  }
  
  // L'intro narrative est maintenant dans NarrativeIntro (StartScreen)
  // Le tutorial commence directement à l'étape 2 (inventaire)
  
  // Étape 2 : Inventaire avec overlay tutorial (skip possible)
  if (tutorialStep === 2) {
    return (
      <>
        <InventoryScreen />
        <Tutorial
          onSkip={handleTutorialSkip}
        />
      </>
    )
  }
  
  // Étape 3 : Exploration avec overlay tutorial (skip possible)
  if (tutorialStep === 3) {
    return (
      <>
        <MapScreen
          locations={dailyLocations}
          onExplore={(location) => {
            useGameStore.getState().exploreLocation(location)
          }}
          onEndDay={() => {}}
        />
        <Tutorial
          onSkip={handleTutorialSkip}
        />
      </>
    )
  }
  
  return null
}
