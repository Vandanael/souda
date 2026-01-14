/**
 * Types pour le système d'icônes héraldiques/occultes
 */

import type { IconName, IconSize, IconStyle } from '../types'

export interface IconProps {
  name: IconName
  size?: IconSize
  style?: IconStyle
  color?: string
  className?: string
  'aria-hidden'?: boolean
}

export interface IconComponentProps extends IconProps {
  width: number
  height: number
  viewBox: string
}

export type IconVariant = 'filled' | 'outline' | 'bordered'

export interface IconConfig {
  viewBox: string
  paths: string[]
  strokeWidth?: number
}
