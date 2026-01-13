import { useGameStore } from '../store/gameStore'
import { Location } from '../types/location'
import { LOCATION_TYPES } from '../types/location'
import { getCombatProbability, estimateCombatRatio, getEstimatedEnemyForRisk, calculateVictoryProbability, calculateCombatOutcomeProbabilities } from '../features/combat'
import { useIsMobile } from '../hooks/useIsMobile'
import { useState } from 'react'
import CompactHUD from '../components/CompactHUD'

interface MapScreenProps {
  locations: Location[]
  onExplore: (location: Location) => void
  onEndDay: () => void
}

export default function MapScreen({ locations, onExplore, onEndDay }: MapScreenProps) {
  const { actionsRemaining, day, rumors, playerStats } = useGameStore()
  const isMobile = useIsMobile()
  const [tooltipLocation, setTooltipLocation] = useState<string | null>(null)
  
  // Filtrer les rumeurs actives (du jour actuel ou des 2 jours précédents)
  const activeRumors = rumors.filter(r => r.day >= day - 2)
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflowY: 'auto'
    }}>
      {/* HUD Compact en haut */}
      <CompactHUD showActions={true} showHunger={true} />
      
      {/* Contenu scrollable */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        flex: 1,
        padding: '1rem'
      }}>
        {/* Titre discret */}
        <div style={{
          textAlign: 'center',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            fontSize: isMobile ? '1.1rem' : '1.2rem',
            fontWeight: 'bold',
            color: '#aaa',
            opacity: 0.7
          }}>
            EXPLORATION
          </div>
        </div>
        
        {/* Liste des lieux */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
        {locations.map((location, index) => {
          const locationConfig = LOCATION_TYPES[location.type]
          const isTutorialLocation = index === 0 && day === 1
          const canExplore = actionsRemaining > 0
          
          // Vérifier si une rumeur cible ce lieu
          const locationRumors = activeRumors.filter(r => 
            r.targetLocationId === location.id || 
            (r.hintType === 'location' && !r.targetLocationId)
          )
          const hasRumor = locationRumors.length > 0
          const rumorType = hasRumor ? locationRumors[0].hintType : null
          const rumorIcon = rumorType === 'combat' ? '⚔️' :
                           rumorType === 'loot' ? '💰' :
                           rumorType === 'event' ? '⚠️' :
                           rumorType === 'location' ? '📍' : null
          
          // Estimer le ratio de combat si probabilité > 0
          const combatProb = getCombatProbability(location.risk)
          let combatEstimate: { ratio: number; confidence: 'low' | 'medium' | 'high' } | null = null
          let estimatedEnemy: { atk: number; def: number; vit: number } | null = null
          let combatWarning: 'danger' | 'risky' | 'safe' | null = null
          let outcomeProbabilities: ReturnType<typeof calculateCombatOutcomeProbabilities> | null = null
          
          if (combatProb > 0.1) {
            estimatedEnemy = getEstimatedEnemyForRisk(location.risk)
            combatEstimate = estimateCombatRatio(playerStats, estimatedEnemy)
            outcomeProbabilities = calculateCombatOutcomeProbabilities(combatEstimate.ratio)
            
            // Déterminer le warning selon le ratio
            if (combatEstimate.ratio < 0.5) {
              combatWarning = 'danger'
            } else if (combatEstimate.ratio < 0.7) {
              combatWarning = 'risky'
            } else if (combatEstimate.ratio > 1.0) {
              combatWarning = 'safe'
            }
          }
          
          return (
            <div
              key={location.id}
              data-tutorial-location={isTutorialLocation ? 'true' : undefined}
              style={{
                background: '#2a2a2a',
                border: '2px solid #555',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              {/* En-tête du lieu */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  position: 'relative'
                }}>
                  {locationConfig.icon}
                  {hasRumor && rumorIcon && (
                    <span style={{
                      position: 'absolute',
                      top: '-0.25rem',
                      right: '-0.25rem',
                      fontSize: '1rem',
                      background: '#ca8',
                      borderRadius: '50%',
                      width: '1.25rem',
                      height: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #2a2a2a'
                    }} title="Rumeur active">
                      {rumorIcon}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {location.name}
                    {location.explored && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#888',
                        fontStyle: 'italic'
                      }}>
                        (Exploré {(location.explorationCount || 0)}x)
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#aaa',
                    fontStyle: 'italic'
                  }}>
                    {location.description}
                  </div>
                </div>
              </div>
              
              {/* Stats du lieu */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                fontSize: '0.9rem',
                color: '#ccc',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span>Risque:</span>
                  <span style={{ color: '#c44' }}>
                    {'⭐'.repeat(location.risk)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <span>Richesse:</span>
                  <span style={{ color: '#ca8' }}>
                    {'💰'.repeat(location.richness)}
                  </span>
                </div>
                {/* Warning combat amélioré */}
                {combatWarning && combatEstimate && estimatedEnemy && outcomeProbabilities && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    marginTop: '0.25rem',
                    padding: '0.75rem',
                    background: combatWarning === 'danger' ? '#2a1a1a' : 
                               combatWarning === 'risky' ? '#2a2a1a' : '#1a2a1a',
                    borderRadius: '4px',
                    border: `1px solid ${combatWarning === 'danger' ? '#c44' : 
                                            combatWarning === 'risky' ? '#ca8' : '#4a4'}`,
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      {combatWarning === 'danger' && (
                        <span style={{
                          background: '#c44',
                          color: '#fff',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          ⚠️ DANGER
                        </span>
                      )}
                      {combatWarning === 'risky' && (
                        <span style={{
                          background: '#ca8',
                          color: '#000',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          ⚠️ RISQUÉ
                        </span>
                      )}
                      {combatWarning === 'safe' && (
                        <span style={{
                          background: '#4a4',
                          color: '#fff',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          ✓ SÛR
                        </span>
                      )}
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#aaa'
                      }}>
                        Ratio: {combatEstimate.ratio.toFixed(2)}
                      </span>
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#aaa'
                      }}>
                        Victoire: {calculateVictoryProbability(combatEstimate.ratio)}%
                      </span>
                      <button
                        onClick={() => setTooltipLocation(tooltipLocation === location.id ? null : location.id)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #555',
                          borderRadius: '4px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.75rem',
                          color: '#aaa',
                          cursor: 'pointer'
                        }}
                        title="Afficher détails"
                      >
                        {tooltipLocation === location.id ? '▼' : '▶'} Détails
                      </button>
                    </div>
                    
                    {/* Stats ennemi estimées */}
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#888',
                      display: 'flex',
                      gap: '0.75rem',
                      flexWrap: 'wrap'
                    }}>
                      <span>Ennemi estimé: ATK {estimatedEnemy.atk} | DEF {estimatedEnemy.def} | VIT {estimatedEnemy.vit}</span>
                    </div>
                    
                    {/* Probabilités détaillées (affichées si tooltip ouvert) */}
                    {tooltipLocation === location.id && (
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: '#1a1a1a',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#ddd' }}>
                          Probabilités de résultats :
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#4a8' }}>Victoire écrasante :</span>
                            <span style={{ color: '#4a8' }}>{outcomeProbabilities.crushing}%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#4a4' }}>Victoire :</span>
                            <span style={{ color: '#4a4' }}>{outcomeProbabilities.victory}%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#ca8' }}>Victoire coûteuse :</span>
                            <span style={{ color: '#ca8' }}>{outcomeProbabilities.costly}%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#c84' }}>Fuite :</span>
                            <span style={{ color: '#c84' }}>{outcomeProbabilities.flee}%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#c44' }}>Défaite :</span>
                            <span style={{ color: '#c44' }}>{outcomeProbabilities.defeat}%</span>
                          </div>
                        </div>
                        <div style={{
                          marginTop: '0.5rem',
                          paddingTop: '0.5rem',
                          borderTop: '1px solid #333',
                          fontSize: '0.7rem',
                          color: '#666',
                          fontStyle: 'italic'
                        }}>
                          {combatWarning === 'danger' && '⚠️ Tu risques de perdre ce combat. Évite ou améliore ton équipement.'}
                          {combatWarning === 'risky' && '⚠️ Combat difficile. Tu risques de fuir ou de subir des dégâts.'}
                          {combatWarning === 'safe' && '✓ Tu devrais gagner ce combat sans trop de difficulté.'}
                        </div>
                      </div>
                    )}
                    
                    {/* Message court si tooltip fermé */}
                    {tooltipLocation !== location.id && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#888',
                        fontStyle: 'italic'
                      }}>
                        {combatWarning === 'danger' && 'Tu risques de perdre ce combat. Évite ou améliore ton équipement.'}
                        {combatWarning === 'risky' && 'Combat difficile. Tu risques de fuir ou de subir des dégâts.'}
                        {combatWarning === 'safe' && 'Tu devrais gagner ce combat sans trop de difficulté.'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Bouton Explorer */}
              <button
                data-tutorial-explore-button={isTutorialLocation ? 'true' : undefined}
                onClick={() => onExplore(location)}
                disabled={!canExplore}
                style={{
                  width: '100%',
                  padding: isMobile ? '0.875rem' : '0.75rem',
                  fontSize: isMobile ? '0.95rem' : '1rem',
                  minHeight: '44px',
                  opacity: canExplore ? 1 : 0.5,
                  cursor: canExplore ? 'pointer' : 'not-allowed'
                }}
              >
                EXPLORER
              </button>
            </div>
          )
        })}
        
        {/* Bouton Terminer la journée */}
        <button
          onClick={onEndDay}
          style={{
            marginTop: '1rem',
            padding: isMobile ? '0.875rem' : '1rem',
            fontSize: isMobile ? '1rem' : '1.1rem',
            minHeight: '44px',
            background: '#3a2a2a',
            border: '2px solid #666'
          }}
        >
          TERMINER LA JOURNÉE
        </button>
      </div>
      </div>
    </div>
  )
}
