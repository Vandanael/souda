export type LocationType = 
  | 'village_fantome'
  | 'champ_bataille'
  | 'ferme_abandonnee'
  | 'monastere_pille'
  | 'ruines_fort'
  | 'foret'
  | 'carriere'
  | 'cache_tresor' // Lieu spécial révélé par la carte

export type LocationEvent = 
  | 'loot'
  | 'combat'
  | 'choice'
  | 'empty'

export interface Location {
  id: string
  type: LocationType
  name: string
  description: string
  risk: number // 1-4
  richness: number // 1-4
  explored?: boolean // Si le lieu a déjà été exploré (optionnel pour rétrocompatibilité)
  explorationCount?: number // Nombre de fois exploré (optionnel pour rétrocompatibilité)
  firstSeenDay?: number // Jour où le lieu a été vu pour la première fois (optionnel pour rétrocompatibilité)
}

/**
 * Normalise un lieu pour s'assurer qu'il a toutes les propriétés requises
 * Utile pour la rétrocompatibilité avec les sauvegardes anciennes
 */
export function normalizeLocation(location: Partial<Location> & { id: string; type: LocationType; name: string; description: string; risk: number; richness: number }, day: number = 1): Location {
  return {
    ...location,
    explored: location.explored ?? false,
    explorationCount: location.explorationCount ?? 0,
    firstSeenDay: location.firstSeenDay ?? day
  }
}

export interface ExplorationResult {
  event: LocationEvent
  location: Location
  
  // Pour combat
  enemyId?: string
  combatResult?: any
  
  // Pour loot
  item?: any
  gold?: number
  relicFragmentId?: string
  relicFragmentAmount?: number
  
  // Pour choix narratif
  choiceId?: string
  choiceText?: string
  choices?: Array<{ id: string; text: string; consequence: string }>
  
  // Pour lieu vide
  atmosphereText?: string
  
  // Message spécial (ex: revisite)
  specialMessage?: string
}

export const LOCATION_TYPES: Record<LocationType, {
  name: string
  description: string
  riskRange: [number, number]
  richness: number
  frequency: number // Pourcentage
  icon: string
}> = {
  village_fantome: {
    name: 'Village Fantôme',
    description: 'Des maisons vides. Des portes qui grincent. Tu sens que quelque chose te regarde.',
    riskRange: [1, 2],
    richness: 2,
    frequency: 20,
    icon: '🏚️'
  },
  champ_bataille: {
    name: 'Champ de Bataille',
    description: 'Des cadavres. Des armes brisées. L\'odeur de la mort. Mais aussi des trésors oubliés.',
    riskRange: [2, 3],
    richness: 3,
    frequency: 15,
    icon: '⚔️'
  },
  ferme_abandonnee: {
    name: 'Ferme Abandonnée',
    description: 'Une ferme laissée à l\'abandon. Peut-être quelques outils encore utilisables.',
    riskRange: [1, 2],
    richness: 1,
    frequency: 20,
    icon: '🚜'
  },
  monastere_pille: {
    name: 'Monastère Pillé',
    description: 'Un lieu de prière profané. Des reliques peuvent encore traîner.',
    riskRange: [2, 2],
    richness: 4,
    frequency: 10,
    icon: '⛪'
  },
  ruines_fort: {
    name: 'Ruines de Fort',
    description: 'Un ancien fort en ruine. Dangereux, mais riche en équipement militaire.',
    riskRange: [3, 4],
    richness: 4,
    frequency: 10,
    icon: '🏰'
  },
  foret: {
    name: 'Forêt',
    description: 'Une forêt sombre. Des bruits étranges. Mais aussi des ressources naturelles.',
    riskRange: [2, 2],
    richness: 1,
    frequency: 15,
    icon: '🌲'
  },
  carriere: {
    name: 'Carrière',
    description: 'Une carrière abandonnée. Des outils de mineur peuvent encore servir.',
    riskRange: [2, 3],
    richness: 2,
    frequency: 10,
    icon: '⛏️'
  },
  cache_tresor: {
    name: 'Cache au Trésor',
    description: 'Un lieu secret révélé par la carte. Des richesses inestimables t\'attendent, mais le danger est grand.',
    riskRange: [3, 4],
    richness: 5, // Richesse maximale
    frequency: 0, // Ne peut pas être généré normalement
    icon: '🗺️'
  }
}
