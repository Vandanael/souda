/**
 * Types pour le système de méta-progression
 */

export interface ArchivedRun {
  id: string
  timestamp: number
  characterName: string
  origin: string
  daysLived: number
  finalGold: number
  finalDebt: number
  finalReputation: number
  endType: 'victory' | 'death' | 'debt'
  endTitle: string // "Le Survivant", "Mort au Combat", etc.
  legendaryItems: string[]
  combatsWon: number
  combatsLost: number
  combatsFled: number
  totalGoldEarned: number
  counters: {
    cynisme: number
    humanite: number
    pragmatisme: number
  }
}

export interface GlobalStats {
  totalRuns: number
  victories: number
  defeats: number
  bestDays: number
  bestGold: number
  totalLegendaryItems: number
  totalCombatsWon: number
  totalCombatsLost: number
}

export interface Origin {
  id: string
  name: string
  description: string
  unlockCondition: (stats: UnlockState) => boolean
  requiredLevel?: number // Niveau méta requis pour débloquer (optionnel)
  bonuses: {
    stats?: { atk?: number; def?: number; vit?: number }
    gold?: number
    reputation?: number
  }
  maluses: {
    stats?: { atk?: number; def?: number; vit?: number }
    gold?: number
    debt?: number
    reputation?: number
  }
}

export interface UnlockState {
  origins: string[] // ids débloqués
  itemPoolAdditions: string[] // items ajoutés au pool
  achievements: string[] // achievements débloqués
  globalCounters: {
    totalLoots: number
    totalMonasteries: number
    totalDaysSurvived: number
    totalFlees: number
    totalGoldEarned: number
    victories: number
    defeats: number
  }
}
