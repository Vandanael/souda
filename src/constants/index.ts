// ============================================
// CONSTANTS - Game Configuration
// ============================================

import type { TileType, LootType } from '../types';

// === GAME BALANCE ===

export const GAME_CONFIG = {
  STARTING_HP: 100,
  STARTING_HUNGER: 4,
  STARTING_GOLD: 5,
  MAX_WEIGHT: 10,
  KARMA_MIN: -100,
  KARMA_MAX: 100,
} as const;

export const HUB_SERVICES = {
  BASIC_REST: { cost: 5, heal: 50, hunger: 3 },
  LUXURY_REST: { cost: 15, heal: 100, hunger: 4 },
} as const;

export const SKILL_BONUSES = {
  TOUGH_HP_BONUS: 20,
  SCAVENGER_LOOT_BONUS: 0.2,
} as const;

// === UI LABELS ===

export const TYPE_LABELS: Record<LootType, string> = {
  weapon: 'Arme',
  armor: 'Armure',
  consumable: 'Conso.',
  skill: 'Skill',
  treasure: 'Trésor',
};

export const TYPE_COLORS: Record<LootType, string> = {
  weapon: 'text-red-400',
  armor: 'text-blue-400',
  consumable: 'text-green-400',
  skill: 'text-purple-400',
  treasure: 'text-amber-400',
};

export const TYPE_BG_COLORS: Record<LootType, string> = {
  weapon: 'from-red-950 to-zinc-900 border-red-700',
  armor: 'from-blue-950 to-zinc-900 border-blue-700',
  consumable: 'from-green-950 to-zinc-900 border-green-700',
  skill: 'from-purple-950 to-zinc-900 border-purple-700',
  treasure: 'from-amber-950 to-zinc-900 border-amber-700',
};

export const BIOME_NAMES: Record<TileType, string> = {
  hub: 'Auberge du Carrefour',
  plain: 'Plaine',
  forest: 'Forêt',
  hills: 'Collines',
  ruins: 'Ruines',
  village: 'Village Abandonné',
};

export const BIOME_COLORS: Record<TileType, string> = {
  hub: 'bg-amber-500',
  plain: 'bg-lime-600',
  forest: 'bg-emerald-700',
  hills: 'bg-stone-500',
  ruins: 'bg-slate-600',
  village: 'bg-orange-500',
};

export const ENEMY_NAMES: Record<string, string> = {
  wolf: 'Loups',
  bandit: 'Bandits',
  mercenary: 'Mercenaires',
  wolf_pack_alpha: 'Alphas',
  deserter: 'Déserteurs',
  patrol_chief: 'Chefs',
  scavenger: 'Charognards',
  wild_boar: 'Sangliers',
  marauder: 'Maraudeurs',
  hunter: 'Chasseurs',
  veteran: 'Vétérans',
};

// === STORAGE KEYS ===

export const STORAGE_KEYS = {
  GAME_SAVE: 'souda-save',
  TUTORIAL_DONE: 'souda-tutorial-done',
} as const;
