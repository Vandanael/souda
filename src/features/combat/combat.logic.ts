import { Enemy } from '../../types/enemy'
import { Item } from '../../types/item'
import { PlayerStats } from '../../utils/stats'
import { RelicInstance } from '../../types/relic'
import { getRelicDamageMultiplier, getRelicFleeBonus } from '../relics/relics.bonus'

export type CombatOutcome = 
  | 'crushing'
  | 'victory'
  | 'costly'
  | 'flee'
  | 'defeat'

export interface DurabilityLoss {
  itemId: string
  amount: number // Pourcentage de perte (10-20)
}

export interface PowerBreakdown {
  atkContribution: number
  defContribution: number
  vitContribution: number
  base: number
  randomRoll: number
  total: number
}

export interface CombatBreakdown {
  player: PowerBreakdown
  enemy: PowerBreakdown
  ratio: number
  thresholds: {
    crushing: number
    victory: number
    costly: number
    flee: number
  }
}

export interface CombatResult {
  outcome: CombatOutcome
  playerPower: number
  enemyPower: number
  ratio: number
  durabilityLoss: DurabilityLoss[]
  lootEarned: boolean
  gold?: number
  message: string
  nearMissMessage?: string
  breakdown: CombatBreakdown
}

/**
 * Générateur de nombres aléatoires avec seed pour tests déterministes
 */
export class SeededRandom {
  private seed: number

  constructor(seed: number = Date.now()) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }
}

/**
 * Calcule la puissance d'un combattant selon la formule du GDD
 * @param stats Stats du combattant
 * @param isPlayer Si true, random(1-20), sinon random(1-15)
 * @param random Générateur aléatoire (optionnel, pour tests)
 */
export function calculatePower(
  stats: PlayerStats,
  isPlayer: boolean,
  random?: SeededRandom,
  relics?: RelicInstance[]
): number {
  return calculatePowerDetailed(stats, isPlayer, random, relics).total
}

export function calculatePowerDetailed(
  stats: PlayerStats,
  isPlayer: boolean,
  random?: SeededRandom,
  relics?: RelicInstance[]
): PowerBreakdown {
  // Appliquer le bonus de dégâts des reliques si c'est le joueur
  const damageMultiplier = isPlayer && relics ? getRelicDamageMultiplier(relics) : 1.0
  
  const atkContribution = stats.atk * 0.5 * damageMultiplier
  const defContribution = stats.def * 0.3
  const vitContribution = stats.vit * 0.2
  const base = atkContribution + defContribution + vitContribution
  
  // Variance réduite : joueur random(7-11), ennemi random(5-9)
  // Cela réduit la variance de 10 à 4 pour joueur, et de 7 à 4 pour ennemi
  // Résultat plus prévisible et équitable
  let randomRoll: number
  if (random) {
    randomRoll = isPlayer ? 7 + random.next() * 4 : 5 + random.next() * 4
  } else {
    randomRoll = isPlayer ? 7 + Math.random() * 4 : 5 + Math.random() * 4
  }
  
  const total = base + randomRoll
  
  return {
    atkContribution,
    defContribution,
    vitContribution,
    base,
    randomRoll,
    total
  }
}

/**
 * Calcule la perte de durabilité selon le résultat du combat
 */
function calculateDurabilityLoss(
  outcome: CombatOutcome,
  equipment: Partial<Record<string, Item>>,
  random?: SeededRandom
): DurabilityLoss[] {
  const losses: DurabilityLoss[] = []
  const equippedItems = Object.values(equipment).filter((item): item is Item => item !== undefined)
  
  if (equippedItems.length === 0) {
    return losses
  }
  
  if (outcome === 'costly') {
    // Victoire coûteuse : -10 à -20% sur 1 item
    const randomItem = equippedItems[
      random ? random.nextInt(0, equippedItems.length - 1) : Math.floor(Math.random() * equippedItems.length)
    ]
    const lossAmount = random ? random.nextInt(10, 20) : Math.floor(Math.random() * 11) + 10
    
    losses.push({
      itemId: randomItem.id,
      amount: lossAmount
    })
  } else if (outcome === 'flee') {
    // Fuite : -15% sur 1-2 items
    const numItems = random 
      ? (random.next() < 0.5 ? 1 : 2)
      : (Math.random() < 0.5 ? 1 : 2)
    
    const selectedItems = [...equippedItems]
      .sort(() => (random ? random.next() - 0.5 : Math.random() - 0.5))
      .slice(0, numItems)
    
    selectedItems.forEach(item => {
      losses.push({
        itemId: item.id,
        amount: 15
      })
    })
  }
  
  return losses
}

