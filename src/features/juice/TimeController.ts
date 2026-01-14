/**
 * TimeController - Gestion centralisée du temps de jeu
 * 
 * Permet le Hit-Stop, Slow-Mo, et la synchronisation des animations
 */

export type EasingFunction = (t: number) => number

// Fonctions d'easing courantes
export const EASINGS = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number) => Math.pow(t, 3),
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  bounce: (t: number) => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) return n1 * t * t
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
    return n1 * (t -= 2.625 / d1) * t + 0.984375
  },
  elastic: (t: number) => {
    if (t === 0 || t === 1) return t
    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)
  }
} as const

interface ScheduledTask {
  id: number
  callback: () => void
  executeAt: number // Temps réel (pas scaled)
  originalDelay: number
}

interface Animation {
  id: number
  startTime: number
  duration: number
  onUpdate: (progress: number) => void
  onComplete?: () => void
  easing: EasingFunction
}

class TimeControllerSingleton {
  private static instance: TimeControllerSingleton | null = null
  
  private _timeScale: number = 1.0
  private _isPaused: boolean = false
  private _lastUpdateTime: number = 0
  private _accumulatedTime: number = 0
  
  private taskIdCounter: number = 0
  private scheduledTasks: Map<number, ScheduledTask> = new Map()
  private activeAnimations: Map<number, Animation> = new Map()
  private animationFrameId: number | null = null
  
  // Listeners pour les changements de timeScale
  private timeScaleListeners: ((scale: number) => void)[] = []
  
  private constructor() {
    this._lastUpdateTime = performance.now()
    this.startUpdateLoop()
  }
  
  static getInstance(): TimeControllerSingleton {
    if (!TimeControllerSingleton.instance) {
      TimeControllerSingleton.instance = new TimeControllerSingleton()
    }
    return TimeControllerSingleton.instance
  }
  
  /**
   * Time scale actuel (1.0 = normal, 0.5 = slow-mo, 0 = freeze)
   */
  get timeScale(): number {
    return this._timeScale
  }
  
  set timeScale(value: number) {
    this._timeScale = Math.max(0, Math.min(2, value))
    this.notifyTimeScaleChange()
  }
  
  get isPaused(): boolean {
    return this._isPaused
  }
  
  /**
   * Hit-Stop : Gel le temps pendant une durée (en ms réel)
   */
  hitStop(duration: number): Promise<void> {
    return new Promise((resolve) => {
      const previousScale = this._timeScale
      this._timeScale = 0
      this.notifyTimeScaleChange()
      
      // Utiliser setTimeout réel (pas affecté par timeScale)
      window.setTimeout(() => {
        this._timeScale = previousScale
        this.notifyTimeScaleChange()
        resolve()
      }, duration)
    })
  }
  
  /**
   * Slow-Mo : Ralentit le temps progressivement
   */
  slowMo(
    targetScale: number, 
    duration: number, 
    holdDuration: number = 0,
    easing: EasingFunction = EASINGS.easeOut
  ): Promise<void> {
    return new Promise((resolve) => {
      const startScale = this._timeScale
      const startTime = performance.now()
      
      const animate = () => {
        const elapsed = performance.now() - startTime
        
        if (elapsed < duration) {
          // Phase de ralentissement
          const progress = elapsed / duration
          const easedProgress = easing(progress)
          this._timeScale = startScale + (targetScale - startScale) * easedProgress
          this.notifyTimeScaleChange()
          requestAnimationFrame(animate)
        } else if (elapsed < duration + holdDuration) {
          // Phase de hold
          this._timeScale = targetScale
          requestAnimationFrame(animate)
        } else if (elapsed < duration + holdDuration + duration) {
          // Phase de retour
          const returnProgress = (elapsed - duration - holdDuration) / duration
          const easedProgress = easing(returnProgress)
          this._timeScale = targetScale + (1.0 - targetScale) * easedProgress
          this.notifyTimeScaleChange()
          requestAnimationFrame(animate)
        } else {
          // Terminé
          this._timeScale = 1.0
          this.notifyTimeScaleChange()
          resolve()
        }
      }
      
      requestAnimationFrame(animate)
    })
  }
  
