/**
 * Audio Manager - Singleton avec lazy loading
 */

type SoundId = 
  // Loot
  | 'loot_common' | 'loot_uncommon' | 'loot_rare' | 'loot_legendary'
  // Combat
  | 'combat_start' | 'hit_01' | 'hit_02' | 'hit_03' | 'victory' | 'defeat' | 'flee'
  // UI
  | 'equip_metal' | 'equip_leather' | 'ui_open' | 'ui_close' | 'coins' | 'coins_loss' | 'ui_click'

type MusicId = 'ambient_camp' | 'ambient_explore' | 'ambient_combat'

interface AudioSettings {
  volume: number // 0-1
  musicEnabled: boolean
  sfxEnabled: boolean
  muted: boolean
}

class AudioManager {
  private static instance: AudioManager | null = null
  private audioContext: AudioContext | null = null
  private soundCache: Map<SoundId, AudioBuffer> = new Map()
  private musicSource: AudioBufferSourceNode | null = null
  private musicGain: GainNode | null = null
  private currentMusic: MusicId | null = null
  private settings: AudioSettings = {
    volume: 0.7,
    musicEnabled: true,
    sfxEnabled: true,
    muted: false
  }
  private initialized = false

  private constructor() {
    // Charger les settings depuis localStorage
    this.loadSettings()
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  /**
   * Initialise l'audio context (lazy loading)
   */
  private async init(): Promise<void> {
    if (this.initialized) return

    try {
      // Créer l'audio context (nécessite une interaction utilisateur)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.initialized = true
    } catch (error) {
      console.warn('Audio context initialization failed:', error)
    }
  }

  /**
   * Charge un fichier audio
   */
  private async loadSound(soundId: SoundId): Promise<AudioBuffer | null> {
    if (this.soundCache.has(soundId)) {
      return this.soundCache.get(soundId)!
    }

    if (!this.audioContext) {
      await this.init()
      if (!this.audioContext) return null
    }

    try {
      // Charger depuis /assets/audio/ (graceful degradation si fichier absent)
      const response = await fetch(`/assets/audio/${soundId}.mp3`)
      if (!response.ok) {
        // Fichier non trouvé - ignorer silencieusement (fichiers audio optionnels)
        return null
      }
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      this.soundCache.set(soundId, audioBuffer)
      return audioBuffer
    } catch (error) {
      // Erreur de chargement - graceful degradation (silencieux)
      // Les fichiers audio n'existent peut-être pas encore, c'est normal
      return null
    }
  }

  /**
   * Charge un fichier musique
   */
  private async loadMusic(musicId: MusicId): Promise<AudioBuffer | null> {
    if (!this.audioContext) {
      await this.init()
      if (!this.audioContext) return null
    }

    try {
      const response = await fetch(`/assets/audio/${musicId}.mp3`)
      if (!response.ok) {
        // Fichier non trouvé - ignorer silencieusement (fichiers audio optionnels)
        return null
      }
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      return audioBuffer
    } catch (error) {
      // Erreur de chargement - graceful degradation (silencieux)
      // Les fichiers audio n'existent peut-être pas encore, c'est normal
      return null
    }
  }

  /**
   * Joue un son
   */
  async playSound(soundId: SoundId, volume: number = 1.0): Promise<void> {
    if (this.settings.muted || !this.settings.sfxEnabled) return

    if (!this.audioContext) {
      await this.init()
      if (!this.audioContext) return
    }

    const buffer = await this.loadSound(soundId)
    if (!buffer || !this.audioContext) return

    try {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = buffer
      gainNode.gain.value = volume * this.settings.volume
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.start(0)
    } catch (error) {
      console.warn(`Failed to play sound ${soundId}:`, error)
    }
  }

  /**
   * Joue une musique (loop)
   */
  async playMusic(musicId: MusicId, fadeIn: number = 0): Promise<void> {
    if (this.settings.muted || !this.settings.musicEnabled) return

    if (!this.audioContext) {
      await this.init()
      if (!this.audioContext) return
    }

    // Arrêter la musique actuelle
    this.stopMusic(0)

    const buffer = await this.loadMusic(musicId)
    if (!buffer || !this.audioContext) return

    try {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = buffer
      source.loop = true
      
      gainNode.gain.value = 0
      gainNode.gain.linearRampToValueAtTime(
        this.settings.volume,
        this.audioContext.currentTime + (fadeIn / 1000)
      )
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.start(0)
      
      this.musicSource = source
      this.musicGain = gainNode
      this.currentMusic = musicId
    } catch (error) {
      console.warn(`Failed to play music ${musicId}:`, error)
    }
  }

  /**
   * Arrête la musique
   */
  stopMusic(fadeOut: number = 0): void {
    if (!this.musicSource || !this.musicGain || !this.audioContext) return

    const fadeOutSeconds = fadeOut / 1000

    this.musicGain.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + fadeOutSeconds
    )

    setTimeout(() => {
      try {
        this.musicSource?.stop()
      } catch (error) {
        // Ignore si déjà arrêté
      }
      this.musicSource = null
      this.musicGain = null
      this.currentMusic = null
    }, fadeOut)
  }

  /**
   * Crossfade entre deux musiques
   */
  async crossfadeMusic(musicId: MusicId, duration: number = 1000): Promise<void> {
    if (this.settings.muted || !this.settings.musicEnabled) return

    // Fade out la musique actuelle
    this.stopMusic(duration / 2)

    // Attendre un peu puis fade in la nouvelle
    setTimeout(async () => {
      await this.playMusic(musicId, duration / 2)
    }, duration / 2)
  }

  /**
   * Définit le volume global
   */
  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
    
    if (this.musicGain && this.audioContext) {
      this.musicGain.gain.value = this.settings.volume
    }
  }

  /**
   * Mute/unmute
   */
  mute(): void {
    this.settings.muted = true
    this.stopMusic(0)
    this.saveSettings()
  }

  unmute(): void {
    this.settings.muted = false
    this.saveSettings()
  }

  /**
   * Active/désactive la musique
   */
  setMusicEnabled(enabled: boolean): void {
    this.settings.musicEnabled = enabled
    this.saveSettings()
    
    if (!enabled) {
      this.stopMusic(0)
    } else if (this.currentMusic) {
      this.playMusic(this.currentMusic, 500)
    }
  }

  /**
   * Active/désactive les SFX
   */
  setSfxEnabled(enabled: boolean): void {
    this.settings.sfxEnabled = enabled
    this.saveSettings()
  }

  /**
   * Charge les settings depuis localStorage
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('audioSettings')
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.warn('Failed to load audio settings:', error)
    }
  }

  /**
   * Sauvegarde les settings dans localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('audioSettings', JSON.stringify(this.settings))
    } catch (error) {
      console.warn('Failed to save audio settings:', error)
    }
  }

  /**
   * Obtient les settings actuels
   */
  getSettings(): AudioSettings {
    return { ...this.settings }
  }
}

export const audioManager = AudioManager.getInstance()

// Export des types
export type { SoundId, MusicId, AudioSettings }
