import { CYNISME_MONOLOGUES, HUMANITE_MONOLOGUES, PRAGMATISME_MONOLOGUES, COMBINED_MONOLOGUES } from './monologues'

/**
 * Sélectionne un monologue approprié selon les compteurs narratifs
 * @param counters Compteurs narratifs (cynisme, humanite, pragmatisme)
 * @param recentMonologues Historique des monologues récents (pour éviter répétitions)
 * @returns Monologue sélectionné ou null
 */
export function selectMonologue(
  counters: Record<string, number>,
  recentMonologues: string[] = []
): string | null {
  const cynisme = counters.cynisme || 0
  const humanite = counters.humanite || 0
  const pragmatisme = counters.pragmatisme || 0
  
  // Si tous les compteurs sont faibles, pas de monologue
  if (cynisme < 5 && humanite < 5 && pragmatisme < 5) {
    return null
  }
  
  // Vérifier les combinaisons spéciales
  const maxCounter = Math.max(cynisme, humanite, pragmatisme)
  const hasMultipleHigh = [
    cynisme >= 10,
    humanite >= 10,
    pragmatisme >= 10
  ].filter(Boolean).length >= 2
  
  // Si plusieurs compteurs élevés, utiliser monologues combinés
  if (hasMultipleHigh) {
    if (cynisme >= 10 && humanite >= 10) {
      const pool = COMBINED_MONOLOGUES.cynisme_humanite
      return selectFromPool(pool, recentMonologues)
    }
    if (cynisme >= 10 && pragmatisme >= 10) {
      const pool = COMBINED_MONOLOGUES.cynisme_pragmatisme
      return selectFromPool(pool, recentMonologues)
    }
    if (humanite >= 10 && pragmatisme >= 10) {
      const pool = COMBINED_MONOLOGUES.humanite_pragmatisme
      return selectFromPool(pool, recentMonologues)
    }
  }
  
  // Si tous les compteurs sont équilibrés (différence < 5)
  const differences = [
    Math.abs(cynisme - humanite),
    Math.abs(cynisme - pragmatisme),
    Math.abs(humanite - pragmatisme)
  ]
  const isBalanced = differences.every(diff => diff < 5) && maxCounter >= 5
  if (isBalanced) {
    const pool = COMBINED_MONOLOGUES.balanced
    return selectFromPool(pool, recentMonologues)
  }
  
  // Sinon, sélectionner selon le compteur le plus élevé
  let selectedPool: string[] | null = null
  let level = 5
  
  if (cynisme >= humanite && cynisme >= pragmatisme && cynisme >= 5) {
    // Déterminer le niveau
    if (cynisme >= 20) level = 20
    else if (cynisme >= 15) level = 15
    else if (cynisme >= 10) level = 10
    else level = 5
    selectedPool = CYNISME_MONOLOGUES[level] || CYNISME_MONOLOGUES[5]
  } else if (humanite >= pragmatisme && humanite >= 5) {
    if (humanite >= 20) level = 20
    else if (humanite >= 15) level = 15
    else if (humanite >= 10) level = 10
    else level = 5
    selectedPool = HUMANITE_MONOLOGUES[level] || HUMANITE_MONOLOGUES[5]
  } else if (pragmatisme >= 5) {
    if (pragmatisme >= 20) level = 20
    else if (pragmatisme >= 15) level = 15
    else if (pragmatisme >= 10) level = 10
    else level = 5
    selectedPool = PRAGMATISME_MONOLOGUES[level] || PRAGMATISME_MONOLOGUES[5]
  }
  
  if (!selectedPool) {
    return null
  }
  
  return selectFromPool(selectedPool, recentMonologues)
}

/**
 * Sélectionne un monologue dans un pool en évitant les répétitions récentes
 * Amélioré pour mieux éviter les répétitions
 */
function selectFromPool(pool: string[], recentMonologues: string[]): string {
  // Filtrer les monologues récents (éviter les 5 derniers)
  const available = pool.filter(m => !recentMonologues.includes(m))
  
  // Si moins de 30% du pool est disponible, réinitialiser
  // Cela permet d'éviter de toujours choisir les mêmes monologues
  const threshold = Math.max(1, Math.floor(pool.length * 0.3))
  const poolToUse = available.length >= threshold ? available : pool
  
  // Sélectionner aléatoirement
  const selected = poolToUse[Math.floor(Math.random() * poolToUse.length)]
  
  return selected
}
