import { Item, ItemRarity, ItemProperty, BASE_ITEMS } from '../../types/item'
import { SeededRandom } from '../combat/combat.logic'

/**
 * Probabilités de rareté selon le risque du lieu
 */
export interface RarityProbabilities {
  common: number
  uncommon: number
  rare: number
  legendary: number
}

/**
 * Probabilités de base (lieu normal)
 */
const BASE_PROBABILITIES: RarityProbabilities = {
  common: 0.60,    // 60%
  uncommon: 0.30,  // 30%
  rare: 0.09,      // 9%
  legendary: 0.01 // 1%
}

/**
 * Probabilités pour lieu risqué (×1.5 pour rare/legendary)
 */
const RISKY_PROBABILITIES: RarityProbabilities = {
  common: 0.50,    // 50%
  uncommon: 0.35,  // 35%
  rare: 0.12,      // 12%
  legendary: 0.03 // 3%
}

/**
 * Obtient les probabilités selon le risque du lieu
 */
export function getRarityProbabilities(locationRisk: number): RarityProbabilities {
  const risk = Math.min(4, Math.max(1, locationRisk))
  
  // Risque 3-4 = lieu risqué
  if (risk >= 3) {
    return RISKY_PROBABILITIES
  }
  
  return BASE_PROBABILITIES
}

/**
 * Détermine la rareté selon les probabilités
 */
export function determineRarity(
  probabilities: RarityProbabilities,
  random?: SeededRandom
): ItemRarity {
  const rand = random ? random.next() : Math.random()
  
  if (rand < probabilities.common) {
    return 'common'
  } else if (rand < probabilities.common + probabilities.uncommon) {
    return 'uncommon'
  } else if (rand < probabilities.common + probabilities.uncommon + probabilities.rare) {
    return 'rare'
  } else {
    return 'legendary'
  }
}

/**
 * Propriétés spéciales disponibles pour Rare+
 */
const SPECIAL_PROPERTIES: ItemProperty[] = [
  'light',
  'heavy',
  'rusty',
  'bloody',
  'blessed',
  'solid'
]

/**
 * Ajoute une propriété spéciale à un item Rare+
 * @param item Item à modifier
 * @param random Générateur aléatoire (optionnel)
 * @returns Item avec propriété ajoutée (30% chance)
 */
function addSpecialProperty(
  item: Item,
  random?: SeededRandom
): Item {
  // 30% de chance d'ajouter une propriété
  const shouldAdd = random ? random.next() < 0.3 : Math.random() < 0.3
  
  if (!shouldAdd || item.properties.length >= 2) {
    return item
  }
  
  // Éviter les propriétés incompatibles
  const availableProps = SPECIAL_PROPERTIES.filter(prop => {
    // Ne pas ajouter 'light' si déjà 'heavy' et vice versa
    if (prop === 'light' && item.properties.includes('heavy')) return false
    if (prop === 'heavy' && item.properties.includes('light')) return false
    // Ne pas dupliquer
    if (item.properties.includes(prop)) return false
    return true
  })
  
  if (availableProps.length === 0) {
    return item
  }
  
  const randomProp = availableProps[
    random 
      ? random.nextInt(0, availableProps.length - 1)
      : Math.floor(Math.random() * availableProps.length)
  ]
  
  return {
    ...item,
    properties: [...item.properties, randomProp]
  }
}

/**
 * Génère la durabilité initiale (80-100%)
 */
function generateDurability(
  maxDurability: number,
  random?: SeededRandom
): number {
  const percentage = random
    ? random.nextInt(80, 100)
    : Math.floor(Math.random() * 21) + 80
  
  return Math.floor(maxDurability * percentage / 100)
}

/**
 * Applique le scaling de valeur d'item selon le jour
 * @param item Item de base
 * @param day Jour actuel
 * @returns Item avec valeur scalée
 */
export function scaleItemValue(item: Item, day: number): Item {
  const scalingFactor = 1 + ((day - 1) * 0.1) // +10% par jour (J1 = 1.0, J2 = 1.1, J10 = 1.9)
  
  return {
    ...item,
    value: Math.round(item.value * scalingFactor)
  }
}

