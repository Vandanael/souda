/**
 * Configuration d'équilibrage du jeu
 * Ajuster ces valeurs pour équilibrer la difficulté
 */

export const BALANCE_CONFIG = {
  // COMBAT
  combat: {
    defeatThreshold: 0.4, // Ratio pour défaite (0.35 = plus mortel, 0.45 = moins mortel)
    playerRandomRange: { min: 1, max: 20 },
    enemyRandomRange: { min: 1, max: 15 },
    // Seuils de résultats
    crushingThreshold: 1.4,
    victoryThreshold: 1.0,
    costlyThreshold: 0.7,
    fleeThreshold: 0.4
  },
  
  // ÉCONOMIE
  economy: {
    dailyInterest: 5, // Intérêts quotidiens de la dette (déprécié, utiliser progressiveInterest)
    initialDebt: 80,
    // Intérêts progressifs par période
    progressiveInterest: {
      day1to5: 5,   // J1-5 : +5💰
      day6to10: 7,  // J6-10 : +7💰
      day11to15: 10, // J11-15 : +10💰
      day16to20: 15  // J16-20 : +15💰
    },
    // Multiplicateurs de prix
    buyMultiplier: 1.5, // Prix d'achat = valeur × 1.5
    repairCostPerPoint: 0.15, // Coût réparation = (max - current) × 0.15 × rareté (réduit de 0.25 à 0.15, -40%)
    goldMultiplier: 1.25 // FIX: Audit 2 - Réduit de 1.35 à 1.25 (compromis recommandé)
  },
  
  // DURABILITÉ
  durability: {
    // Perte par situation (%)
    costlyVictoryLoss: { min: 10, max: 20 },
    fleeLoss: 15,
    trapLoss: 20,
    // États
    wornThreshold: 50, // % pour "usé"
    damagedThreshold: 25, // % pour "endommagé"
    // Multiplicateurs de stats
    wornMultiplier: 0.8,
    damagedMultiplier: 0.5,
    brokenMultiplier: 0
  },
  
  // LOOT
  loot: {
    // Probabilités de rareté (risque normal / élevé)
    rarityProbabilities: {
      normal: {
        common: 0.60,
        uncommon: 0.30,
        rare: 0.09,
        legendary: 0.01
      },
      high: {
        common: 0.50,
        uncommon: 0.35,
        rare: 0.12,
        legendary: 0.03
      }
    },
    // Chance de propriété spéciale (Rare+)
    specialPropertyChance: 0.3,
    // Durabilité initiale
    initialDurability: { min: 80, max: 100 }
  },
  
  // EXPLORATION
  exploration: {
    actionsPerDay: 3,
    // Distribution d'événements (%)
    eventDistribution: {
      lootDirect: 0.40,
      combat: 0.30,
      narrativeChoice: 0.20,
      empty: 0.10
    },
    // Scaling du risque par jour
    riskScalingPerDay: 0.1 // +0.1 risque par jour
  },
  
  // PROGRESSION
  progression: {
    // Scaling des ennemis par jour
    enemyScalingPerDay: 0.05, // +5% stats par jour
    // Scaling du loot par jour
    lootScalingPerDay: 0.1 // +10% valeur par jour
  }
}

/**
 * Ajustements recommandés selon feedback :
 * 
 * Si trop facile :
 * - defeatThreshold: 0.35
 * - dailyInterest: 6
 * - costlyVictoryLoss: { min: 15, max: 25 }
 * 
 * Si trop difficile :
 * - defeatThreshold: 0.45
 * - dailyInterest: 4
 * - costlyVictoryLoss: { min: 5, max: 15 }
 */
