import { useState, useEffect } from 'react'
import { motion, useMotionValue } from 'framer-motion'

/**
 * Hook pour créer un effet de tremblement d'écran
 * Utilisé pour les feedbacks visuels (dette, dégâts, choix critiques)
 */
export function useScreenShake() {
  const [isShaking, setIsShaking] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  /**
   * Déclenche un tremblement d'écran
   * @param intensity Intensité du tremblement (1-5, défaut: 3)
   * @param duration Durée en ms (défaut: 500ms)
   */
  const triggerShake = (intensity: number = 3, duration: number = 500) => {
    if (isShaking) return // Éviter les shakes multiples
    
    setIsShaking(true)
    
    // Générer des valeurs de tremblement aléatoires
    const shakeValues = Array.from({ length: 10 }, () => ({
      x: (Math.random() - 0.5) * intensity * 10,
      y: (Math.random() - 0.5) * intensity * 10
    }))
    
    // Animer le tremblement
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / duration
      
      if (progress >= 1) {
        // Fin du tremblement
        x.set(0)
        y.set(0)
        setIsShaking(false)
        return
      }
      
      // Easing (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentIndex = Math.floor(eased * (shakeValues.length - 1))
      const currentShake = shakeValues[currentIndex]
      
      // Appliquer le tremblement avec réduction progressive
      x.set(currentShake.x * (1 - eased))
      y.set(currentShake.y * (1 - eased))
      
      requestAnimationFrame(animate)
    }
    
    requestAnimationFrame(animate)
  }
  
  return {
    isShaking,
    triggerShake,
    shakeStyle: {
      x,
      y
    }
  }
}

/**
 * Composant wrapper pour appliquer le shake à un élément
 */
interface ScreenShakeWrapperProps {
  children: React.ReactNode
  intensity?: number
  duration?: number
  trigger?: boolean // Si true, déclenche le shake
}

export function ScreenShakeWrapper({ 
  children, 
  intensity = 3, 
  duration = 500,
  trigger = false
}: ScreenShakeWrapperProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  useEffect(() => {
    if (trigger) {
      // Générer des valeurs de tremblement aléatoires
      const shakeValues = Array.from({ length: 10 }, () => ({
        x: (Math.random() - 0.5) * intensity * 10,
        y: (Math.random() - 0.5) * intensity * 10
      }))
      
      // Animer le tremblement
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = elapsed / duration
        
        if (progress >= 1) {
          // Fin du tremblement
          x.set(0)
          y.set(0)
          return
        }
        
        // Easing (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3)
        const currentIndex = Math.floor(eased * (shakeValues.length - 1))
        const currentShake = shakeValues[currentIndex]
        
        // Appliquer le tremblement avec réduction progressive
        x.set(currentShake.x * (1 - eased))
        y.set(currentShake.y * (1 - eased))
        
        requestAnimationFrame(animate)
      }
      
      requestAnimationFrame(animate)
    }
  }, [trigger, intensity, duration, x, y])
  
  return (
    <motion.div
      style={{
        x,
        y,
        width: '100%',
        height: '100%'
      }}
    >
      {children}
    </motion.div>
  )
}
