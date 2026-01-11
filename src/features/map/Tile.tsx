import type { Tile as TileType, TileType as BiomeType } from '../../types';

interface TileProps {
  tile: TileType;
  isPlayerHere: boolean;
  isClickable: boolean;
  hasVigilant: boolean;
  onClick: () => void;
}

// Couleurs des biomes - tons sombres
const BIOME_BG: Record<BiomeType, string> = {
  hub: '#4a3a2a',      // Brun chaud
  plain: '#2a3a2a',    // Vert sombre
  forest: '#1a2a1a',   // Vert tres sombre
  hills: '#3a3a3a',    // Gris
  ruins: '#2a2a2a',    // Gris fonce
  village: '#3a2a1a',  // Brun
};

export function Tile({ tile, isPlayerHere, isClickable, hasVigilant, onClick }: TileProps) {
  // Tuile non revelee = Brouillard
  if (!tile.isRevealed) {
    const showDangerHint = hasVigilant && isClickable && tile.hasDanger;
    
    return (
      <button
        className={`
          w-full h-full rounded
          flex items-center justify-center
          transition-all duration-200
          ${isClickable ? 'tile-clickable' : ''}
        `}
        style={{
          background: showDangerHint 
            ? 'var(--danger)' 
            : isClickable 
              ? 'var(--bg-elevated)' 
              : 'var(--bg-void)',
          border: showDangerHint
            ? '2px dashed var(--danger-light)'
            : isClickable 
              ? undefined // handled by .tile-clickable
              : '1px solid #1a1a1a',
          minWidth: '44px',
          minHeight: '44px',
        }}
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        aria-label={
          showDangerHint 
            ? 'Zone dangereuse detectee' 
            : isClickable 
              ? 'Explorer cette zone' 
              : 'Zone inaccessible'
        }
      >
        {showDangerHint ? (
          <span 
            className="text-xl font-bold"
            style={{ color: 'var(--danger-light)' }}
          >
            !
          </span>
        ) : isClickable && (
          <span 
            className="text-lg font-bold"
            style={{ color: 'var(--copper)' }}
          >
            ?
          </span>
        )}
      </button>
    );
  }

  // Tuile revelee
  return (
    <button
      className={`
        w-full h-full rounded
        flex flex-col items-center justify-center
        transition-all duration-200
        relative overflow-hidden
        ${isClickable ? 'tile-clickable' : ''}
      `}
      style={{
        background: BIOME_BG[tile.type],
        border: isPlayerHere 
          ? '3px solid var(--copper-light)' 
          : '1px solid #2a2a2a',
        boxShadow: isPlayerHere 
          ? '0 0 12px rgba(166, 124, 82, 0.4), inset 0 0 8px rgba(166, 124, 82, 0.2)'
          : 'none',
        minWidth: '44px',
        minHeight: '44px',
      }}
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
    >
      {/* Marqueur du joueur */}
      {isPlayerHere && (
        <div 
          className="w-3 h-3 rounded-full"
          style={{ 
            background: 'var(--copper-light)',
            boxShadow: '0 0 8px var(--copper)'
          }}
        />
      )}
      
      {/* Indicateur de loot */}
      {tile.loot && !isPlayerHere && (
        <div 
          className="absolute top-1 right-1 w-2 h-2 rounded-full pulse-glow"
          style={{ background: 'var(--copper)' }}
        />
      )}
      
      {/* Indicateur de danger */}
      {tile.hasDanger && !isPlayerHere && (
        <div 
          className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
          style={{ background: 'var(--danger-light)' }}
        />
      )}
      
      {/* Indicateur explore */}
      {tile.isExplored && !isPlayerHere && !tile.loot && !tile.hasDanger && (
        <div 
          className="absolute bottom-0.5 left-0.5 text-[8px]"
          style={{ color: 'var(--text-dim)', opacity: 0.5 }}
        >
          ok
        </div>
      )}
    </button>
  );
}
