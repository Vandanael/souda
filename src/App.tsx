import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { STORAGE_KEYS } from './constants';
import {
  WorldMap,
  StatusBar,
  Backpack,
  LootPopup,
  CombatScreen,
  HubScreen,
  GameOverScreen,
  EventScreen,
  TutorialScreen,
} from './features';

function App() {
  const screen = useGameStore(state => state.screen);
  const resetGame = useGameStore(state => state.resetGame);
  const currentLoot = useGameStore(state => state.currentLoot);
  const currentEvent = useGameStore(state => state.currentEvent);
  const world = useGameStore(state => state.world);
  const setScreen = useGameStore(state => state.setScreen);
  
  const [showTutorial, setShowTutorial] = useState(false);
  
  useEffect(() => {
    const tutorialDone = localStorage.getItem(STORAGE_KEYS.TUTORIAL_DONE);
    if (!tutorialDone) {
      setShowTutorial(true);
    }
  }, []);
  
  const handleTutorialComplete = () => {
    localStorage.setItem(STORAGE_KEYS.TUTORIAL_DONE, 'true');
    setShowTutorial(false);
  };
  
  if (showTutorial) {
    return <TutorialScreen onComplete={handleTutorialComplete} />;
  }

  // Vérifier si on est sur le hub
  const currentTile = world.tiles.get(`${world.playerPosition.x},${world.playerPosition.y}`);
  const isOnHub = currentTile?.type === 'hub';

  return (
    <div className="h-screen-safe flex flex-col" style={{ background: 'var(--bg-dark)' }}>
      {/* === HEADER COMPACT === */}
      <header className="safe-top px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: '#2a2a2a' }}>
        <div>
          <h1 className="text-lg font-bold tracking-wide" style={{ color: 'var(--copper)' }}>
            SOUDA
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            Jour {world.time.day}, {world.time.hour}h
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Recommencer une nouvelle partie ?')) {
              resetGame();
            }
          }}
          className="text-xs px-3 py-1.5 rounded"
          style={{ 
            background: 'var(--bg-surface)', 
            color: 'var(--text-muted)',
            border: '1px solid #2a2a2a'
          }}
        >
          Reset
        </button>
      </header>

      {/* === STATUS BAR === */}
      {screen === 'map' && (
        <div className="px-4 py-3">
          <StatusBar />
        </div>
      )}

      {/* === MAIN CONTENT === */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {screen === 'map' && (
          <>
            {/* Map centrée */}
            <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-hidden">
              <WorldMap />
            </div>
            
            {/* Inventaire horizontal en bas */}
            <div className="px-4 pb-2">
              <Backpack />
            </div>
          </>
        )}
      </main>

      {/* === ZONE DU POUCE (BOUTONS ACTION) === */}
      {screen === 'map' && !currentLoot && !currentEvent && (
        <div 
          className="px-4 pb-4 pt-2 flex gap-3"
          style={{ 
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            background: 'linear-gradient(to top, var(--bg-dark) 90%, transparent)'
          }}
        >
          {isOnHub ? (
            <button
              onClick={() => setScreen('hub')}
              className="btn-copper flex-1 text-center"
            >
              Entrer dans l'Auberge
            </button>
          ) : (
            <button
              onClick={() => {
                // Retour au hub
                const hubPos = { x: 3, y: 3 };
                if (world.playerPosition.x !== hubPos.x || world.playerPosition.y !== hubPos.y) {
                  setScreen('hub');
                }
              }}
              className="btn-neutral flex-1 text-center"
              style={{ opacity: 0.7 }}
              disabled
            >
              Exploration active
            </button>
          )}
        </div>
      )}

      {/* === FOOTER MINIMAL === */}
      <footer 
        className="px-4 py-2 flex items-center justify-center gap-4 text-xs"
        style={{ 
          color: 'var(--text-dim)',
          borderTop: '1px solid #1a1a1a',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
        }}
      >
        <span>v0.3</span>
        <span className="flex items-center gap-1" style={{ color: 'var(--positive-light)' }}>
          <span 
            className="w-1.5 h-1.5 rounded-full animate-pulse" 
            style={{ background: 'var(--positive-light)' }} 
          />
          Auto-save
        </span>
      </footer>

      {/* === OVERLAYS === */}
      {currentLoot && screen === 'map' && <LootPopup />}
      {currentEvent && screen === 'map' && <EventScreen />}
      {screen === 'combat' && <CombatScreen />}
      {screen === 'hub' && <HubScreen />}
      {screen === 'gameover' && <GameOverScreen />}
    </div>
  );
}

export default App;
