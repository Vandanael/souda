/**
 * useScreenShake - Hook React pour appliquer le screen shake
 * 
 * Remplace l'ancien hook useScreenShake.tsx avec une intégration
 * au système ScreenEffects centralisé.
 */

import { useState, useEffect, useCallback } from 'react'
import { screenEffects, ShakePreset } from '../ScreenEffects'

interface ShakeStyle {
  transform: string
}

/**
 * Hook pour obtenir les valeurs de shake et appliquer aux composants
 */
export function useScreenShake() {
  const [shakeStyle, setShakeStyle] = useState<ShakeStyle>({ transform: 'translate(0, 0)' })
  const [isShaking, setIsShaking] = useState(false)
  
  // S'abonner aux changements de shake
  useEffect(() => {
    const unsubscribe = screenEffects.onShakeChange((x, y) => {
      setShakeStyle({ transform: `translate(${x}px, ${y}px)` })
      setIsShaking(x !== 0 || y !== 0)
    })
    
    return unsubscribe
  }, [])
  
  /**
   * Déclenche un shake avec un preset
   */
  const shake = useCallback((preset: ShakePreset = 'damage') => {
    screenEffects.shake(preset)
  }, [])
  
  /**
   * Déclenche un shake personnalisé
   */
  const shakeCustom = useCallback((
    intensity: number,
    duration: number,
    frequency: number = 8,
    decay: 'linear' | 'exponential' | 'sine' = 'exponential'
  ) => {
    screenEffects.shakeCustom({ intensity, duration, frequency, decay })
  }, [])
  
  return {
    shakeStyle,
    isShaking,
    shake,
    shakeCustom,
    // Valeurs brutes pour usage custom
    shakeX: screenEffects.shakeX,
    shakeY: screenEffects.shakeY
  }
}

/**
 * Hook pour wrapper automatiquement un composant avec le shake
 * Retourne les props de style à appliquer
 */
export function useShakeStyle() {
  const [style, setStyle] = useState<React.CSSProperties>({})
  
  useEffect(() => {
    const unsubscribe = screenEffects.onShakeChange((x, y) => {
      setStyle({
        transform: `translate(${x}px, ${y}px)`,
        transition: 'transform 0.016s linear' // ~60fps
      })
    })
    
    return unsubscribe
  }, [])
  
  return style
}
