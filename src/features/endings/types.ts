/**
 * Types pour le système de fins multiples
 */

export type EndingType = 'victory' | 'defeat'

export type VictoryEndingId = 
  | 'seigneur'
  | 'marchand'
  | 'redempteur'
  | 'fantome'
  | 'survivant'
  | 'humanite'
  | 'cynisme'
  | 'pragmatisme'
  | 'equilibre'

export type DefeatEndingId = 
  | 'dette_sang'
  | 'fuite'
  | 'mort_combat'

export type EndingId = VictoryEndingId | DefeatEndingId

export interface EndingAmbiance {
  backgroundColor: string
  textColor: string
  titleColor: string
  particles?: 'gold' | 'ashes' | 'mist' | 'light' | 'none'
  musicId?: string
}

export interface Ending {
  id: EndingId
  type: EndingType
  title: string
  text: string
  ambiance: EndingAmbiance
  variables?: Record<string, string> // Pour injecter des variables (ex: enemyName)
}
