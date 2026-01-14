import { useGameStore } from '../store/gameStore'
import CombatScreen from '../features/combat/CombatScreen'
import LootRevealScreen from './LootRevealScreen'
import MapScreen from './MapScreen'
import { Panel } from '../components/design/Panel'
import { Button } from '../components/design/Button'
import { colors } from '../design/tokens'
import { getTypographyStyleByName } from '../design/typography'

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
          relicFragmentId={eventResult.relicFragmentId}
          relicFragmentAmount={eventResult.relicFragmentAmount}
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}>
        <Panel level="L1" style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ 
            ...getTypographyStyleByName('uiLarge'),
            fontSize: '1.3rem', 
            marginBottom: '1rem' 
          }}>
            💰
          </div>
          <div style={{ 
            ...getTypographyStyleByName('ui'),
            fontSize: '1.1rem', 
            marginBottom: '1rem', 
            color: colors.neutral.ivory 
          }}>
            {eventResult.message}
          </div>
          {eventResult.gold && (
            <div style={{ 
              color: colors.gold.tarnished, 
              fontSize: '1.2rem', 
              marginTop: '1rem',
              fontWeight: 600
            }}>
              +{eventResult.gold}💰
            </div>
          )}
        </Panel>
        
        <Button onClick={finishEvent}>
          CONTINUER
        </Button>
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
        alignItems: 'center',
        padding: '1rem'
      }}>
        <div style={{ 
          ...getTypographyStyleByName('ui'),
          color: colors.neutral.ivory 
        }}>
          Chargement des lieux...
        </div>
        <Button onClick={() => useGameStore.getState().goToExploration()}>
          GÉNÉRER LES LIEUX
        </Button>
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
