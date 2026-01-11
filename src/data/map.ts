import type { Tile, TileType } from '../types';
import { rollLoot } from './loot';

// ============================================
// CARTE DU PROTOTYPE - SOUDA: Terra Incognita
// ============================================

// Configuration de la grille
export const GRID_SIZE = 5;
export const HUB_POSITION = { x: 2, y: 2 }; // Centre de la grille 5x5

// Layout de la carte prototype (5x5)
// Le hub est au centre, entouré de différents biomes
const MAP_LAYOUT: TileType[][] = [
  // y=0 (Nord)
  ['ruins',  'forest', 'hills',  'forest', 'ruins' ],
  // y=1
  ['plain',  'plain',  'forest', 'plain',  'hills' ],
  // y=2 (Centre - Hub)
  ['forest', 'plain',  'hub',    'plain',  'village'],
  // y=3
  ['hills',  'forest', 'plain',  'forest', 'ruins' ],
  // y=4 (Sud)
  ['village','plain',  'hills',  'plain',  'forest'],
];

// Couleurs Tailwind par biome
export const BIOME_COLORS: Record<TileType, string> = {
  hub: 'bg-amber-500',
  plain: 'bg-lime-500',
  forest: 'bg-emerald-700',
  hills: 'bg-stone-500',
  ruins: 'bg-slate-600',
  village: 'bg-orange-400',
};

// Couleurs de survol par biome
export const BIOME_HOVER_COLORS: Record<TileType, string> = {
  hub: 'hover:bg-amber-400',
  plain: 'hover:bg-lime-400',
  forest: 'hover:bg-emerald-600',
  hills: 'hover:bg-stone-400',
  ruins: 'hover:bg-slate-500',
  village: 'hover:bg-orange-300',
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

// Icônes des biomes
export const BIOME_ICONS: Record<TileType, string> = {
  hub: '🏠',
  plain: '🌾',
  forest: '🌲',
  hills: '⛰️',
  ruins: '🏚️',
  village: '🏘️',
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
    isRevealed: isHub, // Seul le hub est révélé au départ
    isExplored: isHub,
    hasDanger: false,  // Les dangers sont générés au moment de l'exploration
    loot: null,        // Le loot est généré au moment de l'exploration
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

// Génère le contenu d'une tuile (loot, danger) lors de l'exploration
export function generateTileContent(tile: Tile): { loot: ReturnType<typeof rollLoot>; hasDanger: boolean } {
  // Ne pas générer de contenu pour le hub
  if (tile.type === 'hub') {
    return { loot: null, hasDanger: false };
  }
  
  // Générer le loot
  const loot = rollLoot(tile.type);
  
  // Les dangers sont déterminés par la propriété hasDanger existante
  // ou générés aléatoirement lors de la première visite
  // (géré dans le store lors du mouvement)
  
  return {
    loot,
    hasDanger: false, // Le danger est géré séparément via spawnEnemy
  };
}

// Vérifie si deux positions sont adjacentes
export function areAdjacent(pos1: { x: number; y: number }, pos2: { x: number; y: number }): boolean {
  const dx = Math.abs(pos1.x - pos2.x);
  const dy = Math.abs(pos1.y - pos2.y);
  
  // Adjacent = différence de 1 sur un seul axe (pas de diagonale)
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
