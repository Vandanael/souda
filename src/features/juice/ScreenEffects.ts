/**
 * ScreenEffects - Effets visuels d'écran centralisés
 * 
 * Gère les effets de screen shake, flash, vignette, etc.
 * Utilise des éléments DOM overlay pour les effets globaux.
 */

import { timeController, EASINGS } from './TimeController'

// Presets de shake
export type ShakePreset = 'impact' | 'damage' | 'defeat' | 'rumble' | 'micro'

interface ShakeConfig {
  intensity: number  // Amplitude en pixels
  duration: number   // Durée en ms
  frequency: number  // Nombre d'oscillations
  decay: 'linear' | 'exponential' | 'sine'
}

const SHAKE_PRESETS: Record<ShakePreset, ShakeConfig> = {
  impact: { intensity: 8, duration: 100, frequency: 4, decay: 'exponential' },
  damage: { intensity: 5, duration: 350, frequency: 8, decay: 'linear' },
  defeat: { intensity: 6, duration: 600, frequency: 12, decay: 'sine' },
  rumble: { intensity: 3, duration: 400, frequency: 6, decay: 'sine' },
  micro: { intensity: 2, duration: 80, frequency: 3, decay: 'exponential' }
}

class ScreenEffectsSingleton {
  private static instance: ScreenEffectsSingleton | null = null
  
  // État du shake
  private _shakeX: number = 0
  private _shakeY: number = 0
  private isShaking: boolean = false
  private shakeAnimationId: number | null = null
  
  // Listeners pour les changements de shake
  private shakeListeners: ((x: number, y: number) => void)[] = []
  
  // Éléments DOM pour les overlays
  private overlayContainer: HTMLDivElement | null = null
  private flashOverlay: HTMLDivElement | null = null
  private vignetteOverlay: HTMLDivElement | null = null
  
  private constructor() {
    this.initOverlays()
  }
  
  static getInstance(): ScreenEffectsSingleton {
    if (!ScreenEffectsSingleton.instance) {
      ScreenEffectsSingleton.instance = new ScreenEffectsSingleton()
    }
    return ScreenEffectsSingleton.instance
  }
  