/**
 * Résout un combat selon les règles du GDD
 * @param playerStats Stats du joueur
 * @param enemy Ennemi à affronter
 * @param equipment Équipement du joueur (pour calculer durabilité)
 * @param random Générateur aléatoire (optionnel, pour tests)
 * @param relics Reliques du joueur (pour appliquer les bonus)
 */
export function resolveCombat(
  playerStats: PlayerStats,
  enemy: Enemy,
  equipment?: Partial<Record<string, Item>>,
  random?: SeededRandom,
  relics?: RelicInstance[]
): CombatResult {
  const playerPowerInfo = calculatePowerDetailed(playerStats, true, random, relics)
  const enemyPowerInfo = calculatePowerDetailed(
    { atk: enemy.atk, def: enemy.def, vit: enemy.vit },
    false,
    random
  )
  
  const playerPower = playerPowerInfo.total
  const enemyPower = enemyPowerInfo.total
  let ratio = playerPower / enemyPower
  
  let outcome: CombatOutcome
  let message: string
  let nearMissMessage: string | undefined
  let gold: number | undefined
  let lootEarned = false
  
  if (ratio > 1.4) {
    outcome = 'crushing'
    message = `Tu écrasés ${enemy.name}. Aucune résistance.`
    gold = random
      ? random.nextInt(enemy.lootGold.min, enemy.lootGold.max)
      : Math.floor(Math.random() * (enemy.lootGold.max - enemy.lootGold.min + 1)) + enemy.lootGold.min
    lootEarned = true
  } else if (ratio > 1.0) {
    outcome = 'victory'
    message = `Tu as vaincu ${enemy.name}.`
    gold = random
      ? random.nextInt(enemy.lootGold.min, enemy.lootGold.max)
      : Math.floor(Math.random() * (enemy.lootGold.max - enemy.lootGold.min + 1)) + enemy.lootGold.min
    lootEarned = true
  } else if (ratio > 0.7) {
    outcome = 'costly'
    message = `Victoire coûteuse contre ${enemy.name}. Tu es blessé.`
    gold = random
      ? random.nextInt(enemy.lootGold.min, enemy.lootGold.max)
      : Math.floor(Math.random() * (enemy.lootGold.max - enemy.lootGold.min + 1)) + enemy.lootGold.min
    lootEarned = true
    
    // Message "Near Miss" pour combat serré
    if (ratio >= 0.7 && ratio <= 1.1) {
      if (playerStats.def > enemy.atk) {
        nearMissMessage = `Ta Défense (${playerStats.def}) a bloqué leur attaque (${enemy.atk}).`
      } else if (playerStats.atk > enemy.def) {
        nearMissMessage = `Ton arme a fait la différence.`
      } else {
        nearMissMessage = `Sans ton équipement, tu serais mort.`
      }
    }
  } else if (ratio > 0.4) {
    // Appliquer le bonus de fuite des reliques
    const fleeBonus = relics ? getRelicFleeBonus(relics) : 0
    // Ajuster le ratio pour favoriser la fuite (augmenter le ratio effectif)
    const adjustedRatio = ratio * (1 + fleeBonus)
    
    if (adjustedRatio > 0.4) {
      outcome = 'flee'
      message = `Tu as fui ${enemy.name}. Tu as perdu du matériel.`
      lootEarned = false
    } else {
      outcome = 'defeat'
      message = `Tu as été vaincu par ${enemy.name}.`
      lootEarned = false
    }
  } else {
    outcome = 'defeat'
    message = `Tu as été vaincu par ${enemy.name}.`
    lootEarned = false
  }
  
  // Calculer la perte de durabilité
  const durabilityLoss = equipment
    ? calculateDurabilityLoss(outcome, equipment, random)
    : []
  
  return {
    outcome,
    ratio,
    playerPower,
    enemyPower,
    durabilityLoss,
    lootEarned,
    gold,
    message,
    nearMissMessage,
    breakdown: {
      player: playerPowerInfo,
      enemy: enemyPowerInfo,
      ratio,
      thresholds: {
        crushing: 1.4,
        victory: 1.0,
        costly: 0.7,
        flee: 0.4
      }
    }
  }
}

