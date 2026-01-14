/**
 * Panneau de debug toujours visible en haut à gauche
 */

import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { clearAllCacheAndReload, resetGameAndCache } from '../utils/debug'

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { resetGame, phase, day, gold, debt } = useGameStore()

  const handleClearCache = async () => {
    if (confirm('🐛 Vider tout le cache et recharger ?\n\n⚠️ Action irréversible !')) {
      await clearAllCacheAndReload()
    }
  }

  const handleResetGame = async () => {
    if (confirm('💥 Reset complet : vider TOUT (cache + Hall of Fame + progression) ?\n\n⚠️ Action irréversible !\n\nLa page va se recharger automatiquement.')) {
      try {
        // Nettoyer le cache (IndexedDB + localStorage + Hall of Fame)
        await resetGameAndCache()
        
        // Reset le jeu dans le store
        resetGame()
        
        console.log('✅ Reset complet effectué, rechargement...')
        
        // Attendre un peu pour que les opérations se terminent
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Recharger la page pour être sûr que tout est à zéro
        window.location.reload()
      } catch (error) {
        console.error('❌ Erreur lors du reset:', error)
        // Recharger quand même
        window.location.reload()
      }
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
        fontFamily: 'monospace',
        // Style orange distinct de la DA de l'app
        filter: 'drop-shadow(0 2px 4px rgba(255, 165, 0, 0.5))'
      }}
    >
      {/* Bouton toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.5rem',
          background: '#ff8800',
          border: '2px solid #ffaa00',
          color: '#000',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(255, 140, 0, 0.6)',
          fontFamily: 'monospace'
        }}
      >
        🐛
      </button>

      {/* Panneau déroulant */}
      {isOpen && (
        <div
          style={{
            marginTop: '0.5rem',
            background: '#1a0f00',
            border: '2px solid #ff8800',
            borderRadius: '4px',
            padding: '0.75rem',
            minWidth: '200px',
            boxShadow: '0 4px 8px rgba(255, 140, 0, 0.4)',
            fontFamily: 'monospace'
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#ffaa00',
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
                color: '#ffaa00',
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
              color: '#ffcc88',
              marginBottom: '0.75rem',
              padding: '0.5rem',
              background: '#0a0500',
              borderRadius: '2px',
              border: '1px solid #ff8800'
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
                background: '#332200',
                border: '1px solid #ff8800',
                color: '#ffcc88',
                fontSize: '0.7rem',
                cursor: 'pointer',
                borderRadius: '2px',
                textAlign: 'left',
                fontFamily: 'monospace'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#443300'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#332200'
              }}
            >
              📊 État console
            </button>

            <button
              onClick={handleResetGame}
              style={{
                padding: '0.5rem',
                background: '#ff6600',
                border: '1px solid #ff8800',
                color: '#000',
                fontSize: '0.7rem',
                cursor: 'pointer',
                borderRadius: '2px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff7700'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ff6600'
              }}
            >
              💥 Reset complet
            </button>

            <button
              onClick={handleClearCache}
              style={{
                padding: '0.5rem',
                background: '#ff4400',
                border: '1px solid #ff6600',
                color: '#fff',
                fontSize: '0.7rem',
                cursor: 'pointer',
                borderRadius: '2px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff5500'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ff4400'
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
