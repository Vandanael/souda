import { Origin, UnlockState } from './types'

/**
 * Pool d'origines disponibles
 */
export const ORIGINS: Origin[] = [
  {
    id: 'deserteur',
    name: 'Déserteur',
    description: 'Tu as fui la guerre. Tu connais la survie, mais tu as des dettes.',
    unlockCondition: () => true, // Toujours disponible
    requiredLevel: 1, // Niveau 1 (toujours disponible)
    bonuses: {},
    maluses: {}
  },
  {
    id: 'veteran',
    name: 'Vétéran',
    description: 'Tu as survécu à une guerre. Tu connais le combat, mais tu as perdu ta fortune.',
    unlockCondition: (stats) => stats.globalCounters.victories >= 1,
    requiredLevel: 2, // Niveau 2 requis
    bonuses: {
      stats: { def: 2 }
    },
    maluses: {
      gold: -10
    }
  },
  {
    id: 'pillard',
    name: 'Pillard',
    description: 'Tu as pillé et volé. Tu es rapide, mais ta réputation te précède.',
    unlockCondition: (stats) => stats.globalCounters.totalLoots >= 50,
    requiredLevel: 5, // Niveau 5 requis
    bonuses: {
      stats: { vit: 1 }
    },
    maluses: {
      reputation: 2 // Réputation de départ = 2⭐
    }
  },
  {
    id: 'moine',
    name: 'Ancien Moine',
    description: 'Tu as quitté le monastère. Tu connais les bénédictions, mais le cynisme te ronge.',
    unlockCondition: (stats) => stats.globalCounters.totalMonasteries >= 5,
    requiredLevel: 8, // Niveau 8 requis
    bonuses: {
      // Items bénis + fréquents (géré dans le loot)
    },
    maluses: {
      // Cynisme = malus moral (géré dans les événements)
    }
  },
  {
    id: 'noble',
    name: 'Noble Déchu',
    description: 'Tu as perdu ta fortune. Tu as de l\'or de départ, mais une dette plus lourde.',
    unlockCondition: () => {
      // Vérifier si une run a atteint > 200 or
      // On va devoir vérifier dans les runs archivées
      return false // Sera vérifié dynamiquement
    },
    requiredLevel: 12, // Niveau 12 requis
    bonuses: {
      gold: 20
    },
    maluses: {
      debt: 20
    }
  },
  {
    id: 'survivant',
    name: 'Survivant',
    description: 'Tu as fui de nombreux combats. Tu sais survivre, mais tu es moins combatif.',
    unlockCondition: (stats) => stats.globalCounters.totalFlees >= 3,
    requiredLevel: 15, // Niveau 15 requis
    bonuses: {
      // Fuite = 0 dégât durabilité (géré dans le combat)
    },
    maluses: {
      stats: { atk: -1 }
    }
  }
]

/**
 * Vérifie si une origine est débloquée
 */
export function isOriginUnlocked(originId: string, unlockState: UnlockState): boolean {
  return unlockState.origins.includes(originId)
}

/**
 * Obtient une origine par son ID
 */
export function getOriginById(originId: string): Origin | undefined {
  return ORIGINS.find(o => o.id === originId)
}
