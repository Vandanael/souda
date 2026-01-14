import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

export default function DebugButton() {
  const [debugOpen, setDebugOpen] = useState(false)
  const setPhase = useGameStore((state) => state.setPhase)
  const resetGame = useGameStore((state) => state.resetGame)

  const handleDebugResetCache = async () => {
    try {
      if (typeof caches !== 'undefined') {
        const keys = await caches.keys()
        await Promise.all(keys.map(k => caches.delete(k)))
      }
      if (navigator?.serviceWorker) {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map(r => r.unregister()))
      }
      localStorage.clear()
      setTimeout(() => window.location.reload(), 150)
    } catch (e) {
      console.warn('Reset cache/service worker impossible:', e)
      window.location.reload()
    }
  }

  const handleDebugSkipToDay19 = () => {
    useGameStore.setState((state) => ({
      ...state,
      day: 19,
      debt: 20,
      gold: 250,
      actionsRemaining: 3,
      phase: 'aube',
      currentEvent: 'none',
      eventResult: null,
      combatResult: null,
      lootedItem: null,
      currentEnemy: null
    }))
    setPhase('aube')
    setDebugOpen(false)
  }

  const handleDebugEndGameVictory = () => {
    useGameStore.setState((state) => ({
      ...state,
      day: 20,
      debt: 0,
      gold: 300,
      actionsRemaining: 0,
      phase: 'victory'
    }))
    setPhase('victory')
    setDebugOpen(false)
  }

  const handleDebugResetState = () => {
    resetGame()
    localStorage.clear()
    setDebugOpen(false)
  }

  return (
    <>
      {/* Bouton debug toujours visible en bas */}
      <button
        onClick={() => setDebugOpen(!debugOpen)}
        style={{
          position: 'fixed',
          bottom: '0.5rem',
          right: '0.5rem',
          zIndex: 9999,
          padding: '0.4rem 0.8rem',
          fontSize: '0.7rem',
          background: 'rgba(0, 0, 0, 0.7)',
          border: '1px solid #555',
          borderRadius: '4px',
          color: '#ca8',
          cursor: 'pointer',
          fontWeight: 'bold',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
      >
        debug
      </button>

      {/* Panel debug */}
      {debugOpen && (
        <div
          onClick={() => setDebugOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1a1a1a',
              border: '2px solid #ca8',
              borderRadius: '8px',
              padding: '1.5rem',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#ca8',
              textAlign: 'center'
            }}>
              🛠️ DEBUG PANEL
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <button
                onClick={handleDebugResetCache}
                style={{
                  padding: '0.6rem',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  color: '#ddd',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                🔄 Relancer sans cache (clear caches + SW + reload)
              </button>
              
              <button
                onClick={handleDebugSkipToDay19}
                style={{
                  padding: '0.6rem',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  color: '#ddd',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                ⏩ Passer Jour 19 (250💰, dette 20, phase Aube)
              </button>
              
              <button
                onClick={handleDebugEndGameVictory}
                style={{
                  padding: '0.6rem',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  color: '#ddd',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                🏁 Forcer Victoire (J20, dette 0)
              </button>
              
              <button
                onClick={handleDebugResetState}
                style={{
                  padding: '0.6rem',
                  background: '#2a2a2a',
                  border: '1px solid #444',
                  color: '#ddd',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                🗑️ Reset état (store + localStorage)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
