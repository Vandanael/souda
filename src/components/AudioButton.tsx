/**
 * Bouton avec audio intégré
 */

import { ReactNode } from 'react'
import { useAudio } from '../features/audio/useAudio'

interface AudioButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  soundId?: 'ui_click' | 'ui_open' | 'ui_close'
  haptic?: boolean
}

export default function AudioButton({ 
  children, 
  soundId = 'ui_click',
  haptic = true,
  onClick,
  ...props 
}: AudioButtonProps) {
  const { playSound, playHaptic } = useAudio()
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound(soundId, 0.5)
    if (haptic) {
      playHaptic('button_press')
    }
    if (onClick) {
      onClick(e)
    }
  }
  
  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  )
}
