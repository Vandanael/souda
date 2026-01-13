// Export public de l'API de durabilité
export {
  applyDurabilityLoss,
  getDurabilityState,
  getDurabilityMultiplier,
  getEffectiveStats,
  selectItemsForDamage,
  applyCombatDamage,
  isItemBroken,
  getDurabilityColor,
  type DurabilityState
} from './durability.logic'

export { default as DurabilityBar } from './DurabilityBar'
