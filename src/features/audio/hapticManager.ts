/**
 * Haptic Manager - Utilise Vibration API avec fallback Web
 * Compatible Web : Si vibrate n'est pas disponible, utilise un feedback visuel/sonore
 */

type HapticPattern = 
  | 'loot_common' | 'loot_uncommon' | 'loot_rare' | 'loot_legendary'
  | 'combat_hit' | 'victory' | 'defeat' | 'button_press'
  | 'button_metal' // Impulsion courte et ferme pour boutons métalliques (design system)

/**
 * Détecte si on est sur Web
 */
function isWebPlatform(): boolean {
  return typeof window !== 'undefined' && window.document !== undefined
}

/**
 * Détecte si l'API Vibration est disponible
 */
function isVibrationAvailable(): boolean {
  return typeof navigator !== 'undefined' && 
         'vibrate' in navigator && 
         typeof navigator.vibrate === 'function'
}

class HapticManager {
  private static instance: HapticManager | null = null
  private enabled: boolean = true
  private isWeb: boolean = false
  private vibrationAvailable: boolean = false

  private constructor() {
    // Détecter la plateforme
    this.isWeb = isWebPlatform()
    this.vibrationAvailable = isVibrationAvailable()
    
    // Charger les settings depuis localStorage
    this.loadSettings()
    
    // Log en dev pour debug
    if (process.env.NODE_ENV === 'development') {
      console.log(`[HapticManager] Platform: ${this.isWeb ? 'Web' : 'Native'}, Vibration: ${this.vibrationAvailable ? 'Available' : 'Unavailable'}`)
    }
  }

  static getInstance(): HapticManager {
    if (!HapticManager.instance) {
      HapticManager.instance = new HapticManager()
    }
    return HapticManager.instance
  }

  /**
   * Patterns de vibration par type
   */
  private patterns: Record<HapticPattern, number[]> = {
    loot_common: [10],
    loot_uncommon: [30],
    loot_rare: [50, 30, 50],
    loot_legendary: [100, 50, 100, 50, 200],
    combat_hit: [20],
    victory: [50, 50, 100],
    defeat: [200],
    button_press: [5],
    button_metal: [15] // Impulsion courte et ferme (plus forte que button_press)
  }

  /**
   * Feedback visuel pour Web (quand vibration n'est pas disponible)
   */
  private triggerVisualFeedback(intensity: 'light' | 'medium' | 'strong'): void {
    if (!this.isWeb || typeof document === 'undefined') return
    
    // Créer un flash visuel subtil
    const flash = document.createElement('div')
    const opacity = intensity === 'light' ? 0.05 : intensity === 'medium' ? 0.1 : 0.15
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, ${opacity});
      pointer-events: none;
      z-index: 99999;
      animation: haptic-flash 0.1s ease-out;
    `
    
    // Ajouter l'animation si elle n'existe pas déjà
    if (!document.getElementById('haptic-flash-style')) {
      const style = document.createElement('style')
      style.id = 'haptic-flash-style'
      style.textContent = `
        @keyframes haptic-flash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }
    
    document.body.appendChild(flash)
    setTimeout(() => flash.remove(), 100)
  }

  /**
   * Vibration personnalisée avec fallback Web
   */
  vibrate(pattern: number[]): void {
    if (!this.enabled) return

    // Essayer d'utiliser l'API Vibration si disponible
    if (this.vibrationAvailable) {
      try {
        navigator.vibrate(pattern)
        return
      } catch (error) {
        console.warn('Vibration failed:', error)
        // Fallback sur feedback visuel si vibration échoue
      }
    }
    
    // Fallback Web : feedback visuel
    if (this.isWeb) {
      const totalDuration = pattern.reduce((a, b) => a + b, 0)
      const intensity: 'light' | 'medium' | 'strong' = 
        totalDuration < 20 ? 'light' : 
        totalDuration < 100 ? 'medium' : 'strong'
      this.triggerVisualFeedback(intensity)
    }
  }

  /**
   * Vibration par pattern prédéfini
   */
  play(pattern: HapticPattern): void {
    if (!this.enabled) return

    const vibrationPattern = this.patterns[pattern]
    if (vibrationPattern) {
      this.vibrate(vibrationPattern)
    }
  }

  /**
   * Active/désactive les vibrations
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    this.saveSettings()
  }

  /**
   * Vérifie si les vibrations sont activées
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Charge les settings depuis localStorage
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('hapticEnabled')
      if (saved !== null) {
        this.enabled = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Failed to load haptic settings:', error)
    }
  }

  /**
   * Sauvegarde les settings dans localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('hapticEnabled', JSON.stringify(this.enabled))
    } catch (error) {
      console.warn('Failed to save haptic settings:', error)
    }
  }
}

export const hapticManager = HapticManager.getInstance()

// Export des types
export type { HapticPattern }