/**
 * Probabilité de combat selon le risque du lieu
 */
export function getCombatProbability(riskLevel: number): number {
  const risk = Math.min(5, Math.max(1, riskLevel))
  const probabilities: Record<number, number> = {
    1: 0.10,  // 10%
    2: 0.25,  // 25%
    3: 0.45,  // 45%
    4: 0.65,  // 65%
    5: 0.85   // 85%
  }
  return probabilities[risk] || 0.10
}

/**
 * Estime le ratio de combat moyen (sans random) pour affichage avant combat
 * @param playerStats Stats du joueur
 * @param enemy Ennemi estimé
 * @returns Ratio estimé et niveau de confiance
 */
export function estimateCombatRatio(
  playerStats: PlayerStats,
  enemy: { atk: number; def: number; vit: number }
): { ratio: number; confidence: 'low' | 'medium' | 'high' } {
  // Calculer puissance moyenne (sans random, en utilisant la moyenne)
  // Utiliser la même formule que calculatePower mais avec moyenne au lieu de random
  const playerAvgPower = (playerStats.atk * 0.5) + (playerStats.def * 0.3) + (playerStats.vit * 0.2) + 10 // Moyenne de 3.5-16.5 = 10
  const enemyAvgPower = (enemy.atk * 0.5) + (enemy.def * 0.3) + (enemy.vit * 0.2) + 7.5 // Moyenne de 3-12 = 7.5
  
  const ratio = playerAvgPower / enemyAvgPower
  
  // Confidence basée sur l'écart type et la différence
  // Plus le ratio est éloigné de 1.0, plus la confiance est élevée
  let confidence: 'low' | 'medium' | 'high'
  if (ratio > 1.2 || ratio < 0.6) {
    confidence = 'high' // Grande différence = confiance élevée
  } else if (ratio > 0.8 && ratio < 1.2) {
    confidence = 'medium' // Proche de 1.0 = confiance moyenne
  } else {
    confidence = 'low' // Zone dangereuse = confiance faible
  }
  
  return { ratio, confidence }
}

/**
 * Obtient un ennemi estimé moyen pour un niveau de risque
 * Utilise les stats moyennes des ennemis possibles pour ce risque
 */
export function getEstimatedEnemyForRisk(riskLevel: number): { atk: number; def: number; vit: number } {
  const risk = Math.min(5, Math.max(1, riskLevel))
  
  // Stats moyennes selon le risque (basées sur les ennemis possibles)
  const estimatedStats: Record<number, { atk: number; def: number; vit: number }> = {
    1: { atk: 8, def: 4, vit: 4 },   // Bandits/Squatteurs moyens
    2: { atk: 10, def: 7, vit: 5 },  // Mix Bandits/Déserteurs/Miliciens
    3: { atk: 12, def: 10, vit: 5 }, // Déserteurs/Miliciens moyens
    4: { atk: 14, def: 11, vit: 6 },  // Pillards vétérans/Déserteurs forts
    5: { atk: 16, def: 8, vit: 6 }    // Pillards vétérans
  }
  
  return estimatedStats[risk] || estimatedStats[1]
}

