import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { useAudio } from '../features/audio/useAudio'
import { hapticManager } from '../features/audio/hapticManager'

export default function SettingsScreen() {
  const { setPhase } = useGameStore()
  const { 
    setVolume, 
    mute, 
    unmute, 
    setMusicEnabled, 
    setSfxEnabled,
    getSettings 
  } = useAudio()
  
  const [audioSettings, setAudioSettings] = useState(getSettings())
  const [hapticEnabled, setHapticEnabled] = useState(hapticManager.isEnabled())
  const [volume, setVolumeState] = useState(audioSettings.volume * 100)
  
  useEffect(() => {
    setAudioSettings(getSettings())
    setHapticEnabled(hapticManager.isEnabled())
    setVolumeState(getSettings().volume * 100)
  }, [])
  
  const handleVolumeChange = (newVolume: number) => {
    setVolumeState(newVolume)
    setVolume(newVolume / 100)
  }
  
  const handleMuteToggle = () => {
    if (audioSettings.muted) {
      unmute()
    } else {
      mute()
    }
    setAudioSettings(getSettings())
  }
  
  const handleMusicToggle = () => {
    setMusicEnabled(!audioSettings.musicEnabled)
    setAudioSettings(getSettings())
  }
  
  const handleSfxToggle = () => {
    setSfxEnabled(!audioSettings.sfxEnabled)
    setAudioSettings(getSettings())
  }
  
  const handleHapticToggle = () => {
    const newValue = !hapticEnabled
    hapticManager.setEnabled(newValue)
    setHapticEnabled(newValue)
  }
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      flex: 1,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      {/* En-tête */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          PARAMÈTRES
        </div>
        <button
          onClick={() => setPhase('aube')}
          style={{
            fontSize: '0.9rem',
            padding: '0.5rem 1rem'
          }}
        >
          RETOUR
        </button>
      </div>
      
      {/* Audio */}
      <div style={{
        background: '#2a2a2a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '2px solid #555'
      }}>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          AUDIO
        </div>
        
        {/* Volume */}
        <div style={{
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <div style={{ fontSize: '1rem' }}>
              Volume
            </div>
            <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
              {Math.round(volume)}%
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              background: '#1a1a1a',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>
        
        {/* Mute */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '0.75rem',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '1rem' }}>
            Mute
          </div>
          <button
            onClick={handleMuteToggle}
            style={{
              padding: '0.5rem 1rem',
              background: audioSettings.muted ? '#c44' : '#555',
              border: `2px solid ${audioSettings.muted ? '#e66' : '#777'}`
            }}
          >
            {audioSettings.muted ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
          </button>
        </div>
        
        {/* Musique */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '0.75rem',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '1rem' }}>
            Musique
          </div>
          <button
            onClick={handleMusicToggle}
            style={{
              padding: '0.5rem 1rem',
              background: audioSettings.musicEnabled ? '#555' : '#c44',
              border: `2px solid ${audioSettings.musicEnabled ? '#777' : '#e66'}`
            }}
          >
            {audioSettings.musicEnabled ? 'ACTIVÉE' : 'DÉSACTIVÉE'}
          </button>
        </div>
        
        {/* SFX */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '1rem' }}>
            Effets sonores
          </div>
          <button
            onClick={handleSfxToggle}
            style={{
              padding: '0.5rem 1rem',
              background: audioSettings.sfxEnabled ? '#555' : '#c44',
              border: `2px solid ${audioSettings.sfxEnabled ? '#777' : '#e66'}`
            }}
          >
            {audioSettings.sfxEnabled ? 'ACTIVÉS' : 'DÉSACTIVÉS'}
          </button>
        </div>
      </div>
      
      {/* Haptic */}
      <div style={{
        background: '#2a2a2a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '2px solid #555'
      }}>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          VIBRATIONS
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '1rem' }}>
            Vibrations (mobile)
          </div>
          <button
            onClick={handleHapticToggle}
            style={{
              padding: '0.5rem 1rem',
              background: hapticEnabled ? '#555' : '#c44',
              border: `2px solid ${hapticEnabled ? '#777' : '#e66'}`
            }}
          >
            {hapticEnabled ? 'ACTIVÉES' : 'DÉSACTIVÉES'}
          </button>
        </div>
      </div>

    </div>
  )
}
