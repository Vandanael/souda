import type { Tile, TileType } from '../types';
import { rollLoot } from './loot';

// ============================================
// CARTE DU PROTOTYPE - SOUDA: Terra Incognita
// ============================================

// Configuration de la grille (7x7)
export const GRID_SIZE = 7;
export const HUB_POSITION = { x: 3, y: 3 }; // Centre de la grille 7x7

// Layout de la carte prototype (7x7)
const MAP_LAYOUT: TileType[][] = [
  // y=0 (Nord - zone dangereuse)
  ['ruins',  'ruins',  'hills',  'forest', 'hills',  'ruins',  'ruins' ],
  // y=1
  ['hills',  'forest', 'plain',  'forest', 'plain',  'forest', 'hills' ],
  // y=2
  ['forest', 'plain',  'village','plain',  'village','plain',  'forest'],
  // y=3 (Centre - Hub)
  ['plain',  'forest', 'plain',  'hub',    'plain',  'forest', 'plain' ],
  // y=4
  ['forest', 'plain',  'village','plain',  'hills',  'plain',  'forest'],
  // y=5
  ['hills',  'forest', 'plain',  'forest', 'plain',  'forest', 'hills' ],
  // y=6 (Sud - zone dangereuse)
  ['ruins',  'ruins',  'hills',  'forest', 'hills',  'ruins',  'ruins' ],
];

// Couleurs Tailwind par biome
export const BIOME_COLORS: Record<TileType, string> = {
  hub: 'bg-amber-500',
  plain: 'bg-lime-600',
  forest: 'bg-emerald-700',
  hills: 'bg-stone-500',
  ruins: 'bg-slate-600',
  village: 'bg-orange-500',
};

// Couleurs de survol par biome
export const BIOME_HOVER_COLORS: Record<TileType, string> = {
  hub: 'hover:bg-amber-400',
  plain: 'hover:bg-lime-500',
  forest: 'hover:bg-emerald-600',
  hills: 'hover:bg-stone-400',
  ruins: 'hover:bg-slate-500',
  village: 'hover:bg-orange-400',
};

// Noms des biomes
export const BIOME_NAMES: Record<TileType, string> = {
  hub: 'Auberge du Carrefour',
  plain: 'Plaine',
  forest: 'Forêt',
  hills: 'Collines',
  ruins: 'Ruines',
  village: 'Village Abandonné',
};

// Temps de voyage par biome (en heures)
export const TRAVEL_TIME: Record<TileType, number> = {
  hub: 0,
  plain: 1,
  forest: 2,
  hills: 2,
  ruins: 1,
  village: 1,
};

// Génère une tuile à partir de sa position
function createTile(x: number, y: number, isHub: boolean): Tile {
  const type = MAP_LAYOUT[y][x];
  
  return {
    id: `${x},${y}`,
    x,
    y,
    type,
    isRevealed: isHub,
    isExplored: isHub,
    hasDanger: false,
    loot: null,
  };
}

// Génère la carte complète
export function generateMap(): Map<string, Tile> {
  const tiles = new Map<string, Tile>();
  
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isHub = x === HUB_POSITION.x && y === HUB_POSITION.y;
      const tile = createTile(x, y, isHub);
      tiles.set(tile.id, tile);
    }
  }
  
  return tiles;
}

// Génère le contenu d'une tuile lors de l'exploration
export function generateTileContent(tile: Tile): { loot: ReturnType<typeof rollLoot>; hasDanger: boolean } {
  if (tile.type === 'hub') {
    return { loot: null, hasDanger: false };
  }
  
  const loot = rollLoot(tile.type);
  
  return {
    loot,
    hasDanger: false,
  };
}

// Vérifie si deux positions sont adjacentes
export function areAdjacent(pos1: { x: number; y: number }, pos2: { x: number; y: number }): boolean {
  const dx = Math.abs(pos1.x - pos2.x);
  const dy = Math.abs(pos1.y - pos2.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

// Obtient toutes les tuiles adjacentes à une position
export function getAdjacentPositions(pos: { x: number; y: number }): { x: number; y: number }[] {
  const directions = [
    { x: 0, y: -1 },  // Nord
    { x: 1, y: 0 },   // Est
    { x: 0, y: 1 },   // Sud
    { x: -1, y: 0 },  // Ouest
  ];
  
  return directions
    .map(dir => ({ x: pos.x + dir.x, y: pos.y + dir.y }))
    .filter(p => p.x >= 0 && p.x < GRID_SIZE && p.y >= 0 && p.y < GRID_SIZE);
}
