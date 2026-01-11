import type { LootCard, TileType } from '../types';

// ============================================
// POOL DE LOOT - SOUDA: Terra Incognita
// ============================================

export const LOOT_POOL: LootCard[] = [
  // === ARMES ===
  {
    id: 'wpn_rusty_sword',
    name: 'Épée Rouillée',
    type: 'weapon',
    weight: 1,
    stats: { atk: 3 },
    description: 'Lame émoussée. Elle a connu des jours meilleurs.',
    value: 5,
  },
  {
    id: 'wpn_dagger',
    name: 'Dague Rapide',
    type: 'weapon',
    weight: 0.5,
    stats: { atk: 3 },
    description: 'Légère et maniable. Pour les combattants agiles.',
    value: 15,
  },
  {
    id: 'wpn_longsword',
    name: 'Épée Longue',
    type: 'weapon',
    weight: 2,
    stats: { atk: 5 },
    description: 'Équilibrée. Le choix du professionnel.',
    value: 35,
  },
  {
    id: 'wpn_axe',
    name: 'Hache de Guerre',
    type: 'weapon',
    weight: 3.5,
    stats: { atk: 7 },
    description: 'Frappe lourde. Pour ceux qui ont la force.',
    value: 60,
  },
  {
    id: 'wpn_shortbow',
    name: 'Arc Court',
    type: 'weapon',
    weight: 1,
    stats: { atk: 4 },
    description: 'Attaque à distance. Évite les coups.',
    value: 45,
  },

  // === ARMURES ===
  {
    id: 'arm_clothes',
    name: 'Vêtements de Voyage',
    type: 'armor',
    weight: 1.5,
    stats: { def: 1 },
    description: 'Tissu épais, rapiécé. Mieux que rien.',
    value: 5,
  },
  {
    id: 'arm_gambeson',
    name: 'Gambeson Renforcé',
    type: 'armor',
    weight: 2,
    stats: { def: 2 },
    description: 'Tissu matelassé. Protection décente.',
    value: 25,
  },
  {
    id: 'arm_chainmail',
    name: 'Maille Légère',
    type: 'armor',
    weight: 3.5,
    stats: { def: 3 },
    description: 'Anneaux de fer. Solide.',
    value: 50,
  },
  {
    id: 'arm_cuirass',
    name: 'Cuirasse de Plaques',
    type: 'armor',
    weight: 5,
    stats: { def: 5 },
    description: 'Protection maximale. Très lourde.',
    value: 100,
  },

  // === CONSOMMABLES ===
  {
    id: 'cons_bread',
    name: 'Pain Sec',
    type: 'consumable',
    weight: 0.3,
    stats: { heal: 5, hungerRestore: 1 },
    description: '+1 jour faim, +5 HP',
    value: 2,
  },
  {
    id: 'cons_fresh_bread',
    name: 'Pain Frais',
    type: 'consumable',
    weight: 0.3,
    stats: { heal: 10, hungerRestore: 1 },
    description: '+1 jour faim, +10 HP',
    value: 3,
  },
  {
    id: 'cons_meat',
    name: 'Viande Séchée',
    type: 'consumable',
    weight: 0.5,
    stats: { heal: 15, hungerRestore: 2 },
    description: '+2 jours faim, +15 HP',
    value: 6,
  },
  {
    id: 'cons_bandage_dirty',
    name: 'Bandage Sale',
    type: 'consumable',
    weight: 0.2,
    stats: { heal: 20 },
    description: '+20 HP',
    value: 3,
  },
  {
    id: 'cons_bandage',
    name: 'Bandage Propre',
    type: 'consumable',
    weight: 0.2,
    stats: { heal: 30 },
    description: '+30 HP',
    value: 5,
  },

  // === TRÉSORS ===
  {
    id: 'gold_pouch_small',
    name: 'Petite Bourse',
    type: 'treasure',
    weight: 0.1,
    stats: {},
    description: '5-10 pièces de cuivre',
    value: 8,
  },
  {
    id: 'gold_pouch',
    name: 'Bourse de Pièces',
    type: 'treasure',
    weight: 0.2,
    stats: {},
    description: '10-20 pièces de cuivre',
    value: 15,
  },
  {
    id: 'wolf_pelt',
    name: 'Peau de Loup',
    type: 'treasure',
    weight: 0.5,
    stats: {},
    description: 'Vaut 5 pièces chez le marchand.',
    value: 5,
  },
  {
    id: 'rare_gem',
    name: 'Gemme Brute',
    type: 'treasure',
    weight: 0.1,
    stats: {},
    description: 'Pierre précieuse non taillée.',
    value: 25,
  },

  // === COMPÉTENCES ===
  {
    id: 'skill_vigilant',
    name: 'Vigilant',
    type: 'skill',
    weight: 0,
    stats: {},
    description: 'Tu vois les dangers 1 tuile à l\'avance.',
    value: 30,
  },
];

