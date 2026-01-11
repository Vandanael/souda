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

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            <span className="text-amber-400">SOUDA</span>
            <span className="text-zinc-500 font-normal"> : Terra Incognita</span>
          </h1>
          <button
            onClick={() => {
              if (confirm('Recommencer une nouvelle partie ?')) {
                resetGame();
              }
            }}
            className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
          >
            Nouvelle partie
          </button>
        </div>
      </header>

      {/* Status Bar */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <StatusBar />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          {screen === 'map' && (
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
              <div className="flex-shrink-0">
                <WorldMap />
              </div>
              <div className="w-full lg:w-auto">
                <Backpack />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-zinc-800 text-center text-xs text-zinc-600 flex items-center justify-center gap-4">
        <span>Prototype v0.3</span>
        <span className="flex items-center gap-1 text-emerald-600">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Sauvegarde auto
        </span>
      </footer>

      {/* Overlays */}
      {currentLoot && screen === 'map' && <LootPopup />}
      {currentEvent && screen === 'map' && <EventScreen />}
      {screen === 'combat' && <CombatScreen />}
      {screen === 'hub' && <HubScreen />}
      {screen === 'gameover' && <GameOverScreen />}
    </div>
  );
}

export default App;
