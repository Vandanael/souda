// ============================================
// TYPES - Events & Quests
// ============================================

import type { TileType } from './entities.types';

// === EVENTS ===

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

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  biomes: TileType[];
  chance: number;
}

// === QUESTS ===

export type QuestType = 'explore' | 'kill' | 'collect';

export interface QuestTarget {
  count: number;
  biome?: string;
  enemyId?: string;
  itemId?: string;
}

export interface QuestReward {
  gold: number;
  karma?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  giver: string;
  type: QuestType;
  target: QuestTarget;
  reward: QuestReward;
}

// === RUMORS ===

export interface Rumor {
  id: string;
  author: string;
  date: string;
  content: string;
  hint?: string;
}
