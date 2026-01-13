import { useState, useEffect } from 'react'

/**
 * Hook pour détecter si l'utilisateur est sur mobile
 * @param breakpoint Largeur de breakpoint (défaut: 768px)
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobile
}

/**
 * Hook pour détecter si l'utilisateur est sur un appareil bas de gamme
 * (basé sur la taille de l'écran, les capacités et les performances)
 */
export function useIsLowEndDevice(): boolean {
  const [isLowEnd, setIsLowEnd] = useState(() => {
    if (typeof window === 'undefined') return false
    
    // Détecter appareil bas de gamme basé sur :
    // - Taille d'écran < 400px (petit mobile)
    // - Pas de touch (probablement desktop)
    // - Hardware concurrency < 4 (peu de cores)
    // - Device memory < 4GB (si disponible)
    const isSmallScreen = window.innerWidth < 400
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const lowCores = navigator.hardwareConcurrency < 4
    const lowMemory = (navigator as any).deviceMemory ? (navigator as any).deviceMemory < 4 : false
    
    // Considérer comme bas de gamme si :
    // - Petit écran ET touch (mobile bas de gamme)
    // - OU peu de cores
    // - OU peu de mémoire
    return (isSmallScreen && hasTouch) || lowCores || lowMemory
  })

  useEffect(() => {
    // Vérifier les performances au chargement
    const checkPerformance = () => {
      const start = performance.now()
      // Test simple de performance
      for (let i = 0; i < 1000; i++) {
        Math.sqrt(i)
      }
      const duration = performance.now() - start
      
      // Si le test prend plus de 1ms, considérer comme bas de gamme
      if (duration > 1) {
        setIsLowEnd(true)
      }
    }
    
    checkPerformance()
  }, [])

  return isLowEnd
}
