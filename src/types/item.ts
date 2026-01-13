export type ItemSlot = 
  | 'head'
  | 'torso'
  | 'legs'
  | 'hands'
  | 'weapon'
  | 'offhand'
  | 'accessory'

export type ItemRarity = 
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'legendary'

export type ItemProperty = 
  | 'light'
  | 'heavy'
  | 'rusty'
  | 'bloody'
  | 'blessed'
  | 'stolen'
  | 'solid'

export interface Item {
  id: string
  name: string
  slot: ItemSlot
  rarity: ItemRarity
  stats: {
    atk: number
    def: number
    vit: number
  }
  durability: number
  maxDurability: number
  properties: ItemProperty[]
  setId?: string
  value: number
  description: string
  cursed?: boolean // Si l'item est compromis/défectueux
  curseEffect?: string // Description courte de l'effet
  curseDescription?: string // Description détaillée du défaut
  hiddenMalus?: Partial<{ atk: number; def: number; vit: number }> // Malus caché sur les stats
  visibleMalus?: Partial<{ atk: number; def: number; vit: number }> // Malus visible (optionnel)
}

// Items de base pour le prototype
export const BASE_ITEMS: Item[] = [
  {
    id: 'sword_chipped',
    name: 'Épée Ébréchée',
    slot: 'weapon',
    rarity: 'common',
    stats: { atk: 8, def: 0, vit: 0 },
    durability: 100,
    maxDurability: 100,
    properties: [],
    value: 10,
    description: 'Ton épée de départ. Elle a vu des combats.'
  },
  {
    id: 'leather_armor',
    name: 'Armure de Cuir',
    slot: 'torso',
    rarity: 'common',
    stats: { atk: 0, def: 6, vit: 0 },
    durability: 100,
    maxDurability: 100,
    properties: [],
    value: 8,
    description: 'Une armure usée mais solide.'
  },
  {
    id: 'sword_dented',
    name: 'Épée Dentelée',
    slot: 'weapon',
    rarity: 'uncommon',
    stats: { atk: 12, def: 0, vit: 0 },
    durability: 100,
    maxDurability: 100,
    properties: [],
    value: 25,
    description: 'Une épée qui a mordu dans la chair. Efficace.'
  },
  {
    id: 'helmet_rusty',
    name: 'Casque Rouillé',
    slot: 'head',
    rarity: 'common',
    stats: { atk: 0, def: 4, vit: 0 },
    durability: 75,
    maxDurability: 100,
    properties: ['rusty'],
    value: 12,
    description: 'Rouillé mais ça protège encore.'
  },
  {
    id: 'mail_shirt',
    name: 'Chemise de Mailles',
    slot: 'torso',
    rarity: 'uncommon',
    stats: { atk: 0, def: 10, vit: -1 },
    durability: 100,
    maxDurability: 100,
    properties: ['heavy'],
    value: 30,
    description: 'Lourde mais résistante. Ça ralentit un peu.'
  },
  {
    id: 'dagger_bloody',
    name: 'Dague Ensanglantée',
    slot: 'weapon',
    rarity: 'rare',
    stats: { atk: 10, def: 0, vit: 2 },
    durability: 100,
    maxDurability: 100,
    properties: ['bloody', 'light'],
    value: 45,
    description: 'Légère et rapide. Le sang séché porte chance.'
  },
  {
    id: 'shield_wooden',
    name: 'Bouclier de Bois',
    slot: 'offhand',
    rarity: 'common',
    stats: { atk: 0, def: 8, vit: 0 },
    durability: 100,
    maxDurability: 100,
    properties: [],
    value: 15,
    description: 'Un bouclier simple. Mieux que rien.'
  },
  {
    id: 'boots_worn',
    name: 'Bottes Usées',
    slot: 'legs',
    rarity: 'common',
    stats: { atk: 0, def: 2, vit: 3 },
    durability: 100,
    maxDurability: 100,
    properties: ['light'],
    value: 10,
    description: 'Usées mais confortables. Tu bouges mieux.'
  }
]

// Fonction pour générer un item aléatoire selon le risque
export function generateRandomItem(riskLevel: number): Item {
  const risk = Math.min(5, Math.max(1, riskLevel))
  
  // Probabilités de rareté selon le risque
  let rarity: ItemRarity = 'common'
  const rand = Math.random()
  
  if (risk <= 1) {
    // Risque faible = seulement commun
    rarity = 'common'
  } else if (risk === 2) {
    // Risque moyen = 70% commun, 30% peu commun
    rarity = rand < 0.7 ? 'common' : 'uncommon'
  } else if (risk === 3) {
    // Risque élevé = 50% commun, 40% peu commun, 10% rare
    if (rand < 0.5) rarity = 'common'
    else if (rand < 0.9) rarity = 'uncommon'
    else rarity = 'rare'
  } else {
    // Risque très élevé = 30% commun, 50% peu commun, 20% rare
    if (rand < 0.3) rarity = 'common'
    else if (rand < 0.8) rarity = 'uncommon'
    else rarity = 'rare'
  }
  
  // Sélectionner un item de la rareté appropriée
  const itemsOfRarity = BASE_ITEMS.filter(item => item.rarity === rarity)
  if (itemsOfRarity.length === 0) {
    // Fallback sur commun
    return BASE_ITEMS[0]
  }
  
  const randomItem = itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)]
  
  // Créer une copie avec un ID unique
  return {
    ...randomItem,
    id: `${randomItem.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    durability: randomItem.maxDurability // Toujours à 100% au loot
  }
}

// Fonction pour obtenir le nom de la rareté en français
export function getRarityName(rarity: ItemRarity): string {
  const names: Record<ItemRarity, string> = {
    common: 'Commun',
    uncommon: 'Peu Commun',
    rare: 'Rare',
    legendary: 'Légendaire'
  }
  return names[rarity]
}

// Fonction pour obtenir la couleur selon la rareté (en gris pour l'instant)
export function getRarityColor(rarity: ItemRarity): string {
  const colors: Record<ItemRarity, string> = {
    common: '#888',      // Gris moyen
    uncommon: '#aaa',    // Gris clair
    rare: '#ddd',        // Gris très clair
    legendary: '#fff'    // Blanc
  }
  return colors[rarity]
}
