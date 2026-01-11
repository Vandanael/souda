// ============================================
// TYPES - Game Entities
// ============================================

// === POSITION ===

export interface Position {
  x: number;
  y: number;
}

// === TIME ===

export interface TimeState {
  hour: number;
  day: number;
}

// === TILES ===

export type TileType = 'hub' | 'plain' | 'forest' | 'hills' | 'ruins' | 'village';

export interface Tile {
  id: string;
  x: number;
  y: number;
  type: TileType;
  isRevealed: boolean;
  isExplored: boolean;
  hasDanger: boolean;
  loot: LootCard | null;
}

// === LOOT ===

export type LootType = 'weapon' | 'armor' | 'consumable' | 'skill' | 'treasure';

export interface LootStats {
  atk?: number;
  def?: number;
  heal?: number;
  hungerRestore?: number;
}

export interface LootCard {
  id: string;
  name: string;
  type: LootType;
  weight: number;
  stats: LootStats;
  description: string;
  value?: number;
}

// === ENEMIES ===

export type EnemyAction = 'attack' | 'defend' | 'rest';

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  atk: number;
  def: number;
  pattern: EnemyAction[];
  fleeChance: number;
  loot: { itemId: string; chance: number }[];
  description: string;
}
