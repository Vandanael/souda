import type { Tile as TileType } from '../../types';
import { BIOME_COLORS, BIOME_HOVER_COLORS } from '../../data/map';

interface TileProps {
  tile: TileType;
  isPlayerHere: boolean;
  isClickable: boolean;
  hasVigilant: boolean;
  onClick: () => void;
}

export function Tile({ tile, isPlayerHere, isClickable, hasVigilant, onClick }: TileProps) {
  // Tuile non révélée = Brouillard
  if (!tile.isRevealed) {
    // Si Vigilant équipé et tuile clickable, montrer le danger
    const showDangerHint = hasVigilant && isClickable && tile.hasDanger;
    
    return (
      <button
        className={`
          aspect-square rounded-lg
          flex items-center justify-center
          transition-all duration-300 ease-out
          ${showDangerHint
            ? 'bg-red-900/50 cursor-pointer hover:bg-red-800/50 hover:scale-105 border-2 border-dashed border-red-500 hover:border-red-400'
            : isClickable 
              ? 'bg-zinc-700 cursor-pointer hover:bg-zinc-600 hover:scale-105 border-2 border-dashed border-zinc-500 hover:border-amber-500' 
              : 'bg-zinc-900 cursor-default'}
        `}
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        aria-label={showDangerHint ? 'Zone dangereuse détectée' : isClickable ? 'Explorer cette zone' : 'Zone inaccessible'}
      >
        {showDangerHint ? (
          <span className="text-red-400 text-2xl font-bold">!</span>
        ) : isClickable && (
          <span className="text-zinc-400 text-2xl font-bold">?</span>
        )}
      </button>
    );
  }

  // Tuile révélée
  return (
    <button
      className={`
        aspect-square rounded-lg
        flex flex-col items-center justify-center gap-1
        transition-all duration-300 ease-out
        ${BIOME_COLORS[tile.type]}
        ${isClickable ? `${BIOME_HOVER_COLORS[tile.type]} cursor-pointer hover:scale-105` : 'cursor-default'}
        ${isPlayerHere ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-zinc-900 scale-110' : ''}
        ${isClickable && !isPlayerHere ? 'ring-2 ring-white/30 hover:ring-white/60' : ''}
        relative overflow-hidden
      `}
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
    >
      {/* Marqueur du joueur */}
      {isPlayerHere && (
        <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
      )}
      
      {/* Indicateur de loot - petit point doré */}
      {tile.loot && !isPlayerHere && (
        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
      )}
      
      {/* Indicateur de danger - petit point rouge */}
      {tile.hasDanger && !isPlayerHere && (
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      )}
      
      {/* Indicateur exploré - checkmark discret */}
      {tile.isExplored && !isPlayerHere && !tile.loot && !tile.hasDanger && (
        <div className="absolute bottom-1 left-1 text-[10px] text-white/30">✓</div>
      )}
    </button>
  );
}
