/**
 * Hook React pour utiliser l'audio manager facilement
 */

import { useCallback } from 'react'
import { audioManager, type SoundId, type MusicId } from './audioManager'
import { hapticManager, type HapticPattern } from './hapticManager'

export function useAudio() {
  const playSound = useCallback((soundId: SoundId, volume?: number) => {
    audioManager.playSound(soundId, volume)
  }, [])

  const playMusic = useCallback((musicId: MusicId, fadeIn?: number) => {
    audioManager.playMusic(musicId, fadeIn)
  }, [])

  const stopMusic = useCallback((fadeOut?: number) => {
    audioManager.stopMusic(fadeOut)
  }, [])

  const crossfadeMusic = useCallback((musicId: MusicId, duration?: number) => {
    audioManager.crossfadeMusic(musicId, duration)
  }, [])

  const playHaptic = useCallback((pattern: HapticPattern) => {
    hapticManager.play(pattern)
  }, [])

  return {
    playSound,
    playMusic,
    stopMusic,
    crossfadeMusic,
    playHaptic,
    setVolume: audioManager.setVolume.bind(audioManager),
    mute: audioManager.mute.bind(audioManager),
    unmute: audioManager.unmute.bind(audioManager),
    setMusicEnabled: audioManager.setMusicEnabled.bind(audioManager),
    setSfxEnabled: audioManager.setSfxEnabled.bind(audioManager),
    getSettings: audioManager.getSettings.bind(audioManager)
  }
}
