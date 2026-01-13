// Export public de l'API de combat
export {
  resolveCombat,
  calculatePower,
  getCombatProbability,
  estimateCombatRatio,
  getEstimatedEnemyForRisk,
  calculateVictoryProbability,
  calculateCombatOutcomeProbabilities,
  SeededRandom,
  type CombatOutcome,
  type CombatResult,
  type DurabilityLoss
} from './combat.logic'

// PlayerStats est exporté depuis utils/stats
export type { PlayerStats } from '../../utils/stats'
