import { RelicInstance } from '../../types/relic'
import { RELIC_DEFS_BY_ID } from './relics.logic'

/**
 * Parse un bonus depuis une chaîne de description
 * Exemples :
 * - "+5% or trouvé" → { gold: 0.05 }
 * - "+10% or, +5% dégâts" → { gold: 0.10, damage: 0.05 }
 * - "+15% fuite" → { flee: 0.15 }
 * - "-10% coût réparations" → { repair: -0.10 }
 * - "+1 DEF après victoire coûteuse" → { defAfterCostly: 1 }
 * - "-1 réputation" → { reputation: -1 }
 */
interface ParsedBonus {
  gold?: number // Multiplicateur or (ex: 0.05 = +5%)
  damage?: number // Multiplicateur dégâts (ex: 0.05 = +5%)
  flee?: number // Bonus fuite (ex: 0.15 = +15%)
  repair?: number // Multiplicateur réparations (ex: -0.10 = -10%)
  reputation?: number // Modificateur réputation (ex: -1)
  defAfterCostly?: number // Bonus DEF après victoire coûteuse (ex: 1)
}

function parseBonusString(bonus: string): ParsedBonus {
  const result: ParsedBonus = {}
  
  // Extraire tous les pourcentages
  const percentMatches = bonus.match(/([+-]?\d+)%/g)
  if (percentMatches) {
    percentMatches.forEach(match => {
      const value = parseInt(match) / 100
      
      // Chercher le contexte autour du pourcentage
      const index = bonus.indexOf(match)
      const context = bonus.substring(Math.max(0, index - 20), Math.min(bonus.length, index + 20)).toLowerCase()
      
      if (context.includes('or') || context.includes('trouvé')) {
        result.gold = (result.gold || 0) + value
      } else if (context.includes('dégât') || context.includes('dégat')) {
        result.damage = (result.damage || 0) + value
      } else if (context.includes('fuite')) {
        result.flee = (result.flee || 0) + value
      } else if (context.includes('réparation') || context.includes('reparation') || context.includes('coût réparation')) {
        result.repair = (result.repair || 0) + value
      }
    })
  }
  
  // Extraire les valeurs absolues (ex: +1 DEF, -1 réputation)
  const absoluteMatches = bonus.match(/([+-]?\d+)\s+(DEF|réputation|reputation)/gi)
  if (absoluteMatches) {
    absoluteMatches.forEach(match => {
      const value = parseInt(match)
      if (match.toLowerCase().includes('def')) {
        // Vérifier si c'est "après victoire coûteuse"
        if (bonus.toLowerCase().includes('après') || bonus.toLowerCase().includes('apres')) {
          result.defAfterCostly = (result.defAfterCostly || 0) + value
        }
      } else if (match.toLowerCase().includes('réputation') || match.toLowerCase().includes('reputation')) {
        result.reputation = (result.reputation || 0) + value
      }
    })
  }
  
  return result
}

/**
 * Calcule le multiplicateur d'or total depuis toutes les reliques
 */
export function getRelicGoldMultiplier(relics: RelicInstance[]): number {
  let multiplier = 1.0
  
  relics.forEach(relic => {
    const def = RELIC_DEFS_BY_ID[relic.definitionId]
    if (!def) return
    
    const stage = def.stages[relic.stageIndex]
    const bonus = parseBonusString(stage.bonus)
    
    if (bonus.gold) {
      multiplier += bonus.gold
    }
  })
  
  return multiplier
}

/**
 * Calcule le multiplicateur de dégâts total depuis toutes les reliques
 */
export function getRelicDamageMultiplier(relics: RelicInstance[]): number {
  let multiplier = 1.0
  
  relics.forEach(relic => {
    const def = RELIC_DEFS_BY_ID[relic.definitionId]
    if (!def) return
    
    const stage = def.stages[relic.stageIndex]
    const bonus = parseBonusString(stage.bonus)
    
    if (bonus.damage) {
      multiplier += bonus.damage
    }
  })
  
  return multiplier
}

/**
 * Calcule le bonus de fuite total depuis toutes les reliques
 * Retourne un multiplicateur (ex: 0.15 = +15% de chance de fuite)
 */
export function getRelicFleeBonus(relics: RelicInstance[]): number {
  let bonus = 0.0
  
  relics.forEach(relic => {
    const def = RELIC_DEFS_BY_ID[relic.definitionId]
    if (!def) return
    
    const stage = def.stages[relic.stageIndex]
    const parsed = parseBonusString(stage.bonus)
    
    if (parsed.flee) {
      bonus += parsed.flee
    }
  })
  
  return bonus
}

/**
 * Calcule le multiplicateur de coût de réparation total depuis toutes les reliques
 */
export function getRelicRepairMultiplier(relics: RelicInstance[]): number {
  let multiplier = 1.0
  
  relics.forEach(relic => {
    const def = RELIC_DEFS_BY_ID[relic.definitionId]
    if (!def) return
    
    const stage = def.stages[relic.stageIndex]
    const bonus = parseBonusString(stage.bonus)
    
    if (bonus.repair) {
      multiplier += bonus.repair // repair est déjà négatif si c'est une réduction
    }
  })
  
  return multiplier
}

/**
 * Calcule le modificateur de réputation total depuis toutes les reliques
 */
export function getRelicReputationModifier(relics: RelicInstance[]): number {
  let modifier = 0
  
  relics.forEach(relic => {
    const def = RELIC_DEFS_BY_ID[relic.definitionId]
    if (!def) return
    
    const stage = def.stages[relic.stageIndex]
    const bonus = parseBonusString(stage.bonus)
    
    if (bonus.reputation) {
      modifier += bonus.reputation
    }
  })
  
  return modifier
}

/**
 * Vérifie si une relique donne un bonus DEF après victoire coûteuse
 * Retourne le montant du bonus (0 si aucun)
 */
export function getRelicDefAfterCostlyBonus(relics: RelicInstance[]): number {
  let bonus = 0
  
  relics.forEach(relic => {
    const def = RELIC_DEFS_BY_ID[relic.definitionId]
    if (!def) return
    
    const stage = def.stages[relic.stageIndex]
    const parsed = parseBonusString(stage.bonus)
    
    if (parsed.defAfterCostly) {
      bonus += parsed.defAfterCostly
    }
  })
  
  return bonus
}

/**
 * Obtient tous les bonus actifs sous forme de description lisible
 */
export function getActiveRelicBonuses(relics: RelicInstance[]): string[] {
  const bonuses: string[] = []
  
  relics.forEach(relic => {
    const def = RELIC_DEFS_BY_ID[relic.definitionId]
    if (!def) return
    
    const stage = def.stages[relic.stageIndex]
    if (stage.bonus) {
      bonuses.push(`${def.name} (${stage.id}): ${stage.bonus}`)
    }
  })
  
  return bonuses
}