  /**
   * Pause/Reprend le temps
   */
  pause(): void {
    this._isPaused = true
    this._timeScale = 0
    this.notifyTimeScaleChange()
  }
  
  resume(): void {
    this._isPaused = false
    this._timeScale = 1.0
    this.notifyTimeScaleChange()
  }
  
  /**
   * Schedule une tâche (comme setTimeout mais respecte le timeScale pour le callback)
   * Le delay est en temps RÉEL (pas affecté par timeScale)
   */
  schedule(callback: () => void, delay: number): number {
    const id = ++this.taskIdCounter
    const task: ScheduledTask = {
      id,
      callback,
      executeAt: performance.now() + delay,
      originalDelay: delay
    }
    
    this.scheduledTasks.set(id, task)
    return id
  }
  
  /**
   * Schedule une tâche en temps de jeu (affecté par timeScale)
   */
  scheduleGameTime(callback: () => void, delay: number): number {
    // Si timeScale est 0, le délai est infini
    if (this._timeScale <= 0) {
      return this.schedule(callback, Number.MAX_SAFE_INTEGER)
    }
    
    const realDelay = delay / this._timeScale
    return this.schedule(callback, realDelay)
  }
  
  /**
   * Annule une tâche schedulée
   */
  cancel(id: number): void {
    this.scheduledTasks.delete(id)
    this.activeAnimations.delete(id)
  }
  
  /**
   * Lance une animation avec easing
   */
  animate(
    duration: number,
    onUpdate: (progress: number) => void,
    onComplete?: () => void,
    easing: EasingFunction = EASINGS.easeOut
  ): number {
    const id = ++this.taskIdCounter
    const animation: Animation = {
      id,
      startTime: performance.now(),
      duration,
      onUpdate,
      onComplete,
      easing
    }
    
    this.activeAnimations.set(id, animation)
    return id
  }
  
  /**
   * Convertit un delta de temps réel en delta de temps de jeu
   */
  getScaledDelta(realDelta: number): number {
    return realDelta * this._timeScale
  }
  
  /**
   * S'abonner aux changements de timeScale
   */
  onTimeScaleChange(listener: (scale: number) => void): () => void {
    this.timeScaleListeners.push(listener)
    return () => {
      this.timeScaleListeners = this.timeScaleListeners.filter(l => l !== listener)
    }
  }
  
  private notifyTimeScaleChange(): void {
    this.timeScaleListeners.forEach(listener => listener(this._timeScale))
  }
  
  private startUpdateLoop(): void {
    const update = () => {
      const now = performance.now()
      const realDelta = now - this._lastUpdateTime
      this._lastUpdateTime = now
      
      // Mettre à jour le temps accumulé (scaled)
      this._accumulatedTime += this.getScaledDelta(realDelta)
      
      // Exécuter les tâches schedulées
      this.scheduledTasks.forEach((task, id) => {
        if (now >= task.executeAt) {
          task.callback()
          this.scheduledTasks.delete(id)
        }
      })
      
      // Mettre à jour les animations
      this.activeAnimations.forEach((animation, id) => {
        const elapsed = now - animation.startTime
        const progress = Math.min(1, elapsed / animation.duration)
        const easedProgress = animation.easing(progress)
        
        animation.onUpdate(easedProgress)
        
        if (progress >= 1) {
          animation.onComplete?.()
          this.activeAnimations.delete(id)
        }
      })
      
      this.animationFrameId = requestAnimationFrame(update)
    }
    
    this.animationFrameId = requestAnimationFrame(update)
  }
  
  /**
   * Nettoie le controller (pour les tests)
   */
  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
    }
    this.scheduledTasks.clear()
    this.activeAnimations.clear()
    this.timeScaleListeners = []
    TimeControllerSingleton.instance = null
  }
}

export const timeController = TimeControllerSingleton.getInstance()

export type { ScheduledTask, Animation }
