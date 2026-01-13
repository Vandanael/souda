import { lazy, Suspense } from 'react'
import { useGameStore } from './store/gameStore'
import { useMusicPhase } from './features/audio/useMusicPhase'
import PageTransition from './components/PageTransition'
import DebugPanel from './components/DebugPanel'
import { useIsMobile } from './hooks/useIsMobile'
import ContextualGuide from './components/ContextualGuide'
import WebContainer from './components/layout/WebContainer'

// Écrans principaux (chargés immédiatement)
import StartScreen from './screens/StartScreen'
import AubeScreen from './screens/AubeScreen'
import ExplorationScreen from './screens/ExplorationScreen'
import CrepusculeScreen from './screens/CrepusculeScreen'

// Écrans chargés à la demande (lazy loading)
const DefeatScreen = lazy(() => import('./screens/DefeatScreen'))
const VictoryScreen = lazy(() => import('./screens/VictoryScreen'))
const InventoryScreen = lazy(() => import('./screens/InventoryScreen'))
const MarcheScreen = lazy(() => import('./screens/MarcheScreen'))
const MortenScreen = lazy(() => import('./screens/MortenScreen'))
const ForgeScreen = lazy(() => import('./screens/ForgeScreen'))
const TaverneScreen = lazy(() => import('./screens/TaverneScreen'))
const EventScreen = lazy(() => import('./screens/EventScreen'))
const OriginSelectScreen = lazy(() => import('./screens/OriginSelectScreen'))
const HallOfFameScreen = lazy(() => import('./screens/HallOfFameScreen'))
const TutorialScreen = lazy(() => import('./screens/TutorialScreen'))
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'))

// Composant de chargement minimal
const ScreenLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100%',
    fontSize: '0.9rem',
    color: '#999'
  }}>
    Chargement...
  </div>
)

function App() {
  const phase = useGameStore((state) => state.phase)
  const isMobile = useIsMobile()
  
  // Gérer la musique ambient selon la phase
  useMusicPhase()
  
  return (
    <WebContainer>
      <div style={{ 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        padding: isMobile ? '0.5rem' : '1rem',
        fontSize: isMobile ? '0.9rem' : '1rem',
        overflow: 'auto'
      }}>
        <DebugPanel />
        <ContextualGuide phase={phase} />
        <PageTransition phase={phase}>
          <Suspense fallback={<ScreenLoader />}>
            {phase === 'start' && <StartScreen />}
            {phase === 'tutorial' && <TutorialScreen />}
            {phase === 'aube' && <AubeScreen />}
            {phase === 'exploration' && <ExplorationScreen />}
            {phase === 'crepuscule' && <CrepusculeScreen />}
            {phase === 'defeat' && <DefeatScreen />}
            {phase === 'victory' && <VictoryScreen />}
            {phase === 'inventory' && <InventoryScreen />}
            {phase === 'marche' && <MarcheScreen />}
            {phase === 'morten' && <MortenScreen />}
            {phase === 'forge' && <ForgeScreen />}
            {phase === 'taverne' && <TaverneScreen />}
            {phase === 'narrative' && <EventScreen />}
            {phase === 'origin' && <OriginSelectScreen />}
            {phase === 'hallOfFame' && <HallOfFameScreen />}
            {phase === 'settings' && <SettingsScreen />}
          </Suspense>
        </PageTransition>
      </div>
    </WebContainer>
  )
}

export default App
