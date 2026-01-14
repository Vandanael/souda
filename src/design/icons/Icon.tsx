/**
 * Composant Icon wrapper type-safe
 * Utilise le système d'icônes héraldiques/occultes
 */

import type { IconProps } from './types'
import { IconSet } from './IconSet'
import { colors } from '../tokens'

export function Icon({
  name,
  size = 24,
  style = 'filled',
  color,
  className,
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  // Couleur par défaut selon le style
  const iconColor = color || (style === 'filled' ? colors.neutral.charcoal : colors.neutral.ivory)
  const borderColor = style === 'bordered' ? colors.neutral.ivory : colors.neutral.charcoal

  return (
    <span
      className={className}
      aria-hidden={ariaHidden}
      role="presentation"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <IconSet
        name={name}
        size={size}
        style={style}
        color={iconColor}
        borderColor={borderColor}
      />
    </span>
  )
}

export default Icon
