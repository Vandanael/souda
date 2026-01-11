import { useGameStore } from '../../store/gameStore';

export function GameOverScreen() {
  const screen = useGameStore(state => state.screen);
  const stats = useGameStore(state => state.stats);
  const world = useGameStore(state => state.world);
  const resetGame = useGameStore(state => state.resetGame);
  
  if (screen !== 'gameover') return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'var(--bg-void)' }}
    >
      {/* Contenu centre */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Header */}
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--danger-light)' }}
        >
          Fin de la Route
        </h1>
        <p 
          className="mb-8"
          style={{ color: 'var(--text-muted)' }}
        >
          Le monde continue sans toi.
        </p>
        
        {/* Stats */}
        <div className="card-metal p-5 w-full max-w-sm mb-8">
          <h2 
            className="text-sm font-bold uppercase tracking-wider text-center mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            Ton parcours
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="p-3 rounded text-center"
              style={{ background: 'var(--bg-surface)' }}
            >
              <p className="text-2xl font-bold" style={{ color: 'var(--copper)' }}>
                {stats.tilesExplored}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Zones</p>
            </div>
            
            <div 
              className="p-3 rounded text-center"
              style={{ background: 'var(--bg-surface)' }}
            >
              <p className="text-2xl font-bold" style={{ color: 'var(--stat-atk)' }}>
                {stats.enemiesKilled}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Ennemis</p>
            </div>
            
            <div 
              className="p-3 rounded text-center"
              style={{ background: 'var(--bg-surface)' }}
            >
              <p className="text-2xl font-bold" style={{ color: 'var(--positive-light)' }}>
                {stats.itemsCollected}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Objets</p>
            </div>
            
            <div 
              className="p-3 rounded text-center"
              style={{ background: 'var(--bg-surface)' }}
            >
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {world.time.day}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Jours</p>
            </div>
          </div>
          
          {stats.deaths > 0 && (
            <p 
              className="mt-4 text-sm text-center"
              style={{ color: 'var(--text-dim)' }}
            >
              Tu es tombe {stats.deaths} fois.
            </p>
          )}
        </div>
      </div>
      
      {/* Zone du pouce */}
      <div 
        className="p-4"
        style={{ 
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--bg-dark) 90%, transparent)'
        }}
      >
        <button
          onClick={resetGame}
          className="btn-copper w-full text-lg"
        >
          Nouvelle Partie
        </button>
        <p 
          className="text-xs text-center mt-3"
          style={{ color: 'var(--text-dim)' }}
        >
          Les Terres Oubliees attendent un nouveau voyageur.
        </p>
      </div>
    </div>
  );
}
