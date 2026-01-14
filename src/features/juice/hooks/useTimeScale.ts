/**
 * useTimeScale - Hook React pour la gestion du temps de jeu
 */

import { useState, useEffect, useCallback } from 'react'
import { timeController, EASINGS, EasingFunction } from '../TimeController'

/**
 * Hook pour accéder au timeScale et aux fonctions de temps
 */
export function useTimeScale() {
  const [timeScale, setTimeScale] = useState(1.0)
  const [isPaused, setIsPaused] = useState(false)
  
  // S'abonner aux changements de timeScale
  useEffect(() => {
    const unsubscribe = timeController.onTimeScaleChange((scale) => {
      setTimeScale(scale)
      setIsPaused(scale === 0)
    })
    
    return unsubscribe
  }, [])
  
  /**
   * Gel le temps (hit-stop)
   */
  const hitStop = useCallback((duration: number) => {
    return timeController.hitStop(duration)
  }, [])
  
  /**
   * Ralentit le temps (slow-mo)
   */
  const slowMo = useCallback((
    targetScale: number,
    duration: number,
    holdDuration: number = 0,
    easing: EasingFunction = EASINGS.easeOut
  ) => {
    return timeController.slowMo(targetScale, duration, holdDuration, easing)
  }, [])
  
  /**
   * Pause le jeu
   */
  const pause = useCallback(() => {
    timeController.pause()
  }, [])
  
  /**
   * Reprend le jeu
   */
  const resume = useCallback(() => {
    timeController.resume()
  }, [])
  
  /**
   * Schedule une tâche (en temps réel)
   */
  const schedule = useCallback((callback: () => void, delay: number) => {
    return timeController.schedule(callback, delay)
  }, [])
  
  /**
   * Schedule une tâche (en temps de jeu, affecté par timeScale)
   */
  const scheduleGameTime = useCallback((callback: () => void, delay: number) => {
    return timeController.scheduleGameTime(callback, delay)
  }, [])
  
  /**
   * Annule une tâche schedulée
   */
  const cancel = useCallback((id: number) => {
    timeController.cancel(id)
  }, [])
  
  /**
   * Lance une animation avec easing
   */
  const animate = useCallback((
    duration: number,
    onUpdate: (progress: number) => void,
    onComplete?: () => void,
    easing: EasingFunction = EASINGS.easeOut
  ) => {
    return timeController.animate(duration, onUpdate, onComplete, easing)
  }, [])
  
  return {
    timeScale,
    isPaused,
    hitStop,
    slowMo,
    pause,
    resume,
    schedule,
    scheduleGameTime,
    cancel,
    animate,
    easings: EASINGS
  }
}

/**
 * Hook pour créer un délai qui respecte le timeScale
 */
export function useGameDelay() {
  const { scheduleGameTime, cancel } = useTimeScale()
  
  /**
   * Attend un délai en temps de jeu
   */
  const delay = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => {
      scheduleGameTime(resolve, ms)
    })
  }, [scheduleGameTime])
  
  /**
   * Attend un délai en temps réel (non affecté par timeScale)
   */
  const realDelay = useCallback((ms: number): Promise<void> => {
    return new Promise((resolve) => {
      timeController.schedule(resolve, ms)
    })
  }, [])
  
  return { delay, realDelay, cancel }
}
