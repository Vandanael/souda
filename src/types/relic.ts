export type RelicTag = 'greed' | 'survival' | 'violence' | 'faith'

export interface RelicStage {
  id: string
  xpRequired: number
  bonus: string
}

export interface RelicDefinition {
  id: string
  name: string
  description: string
  tags: RelicTag[]
  fragmentId: string
  stages: RelicStage[]
}

export interface RelicInstance {
  id: string
  definitionId: string
  stageIndex: number
  xp: number
  acquiredDay: number
  fragmentsUsed: number
}

export interface RelicFragmentDrop {
  fragmentId: string
  amount: number
  definitionId?: string
}
