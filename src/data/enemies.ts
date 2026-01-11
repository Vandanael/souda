import type { Enemy, TileType } from '../types';

// ============================================
// ENNEMIS - SOUDA: Terra Incognita
// ============================================

export const ENEMIES: Enemy[] = [
  // === COMMUNS (70%) ===
  {
    id: 'wolf',
    name: 'Loup Errant',
    hp: 40,
    atk: 4,
    def: 0,
    pattern: ['attack', 'attack', 'rest'],
    fleeChance: 0.7,
    loot: [
      { itemId: 'cons_meat', chance: 0.5 },
      { itemId: 'wolf_pelt', chance: 0.3 },
    ],
    description: 'Affamé. Agressif. Yeux jaunes dans l\'ombre.',
  },
  {
    id: 'bandit',
    name: 'Bandit Solitaire',
    hp: 60,
    atk: 5,
    def: 1,
    pattern: ['attack', 'attack', 'attack'],
    fleeChance: 0.6,
    loot: [
      { itemId: 'gold_pouch_small', chance: 1.0 },
      { itemId: 'wpn_dagger', chance: 0.4 },
    ],
    description: 'Haillons et lame rouillée. Désespéré.',
  },

  // === ÉLITES (20%) ===
  {
    id: 'mercenary',
    name: 'Mercenaire Rival',
    hp: 80,
    atk: 6,
    def: 2,
    pattern: ['attack', 'defend', 'attack', 'defend'],
    fleeChance: 0.8,
    loot: [
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'wpn_longsword', chance: 0.5 },
      { itemId: 'arm_gambeson', chance: 0.3 },
    ],
    description: 'Armure usée mais entretenue. Regard calculateur.',
  },
  {
    id: 'wolf_pack_alpha',
    name: 'Alpha de Meute',
    hp: 60,
    atk: 5,
    def: 1,
    pattern: ['attack', 'attack', 'rest', 'attack'],
    fleeChance: 0.5,
    loot: [
      { itemId: 'cons_meat', chance: 1.0 },
      { itemId: 'cons_meat', chance: 0.7 },
      { itemId: 'wolf_pelt', chance: 0.8 },
    ],
    description: 'Plus grand que les autres. Cicatrices sur le museau.',
  },

  // === DANGEREUX (10%) ===
  {
    id: 'deserter',
    name: 'Déserteur',
    hp: 70,
    atk: 6,
    def: 2,
    pattern: ['attack', 'attack', 'defend', 'attack'],
    fleeChance: 0.6,
    loot: [
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'arm_chainmail', chance: 0.4 },
      { itemId: 'wpn_longsword', chance: 0.3 },
    ],
    description: 'Uniforme déchiré, yeux fous. Rien à perdre.',
  },
  {
    id: 'patrol_chief',
    name: 'Chef de Patrouille',
    hp: 120,
    atk: 7,
    def: 3,
    pattern: ['attack', 'attack', 'defend', 'attack', 'defend'],
    fleeChance: 0.8,
    loot: [
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'gold_pouch', chance: 0.8 },
      { itemId: 'wpn_axe', chance: 0.3 },
      { itemId: 'arm_cuirass', chance: 0.2 },
    ],
    description: 'Cuirasse polie, regard dur. Le plus dangereux de la région.',
  },
];

// Fonction pour obtenir un ennemi par ID
export function getEnemyById(id: string): Enemy | undefined {
  return ENEMIES.find(e => e.id === id);
}

// Spawn table selon biome
const SPAWN_TABLE: Record<TileType, { enemyId: string; chance: number }[]> = {
  hub: [], // Pas d'ennemi au hub
  plain: [
    { enemyId: 'bandit', chance: 0.15 },
  ],
  forest: [
    { enemyId: 'wolf', chance: 0.3 },
    { enemyId: 'bandit', chance: 0.15 },
    { enemyId: 'wolf_pack_alpha', chance: 0.1 },
  ],
  hills: [
    { enemyId: 'bandit', chance: 0.2 },
    { enemyId: 'deserter', chance: 0.1 },
  ],
  ruins: [
    { enemyId: 'mercenary', chance: 0.35 },
    { enemyId: 'deserter', chance: 0.2 },
    { enemyId: 'patrol_chief', chance: 0.1 },
  ],
  village: [
    { enemyId: 'bandit', chance: 0.1 },
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
        // Retourner une copie
        return { ...enemy };
      }
    }
  }
  
  return null;
}

// Fonction pour obtenir l'icône de l'ennemi
export function getEnemyIcon(enemyId: string): string {
  switch (enemyId) {
    case 'wolf':
    case 'wolf_pack_alpha':
      return '🐺';
    case 'bandit':
      return '🗡️';
    case 'mercenary':
      return '⚔️';
    case 'deserter':
      return '💀';
    case 'patrol_chief':
      return '🛡️';
    default:
      return '👤';
  }
}
