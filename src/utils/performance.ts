/**
 * Utilitaires de performance
 */

/**
 * Détecte si l'appareil est bas de gamme
 */
export function isLowEndDevice(): boolean {
  // Détecter via hardwareConcurrency et deviceMemory
  const cores = navigator.hardwareConcurrency || 4
  const memory = (navigator as any).deviceMemory || 4
  
  return cores <= 4 || memory <= 2
}

/**
 * Réduit les particules si performance faible
 */
export function shouldReduceParticles(): boolean {
  if (isLowEndDevice()) {
    return true
  }
  
  // Vérifier prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true
  }
  
  return false
}

/**
 * Mesure les FPS
 */
export class FPSMonitor {
  private frames: number[] = []
  private lastTime = performance.now()
  private frameCount = 0
  
  tick(): number {
    const now = performance.now()
    const delta = now - this.lastTime
    
    if (delta >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / delta)
      this.frames.push(fps)
      
      // Garder seulement les 60 dernières mesures
      if (this.frames.length > 60) {
        this.frames.shift()
      }
      
      this.frameCount = 0
      this.lastTime = now
      
      return fps
    }
    
    this.frameCount++
    return 0
  }
  
  getAverageFPS(): number {
    if (this.frames.length === 0) return 60
    const sum = this.frames.reduce((a, b) => a + b, 0)
    return Math.round(sum / this.frames.length)
  }
  
  isLowFPS(): boolean {
    return this.getAverageFPS() < 30
  }
}

/**
 * Debounce pour limiter les appels fréquents
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle pour limiter les appels
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
