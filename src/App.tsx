import { useGameStore } from './store/gameStore'
import StartScreen from './screens/StartScreen'
import AubeScreen from './screens/AubeScreen'
import ExplorationScreen from './screens/ExplorationScreen'
import CrepusculeScreen from './screens/CrepusculeScreen'
import DefeatScreen from './screens/DefeatScreen'
import VictoryScreen from './screens/VictoryScreen'
import InventoryScreen from './screens/InventoryScreen'
import MarcheScreen from './screens/MarcheScreen'
import MortenScreen from './screens/MortenScreen'
import ForgeScreen from './screens/ForgeScreen'
import TaverneScreen from './screens/TaverneScreen'
import EventScreen from './screens/EventScreen'
import OriginSelectScreen from './screens/OriginSelectScreen'
import HallOfFameScreen from './screens/HallOfFameScreen'
import TutorialScreen from './screens/TutorialScreen'
import SettingsScreen from './screens/SettingsScreen'
import { useMusicPhase } from './features/audio/useMusicPhase'
import PageTransition from './components/PageTransition'
import DebugPanel from './components/DebugPanel'
import { useIsMobile } from './hooks/useIsMobile'
import ContextualGuide from './components/ContextualGuide'
import WebContainer from './components/layout/WebContainer'

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
        </PageTransition>
      </div>
    </WebContainer>
  )
}

export default App
