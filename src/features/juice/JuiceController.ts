/**
 * JuiceController - Orchestrateur central des effets de jeu
 * 
 * Connecte le FeedbackBroker avec les différents systèmes d'effets :
 * - Audio (audioManager)
 * - Haptic (hapticManager)  
 * - Screen Effects (shake, flash, vignette)
 * - Time (hit-stop, slow-mo)
 * - Particles
 */

import { feedbackBroker, JuiceEventType, JuiceEventPayloads } from './FeedbackBroker'
import { timeController, EASINGS } from './TimeController'
import { screenEffects, ShakePreset } from './ScreenEffects'
import { audioManager } from '../audio/audioManager'
import { hapticManager } from '../audio/hapticManager'

// Configuration des effets par type d'événement
interface EffectConfig {
  // Audio
  sound?: {
    id: string
    volume?: number
    delay?: number
  }
  
  // Haptic
  haptic?: {
    pattern: string
    delay?: number
  }
  
  // Screen effects
  shake?: {
    preset: ShakePreset
    delay?: number
  }
  flash?: {
    color: string
    duration: number
    delay?: number
  }
  vignette?: {
    intensity: number
    duration: number
    delay?: number
  }
  
  // Time
  hitStop?: {
    duration: number
    delay?: number
  }
  slowMo?: {
    scale: number
    duration: number
    holdDuration?: number
    delay?: number
  }
}

// Configuration complète pour un événement
type EventEffectConfig = EffectConfig | ((payload: unknown) => EffectConfig)

// Mapping événement -> effets
const JUICE_CONFIG: Partial<Record<JuiceEventType, EventEffectConfig>> = {
  // === COMBAT ===
  COMBAT_START: {
    sound: { id: 'combat_start', volume: 0.8 },
    vignette: { intensity: 0.3, duration: 500 }
  },
  
  COMBAT_HIT: (payload: unknown) => {
    const p = payload as JuiceEventPayloads['COMBAT_HIT']
    return {
      sound: { id: `hit_0${Math.floor(Math.random() * 3) + 1}`, volume: 0.7 + p.intensity * 0.1 },
      haptic: { pattern: 'combat_hit' },
      shake: { preset: 'impact' },
      flash: { color: '#ffffff', duration: 50 },
      hitStop: { duration: 40 + p.intensity * 10 }
    }
  },
  
  COMBAT_VICTORY: (payload: unknown) => {
    const p = payload as JuiceEventPayloads['COMBAT_VICTORY']
    const isCrushing = p.outcome === 'crushing'
    const isCostly = p.outcome === 'costly'
    
    return {
      sound: { id: 'victory', volume: isCrushing ? 1.0 : 0.8 },
      haptic: { pattern: 'victory' },
      shake: isCostly ? { preset: 'damage' } : undefined,
      slowMo: isCrushing ? { scale: 0.3, duration: 300, holdDuration: 200 } : undefined
    }
  },
  
  COMBAT_DEFEAT: {
    sound: { id: 'defeat', volume: 1.0 },
    haptic: { pattern: 'defeat' },
    shake: { preset: 'defeat' },
    vignette: { intensity: 0.5, duration: 1000 }
  },
  
  COMBAT_FLEE: {
    sound: { id: 'flee', volume: 0.7 },
    shake: { preset: 'damage' }
  },
  
  // === LOOT ===
  LOOT_REVEAL_FLIP: (payload: unknown) => {
    const p = payload as JuiceEventPayloads['LOOT_REVEAL_FLIP']
    const soundMap = {
      common: 'loot_common',
      uncommon: 'loot_uncommon', 
      rare: 'loot_rare',
      legendary: 'loot_legendary'
    }
    const hapticMap = {
      common: 'loot_common',
      uncommon: 'loot_uncommon',
      rare: 'loot_rare', 
      legendary: 'loot_legendary'
    }
    
    return {
      sound: { id: soundMap[p.rarity], volume: 0.8 },
      haptic: { pattern: hapticMap[p.rarity] },
      slowMo: p.rarity === 'legendary' ? { scale: 0.5, duration: 200, holdDuration: 100 } : undefined
    }
  },
  
  // === ÉCONOMIE ===
  GOLD_GAIN: (payload: unknown) => {
    const p = payload as JuiceEventPayloads['GOLD_GAIN']
    const isLarge = p.amount >= 50
    
    return {
      sound: { 
        id: isLarge ? 'coins' : 'coins', 
        volume: Math.min(1.0, 0.4 + p.amount * 0.01)
      },
      shake: isLarge ? { preset: 'rumble' } : undefined
    }
  },
  
  GOLD_LOSS: {
    sound: { id: 'coins_loss', volume: 0.7 },
    vignette: { intensity: 0.1, duration: 200 }
  },
  
  DEBT_REPAY: (payload: unknown) => {
    const p = payload as JuiceEventPayloads['DEBT_REPAY']
    return {
      sound: { id: 'coins_loss', volume: 0.8 },
      flash: p.remainingDebt <= 0 
        ? { color: '#4a8', duration: 200 } 
        : undefined
    }
  },
  
  // === ITEMS ===
  ITEM_EQUIP: (payload: unknown) => {
    const p = payload as JuiceEventPayloads['ITEM_EQUIP']
    return {
      sound: { 
        id: p.material === 'metal' ? 'equip_metal' : 'equip_leather',
        volume: 0.7
      }
    }
  },
  
  ITEM_BREAK: {
    sound: { id: 'ui_close', volume: 0.8 },
    shake: { preset: 'damage' },
    haptic: { pattern: 'defeat' }
  },
  
  // === UI ===
  BUTTON_PRESS: (payload: unknown) => {
    const p = payload as JuiceEventPayloads['BUTTON_PRESS']
    return {
      sound: p.importance !== 'low' ? { id: 'ui_click', volume: 0.5 } : undefined,
      haptic: { pattern: 'button_press' }
    }
  },
  
  MENU_OPEN: {
    sound: { id: 'ui_open', volume: 0.6 }
  },
  
  MENU_CLOSE: {
    sound: { id: 'ui_close', volume: 0.5 }
  }
}

