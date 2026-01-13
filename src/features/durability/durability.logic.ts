import { Item } from '../../types/item'
import { SeededRandom } from '../combat/combat.logic'

export type DurabilityState = 'normal' | 'worn' | 'damaged' | 'broken'

/**
 * Applique une perte de durabilité à un item
 * @param item Item à modifier
 * @param percentage Pourcentage de perte (10-20)
 * @param random Générateur aléatoire (optionnel)
 * @returns Item avec durabilité mise à jour
 */
export function applyDurabilityLoss(
  item: Item,
  percentage: number
): Item {
  // Propriété "solid" = immunité totale
  if (item.properties.includes('solid')) {
    return item
  }
  
  const loss = (item.maxDurability * percentage) / 100
  const newDurability = Math.max(0, item.durability - loss)
  
  return {
    ...item,
    durability: newDurability
  }
}

/**
 * Détermine l'état de durabilité d'un item
 */
export function getDurabilityState(item: Item): DurabilityState {
  const percentage = (item.durability / item.maxDurability) * 100
  
  if (percentage === 0) {
    return 'broken'
  } else if (percentage <= 25) {
    return 'damaged'
  } else if (percentage <= 50) {
    return 'worn'
  } else {
    return 'normal'
  }
}

/**
 * Obtient le multiplicateur de stats selon l'état de durabilité
 */
export function getDurabilityMultiplier(state: DurabilityState): number {
  switch (state) {
    case 'normal':
      return 1.0
    case 'worn':
      return 0.8
    case 'damaged':
      return 0.5
    case 'broken':
      return 0.0
  }
}

/**
 * Calcule les stats effectives d'un item avec dégradation
 */
export function getEffectiveStats(item: Item): { atk: number; def: number; vit: number } {
  const state = getDurabilityState(item)
  const multiplier = getDurabilityMultiplier(state)
  
  return {
    atk: Math.floor(item.stats.atk * multiplier),
    def: Math.floor(item.stats.def * multiplier),
    vit: Math.floor(item.stats.vit * multiplier)
  }
}

/**
 * Sélectionne aléatoirement des items équipés pour subir des dégâts
 * @param equipment Équipement actuel
 * @param count Nombre d'items à sélectionner (1-2)
 * @param random Générateur aléatoire (optionnel)
 * @returns Liste d'items sélectionnés
 */
export function selectItemsForDamage(
  equipment: Partial<Record<string, Item>>,
  count: number,
  random?: SeededRandom
): Item[] {
  const equippedItems = Object.values(equipment).filter((item): item is Item => item !== undefined)
  
  if (equippedItems.length === 0) {
    return []
  }
  
  // Filtrer les items "solid" (immunité)
  const damageableItems = equippedItems.filter(item => !item.properties.includes('solid'))
  
  if (damageableItems.length === 0) {
    return []
  }
  
  const numToSelect = Math.min(count, damageableItems.length)
  
  // Mélanger et prendre les N premiers
  const shuffled = [...damageableItems].sort(() => 
    random ? random.next() - 0.5 : Math.random() - 0.5
  )
  
  return shuffled.slice(0, numToSelect)
}

/**
 * Applique la dégradation selon le résultat de combat
 * @param equipment Équipement actuel
 * @param outcome Résultat du combat
 * @param random Générateur aléatoire (optionnel)
 * @returns Liste des items endommagés avec nouvelle durabilité
 */
export function applyCombatDamage(
  equipment: Partial<Record<string, Item>>,
  outcome: 'costly' | 'flee',
  random?: SeededRandom
): Array<{ itemId: string; newDurability: number; state: DurabilityState }> {
  const results: Array<{ itemId: string; newDurability: number; state: DurabilityState }> = []
  
  if (outcome === 'costly') {
    // Victoire coûteuse : -10 à -20% sur 1 item
    const items = selectItemsForDamage(equipment, 1, random)
    if (items.length > 0) {
      const lossPercent = random
        ? random.nextInt(10, 20)
        : Math.floor(Math.random() * 11) + 10
      
      const item = items[0]
      const updated = applyDurabilityLoss(item, lossPercent)
      
      results.push({
        itemId: item.id,
        newDurability: updated.durability,
        state: getDurabilityState(updated)
      })
    }
  } else if (outcome === 'flee') {
    // Fuite : -15% sur 1-2 items
    const numItems = random
      ? (random.next() < 0.5 ? 1 : 2)
      : (Math.random() < 0.5 ? 1 : 2)
    
    const items = selectItemsForDamage(equipment, numItems, random)
    
    items.forEach(item => {
      const updated = applyDurabilityLoss(item, 15)
      
      results.push({
        itemId: item.id,
        newDurability: updated.durability,
        state: getDurabilityState(updated)
      })
    })
  }
  
  return results
}

/**
 * Vérifie si un item est cassé (durabilité à 0)
 */
export function isItemBroken(item: Item): boolean {
  return item.durability <= 0
}

/**
 * Obtient la couleur selon l'état de durabilité
 */
export function getDurabilityColor(state: DurabilityState): string {
  switch (state) {
    case 'normal':
      return '#4a8' // Vert
    case 'worn':
      return '#ca8' // Jaune
    case 'damaged':
      return '#c84' // Orange
    case 'broken':
      return '#c44' // Rouge
  }
}
