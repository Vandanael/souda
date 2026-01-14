import { RelicDefinition, RelicInstance, RelicFragmentDrop, RelicTag } from '../../types/relic'
import { RELIC_DEFINITIONS, RELIC_FRAGMENT_MAP } from './relics.data'
import { SeededRandom } from '../combat/combat.logic'

const RELIC_DEFS_BY_ID: Record<string, RelicDefinition> = Object.fromEntries(
  RELIC_DEFINITIONS.map(def => [def.id, def])
)

/**
 * Crée une instance de relique au stade 0
 */
export function createRelicInstance(definitionId: string, acquiredDay: number): RelicInstance {
  return {
    id: `${definitionId}_${acquiredDay}_${Date.now()}`,
    definitionId,
    stageIndex: 0,
    xp: 0,
    acquiredDay,
    fragmentsUsed: 3
  }
}

/**
 * Ajoute des fragments et retourne le nouvel inventaire + reliques créées si seuil atteint
 */
export function addFragmentsAndMaybeCreate(
  currentFragments: Record<string, number>,
  currentRelics: RelicInstance[],
  fragmentId: string,
  amount: number,
  currentDay: number
): { fragments: Record<string, number>; relics: RelicInstance[]; created?: RelicInstance } {
  const newFragments = { ...currentFragments }
  const defId = RELIC_FRAGMENT_MAP[fragmentId]
  newFragments[fragmentId] = (newFragments[fragmentId] || 0) + amount
  let newRelics = [...currentRelics]
  let created: RelicInstance | undefined
  
  // Règle simple : 3 fragments => 1 relique (si pas déjà possédée)
  if (defId && newFragments[fragmentId] >= 3) {
    const alreadyOwned = newRelics.some(r => r.definitionId === defId)
    if (!alreadyOwned) {
      const instance = createRelicInstance(defId, currentDay)
      newRelics = [...newRelics, instance]
      newFragments[fragmentId] -= 3
      created = instance
    }
  }
  
  return { fragments: newFragments, relics: newRelics, created }
}

/**
 * Ajoute de l'XP aux reliques (optionnellement filtré par tag)
 */
export function gainRelicXp(
  relics: RelicInstance[],
  amount: number,
  tags?: RelicTag[]
): RelicInstance[] {
  return relics.map(relic => {
    const def = RELIC_DEFS_BY_ID[relic.definitionId]
    if (!def) return relic
    if (tags && !def.tags.some(t => tags.includes(t))) return relic
    
    let xp = relic.xp + amount
    let stageIndex = relic.stageIndex
    
    while (stageIndex + 1 < def.stages.length && xp >= def.stages[stageIndex + 1].xpRequired) {
      stageIndex += 1
    }
    
    return { ...relic, xp, stageIndex }
  })
}

/**
 * Détermine un drop de fragment (probabilité simple selon risque)
 */
export function rollRelicFragmentDrop(
  random: SeededRandom | undefined,
  risk: number
): RelicFragmentDrop | null {
  const baseChance = risk >= 3 ? 0.25 : 0.12
  const roll = random ? random.next() : Math.random()
  if (roll > baseChance) return null
  
  // Choisir une relique au hasard
  const pick = RELIC_DEFINITIONS[(random ? random.nextInt(0, RELIC_DEFINITIONS.length - 1) : Math.floor(Math.random() * RELIC_DEFINITIONS.length))]
  return { fragmentId: pick.fragmentId, amount: 1, definitionId: pick.id }
}

export { RELIC_DEFS_BY_ID }
