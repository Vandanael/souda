/**
 * Hook pour gérer la musique ambient selon la phase du jeu
 */

import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { audioManager } from './audioManager'

export function useMusicPhase() {
  const phase = useGameStore((state) => state.phase)
  
  useEffect(() => {
    // Ne pas jouer de musique si audio désactivé
    const settings = audioManager.getSettings()
    if (settings.muted || !settings.musicEnabled) return
    
    switch (phase) {
      case 'aube':
      case 'marche':
      case 'morten':
      case 'forge':
      case 'taverne':
      case 'inventory':
        // Camp/Hub
        audioManager.playMusic('ambient_camp', 1000)
        break
        
      case 'exploration':
        // Exploration
        audioManager.playMusic('ambient_explore', 1000)
        break
        
      case 'crepuscule':
        // Retour au camp
        audioManager.playMusic('ambient_camp', 1000)
        break
        
      case 'start':
      case 'origin':
      case 'tutorial':
      case 'defeat':
      case 'victory':
      case 'hallOfFame':
      case 'settings':
        // Pas de musique pour ces phases
        audioManager.stopMusic(500)
        break
        
      // Combat gère sa propre musique (crossfade)
      default:
        break
    }
    
    return () => {
      // Cleanup si nécessaire
    }
  }, [phase])
}
