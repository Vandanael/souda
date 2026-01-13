import { Item, ItemRarity } from '../../types/item'

export type Reputation = 1 | 2 | 3 | 4 | 5

/**
 * Multiplicateurs de prix selon la réputation (pour VENTE)
 */
const REPUTATION_SELL_MULTIPLIERS: Record<Reputation, number> = {
  1: 0.6,  // ⭐ : -40%
  2: 0.8,  // ⭐⭐ : -20%
  3: 1.0,  // ⭐⭐⭐ : Normal
  4: 1.1,  // ⭐⭐⭐⭐ : +10%
  5: 1.2   // ⭐⭐⭐⭐⭐ : +20%
}

/**
 * Multiplicateurs de prix selon la réputation (pour ACHAT)
 * Inversé : meilleure réputation = meilleurs prix
 */
const REPUTATION_BUY_MULTIPLIERS: Record<Reputation, number> = {
  1: 1.4,  // ⭐ : +40%
  2: 1.2,  // ⭐⭐ : +20%
  3: 1.0,  // ⭐⭐⭐ : Normal
  4: 0.9,  // ⭐⭐⭐⭐ : -10%
  5: 0.8   // ⭐⭐⭐⭐⭐ : -20%
}

/**
 * Multiplicateurs selon la rareté
 */
const RARITY_MULTIPLIERS: Record<ItemRarity, number> = {
  common: 1.0,
  uncommon: 1.5,
  rare: 2.5,
  legendary: 5.0
}

/**
 * Calcule le prix de vente d'un item
 * @param item Item à vendre
 * @param reputation Réputation du joueur
 * @param narrativeCounters Compteurs narratifs (optionnel, pour bonus humanité)
 */
export function calculateSellPrice(
  item: Item, 
  reputation: Reputation,
  narrativeCounters?: Record<string, number>
): number {
  const baseValue = item.value
  const rarityMultiplier = RARITY_MULTIPLIERS[item.rarity]
  const reputationMultiplier = REPUTATION_SELL_MULTIPLIERS[reputation]
  
  // Bonus humanité : +10% prix de vente si humanité >= 8 (augmenté de +5% et seuil réduit de 10)
  let humaniteBonus = 1.0
  if (narrativeCounters && (narrativeCounters.humanite || 0) >= 8) {
    humaniteBonus = 1.10
  }
  
  return Math.floor(baseValue * rarityMultiplier * reputationMultiplier * humaniteBonus)
}

/**
 * Calcule le prix d'achat d'un item
 * @param item Item à acheter
 * @param reputation Réputation du joueur
 * @param narrativeCounters Compteurs narratifs (optionnel, pour bonus cynisme)
 */
export function calculateBuyPrice(
  item: Item, 
  reputation: Reputation,
  narrativeCounters?: Record<string, number>
): number {
  const baseValue = item.value
  const rarityMultiplier = RARITY_MULTIPLIERS[item.rarity]
  const reputationMultiplier = REPUTATION_BUY_MULTIPLIERS[reputation]
  
  // Bonus cynisme : -15% prix d'achat si cynisme >= 8 (augmenté de -10% et seuil réduit de 10)
  let cynismeBonus = 1.0
  if (narrativeCounters && (narrativeCounters.cynisme || 0) >= 8) {
    cynismeBonus = 0.85
  }
  
  // Prix d'achat = valeur × 1.5 × multiplicateurs × bonus cynisme
  return Math.floor(baseValue * 1.5 * rarityMultiplier * reputationMultiplier * cynismeBonus)
}

/**
 * Obtient le multiplicateur de vente selon la réputation
 */
export function getSellMultiplier(reputation: Reputation): number {
  return REPUTATION_SELL_MULTIPLIERS[reputation]
}

/**
 * Obtient le multiplicateur d'achat selon la réputation
 */
export function getBuyMultiplier(reputation: Reputation): number {
  return REPUTATION_BUY_MULTIPLIERS[reputation]
}
