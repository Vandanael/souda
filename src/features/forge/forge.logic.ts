import { Item } from '../../types/item'
import { BALANCE_CONFIG } from '../../config/balance'
import { RelicInstance } from '../../types/relic'
import { getRelicRepairMultiplier } from '../relics/relics.bonus'

/**
 * Calcule le coût de réparation d'un item
 * Coût = (max - current) × repairCostPerPoint × rareté
 * @param item Item à réparer
 * @param narrativeCounters Compteurs narratifs (optionnel, pour bonus pragmatisme)
 * @param relics Reliques du joueur (optionnel, pour bonus réparations)
 */
export function calculateRepairCost(
  item: Item,
  narrativeCounters?: Record<string, number>,
  relics?: RelicInstance[]
): number {
  const missingDurability = item.maxDurability - item.durability
  const rarityMultiplier = item.rarity === 'common' ? 1.0 : 
                          item.rarity === 'uncommon' ? 1.5 :
                          item.rarity === 'rare' ? 2.5 : 5.0
  
  // Bonus pragmatisme : -15% coût de réparation si pragmatisme >= 8 (augmenté de -10% et seuil réduit de 10)
  let pragmatismeBonus = 1.0
  if (narrativeCounters && (narrativeCounters.pragmatisme || 0) >= 8) {
    pragmatismeBonus = 0.85
  }
  
  // Bonus reliques : multiplicateur de réparation (ex: -10% = 0.9)
  const relicRepairMultiplier = relics ? getRelicRepairMultiplier(relics) : 1.0
  
  const cost = missingDurability * BALANCE_CONFIG.economy.repairCostPerPoint * rarityMultiplier * pragmatismeBonus * relicRepairMultiplier
  return Math.ceil(cost)
}

/**
 * Répare un item à 100% de durabilité
 */
export function repairItem(item: Item): Item {
  return {
    ...item,
    durability: item.maxDurability
  }
}

/**
 * Obtient le commentaire de Bertram selon l'état de l'item
 */
export function getBertramComment(durabilityPercent: number, reputation: number): string {
  if (durabilityPercent < 25) {
    return reputation >= 4
      ? "Encore un peu et c'était bon pour la ferraille... Mais je vais arranger ça."
      : "Encore un peu et c'était bon pour la ferraille..."
  } else if (durabilityPercent < 50) {
    return reputation >= 4
      ? "Ça a vécu, mais c'est réparable. Je m'en occupe."
      : "Ça a vécu, mais c'est réparable."
  } else if (durabilityPercent < 75) {
    return reputation >= 4
      ? "Pas mal usé, mais rien de grave. Je peux arranger ça."
      : "Pas mal usé, mais rien de grave."
  } else {
    return reputation >= 4
      ? "Presque neuf, pourquoi venir me voir ? Mais bon, je peux le polir un peu."
      : "Presque neuf, pourquoi venir me voir ?"
  }
}

/**
 * Obtient le dialogue de présentation de Bertram
 */
export function getBertramIntroduction(hasVisited: boolean): string {
  if (hasVisited) {
    return "Reviens quand tu veux. J'ai toujours mes outils."
  }
  return "Bertram, forgeron. Je répare, je forge, je vends. Que veux-tu ?"
}

/**
 * Obtient le dialogue contextuel selon la réputation
 */
export function getBertramContextualDialogue(reputation: number): string {
  if (reputation <= 1) {
    return "Tu as l'air d'avoir des ennuis. Moi, je fais mon travail, c'est tout."
  } else if (reputation <= 2) {
    return "Tu commences à te faire connaître. Continue comme ça."
  } else if (reputation >= 4) {
    return "Tu as une bonne réputation ici. Je peux te faire un petit prix."
  } else {
    return "Besoin de quelque chose ?"
  }
}
