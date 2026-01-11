// ============================================
// TYPES - Game State & Actions
// ============================================

import type { LootCard, Enemy, Tile, Position, TimeState } from './entities.types';
import type { EventChoice, GameEvent } from './events.types';

// === GAME SCREENS ===

export type GameScreen = 'map' | 'hub' | 'combat' | 'gameover';

// === PLAYER STATE ===

export interface PlayerState {
  hp: number;
  maxHp: number;
  hunger: number;
  gold: number;
  karma: number;
}

// === INVENTORY STATE ===

export interface InventoryState {
  bag: LootCard[];
  equipped: {
    weapon: LootCard | null;
    armor: LootCard | null;
    skills: LootCard[];
  };
  chest: LootCard[];
  maxWeight: number;
}

// === WORLD STATE ===

export interface WorldState {
  tiles: Map<string, Tile>;
  playerPosition: Position;
  time: TimeState;
}

// === COMBAT STATE ===

export interface CombatState {
  isActive: boolean;
  enemy: Enemy | null;
  enemyHp: number;
  turn: number;
  defendBonus: number;
  log: string[];
}

// === STATS ===

export interface GameStats {
  tilesExplored: number;
  enemiesKilled: number;
  itemsCollected: number;
  deaths: number;
  biomesExplored: Record<string, number>;
  enemiesKilledByType: Record<string, number>;
}

// === COMPLETE GAME STATE ===

export interface GameState {
  screen: GameScreen;
  player: PlayerState;
  inventory: InventoryState;
  world: WorldState;
  combat: CombatState;
  currentLoot: LootCard | null;
  currentEvent: GameEvent | null;
  stats: GameStats;
  activeQuests: string[];
  completedQuests: string[];
}

// === ACTIONS ===

export interface GameActions {
  // World
  moveTo: (x: number, y: number) => void;
  revealTile: (x: number, y: number) => void;
  getAdjacentTiles: () => Tile[];
  
  // Loot
  takeLoot: () => { success: boolean; reason?: string };
  leaveLoot: () => void;
  dropItem: (index: number) => void;
  useItem: (index: number) => { success: boolean; message: string };
  sellItem: (index: number) => { success: boolean; gold: number; message: string };
  
  // Player
  getCurrentWeight: () => number;
  canCarryMore: (weight: number) => boolean;
  getPlayerAtk: () => number;
  getPlayerDef: () => number;
  getPlayerMaxHp: () => number;
  hasSkill: (skillId: string) => boolean;
  
  // Combat
  startCombat: (enemy: Enemy) => void;
  performCombat: () => CombatResult;
  tryFlee: () => { fled: boolean; damageTaken: number };
  tryTalk: () => { success: boolean; message: string };
  performAction: (action: 'attack' | 'defend' | 'flee') => CombatResult;
  endCombat: () => void;
  
  // Events
  resolveEventChoice: (choice: EventChoice) => { success: boolean; message: string };
  
  // Hub
  restAtHub: (option: 'basic' | 'luxury') => boolean;
  equipItem: (item: LootCard) => void;
  unequipItem: (slot: 'weapon' | 'armor') => void;
  storeInChest: (index: number) => void;
  retrieveFromChest: (index: number) => void;
  
  // Time
  advanceTime: (hours: number) => void;
  
  // Game
  setScreen: (screen: GameScreen) => void;
  resetGame: () => void;
  
  // Quests
  acceptQuest: (questId: string) => void;
  completeQuest: (questId: string, reward: { gold: number; karma?: number }) => void;
}

export interface CombatResult {
  success: boolean;
  fled?: boolean;
  victory?: boolean;
  died?: boolean;
  continues?: boolean;
  drops?: LootCard[];
  message?: string;
}

// === STORE ===

export type GameStore = GameState & GameActions;
