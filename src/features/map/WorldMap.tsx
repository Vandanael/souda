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
  
  // Vérifier si Vigilant est équipé
  const hasVigilant = equippedSkills.some(skill => skill.id === 'skill_vigilant');
  
  // Tuile actuelle
  const currentTile = world.tiles.get(`${world.playerPosition.x},${world.playerPosition.y}`);
  
  // Convertir la Map en tableau 2D pour l'affichage
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
    <div className="flex flex-col items-center gap-4">
      {/* Lieu actuel */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-zinc-200">
          {currentTile ? BIOME_NAMES[currentTile.type] : 'Les Terres Oubliées'}
        </h2>
        <p className="text-sm text-zinc-500">
          Jour {world.time.day}, {world.time.hour}h
        </p>
      </div>
      
      {/* Grille */}
      <div 
        className="grid gap-2 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(90vw, 400px)',
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
      
      {/* Légende minimaliste */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-amber-400 rounded-full" />
          <span>Loot</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <span>Danger</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-400 rounded-full" />
          <span>Toi</span>
        </div>
      </div>
    </div>
  );
}
