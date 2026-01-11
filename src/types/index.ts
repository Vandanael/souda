// ============================================
// TYPES PRINCIPAUX - SOUDA: Terra Incognita
// ============================================

// === TILES & MAP ===

export type TileType = 'hub' | 'plain' | 'forest' | 'hills' | 'ruins' | 'village';

export interface Tile {
  id: string;           // Format: "x,y"
  x: number;
  y: number;
  type: TileType;
  isRevealed: boolean;  // Visible sur la carte
  isExplored: boolean;  // Déjà visité
  hasDanger: boolean;   // Ennemi présent
  loot: LootCard | null;
}

export interface Position {
  x: number;
  y: number;
}

// === LOOT & ITEMS ===

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
  weight: number;       // kg
  stats: LootStats;
  description: string;
  value?: number;       // Prix de vente
}

// === PLAYER ===

export interface PlayerState {
  hp: number;
  maxHp: number;
  hunger: number;       // Jours restants
  gold: number;
}

export interface InventoryState {
  bag: LootCard[];
  equipped: {
    weapon: LootCard | null;
    armor: LootCard | null;
    skills: LootCard[];
  };
  chest: LootCard[];    // Stockage au hub
  maxWeight: number;    // 10kg par défaut
}

// === WORLD ===

export interface TimeState {
  hour: number;         // 0-23
  day: number;          // Jour 1, 2, 3...
}

export interface WorldState {
  tiles: Map<string, Tile>;
  playerPosition: Position;
  time: TimeState;
}

// === COMBAT ===

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

export interface CombatState {
  isActive: boolean;
  enemy: Enemy | null;
  enemyHp: number;
  turn: number;
  defendBonus: number;  // +ATK après avoir défendu
  log: string[];        // Messages de combat
}

// === GAME STATE ===

export type GameScreen = 'map' | 'hub' | 'combat' | 'gameover';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
}

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  effects: {
    hp?: number;
    hunger?: number;
    gold?: number;
    karma?: number;
  };
  successChance?: number;
  successMessage?: string;
  failMessage?: string;
  failEffects?: {
    hp?: number;
    hunger?: number;
    gold?: number;
  };
}

export interface GameState {
  screen: GameScreen;
  player: PlayerState;
  inventory: InventoryState;
  world: WorldState;
  combat: CombatState;
  currentLoot: LootCard | null;
  currentEvent: GameEvent | null;  // Événement narratif en cours
  
  // Stats de session
  stats: {
    tilesExplored: number;
    enemiesKilled: number;
    itemsCollected: number;
    deaths: number;
  };
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
  
  // Player
  getCurrentWeight: () => number;
  canCarryMore: (weight: number) => boolean;
  getPlayerAtk: () => number;
  getPlayerDef: () => number;
  
  // Combat (simplifié)
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