class JuiceControllerSingleton {
  private static instance: JuiceControllerSingleton | null = null
  private isInitialized: boolean = false
  private unsubscribers: (() => void)[] = []
  
  private constructor() {}
  
  static getInstance(): JuiceControllerSingleton {
    if (!JuiceControllerSingleton.instance) {
      JuiceControllerSingleton.instance = new JuiceControllerSingleton()
    }
    return JuiceControllerSingleton.instance
  }
  
  /**
   * Initialise le JuiceController et s'abonne aux événements
   */
  init(): void {
    if (this.isInitialized) return
    
    // S'abonner à tous les événements configurés
    Object.entries(JUICE_CONFIG).forEach(([eventType, config]) => {
      const unsubscribe = feedbackBroker.on(
        eventType as JuiceEventType,
        (payload) => this.executeEffects(eventType as JuiceEventType, payload, config),
        { priority: 'high' }
      )
      this.unsubscribers.push(unsubscribe)
    })
    
    this.isInitialized = true
    console.log('[JuiceController] Initialized')
  }
  
  /**
   * Exécute les effets pour un événement
   */
  private executeEffects(
    _eventType: JuiceEventType,
    payload: unknown,
    config: EventEffectConfig
  ): void {
    // Résoudre la config si c'est une fonction
    const resolvedConfig = typeof config === 'function' 
      ? config(payload)
      : config
    
    // Sound
    if (resolvedConfig.sound) {
      const { id, volume = 1.0, delay = 0 } = resolvedConfig.sound
      if (delay > 0) {
        timeController.schedule(() => {
          audioManager.playSound(id as any, volume)
        }, delay)
      } else {
        audioManager.playSound(id as any, volume)
      }
    }
    
    // Haptic
    if (resolvedConfig.haptic) {
      const { pattern, delay = 0 } = resolvedConfig.haptic
      if (delay > 0) {
        timeController.schedule(() => {
          hapticManager.play(pattern as any)
        }, delay)
      } else {
        hapticManager.play(pattern as any)
      }
    }
    
    // Shake
    if (resolvedConfig.shake) {
      const { preset, delay = 0 } = resolvedConfig.shake
      if (delay > 0) {
        timeController.schedule(() => {
          screenEffects.shake(preset)
        }, delay)
      } else {
        screenEffects.shake(preset)
      }
    }
    
    // Flash
    if (resolvedConfig.flash) {
      const { color, duration, delay = 0 } = resolvedConfig.flash
      if (delay > 0) {
        timeController.schedule(() => {
          screenEffects.flash(color, duration)
        }, delay)
      } else {
        screenEffects.flash(color, duration)
      }
    }
    
    // Vignette
    if (resolvedConfig.vignette) {
      const { intensity, duration, delay = 0 } = resolvedConfig.vignette
      if (delay > 0) {
        timeController.schedule(() => {
          screenEffects.vignette(intensity, duration)
        }, delay)
      } else {
        screenEffects.vignette(intensity, duration)
      }
    }
    
    // Hit-Stop
    if (resolvedConfig.hitStop) {
      const { duration, delay = 0 } = resolvedConfig.hitStop
      if (delay > 0) {
        timeController.schedule(() => {
          timeController.hitStop(duration)
        }, delay)
      } else {
        timeController.hitStop(duration)
      }
    }
    
    // Slow-Mo
    if (resolvedConfig.slowMo) {
      const { scale, duration, holdDuration = 0, delay = 0 } = resolvedConfig.slowMo
      if (delay > 0) {
        timeController.schedule(() => {
          timeController.slowMo(scale, duration, holdDuration, EASINGS.easeOut)
        }, delay)
      } else {
        timeController.slowMo(scale, duration, holdDuration, EASINGS.easeOut)
      }
    }
  }
  
