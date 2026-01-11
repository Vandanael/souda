import type { LootCard, TileType } from '../types';

// ============================================
// POOL DE LOOT - SOUDA: Terra Incognita
// ============================================

export const LOOT_POOL: LootCard[] = [
  // === ARMES (Tier 1 - Communes) ===
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
    id: 'wpn_club',
    name: 'Gourdin',
    type: 'weapon',
    weight: 1.5,
    stats: { atk: 4 },
    description: 'Simple mais efficace. Pas besoin de finesse.',
    value: 8,
  },
  
  // === ARMES (Tier 2 - Peu communes) ===
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
    id: 'wpn_shortbow',
    name: 'Arc Court',
    type: 'weapon',
    weight: 1,
    stats: { atk: 4 },
    description: 'Attaque à distance. Évite les coups.',
    value: 45,
  },
  {
    id: 'wpn_mace',
    name: 'Masse d\'Armes',
    type: 'weapon',
    weight: 2.5,
    stats: { atk: 6 },
    description: 'Ignore une partie de l\'armure.',
    value: 50,
  },
  
  // === ARMES (Tier 3 - Rares) ===
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
    id: 'wpn_greatsword',
    name: 'Espadon',
    type: 'weapon',
    weight: 4,
    stats: { atk: 8 },
    description: 'Lame massive à deux mains. Dévastateur.',
    value: 80,
  },
  {
    id: 'wpn_elite_blade',
    name: 'Lame de Vétéran',
    type: 'weapon',
    weight: 2,
    stats: { atk: 7 },
    description: 'Acier de qualité, parfaitement entretenue.',
    value: 90,
  },

  // === ARMURES (Tier 1 - Communes) ===
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
    id: 'arm_leather',
    name: 'Cuir Durci',
    type: 'armor',
    weight: 2,
    stats: { def: 2 },
    description: 'Protection légère mais fiable.',
    value: 20,
  },
  
  // === ARMURES (Tier 2 - Peu communes) ===
  {
    id: 'arm_gambeson',
    name: 'Gambeson Renforcé',
    type: 'armor',
    weight: 2.5,
    stats: { def: 3 },
    description: 'Tissu matelassé. Protection décente.',
    value: 35,
  },
  {
    id: 'arm_chainmail',
    name: 'Maille Légère',
    type: 'armor',
    weight: 3.5,
    stats: { def: 4 },
    description: 'Anneaux de fer. Solide.',
    value: 50,
  },
  
  // === ARMURES (Tier 3 - Rares) ===
  {
    id: 'arm_cuirass',
    name: 'Cuirasse de Plaques',
    type: 'armor',
    weight: 5,
    stats: { def: 5 },
    description: 'Protection maximale. Très lourde.',
    value: 100,
  },
  {
    id: 'arm_elite',
    name: 'Armure de Garde',
    type: 'armor',
    weight: 4,
    stats: { def: 6 },
    description: 'Équipement militaire de qualité.',
    value: 120,
  },

  // === CONSOMMABLES (Nourriture) ===
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
    id: 'cons_ration',
    name: 'Ration de Voyage',
    type: 'consumable',
    weight: 0.4,
    stats: { heal: 20, hungerRestore: 2 },
    description: '+2 jours faim, +20 HP',
    value: 8,
  },
  {
    id: 'cons_feast',
    name: 'Repas Complet',
    type: 'consumable',
    weight: 0.8,
    stats: { heal: 30, hungerRestore: 3 },
    description: '+3 jours faim, +30 HP',
    value: 15,
  },
  
  // === CONSOMMABLES (Soins) ===
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
  {
    id: 'cons_potion',
    name: 'Potion de Soin',
    type: 'consumable',
    weight: 0.3,
    stats: { heal: 50 },
    description: '+50 HP',
    value: 20,
  },
  {
    id: 'cons_elixir',
    name: 'Élixir Rare',
    type: 'consumable',
    weight: 0.2,
    stats: { heal: 80 },
    description: '+80 HP - Très rare',
    value: 50,
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
    id: 'gold_pouch_large',
    name: 'Grosse Bourse',
    type: 'treasure',
    weight: 0.3,
    stats: {},
    description: '20-40 pièces',
    value: 30,
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
  {
    id: 'ancient_coin',
    name: 'Pièce Ancienne',
    type: 'treasure',
    weight: 0.1,
    stats: {},
    description: 'Monnaie d\'un empire oublié.',
    value: 40,
  },
  {
    id: 'golden_ring',
    name: 'Anneau d\'Or',
    type: 'treasure',
    weight: 0.05,
    stats: {},
    description: 'Finement ouvragé. Très précieux.',
    value: 60,
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
  {
    id: 'skill_tough',
    name: 'Endurant',
    type: 'skill',
    weight: 0,
    stats: {},
    description: '+20 HP max.',
    value: 40,
  },
  {
    id: 'skill_scavenger',
    name: 'Fouilleur',
    type: 'skill',
    weight: 0,
    stats: {},
    description: '+20% chance de trouver du loot.',
    value: 35,
  },
];

// Fonction pour obtenir un item par ID
export function getLootById(id: string): LootCard | undefined {
  return LOOT_POOL.find(item => item.id === id);
}

// Fonction pour générer du loot aléatoire selon le biome
export function rollLoot(tileType: TileType, bonusChance: number = 0): LootCard | null {
  // Chances de drop par biome (augmentées pour récompenser l'exploration)
  const dropChance: Record<TileType, number> = {
    hub: 0,
    plain: 0.35,
    forest: 0.45,
    hills: 0.55,
    ruins: 0.7,
    village: 0.6,
  };

  const finalChance = Math.min(1, dropChance[tileType] + bonusChance);
  if (Math.random() > finalChance) return null;

  // Filtrer le pool selon le biome
  const pool = LOOT_POOL.filter(loot => {
    // Exclure les skills du loot normal (ils viennent des événements)
    if (loot.type === 'skill') return false;
    
    switch (tileType) {
      case 'ruins':
        // Tout peut drop dans les ruines (sauf skills)
        return true;
      case 'forest':
        // Forêt: consommables, trésors (peaux), armes légères
        return loot.type === 'consumable' || 
               loot.type === 'treasure' || 
               (loot.type === 'weapon' && loot.weight <= 1.5);
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

  // Pondération par rareté (items de haute valeur moins fréquents)
  const weightedPool = pool.flatMap(item => {
    const weight = item.value && item.value > 50 ? 1 : 
                   item.value && item.value > 25 ? 2 : 3;
    return Array(weight).fill(item);
  });

  const randomIndex = Math.floor(Math.random() * weightedPool.length);
  
  return { ...weightedPool[randomIndex] };
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
