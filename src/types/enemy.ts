export interface Enemy {
  id: string
  name: string
  type: EnemyType
  atk: number
  def: number
  vit: number
  lootGold: { min: number; max: number }
  description: string
}

export type EnemyType = 
  | 'bandit'
  | 'deserter'
  | 'militia'
  | 'veteran_pillager'
  | 'wolf'
  | 'squatter'

export const ENEMIES: Record<EnemyType, Enemy> = {
  bandit: {
    id: 'bandit',
    name: 'Bandits',
    type: 'bandit',
    atk: 10,
    def: 6,
    vit: 4,
    lootGold: { min: 5, max: 15 },
    description: 'Des pillards sans foi ni loi.'
  },
  deserter: {
    id: 'deserter',
    name: 'Déserteurs',
    type: 'deserter',
    atk: 12,
    def: 10,
    vit: 5,
    lootGold: { min: 8, max: 20 },
    description: 'Comme toi, ils ont fui. Maintenant ils te voient comme une proie.'
  },
  militia: {
    id: 'militia',
    name: 'Miliciens',
    type: 'militia',
    atk: 8,
    def: 14,
    vit: 3,
    lootGold: { min: 3, max: 12 },
    description: 'Défenseurs d\'un village fantôme. Ils ne lâchent rien.'
  },
  veteran_pillager: {
    id: 'veteran_pillager',
    name: 'Pillards Vétérans',
    type: 'veteran_pillager',
    atk: 16,
    def: 8,
    vit: 6,
    lootGold: { min: 15, max: 35 },
    description: 'Quatre hivers de pillage. Ils sont dangereux.'
  },
  wolf: {
    id: 'wolf',
    name: 'Loups',
    type: 'wolf',
    atk: 8,
    def: 4,
    vit: 10,
    lootGold: { min: 2, max: 8 },
    description: 'Une meute affamée. Ils attaquent en groupe.'
  },
  squatter: {
    id: 'squatter',
    name: 'Squatteurs',
    type: 'squatter',
    atk: 6,
    def: 4,
    vit: 4,
    lootGold: { min: 3, max: 10 },
    description: 'Des civils désespérés. Nombreux mais faibles.'
  }
}

/**
 * Applique le scaling des stats d'ennemi selon le jour
 * @param enemy Ennemi de base
 * @param day Jour actuel
 * @returns Ennemi avec stats scalées
 */
export function scaleEnemyStats(enemy: Enemy, day: number): Enemy {
  const scalingFactor = day - 1 // J1 = 0, J2 = 1, etc.
  
  return {
    ...enemy,
    atk: Math.round(enemy.atk + scalingFactor * 0.9),  // +0.9 ATK par jour
    def: Math.round(enemy.def + scalingFactor * 0.8),  // +0.8 DEF par jour
    vit: Math.round(enemy.vit + scalingFactor * 0.3),  // +0.3 VIT par jour
    lootGold: {
      min: Math.round(enemy.lootGold.min + scalingFactor * 0.5),  // +0.5💰 min par jour
      max: Math.round(enemy.lootGold.max + scalingFactor * 1.0)    // +1.0💰 max par jour
    }
  }
}

// Sélection aléatoire d'ennemi selon le risque du lieu
export function getRandomEnemy(riskLevel: number, day: number = 1): Enemy {
  const risk = Math.min(5, Math.max(1, riskLevel))
  
  // Probabilités selon le risque
  const enemyPool: EnemyType[] = []
  
  if (risk === 1) {
    enemyPool.push('bandit', 'squatter')
  } else if (risk === 2) {
    enemyPool.push('bandit', 'deserter', 'militia', 'wolf')
  } else if (risk === 3) {
    enemyPool.push('deserter', 'militia', 'veteran_pillager')
  } else if (risk === 4) {
    enemyPool.push('deserter', 'veteran_pillager', 'militia')
  } else {
    enemyPool.push('veteran_pillager', 'deserter')
  }
  
  const randomType = enemyPool[Math.floor(Math.random() * enemyPool.length)]
  const baseEnemy = ENEMIES[randomType]
  
  // Appliquer le scaling selon le jour
  return scaleEnemyStats(baseEnemy, day)
}
