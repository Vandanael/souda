/**
 * Système d'objectifs quotidiens (Dailies)
 * Génère 3 objectifs basés sur la date du jour (seed)
 */

export interface DailyObjective {
  id: string
  title: string
  description: string
  type: 'gold' | 'survival' | 'npc' | 'exploration' | 'combat'
  target: number
  current: number
  completed: boolean
  xpReward: number
}

/**
 * Génère un seed basé sur la date du jour (YYYY-MM-DD)
 */
function getDateSeed(): string {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

/**
 * Génère un nombre pseudo-aléatoire basé sur un seed
 */
function seededRandom(seed: string, index: number): number {
  let hash = 0
  const seedString = `${seed}-${index}`
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  // Normaliser entre 0 et 1
  return Math.abs(hash % 10000) / 10000
}

/**
 * Pool d'objectifs possibles
 */
const OBJECTIVE_POOL: Omit<DailyObjective, 'id' | 'current' | 'completed'>[] = [
  // Objectifs or
  {
    title: 'Gagner de l\'or',
    description: 'Gagner {target}💰',
    type: 'gold',
    target: 50,
    xpReward: 25
  },
  {
    title: 'Gagner de l\'or',
    description: 'Gagner {target}💰',
    type: 'gold',
    target: 100,
    xpReward: 50
  },
  {
    title: 'Gagner de l\'or',
    description: 'Gagner {target}💰',
    type: 'gold',
    target: 150,
    xpReward: 75
  },
  
  // Objectifs survie
  {
    title: 'Survivre sans manger',
    description: 'Survivre 1 jour sans manger',
    type: 'survival',
    target: 1,
    xpReward: 30
  },
  {
    title: 'Survivre plusieurs jours',
    description: 'Survivre {target} jours consécutifs',
    type: 'survival',
    target: 2,
    xpReward: 40
  },
  
  // Objectifs PNJ
  {
    title: 'Parler à Morten',
    description: 'Visiter l\'usurier Morten',
    type: 'npc',
    target: 1,
    xpReward: 20
  },
  {
    title: 'Explorer les lieux',
    description: 'Explorer {target} lieux différents',
    type: 'exploration',
    target: 3,
    xpReward: 35
  },
  {
    title: 'Explorer les lieux',
    description: 'Explorer {target} lieux différents',
    type: 'exploration',
    target: 5,
    xpReward: 50
  },
  
  // Objectifs combat
  {
    title: 'Gagner un combat',
    description: 'Gagner {target} combat(s)',
    type: 'combat',
    target: 1,
    xpReward: 30
  },
  {
    title: 'Gagner des combats',
    description: 'Gagner {target} combat(s)',
    type: 'combat',
    target: 2,
    xpReward: 50
  }
]

/**
 * Génère 3 objectifs quotidiens basés sur la date
 */
export function generateDailyObjectives(): DailyObjective[] {
  const seed = getDateSeed()
  const objectives: DailyObjective[] = []
  const usedIndices = new Set<number>()
  
  // Générer 3 objectifs uniques
  for (let i = 0; i < 3; i++) {
    let attempts = 0
    let index: number
    
    // Éviter les doublons
    do {
      index = Math.floor(seededRandom(seed, i) * OBJECTIVE_POOL.length)
      attempts++
    } while (usedIndices.has(index) && attempts < 10)
    
    usedIndices.add(index)
    const template = OBJECTIVE_POOL[index]
    
    // Remplacer {target} dans la description
    const description = template.description.replace('{target}', String(template.target))
    
    objectives.push({
      id: `daily-${seed}-${i}`,
      title: template.title,
      description,
      type: template.type,
      target: template.target,
      current: 0,
      completed: false,
      xpReward: template.xpReward
    })
  }
  
  return objectives
}

/**
 * Charge les objectifs quotidiens depuis le localStorage
 * Si la date a changé, génère de nouveaux objectifs
 */
export function loadDailyObjectives(): DailyObjective[] {
  try {
    const stored = localStorage.getItem('souda_daily_objectives')
    const storedDate = localStorage.getItem('souda_daily_objectives_date')
    const today = getDateSeed()
    
    // Si la date a changé ou pas d'objectifs stockés, générer de nouveaux
    if (!stored || storedDate !== today) {
      const newObjectives = generateDailyObjectives()
      saveDailyObjectives(newObjectives)
      return newObjectives
    }
    
    return JSON.parse(stored) as DailyObjective[]
  } catch (error) {
    console.error('Erreur chargement objectifs quotidiens:', error)
    return generateDailyObjectives()
  }
}

/**
 * Sauvegarde les objectifs quotidiens dans le localStorage
 */
export function saveDailyObjectives(objectives: DailyObjective[]): void {
  try {
    localStorage.setItem('souda_daily_objectives', JSON.stringify(objectives))
    localStorage.setItem('souda_daily_objectives_date', getDateSeed())
  } catch (error) {
    console.error('Erreur sauvegarde objectifs quotidiens:', error)
  }
}

/**
 * Met à jour la progression d'un objectif
 */
export function updateObjectiveProgress(
  objectives: DailyObjective[],
  type: DailyObjective['type'],
  amount: number = 1
): { objectives: DailyObjective[]; completed: DailyObjective[] } {
  const updated = objectives.map(obj => {
    if (obj.completed || obj.type !== type) {
      return obj
    }
    
    const newCurrent = obj.current + amount
    const completed = newCurrent >= obj.target
    
    return {
      ...obj,
      current: Math.min(newCurrent, obj.target),
      completed
    }
  })
  
  const completed = updated.filter(obj => obj.completed && !objectives.find(o => o.id === obj.id)?.completed)
  
  // Sauvegarder les objectifs mis à jour
  saveDailyObjectives(updated)
  
  return { objectives: updated, completed }
}

/**
 * Réinitialise les objectifs quotidiens (pour les tests)
 * @deprecated Non utilisé - à supprimer ou déplacer dans les tests
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
// @ts-ignore - Fonction dépréciée, non utilisée
function resetDailyObjectives(): void {
  localStorage.removeItem('souda_daily_objectives')
  localStorage.removeItem('souda_daily_objectives_date')
}
