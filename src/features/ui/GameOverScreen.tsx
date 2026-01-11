import { useGameStore } from '../../store/gameStore';

export function GameOverScreen() {
  const screen = useGameStore(state => state.screen);
  const stats = useGameStore(state => state.stats);
  const world = useGameStore(state => state.world);
  const resetGame = useGameStore(state => state.resetGame);
  
  if (screen !== 'gameover') return null;
  
  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md text-center">
        {/* Header */}
        <h1 className="text-4xl font-bold text-red-500 mb-2">
          Fin de la Route
        </h1>
        <p className="text-zinc-400 mb-8">
          Le monde continue sans toi.
        </p>
        
        {/* Stats */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-8 border border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-300 mb-4 uppercase tracking-wider">
            Ton parcours
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-2xl font-bold text-amber-400">{stats.tilesExplored}</p>
              <p className="text-xs text-zinc-500">Zones explorées</p>
            </div>
            
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-2xl font-bold text-red-400">{stats.enemiesKilled}</p>
              <p className="text-xs text-zinc-500">Ennemis vaincus</p>
            </div>
            
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-400">{stats.itemsCollected}</p>
              <p className="text-xs text-zinc-500">Objets collectés</p>
            </div>
            
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <p className="text-2xl font-bold text-zinc-400">{world.time.day}</p>
              <p className="text-xs text-zinc-500">Jours survécu</p>
            </div>
          </div>
          
          {stats.deaths > 0 && (
            <p className="mt-4 text-sm text-zinc-500">
              Tu es tombé {stats.deaths} fois.
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={resetGame}
            className="w-full p-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Nouvelle Partie
          </button>
          
          <p className="text-xs text-zinc-600">
            Les Terres Oubliées attendent un nouveau voyageur.
          </p>
        </div>
      </div>
    </div>
  );
}
