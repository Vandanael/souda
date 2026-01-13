import { Item } from '../../types/item'

/**
 * Pool d'items compromis avec malus cachés
 * Objets obtenus via rumeurs ou marchands douteux - puissants mais avec défauts
 */
export const COMPROMISED_ITEMS: Item[] = [
  {
    id: 'sword_compromised',
    name: 'Épée Lourde de Guerre',
    slot: 'weapon',
    rarity: 'legendary',
    stats: { atk: 20, def: 0, vit: 0 },
    durability: 100,
    maxDurability: 100,
    properties: ['bloody', 'heavy'],
    value: 50,
    description: 'Une épée de guerre massive. Elle frappe comme un marteau, mais sa lourdeur te fatigue rapidement.',
    cursed: true,
    curseEffect: 'Réduit ta vitalité de 5 points (lourdeur)',
    curseDescription: 'Cette épée est trop lourde pour être maniée efficacement. Elle te fatigue rapidement.',
    hiddenMalus: { vit: -5 }
  },
  {
    id: 'armor_compromised',
    name: 'Armure de Pillard',
    slot: 'torso',
    rarity: 'legendary',
    stats: { atk: 0, def: 25, vit: 0 },
    durability: 100,
    maxDurability: 100,
    properties: ['heavy'],
    value: 60,
    description: 'Une armure de pillard, marquée de symboles infâmes. Elle te protège, mais les marchands te reconnaissent et te font payer plus cher.',
    cursed: true,
    curseEffect: 'Réduit l\'or gagné de 10% (réputation de pillard)',
    curseDescription: 'Cette armure porte les marques d\'un pillard notoire. Les marchands te reconnaissent et te font payer plus cher.',
    hiddenMalus: {} // Malus géré dans le code (réduction or)
  },
  {
    id: 'amulet_compromised',
    name: 'Amulette de Déserteur',
    slot: 'accessory',
    rarity: 'rare',
    stats: { atk: 0, def: 0, vit: 15 },
    durability: 100,
    maxDurability: 100,
    properties: [],
    value: 40,
    description: 'Une amulette militaire volée. Elle te rappelle ta mobilité passée, mais trahit ton passé de déserteur.',
    cursed: true,
    curseEffect: 'Réduit ta réputation de 1 (symbole de déserteur)',
    curseDescription: 'Cette amulette porte les symboles d\'un déserteur. Les gens te reconnaissent et te font moins confiance.',
    hiddenMalus: {} // Malus géré dans le code (réputation)
  },
  {
    id: 'boots_compromised',
    name: 'Bottes Usées de Voyageur',
    slot: 'legs',
    rarity: 'rare',
    stats: { atk: 0, def: 5, vit: 10 },
    durability: 100,
    maxDurability: 100,
    properties: ['light'],
    value: 35,
    description: 'Des bottes de voyageur usées mais légères. Elles te font bouger vite, mais offrent peu de protection.',
    cursed: true,
    curseEffect: 'Réduit ta défense de 3 points (protection insuffisante)',
    curseDescription: 'Ces bottes sont légères mais usées. Elles offrent peu de protection aux pieds.',
    hiddenMalus: { def: -3 }
  }
]

// Alias pour rétrocompatibilité
export const CURSED_ITEMS = COMPROMISED_ITEMS
