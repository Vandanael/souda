/**
 * Panneau de debug toujours visible en haut à gauche
 */

import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { clearAllCacheAndReload } from '../utils/debug'

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { resetGame, phase, day, gold, debt } = useGameStore()

  const handleClearCache = async () => {
    if (confirm('🐛 Vider tout le cache et recharger ?\n\n⚠️ Action irréversible !')) {
      await clearAllCacheAndReload()
    }
  }

  const handleResetGame = () => {
    if (confirm('🔄 Reset du jeu (sans nettoyer le cache) ?')) {
      resetGame()
      setIsOpen(false)
    }
  }

  const handleShowState = () => {
    const state = useGameStore.getState()
    console.log('📊 ÉTAT DU JEU:', {
      phase,
      day,
      gold,
      debt,
      reputation: state.reputation,
      inventory: state.inventory.length,
      equipment: Object.keys(state.equipment).length,
      combatsWon: state.combatsWon,
      combatsLost: state.combatsLost,
      fullState: state
    })
    alert('État du jeu affiché dans la console (F12)')
    setIsOpen(false)
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}
    >
      {/* Bouton toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.5rem',
          background: 'transparent',
          border: '2px solid #e66',
          color: '#fff',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
        title="Debug Panel"
      >
        🐛
      </button>

      {/* Panneau déroulant */}
      {isOpen && (
        <div
          style={{
            marginTop: '0.5rem',
            background: '#2a1a1a',
            border: '2px solid #c44',
            borderRadius: '4px',
            padding: '0.75rem',
            minWidth: '200px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#f88',
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>DEBUG</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f88',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0'
              }}
            >
              ×
            </button>
          </div>

          {/* Info rapide */}
          <div
            style={{
              fontSize: '0.65rem',
              color: '#aaa',
              marginBottom: '0.75rem',
              padding: '0.5rem',
              background: '#1a0a0a',
              borderRadius: '2px'
            }}
          >
            J{day} | {gold}💰 | {debt}💰 | {phase}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={handleShowState}
              style={{
                padding: '0.5rem',
                background: '#555',
                border: '1px solid #777',
                color: '#fff',
                fontSize: '0.7rem',
                cursor: 'pointer',
                borderRadius: '2px',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#666'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#555'
              }}
            >
              📊 État console
            </button>

            <button
              onClick={handleResetGame}
              style={{
                padding: '0.5rem',
                background: '#555',
                border: '1px solid #777',
                color: '#fff',
                fontSize: '0.7rem',
                cursor: 'pointer',
                borderRadius: '2px',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#666'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#555'
              }}
            >
              🔄 Reset jeu
            </button>

            <button
              onClick={handleClearCache}
              style={{
                padding: '0.5rem',
                background: '#c44',
                border: '1px solid #e66',
                color: '#fff',
                fontSize: '0.7rem',
                cursor: 'pointer',
                borderRadius: '2px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d55'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#c44'
              }}
            >
              🧹 Cache + Reload
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
