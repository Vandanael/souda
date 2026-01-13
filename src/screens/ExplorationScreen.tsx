import { useGameStore } from '../store/gameStore'
import CombatScreen from '../features/combat/CombatScreen'
import LootRevealScreen from './LootRevealScreen'
import MapScreen from './MapScreen'

export default function ExplorationScreen() {
  const { 
    currentEvent, 
    eventResult,
    combatResult,
    lootedItem,
    currentEnemy,
    playerStats,
    dailyLocations,
    exploreLocation,
    finishEvent,
    endDay
  } = useGameStore()
  
  // Si un combat est en cours, afficher l'écran de combat avec animations
  if (currentEvent === 'combat' && currentEnemy && combatResult) {
    return (
      <CombatScreen
        enemy={currentEnemy}
        playerStats={playerStats}
        onCombatEnd={() => {
          // Le résultat est déjà dans le store, on continue
          finishEvent()
        }}
      />
    )
  }
  
  // Si un événement loot est en cours, afficher le résultat
  if (currentEvent === 'loot' && eventResult) {
    // Si c'est un item, afficher le LootReveal
    if (lootedItem) {
      return (
        <LootRevealScreen
          item={lootedItem}
          gold={eventResult.gold}
          onContinue={finishEvent}
        />
      )
    }
    
    // Sinon, c'est juste de l'or
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        flex: 1,
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#2a2a2a',
          padding: '2rem',
          borderRadius: '8px',
          border: '2px solid #555',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
            💰
          </div>
          <div style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#ccc' }}>
            {eventResult.message}
          </div>
          {eventResult.gold && (
            <div style={{ color: '#ddd', fontSize: '1.2rem', marginTop: '1rem' }}>
              +{eventResult.gold}💰
            </div>
          )}
        </div>
        
        <button onClick={finishEvent}>
          CONTINUER
        </button>
      </div>
    )
  }
  
  // Écran d'exploration normal - afficher la carte
  if (dailyLocations.length === 0) {
    // Si pas de lieux, générer (ne devrait pas arriver)
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div>Chargement des lieux...</div>
        <button onClick={() => useGameStore.getState().goToExploration()}>
          GÉNÉRER LES LIEUX
        </button>
      </div>
    )
  }
  
  return (
    <MapScreen
      locations={dailyLocations}
      onExplore={exploreLocation}
      onEndDay={endDay}
    />
  )
}
