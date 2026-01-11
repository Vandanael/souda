import type { Enemy, TileType } from '../types';

// ============================================
// ENNEMIS - SOUDA: Terra Incognita
// ============================================

export const ENEMIES: Enemy[] = [
  // === COMMUNS (faciles, bon pour débuter) ===
  {
    id: 'wolf',
    name: 'Loup Errant',
    hp: 25,
    atk: 4,
    def: 0,
    pattern: ['attack', 'attack', 'rest'],
    fleeChance: 0.8,
    loot: [
      { itemId: 'cons_meat', chance: 0.6 },
      { itemId: 'wolf_pelt', chance: 0.4 },
    ],
    description: 'Affamé. Agressif. Yeux jaunes dans l\'ombre.',
  },
  {
    id: 'bandit',
    name: 'Bandit Solitaire',
    hp: 35,
    atk: 4,
    def: 1,
    pattern: ['attack', 'attack', 'attack'],
    fleeChance: 0.7,
    loot: [
      { itemId: 'gold_pouch_small', chance: 1.0 },
      { itemId: 'wpn_dagger', chance: 0.3 },
    ],
    description: 'Haillons et lame rouillée. Désespéré.',
  },
  {
    id: 'scavenger',
    name: 'Charognard',
    hp: 20,
    atk: 3,
    def: 0,
    pattern: ['attack', 'rest', 'attack'],
    fleeChance: 0.9,
    loot: [
      { itemId: 'cons_bread', chance: 0.8 },
      { itemId: 'gold_pouch_small', chance: 0.5 },
    ],
    description: 'Fouille les cadavres. Fuit au premier signe de danger.',
  },
  {
    id: 'wild_boar',
    name: 'Sanglier Sauvage',
    hp: 30,
    atk: 5,
    def: 1,
    pattern: ['attack', 'attack', 'attack', 'rest'],
    fleeChance: 0.6,
    loot: [
      { itemId: 'cons_meat', chance: 1.0 },
      { itemId: 'cons_meat', chance: 0.5 },
    ],
    description: 'Défenses acérées. Charge sans réfléchir.',
  },

  // === ÉLITES (challenge moyen) ===
  {
    id: 'mercenary',
    name: 'Mercenaire Rival',
    hp: 50,
    atk: 5,
    def: 2,
    pattern: ['attack', 'defend', 'attack', 'defend'],
    fleeChance: 0.5,
    loot: [
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'wpn_longsword', chance: 0.4 },
      { itemId: 'arm_gambeson', chance: 0.3 },
    ],
    description: 'Armure usée mais entretenue. Regard calculateur.',
  },
  {
    id: 'wolf_pack_alpha',
    name: 'Alpha de Meute',
    hp: 40,
    atk: 5,
    def: 1,
    pattern: ['attack', 'attack', 'rest', 'attack'],
    fleeChance: 0.6,
    loot: [
      { itemId: 'cons_meat', chance: 1.0 },
      { itemId: 'cons_meat', chance: 0.5 },
      { itemId: 'wolf_pelt', chance: 1.0 },
    ],
    description: 'Plus grand que les autres. Cicatrices sur le museau.',
  },
  {
    id: 'marauder',
    name: 'Maraudeur',
    hp: 45,
    atk: 5,
    def: 2,
    pattern: ['attack', 'attack', 'defend', 'attack'],
    fleeChance: 0.5,
    loot: [
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'wpn_dagger', chance: 0.6 },
      { itemId: 'cons_bandage', chance: 0.4 },
    ],
    description: 'Pillard expérimenté. Sait quand frapper et quand se protéger.',
  },
  {
    id: 'hunter',
    name: 'Chasseur Hostile',
    hp: 40,
    atk: 6,
    def: 1,
    pattern: ['attack', 'attack', 'attack', 'rest'],
    fleeChance: 0.6,
    loot: [
      { itemId: 'wpn_shortbow', chance: 0.5 },
      { itemId: 'cons_meat', chance: 0.8 },
      { itemId: 'gold_pouch_small', chance: 0.7 },
    ],
    description: 'Arc tendu. Te prend pour du gibier.',
  },

  // === DANGEREUX (attention requise) ===
  {
    id: 'deserter',
    name: 'Déserteur',
    hp: 45,
    atk: 6,
    def: 2,
    pattern: ['attack', 'attack', 'defend', 'attack'],
    fleeChance: 0.5,
    loot: [
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'arm_chainmail', chance: 0.3 },
      { itemId: 'wpn_longsword', chance: 0.25 },
    ],
    description: 'Uniforme déchiré, yeux fous. Rien à perdre.',
  },
  {
    id: 'patrol_chief',
    name: 'Chef de Patrouille',
    hp: 70,
    atk: 7,
    def: 3,
    pattern: ['attack', 'attack', 'defend', 'attack', 'defend'],
    fleeChance: 0.3,
    loot: [
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'wpn_axe', chance: 0.4 },
      { itemId: 'arm_cuirass', chance: 0.25 },
    ],
    description: 'Cuirasse polie, regard dur. Le plus dangereux de la région.',
  },
  {
    id: 'veteran',
    name: 'Vétéran de Guerre',
    hp: 60,
    atk: 6,
    def: 3,
    pattern: ['defend', 'attack', 'attack', 'defend', 'attack'],
    fleeChance: 0.4,
    loot: [
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'arm_chainmail', chance: 0.5 },
      { itemId: 'wpn_longsword', chance: 0.4 },
      { itemId: 'cons_bandage', chance: 0.6 },
    ],
    description: 'Cicatrices partout. Sait se battre mieux que quiconque.',
  },
];

// Fonction pour obtenir un ennemi par ID
export function getEnemyById(id: string): Enemy | undefined {
  return ENEMIES.find(e => e.id === id);
}

// Spawn table selon biome
const SPAWN_TABLE: Record<TileType, { enemyId: string; chance: number }[]> = {
  hub: [],
  plain: [
    { enemyId: 'scavenger', chance: 0.12 },
    { enemyId: 'bandit', chance: 0.1 },
    { enemyId: 'wild_boar', chance: 0.08 },
  ],
  forest: [
    { enemyId: 'wolf', chance: 0.2 },
    { enemyId: 'wild_boar', chance: 0.12 },
    { enemyId: 'hunter', chance: 0.08 },
    { enemyId: 'wolf_pack_alpha', chance: 0.05 },
  ],
  hills: [
    { enemyId: 'bandit', chance: 0.15 },
    { enemyId: 'marauder', chance: 0.1 },
    { enemyId: 'deserter', chance: 0.08 },
  ],
  ruins: [
    { enemyId: 'mercenary', chance: 0.2 },
    { enemyId: 'deserter', chance: 0.15 },
    { enemyId: 'veteran', chance: 0.1 },
    { enemyId: 'patrol_chief', chance: 0.08 },
  ],
  village: [
    { enemyId: 'scavenger', chance: 0.1 },
    { enemyId: 'bandit', chance: 0.08 },
    { enemyId: 'deserter', chance: 0.05 },
  ],
};

// Fonction pour spawner un ennemi selon le biome
export function spawnEnemy(tileType: TileType): Enemy | null {
  const table = SPAWN_TABLE[tileType];
  
  for (const entry of table) {
    if (Math.random() < entry.chance) {
      const enemy = getEnemyById(entry.enemyId);
      if (enemy) {
        return { ...enemy };
      }
    }
  }
  
  return null;
}