  /**
   * Initialise les overlays DOM
   */
  private initOverlays(): void {
    if (typeof document === 'undefined') return
    
    // Créer le container s'il n'existe pas
    if (!this.overlayContainer) {
      this.overlayContainer = document.createElement('div')
      this.overlayContainer.id = 'screen-effects-container'
      this.overlayContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 99999;
      `
      document.body.appendChild(this.overlayContainer)
    }
    
    // Flash overlay
    if (!this.flashOverlay) {
      this.flashOverlay = document.createElement('div')
      this.flashOverlay.id = 'flash-overlay'
      this.flashOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        pointer-events: none;
      `
      this.overlayContainer.appendChild(this.flashOverlay)
    }
    
    // Vignette overlay
    if (!this.vignetteOverlay) {
      this.vignetteOverlay = document.createElement('div')
      this.vignetteOverlay.id = 'vignette-overlay'
      this.vignetteOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        pointer-events: none;
        background: radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%);
      `
      this.overlayContainer.appendChild(this.vignetteOverlay)
    }
  }
  
  /**
   * Valeurs actuelles du shake
   */
  get shakeX(): number { return this._shakeX }
  get shakeY(): number { return this._shakeY }
  
  /**
   * Déclenche un screen shake avec un preset
   */
  shake(preset: ShakePreset): void {
    const config = SHAKE_PRESETS[preset]
    this.shakeCustom(config)
  }
  
  /**
   * Déclenche un screen shake avec config personnalisée
   */
  shakeCustom(config: ShakeConfig): void {
    if (this.isShaking) {
      // Annuler le shake en cours
      if (this.shakeAnimationId !== null) {
        timeController.cancel(this.shakeAnimationId)
      }
    }
    
    this.isShaking = true
    const startTime = performance.now()
    
    const animate = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(1, elapsed / config.duration)
      
      if (progress >= 1) {
        // Fin du shake
        this._shakeX = 0
        this._shakeY = 0
        this.isShaking = false
        this.notifyShakeChange()
        return
      }
      
      // Calcul du decay
      let decayFactor: number
      switch (config.decay) {
        case 'exponential':
          decayFactor = Math.pow(1 - progress, 2)
          break
        case 'sine':
          decayFactor = Math.sin((1 - progress) * Math.PI / 2)
          break
        case 'linear':
        default:
          decayFactor = 1 - progress
      }
      
      // Oscillation
      const oscillation = Math.sin(progress * Math.PI * 2 * config.frequency)
      const amplitude = config.intensity * decayFactor
      
      // Ajouter un peu de randomness pour le naturel
      const randomX = (Math.random() - 0.5) * 0.3
      const randomY = (Math.random() - 0.5) * 0.3
      
      this._shakeX = amplitude * (oscillation + randomX)
      this._shakeY = amplitude * (Math.cos(progress * Math.PI * 2 * config.frequency * 0.8) + randomY)
      
      this.notifyShakeChange()
      
      requestAnimationFrame(animate)
    }
    
    requestAnimationFrame(animate)
  }
  
  /**
   * S'abonner aux changements de shake
   */
  onShakeChange(listener: (x: number, y: number) => void): () => void {
    this.shakeListeners.push(listener)
    return () => {
      this.shakeListeners = this.shakeListeners.filter(l => l !== listener)
    }
  }
  
  private notifyShakeChange(): void {
    this.shakeListeners.forEach(listener => listener(this._shakeX, this._shakeY))
  }
  
  /**
   * Flash d'écran
   */
  flash(color: string, duration: number): void {
    if (!this.flashOverlay) return
    
    this.flashOverlay.style.background = color
    
    timeController.animate(
      duration,
      (progress) => {
        if (this.flashOverlay) {
          // Fade in rapide, fade out progressif
          const opacity = progress < 0.2 
            ? progress * 5 
            : 1 - ((progress - 0.2) / 0.8)
          this.flashOverlay.style.opacity = String(Math.max(0, opacity))
        }
      },
      () => {
        if (this.flashOverlay) {
          this.flashOverlay.style.opacity = '0'
        }
      },
      EASINGS.easeOut
    )
  }
  
  /**
   * Effet de vignette (bords sombres)
   */
  vignette(intensity: number, duration: number): void {
    if (!this.vignetteOverlay) return
    
    timeController.animate(
      duration,
      (progress) => {
        if (this.vignetteOverlay) {
          // Courbe: monte jusqu'à 30% puis descend
          let opacity: number
          if (progress < 0.3) {
            opacity = (progress / 0.3) * intensity
          } else {
            opacity = intensity * (1 - ((progress - 0.3) / 0.7))
          }
          this.vignetteOverlay.style.opacity = String(Math.max(0, opacity))
        }
      },
      () => {
        if (this.vignetteOverlay) {
          this.vignetteOverlay.style.opacity = '0'
        }
      },
      EASINGS.easeOut
    )
  }
  
  /**
   * Effet d'aberration chromatique (pour les impacts forts)
   */
  chromatic(amount: number, duration: number): void {
    // Implémenté via CSS filter sur le body ou un container
    if (typeof document === 'undefined') return
    
    const root = document.documentElement
    
    timeController.animate(
      duration,
      (progress) => {
        // Courbe: pic au milieu
        const currentAmount = amount * Math.sin(progress * Math.PI)
        root.style.setProperty('--chromatic-offset', `${currentAmount}px`)
      },
      () => {
        root.style.setProperty('--chromatic-offset', '0px')
      },
      EASINGS.easeOut
    )
  }
  
  /**
   * Désaturation progressive (pour les moments sombres)
   */
  desaturate(intensity: number, duration: number): void {
    if (typeof document === 'undefined') return
    
    const root = document.documentElement
    
    timeController.animate(
      duration,
      (progress) => {
        const saturation = 1 - (intensity * progress)
        root.style.setProperty('--global-saturation', String(saturation))
      },
      () => {
        // Ne pas reset automatiquement - laisser l'effet persister si nécessaire
      },
      EASINGS.easeOut
    )
  }
  
  /**
   * Reset la saturation
   */
  resetSaturation(duration: number = 500): void {
    if (typeof document === 'undefined') return
    
    const root = document.documentElement
    const currentSaturation = parseFloat(
      getComputedStyle(root).getPropertyValue('--global-saturation') || '1'
    )
    
    timeController.animate(
      duration,
      (progress) => {
        const saturation = currentSaturation + (1 - currentSaturation) * progress
        root.style.setProperty('--global-saturation', String(saturation))
      },
      () => {
        root.style.setProperty('--global-saturation', '1')
      },
      EASINGS.easeOut
    )
  }
  
  /**
   * Nettoie les overlays
   */
  destroy(): void {
    if (this.overlayContainer && this.overlayContainer.parentNode) {
      this.overlayContainer.parentNode.removeChild(this.overlayContainer)
    }
    this.overlayContainer = null
    this.flashOverlay = null
    this.vignetteOverlay = null
    this.shakeListeners = []
    ScreenEffectsSingleton.instance = null
  }
}

export const screenEffects = ScreenEffectsSingleton.getInstance()