  /**
   * Émet un événement de jeu (raccourci vers feedbackBroker)
   */
  emit<T extends JuiceEventType>(
    type: T,
    payload: JuiceEventPayloads[T]
  ): void {
    feedbackBroker.emit(type, payload)
  }
  
  /**
   * Séquence de combat pré-configurée
   */
  async playCombatSequence(
    combatResult: { outcome: string; ratio: number },
    callbacks: {
      onAnticipation?: () => void
      onTension?: () => void
      onResolution?: () => void
      onReveal?: () => void
    }
  ): Promise<void> {
    // Phase 1: Anticipation (500ms)
    callbacks.onAnticipation?.()
    this.emit('COMBAT_START', { enemyName: 'Ennemi', risk: 3 })
    await this.delay(500)
    
    // Phase 2: Tension (600ms)
    callbacks.onTension?.()
    screenEffects.vignette(0.2, 600)
    await this.delay(600)
    
    // Phase 3: Résolution (2000ms avec hits)
    callbacks.onResolution?.()
    const numHits = 4
    for (let i = 0; i < numHits; i++) {
      await this.delay(2000 / numHits)
      this.emit('COMBAT_HIT', { intensity: 2 + Math.random(), isPlayer: Math.random() > 0.5 })
    }
    
    // Phase 4: Révélation
    callbacks.onReveal?.()
    this.emit(
      combatResult.outcome === 'defeat' ? 'COMBAT_DEFEAT' : 'COMBAT_VICTORY',
      combatResult.outcome === 'defeat' 
        ? { enemyName: 'Ennemi' }
        : { outcome: combatResult.outcome as any, ratio: combatResult.ratio }
    )
  }
  
  /**
   * Utilitaire pour les délais
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      timeController.schedule(resolve, ms)
    })
  }
  
  /**
   * Nettoie le controller
   */
  destroy(): void {
    this.unsubscribers.forEach(unsub => unsub())
    this.unsubscribers = []
    this.isInitialized = false
    JuiceControllerSingleton.instance = null
  }
}

export const juiceController = JuiceControllerSingleton.getInstance()
