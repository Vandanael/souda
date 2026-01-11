import { useGameStore } from '../../store/gameStore';
import { Tile } from './Tile';
import { GRID_SIZE, areAdjacent, BIOME_NAMES } from '../../data/map';
import { sounds } from '../../utils/sounds';

export function WorldMap() {
  const world = useGameStore(state => state.world);
  const moveTo = useGameStore(state => state.moveTo);
  const getAdjacentTiles = useGameStore(state => state.getAdjacentTiles);
  const equippedSkills = useGameStore(state => state.inventory.equipped.skills);
  
  const adjacentTiles = getAdjacentTiles();
  const adjacentIds = new Set(adjacentTiles.map(t => t.id));
  
  const hasVigilant = equippedSkills.some(skill => skill.id === 'skill_vigilant');
  const currentTile = world.tiles.get(`${world.playerPosition.x},${world.playerPosition.y}`);
  
  // Convertir la Map en tableau 2D
  const grid: (typeof world.tiles extends Map<string, infer T> ? T : never)[][] = [];
  
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: typeof grid[0] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const tile = world.tiles.get(`${x},${y}`);
      if (tile) row.push(tile);
    }
    grid.push(row);
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md">
      {/* Lieu actuel */}
      <div className="text-center w-full">
        <h2 
          className="text-lg font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {currentTile ? BIOME_NAMES[currentTile.type] : 'Les Terres Oubliees'}
        </h2>
      </div>
      
      {/* Grille */}
      <div 
        className="card-metal p-3 w-full"
        style={{ aspectRatio: '1/1', maxWidth: '100%' }}
      >
        <div 
          className="grid gap-1.5 h-full"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {grid.map((row) =>
            row.map((tile) => {
              const isPlayerHere = 
                tile.x === world.playerPosition.x && 
                tile.y === world.playerPosition.y;
              
              const isClickable = 
                !isPlayerHere && 
                (adjacentIds.has(tile.id) || 
                 (tile.isRevealed && areAdjacent(world.playerPosition, { x: tile.x, y: tile.y })));
              
              return (
                <Tile
                  key={tile.id}
                  tile={tile}
                  isPlayerHere={isPlayerHere}
                  isClickable={isClickable}
                  hasVigilant={hasVigilant}
                  onClick={() => {
                    sounds.move();
                    moveTo(tile.x, tile.y);
                  }}
                />
              );
            })
          )}
        </div>
      </div>
      
      {/* Legende minimaliste */}
      <div 
        className="flex justify-center gap-6 text-xs"
        style={{ color: 'var(--text-dim)' }}
      >
        <div className="flex items-center gap-1.5">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ background: 'var(--copper)' }} 
          />
          <span>Loot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ background: 'var(--danger-light)' }} 
          />
          <span>Danger</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ background: 'var(--copper-light)' }} 
          />
          <span>Toi</span>
        </div>
      </div>
    </div>
  );
}
