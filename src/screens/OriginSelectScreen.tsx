import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { ORIGINS, isOriginUnlocked } from '../features/meta/origins'
import { loadUnlockState } from '../features/meta/unlocks'
import { useMetaProgressionStore } from '../store/metaProgression'
import { UnlockState } from '../features/meta/types'

export default function OriginSelectScreen() {
  const { startNewGame } = useGameStore()
  const { playerLevel } = useMetaProgressionStore()
  const [selectedOrigin, setSelectedOrigin] = useState<string>('deserteur')
  const [unlockState, setUnlockState] = useState<UnlockState | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadUnlocks()
  }, [])
  
  const loadUnlocks = async () => {
    try {
      const unlocks = await loadUnlockState()
      setUnlockState(unlocks)
    } catch (error) {
      console.error('Erreur chargement unlocks:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleStart = () => {
    if (!unlockState || !isOriginUnlocked(selectedOrigin, unlockState)) return
    
    // Démarrer la partie avec l'origine sélectionnée
    startNewGame(selectedOrigin)
  }
  
  if (loading || !unlockState) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Chargement...</div>
      </div>
    )
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
      <div style={{
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>
        CHOISIS TON ORIGINE
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {ORIGINS.map((origin) => {
          const unlockedByCondition = isOriginUnlocked(origin.id, unlockState)
          const levelRequirementMet = !origin.requiredLevel || playerLevel >= origin.requiredLevel
          const unlocked = unlockedByCondition && levelRequirementMet
          
          return (
            <div
              key={origin.id}
              onClick={() => unlocked && setSelectedOrigin(origin.id)}
              style={{
                background: selectedOrigin === origin.id ? '#3a3a3a' : '#2a2a2a',
                padding: '1rem',
                borderRadius: '8px',
                border: `2px solid ${selectedOrigin === origin.id ? '#555' : '#333'}`,
                cursor: unlocked ? 'pointer' : 'not-allowed',
                opacity: unlocked ? 1 : 0.6
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}>
                  {unlocked ? '🔓' : '🔒'} {origin.name}
                </div>
                {selectedOrigin === origin.id && unlocked && (
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#2ecc71'
                  }}>
                    SÉLECTIONNÉ
                  </div>
                )}
              </div>
              
              <div style={{
                fontSize: '0.9rem',
                color: '#aaa',
                marginBottom: '0.5rem',
                lineHeight: '1.5'
              }}>
                {origin.description}
              </div>
              
              {!unlocked && (
                <div style={{
                  fontSize: '0.8rem',
                  color: '#888',
                  fontStyle: 'italic'
                }}>
                  {!levelRequirementMet && origin.requiredLevel ? (
                    <span style={{ color: '#f39c12' }}>
                      Niveau {origin.requiredLevel} requis (Niveau actuel : {playerLevel})
                    </span>
                  ) : (
                    <span>Condition : {getUnlockDescription(origin.id)}</span>
                  )}
                </div>
              )}
              
              {unlocked && (origin.bonuses.stats || origin.bonuses.gold || origin.maluses.stats || origin.maluses.debt) && (
                <div style={{
                  fontSize: '0.85rem',
                  color: '#888',
                  marginTop: '0.5rem',
                  display: 'flex',
                  gap: '1rem'
                }}>
                  {origin.bonuses.stats && (
                    <div>
                      Bonus : {origin.bonuses.stats.atk ? `+${origin.bonuses.stats.atk} ATK ` : ''}
                      {origin.bonuses.stats.def ? `+${origin.bonuses.stats.def} DEF ` : ''}
                      {origin.bonuses.stats.vit ? `+${origin.bonuses.stats.vit} VIT ` : ''}
                    </div>
                  )}
                  {origin.maluses.stats && (
                    <div>
                      Malus : {origin.maluses.stats.atk ? `${origin.maluses.stats.atk} ATK ` : ''}
                      {origin.maluses.stats.def ? `${origin.maluses.stats.def} DEF ` : ''}
                      {origin.maluses.stats.vit ? `${origin.maluses.stats.vit} VIT ` : ''}
                    </div>
                  )}
                  {origin.bonuses.gold && (
                    <div style={{ color: '#2ecc71' }}>+{origin.bonuses.gold}💰</div>
                  )}
                  {origin.maluses.debt && (
                    <div style={{ color: '#c44' }}>Dette +{origin.maluses.debt}💰</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      <button
        onClick={handleStart}
        disabled={!unlockState || !isOriginUnlocked(selectedOrigin, unlockState) || (ORIGINS.find(o => o.id === selectedOrigin)?.requiredLevel !== undefined && playerLevel < (ORIGINS.find(o => o.id === selectedOrigin)?.requiredLevel ?? 0))}
        style={{
          fontSize: '1.1rem',
          padding: '1rem',
          width: '100%',
          opacity: (unlockState && isOriginUnlocked(selectedOrigin, unlockState) && (!ORIGINS.find(o => o.id === selectedOrigin)?.requiredLevel || playerLevel >= (ORIGINS.find(o => o.id === selectedOrigin)?.requiredLevel || 0))) ? 1 : 0.5,
          cursor: (unlockState && isOriginUnlocked(selectedOrigin, unlockState) && (!ORIGINS.find(o => o.id === selectedOrigin)?.requiredLevel || playerLevel >= (ORIGINS.find(o => o.id === selectedOrigin)?.requiredLevel || 0))) ? 'pointer' : 'not-allowed'
        }}
      >
        COMMENCER
      </button>
    </div>
  )
}

function getUnlockDescription(originId: string): string {
  const descriptions: Record<string, string> = {
    veteran: '1 victoire',
    pillard: '50 items lootés au total',
    moine: '5 monastères explorés',
    noble: 'Or > 200💰 dans une run',
    survivant: '3 fuites de combat'
  }
  return descriptions[originId] || 'Inconnu'
}
