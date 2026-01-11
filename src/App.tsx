import { useGameStore } from './store/gameStore';
import { WorldMap } from './features/map/WorldMap';
import { StatusBar } from './features/ui/StatusBar';
import { Backpack } from './features/inventory/Backpack';
import { LootPopup } from './features/loot/LootPopup';
import { CombatScreen } from './features/combat/CombatScreen';
import { HubScreen } from './features/hub/HubScreen';
import { GameOverScreen } from './features/ui/GameOverScreen';
import { EventScreen } from './features/events/EventScreen';

function App() {
  const screen = useGameStore(state => state.screen);
  const resetGame = useGameStore(state => state.resetGame);
  const currentLoot = useGameStore(state => state.currentLoot);
  const currentEvent = useGameStore(state => state.currentEvent);

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
              {/* Map */}
              <div className="flex-shrink-0">
                <WorldMap />
              </div>
              
              {/* Sidebar */}
              <div className="w-full lg:w-auto">
                <Backpack />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-zinc-800 text-center text-xs text-zinc-600">
        Prototype v0.1
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