// Fonction pour obtenir un item par ID
export function getLootById(id: string): LootCard | undefined {
  return LOOT_POOL.find(item => item.id === id);
}

// Fonction pour générer du loot aléatoire selon le biome
export function rollLoot(tileType: TileType): LootCard | null {
  // Chances de drop par biome
  const dropChance: Record<TileType, number> = {
    hub: 0,
    plain: 0.25,
    forest: 0.35,
    hills: 0.45,
    ruins: 0.6,
    village: 0.5,
  };

  if (Math.random() > dropChance[tileType]) return null;

  // Filtrer le pool selon le biome
  const pool = LOOT_POOL.filter(loot => {
    switch (tileType) {
      case 'ruins':
        // Tout peut drop dans les ruines
        return true;
      case 'forest':
        // Forêt: consommables, trésors (peaux), armes légères
        return loot.type === 'consumable' || 
               loot.type === 'treasure' || 
               (loot.type === 'weapon' && loot.weight <= 1);
      case 'hills':
        // Collines: trésors (gemmes, bourses) et armes
        return loot.type === 'treasure' || loot.type === 'weapon';
      case 'village':
        // Village: consommables, armures, quelques armes
        return loot.type === 'consumable' || 
               loot.type === 'armor' || 
               (loot.type === 'weapon' && Math.random() < 0.3);
      case 'plain':
        // Plaine: surtout consommables et petits trésors
        return loot.type === 'consumable' || 
               (loot.type === 'treasure' && loot.weight <= 0.2);
      default:
        return false;
    }
  });

  if (pool.length === 0) return null;

  // Sélectionner aléatoirement dans le pool filtré
  const randomIndex = Math.floor(Math.random() * pool.length);
  
  // Retourner une copie pour éviter les mutations
  return { ...pool[randomIndex] };
}

// Équipement de départ
export const STARTER_WEAPON: LootCard = {
  id: 'wpn_rusty_sword',
  name: 'Épée Rouillée',
  type: 'weapon',
  weight: 1,
  stats: { atk: 3 },
  description: 'Lame émoussée. Elle a connu des jours meilleurs.',
  value: 5,
};

export const STARTER_ARMOR: LootCard = {
  id: 'arm_clothes',
  name: 'Vêtements de Voyage',
  type: 'armor',
  weight: 1.5,
  stats: { def: 1 },
  description: 'Tissu épais, rapiécé. Mieux que rien.',
  value: 5,
};

export const STARTER_ITEMS: LootCard[] = [
  {
    id: 'cons_bread',
    name: 'Pain Sec',
    type: 'consumable',
    weight: 0.3,
    stats: { heal: 5, hungerRestore: 1 },
    description: '+1 jour faim, +5 HP',
    value: 2,
  },
  {
    id: 'cons_bread',
    name: 'Pain Sec',
    type: 'consumable',
    weight: 0.3,
    stats: { heal: 5, hungerRestore: 1 },
    description: '+1 jour faim, +5 HP',
    value: 2,
  },
  {
    id: 'cons_bandage_dirty',
    name: 'Bandage Sale',
    type: 'consumable',
    weight: 0.2,
    stats: { heal: 20 },
    description: '+20 HP',
    value: 3,
  },
];
