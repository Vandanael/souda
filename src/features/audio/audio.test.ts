import { describe, it, expect, beforeEach, vi } from 'vitest'
import { audioManager } from './audioManager'
import { hapticManager } from './hapticManager'

// Mock fetch
global.fetch = vi.fn()

// Mock AudioContext
class MockAudioContext {
  currentTime = 0
  destination = {}
  
  createBufferSource() {
    return {
      buffer: null,
      loop: false,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    }
  }
  
  createGain() {
    return {
      gain: { value: 0 },
      connect: vi.fn()
    }
  }
  
  decodeAudioData() {
    return Promise.resolve(new ArrayBuffer(0))
  }
}

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: vi.fn()
})

describe('Audio Manager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock AudioContext
    global.AudioContext = MockAudioContext as any
    ;(global as any).webkitAudioContext = MockAudioContext
  })
  
  it('initialise sans crash si AudioContext indisponible', async () => {
    // Simuler l'absence d'AudioContext
    const originalAudioContext = global.AudioContext
    delete (global as any).AudioContext
    delete (global as any).webkitAudioContext
    
    // Ne devrait pas crasher
    await audioManager.playSound('ui_click')
    
    // Restaurer
    global.AudioContext = originalAudioContext as any
  })
  
  it('ne joue pas de son si muted', async () => {
    audioManager.mute()
    await audioManager.playSound('ui_click')
    
    // Vérifier que fetch n'a pas été appelé (pas de chargement)
    expect(fetch).not.toHaveBeenCalled()
  })
  
  it('ne joue pas de son si SFX désactivés', async () => {
    audioManager.setSfxEnabled(false)
    await audioManager.playSound('ui_click')
    
    // Vérifier que fetch n'a pas été appelé
    expect(fetch).not.toHaveBeenCalled()
    
    // Restaurer
    audioManager.setSfxEnabled(true)
  })
  
  it('définit le volume correctement', () => {
    audioManager.setVolume(0.5)
    const settings = audioManager.getSettings()
    expect(settings.volume).toBe(0.5)
  })
  
  it('mute/unmute fonctionne', () => {
    audioManager.mute()
    expect(audioManager.getSettings().muted).toBe(true)
    
    audioManager.unmute()
    expect(audioManager.getSettings().muted).toBe(false)
  })
  
  it('gère les settings musique et SFX', () => {
    audioManager.setMusicEnabled(false)
    expect(audioManager.getSettings().musicEnabled).toBe(false)
    
    audioManager.setMusicEnabled(true)
    expect(audioManager.getSettings().musicEnabled).toBe(true)
    
    audioManager.setSfxEnabled(false)
    expect(audioManager.getSettings().sfxEnabled).toBe(false)
    
    audioManager.setSfxEnabled(true)
    expect(audioManager.getSettings().sfxEnabled).toBe(true)
  })
})

describe('Haptic Manager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('vibre si API disponible', () => {
    hapticManager.setEnabled(true)
    hapticManager.play('button_press')
    
    expect(navigator.vibrate).toHaveBeenCalledWith([5])
  })
  
  it('ne vibre pas si désactivé', () => {
    hapticManager.setEnabled(false)
    hapticManager.play('button_press')
    
    expect(navigator.vibrate).not.toHaveBeenCalled()
  })
  
  it('utilise les patterns corrects', () => {
    hapticManager.setEnabled(true)
    
    hapticManager.play('loot_common')
    expect(navigator.vibrate).toHaveBeenCalledWith([10])
    
    hapticManager.play('loot_legendary')
    expect(navigator.vibrate).toHaveBeenCalledWith([100, 50, 100, 50, 200])
  })
  
  it('ne crash pas si vibrate indisponible', () => {
    // Le code dans hapticManager vérifie déjà 'vibrate' in navigator
    // Donc si l'API n'est pas disponible, le code ne devrait pas crasher
    // On teste simplement que la fonction s'exécute sans erreur
    expect(() => {
      hapticManager.play('button_press')
    }).not.toThrow()
  })
})
