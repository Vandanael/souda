import { useGameStore } from '../store/gameStore'
import { Location } from '../types/location'
import { getCombatProbability, estimateCombatRatio, getEstimatedEnemyForRisk, calculateVictoryProbability, calculateCombatOutcomeProbabilities } from '../features/combat'
import { useIsMobile } from '../hooks/useIsMobile'
import CompactHUD from '../components/CompactHUD'
import { Card } from '../components/design/Card'
import { Panel } from '../components/design/Panel'
import { Button } from '../components/design/Button'
import { colors } from '../design/tokens'
import { getTypographyStyleByName } from '../design/typography'

interface MapScreenProps {
  locations: Location[]
  onExplore: (location: Location) => void
  onEndDay: () => void
}

export default function MapScreen({ locations, onExplore, onEndDay }: MapScreenProps) {
  const { actionsRemaining, day, playerStats } = useGameStore()
  const isMobile = useIsMobile()
  
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
        gap: isMobile ? '1rem' : '1.5rem',
        flex: 1,
        padding: isMobile ? '0.75rem' : '1rem',
        overflowY: 'auto'
      }}>
        {/* Titre discret */}
        <div style={{
          textAlign: 'center',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            ...getTypographyStyleByName('uiBold'),
            fontSize: isMobile ? '1rem' : '1.2rem',
            color: colors.neutral.ash,
            opacity: 0.7
          }}>
            EXPLORATION
          </div>
        </div>
        
        {/* Liste des lieux */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '0.75rem' : '1rem'
        }}>
        {locations.map((location, index) => {
          const isTutorialLocation = index === 0 && day === 1
          const canExplore = actionsRemaining >= 1
          const firstSeen = location.firstSeenDay ? `Vu J${location.firstSeenDay}` : undefined
          
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
            <Card
              key={location.id}
              variant="interactive"
              surface="L1"
              interactive
              style={{
                padding: isMobile ? '0.75rem' : '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
              data-tutorial-location={isTutorialLocation ? 'true' : undefined}
            >
            <details
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                width: '100%'
              }}
            >
              <summary style={{
                listStyle: 'none',
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                <style>{`
                  details summary::-webkit-details-marker {
                    display: none;
                  }
                  details summary::marker {
                    display: none;
                  }
                `}</style>
              {/* Carte compacte : Icône + Nom + Stats + Bouton */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '0.5rem' : '0.75rem'
                }}
                onClick={(e) => {
                  // Empêcher la propagation si on clique sur le bouton EXPLORER
                  if ((e.target as HTMLElement).closest('button[data-tutorial-explore-button]')) {
                    e.stopPropagation()
                  }
                }}
              >
                {/* Nom et stats - alignés à gauche */}
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem',
                    textAlign: 'left'
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                      {location.name}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    fontSize: isMobile ? '0.7rem' : '0.75rem',
                    color: colors.neutral.ash,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    textAlign: 'left'
                  }}>
                    {location.explored && (
                      <span style={{
                        fontSize: '0.7rem',
                        color: colors.neutral.ash,
                        fontStyle: 'italic',
                        flexShrink: 0
                      }}>
                        (Exploré {(location.explorationCount || 0)}x)
                      </span>
                    )}
                    {firstSeen && (
                      <span style={{
                        fontSize: '0.7rem',
                        color: colors.neutral.soot,
                        flexShrink: 0
                      }}>
                        {firstSeen}
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ color: colors.blood.carmine, fontWeight: 600 }}>
                        Risque {location.risk}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ color: colors.gold.tarnished, fontWeight: 600 }}>
                        Richesse {location.richness}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Bouton EXPLORER - aligné à droite */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
                  <Button
                    data-tutorial-explore-button={isTutorialLocation ? 'true' : undefined}
                    onClick={(e) => {
                      e.stopPropagation() // Empêcher l'ouverture de l'accordéon
                      onExplore(location)
                    }}
                    disabled={!canExplore}
                    size="sm"
                    style={{
                      minWidth: isMobile ? '80px' : '100px',
                      flexShrink: 0
                    }}
                  >
                    EXPLORER
                  </Button>
                </div>
              </div>
              </summary>
              
              {/* Contenu de l'accordéon */}
              <Panel level="L2" style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: isMobile ? '0.8rem' : '0.85rem'
              }}>
                        {/* Description */}
                        <div style={{
                          ...getTypographyStyleByName('narrative'),
                          color: colors.neutral.ash,
                          fontSize: isMobile ? '0.8rem' : '0.85rem',
                          lineHeight: '1.5'
                        }}>
                          {location.description}
                        </div>
                        
                        {/* Détails de combat si disponibles */}
                        {combatWarning && combatEstimate && estimatedEnemy && outcomeProbabilities && (
                          <Panel level="L3" style={{
                            padding: '0.75rem',
                            background: combatWarning === 'danger' ? colors.blood.rust : 
                                       combatWarning === 'risky' ? colors.neutral.slate : colors.neutral.ink,
                            border: `1px solid ${combatWarning === 'danger' ? colors.blood.carmine : 
                                                    combatWarning === 'risky' ? colors.gold.tarnished : colors.gold.bone}`
                          }}>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem'
                            }}>
                              <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                flexWrap: 'wrap',
                                fontSize: '0.75rem',
                                color: colors.neutral.ash
                              }}>
                                <span>Ratio: {combatEstimate.ratio.toFixed(2)}</span>
                                <span>Victoire: {calculateVictoryProbability(combatEstimate.ratio)}%</span>
                                <span>Ennemi: ATK {estimatedEnemy.atk} | DEF {estimatedEnemy.def} | VIT {estimatedEnemy.vit}</span>
                              </div>
                              
                              {/* Probabilités détaillées */}
                              <Panel level="L2" style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem'
                              }}>
                                <div style={{ 
                                  fontWeight: 'bold', 
                                  marginBottom: '0.25rem', 
                                  color: colors.neutral.ivory, 
                                  fontSize: '0.8rem' 
                                }}>
                                  Probabilités :
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.75rem' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: colors.gold.bone }}>Victoire écrasante :</span>
                                    <span style={{ color: colors.gold.bone }}>{outcomeProbabilities.crushing}%</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: colors.gold.tarnished }}>Victoire :</span>
                                    <span style={{ color: colors.gold.tarnished }}>{outcomeProbabilities.victory}%</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: colors.gold.burnt }}>Victoire coûteuse :</span>
                                    <span style={{ color: colors.gold.burnt }}>{outcomeProbabilities.costly}%</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: colors.gold.tarnished }}>Fuite :</span>
                                    <span style={{ color: colors.gold.tarnished }}>{outcomeProbabilities.flee}%</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: colors.blood.carmine }}>Défaite :</span>
                                    <span style={{ color: colors.blood.carmine }}>{outcomeProbabilities.defeat}%</span>
                                  </div>
                                </div>
                              </Panel>
                              
                              <div style={{
                                fontSize: '0.75rem',
                                color: colors.neutral.ash,
                                fontStyle: 'italic',
                                marginTop: '0.25rem'
                              }}>
                                {combatWarning === 'danger' && '⚠️ Tu risques de perdre ce combat. Évite ou améliore ton équipement.'}
                                {combatWarning === 'risky' && '⚠️ Combat difficile. Tu risques de fuir ou de subir des dégâts.'}
                                {combatWarning === 'safe' && '✓ Tu devrais gagner ce combat sans trop de difficulté.'}
                              </div>
                            </div>
                          </Panel>
                        )}
                      </Panel>
            </details>
            </Card>
          )
        })}
        
        {/* Bouton Terminer la journée - Dans la zone scrollable */}
        <Button
          variant="secondary"
          size={isMobile ? 'lg' : 'md'}
          onClick={onEndDay}
          fullWidth
          style={{
            marginTop: isMobile ? '0.5rem' : '1rem',
            minHeight: isMobile ? '56px' : '44px'
          }}
        >
          TERMINER LA JOURNÉE
        </Button>
        
        {/* Indication discrète pour les détails */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.7rem',
          color: colors.neutral.soot,
          marginTop: '0.5rem',
          paddingBottom: '0.5rem',
          fontStyle: 'italic'
        }}>
          {isMobile ? 'Tap' : 'Click'} for info
        </div>
      </div>
      </div>
    </div>
  )
}