/**
 * Calcule la probabilité de victoire basée sur le ratio estimé
 * @param ratio Ratio estimé (joueur / ennemi)
 * @returns Probabilité de victoire en pourcentage (0-100)
 */
export function calculateVictoryProbability(ratio: number): number {
  // Approximation basée sur la distribution normale
  // Ratio > 1.4 = ~95% chance de victoire
  // Ratio > 1.0 = ~75% chance de victoire
  // Ratio > 0.7 = ~50% chance de victoire
  // Ratio > 0.4 = ~25% chance de victoire
  // Ratio <= 0.4 = ~5% chance de victoire
  
  if (ratio >= 1.4) {
    return 95
  } else if (ratio >= 1.0) {
    // Interpolation entre 75% (ratio 1.0) et 95% (ratio 1.4)
    return Math.round(75 + ((ratio - 1.0) / 0.4) * 20)
  } else if (ratio >= 0.7) {
    // Interpolation entre 50% (ratio 0.7) et 75% (ratio 1.0)
    return Math.round(50 + ((ratio - 0.7) / 0.3) * 25)
  } else if (ratio >= 0.4) {
    // Interpolation entre 25% (ratio 0.4) et 50% (ratio 0.7)
    return Math.round(25 + ((ratio - 0.4) / 0.3) * 25)
  } else {
    return 5
  }
}

/**
 * Calcule les probabilités de chaque résultat de combat
 * @param ratio Ratio estimé (joueur / ennemi)
 * @returns Probabilités de chaque résultat en pourcentage
 */
export function calculateCombatOutcomeProbabilities(ratio: number): {
  crushing: number
  victory: number
  costly: number
  flee: number
  defeat: number
} {
  // Approximation basée sur les seuils de ratio
  // Ratio > 1.4 = victoire écrasante
  // Ratio > 1.0 = victoire
  // Ratio > 0.7 = victoire coûteuse
  // Ratio > 0.4 = fuite
  // Ratio <= 0.4 = défaite
  
  // Distribution approximative avec variance
  let crushing = 0
  let victory = 0
  let costly = 0
  let flee = 0
  let defeat = 0
  
  if (ratio >= 1.4) {
    // Zone victoire écrasante
    crushing = Math.min(100, Math.round(60 + (ratio - 1.4) * 20))
    victory = Math.max(0, 100 - crushing - 5)
    costly = 5
  } else if (ratio >= 1.0) {
    // Zone victoire normale
    const progress = (ratio - 1.0) / 0.4 // 0 à 1
    crushing = Math.round(progress * 30)
    victory = Math.round(50 + (1 - progress) * 20)
    costly = Math.max(0, 100 - crushing - victory - 10)
    flee = 5
    defeat = 5
  } else if (ratio >= 0.7) {
    // Zone victoire coûteuse
    const progress = (ratio - 0.7) / 0.3 // 0 à 1
    victory = Math.round(progress * 20)
    costly = Math.round(40 + (1 - progress) * 20)
    flee = Math.round(20 + (1 - progress) * 10)
    defeat = Math.max(0, 100 - victory - costly - flee)
  } else if (ratio >= 0.4) {
    // Zone fuite
    const progress = (ratio - 0.4) / 0.3 // 0 à 1
    costly = Math.round(progress * 15)
    flee = Math.round(50 + (1 - progress) * 20)
    defeat = Math.max(0, 100 - costly - flee)
  } else {
    // Zone défaite
    defeat = Math.min(100, Math.round(80 + (0.4 - ratio) * 20))
    flee = Math.max(0, 100 - defeat)
  }
  
  // Normaliser pour que la somme = 100
  const total = crushing + victory + costly + flee + defeat
  if (total !== 100) {
    const factor = 100 / total
    crushing = Math.round(crushing * factor)
    victory = Math.round(victory * factor)
    costly = Math.round(costly * factor)
    flee = Math.round(flee * factor)
    defeat = Math.round(defeat * factor)
  }
  
  return { crushing, victory, costly, flee, defeat }
}