/**
 * Génère un item de loot procédural
 * @param locationRisk Niveau de risque du lieu (1-4)
 * @param itemPool Pool d'items disponibles (par défaut BASE_ITEMS)
 * @param random Générateur aléatoire (optionnel, pour tests)
 * @param rumorBonus Si true, augmente les probabilités de rares/légendaires (optionnel)
 * @param day Jour actuel (pour scaling, par défaut 1)
 * @returns Item généré
 */
export function generateLoot(
  locationRisk: number,
  itemPool: Item[] = BASE_ITEMS,
  random?: SeededRandom,
  rumorBonus?: boolean,
  day: number = 1
): Item {
  // 1. Déterminer rareté selon probabilités ajustées par risque
  let probabilities = getRarityProbabilities(locationRisk)
  
  // Si bonus de rumeur, augmenter probabilités rares/légendaires de 50%
  if (rumorBonus) {
    probabilities = {
      common: probabilities.common * 0.85,      // Réduire un peu
      uncommon: probabilities.uncommon * 0.95, // Légèrement réduire
      rare: probabilities.rare * 1.5,          // +50%
      legendary: probabilities.legendary * 1.5  // +50%
    }
    
    // Normaliser pour que la somme = 1
    const sum = probabilities.common + probabilities.uncommon + probabilities.rare + probabilities.legendary
    probabilities.common = probabilities.common / sum
    probabilities.uncommon = probabilities.uncommon / sum
    probabilities.rare = probabilities.rare / sum
    probabilities.legendary = probabilities.legendary / sum
  }
  
  const rarity = determineRarity(probabilities, random)
  
  // 2. Filtrer itemPool par rareté
  const itemsOfRarity = itemPool.filter(item => item.rarity === rarity)
  
  if (itemsOfRarity.length === 0) {
    // Fallback : chercher dans toutes les raretés disponibles dans le pool
    // Priorité : common > uncommon > rare > legendary
    const fallbackRarities: ItemRarity[] = ['common', 'uncommon', 'rare', 'legendary']
    
    for (const fallbackRarity of fallbackRarities) {
      const fallbackItems = itemPool.filter(item => item.rarity === fallbackRarity)
      if (fallbackItems.length > 0) {
        const fallbackItem = fallbackItems[
          random
            ? random.nextInt(0, fallbackItems.length - 1)
            : Math.floor(Math.random() * fallbackItems.length)
        ]
        
        return {
          ...fallbackItem,
          id: `${fallbackItem.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          durability: generateDurability(fallbackItem.maxDurability, random),
          properties: [...fallbackItem.properties]
        }
      }
    }
    
    throw new Error('Aucun item disponible dans le pool')
  }
  
  // 3. Sélectionner item aléatoire
  const selectedItem = itemsOfRarity[
    random
      ? random.nextInt(0, itemsOfRarity.length - 1)
      : Math.floor(Math.random() * itemsOfRarity.length)
  ]
  
  // 4. Créer copie avec ID unique
  let newItem: Item = {
    ...selectedItem,
    id: `${selectedItem.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    durability: generateDurability(selectedItem.maxDurability, random),
    properties: [...selectedItem.properties] // Copie des propriétés existantes
  }
  
  // 5. Si Rare+ : ajouter propriété spéciale (30% chance)
  if (rarity === 'rare' || rarity === 'legendary') {
    newItem = addSpecialProperty(newItem, random)
  }
  
  // 6. Appliquer scaling de valeur selon le jour
  newItem = scaleItemValue(newItem, day)
  
  return newItem
}

/**
 * Génère plusieurs items de loot (pour événements spéciaux)
 */
export function generateMultipleLoot(
  count: number,
  locationRisk: number,
  itemPool: Item[] = BASE_ITEMS,
  random?: SeededRandom
): Item[] {
  const items: Item[] = []
  
  for (let i = 0; i < count; i++) {
    // Générer avec un index pour ID unique
    const item = generateLoot(locationRisk, itemPool, random)
    // S'assurer que l'ID est unique en ajoutant l'index
    item.id = `${item.id}_${i}`
    items.push(item)
  }
  
  return items
}
