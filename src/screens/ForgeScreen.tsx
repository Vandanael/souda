import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { calculateRepairCost, getBertramComment, getBertramIntroduction, getBertramContextualDialogue } from '../features/forge/forge.logic'
import { getRarityColor, getRarityName } from '../types/item'
import DurabilityBar from '../features/durability/DurabilityBar'
import { Item } from '../types/item'

export default function ForgeScreen() {
  const {
    equipment,
    inventory,
    gold,
    reputation,
    forgeStock,
    repairItem,
    buyForgeItem,
    generateForgeStock,
    closeInventory,
    narrativeCounters,
    relics
  } = useGameStore()
  
  const [hasVisitedForge, setHasVisitedForge] = useState(false)
  const [selectedRepairItem, setSelectedRepairItem] = useState<Item | null>(null)
  
  // Générer le stock si nécessaire
  useEffect(() => {
    if (forgeStock === null) {
      generateForgeStock()
    }
    if (!hasVisitedForge) {
      setHasVisitedForge(true)
    }
  }, [forgeStock, generateForgeStock, hasVisitedForge])
  
  // Collecter tous les items qui ont besoin de réparation
  const itemsToRepair: Array<{ item: Item; location: 'equipment' | 'inventory'; slot?: string }> = []
  
  Object.entries(equipment).forEach(([slot, item]) => {
    if (item && item.durability < item.maxDurability) {
      itemsToRepair.push({ item, location: 'equipment', slot })
    }
  })
  
  inventory.forEach(item => {
    if (item.durability < item.maxDurability) {
      itemsToRepair.push({ item, location: 'inventory' })
    }
  })
  
  const handleRepair = (item: Item) => {
    const success = repairItem(item)
    if (success) {
      setSelectedRepairItem(null)
    }
  }
  
  const handleBuyForgeItem = () => {
    if (forgeStock) {
      buyForgeItem(forgeStock)
    }
  }
  
  const durabilityPercent = selectedRepairItem
    ? (selectedRepairItem.durability / selectedRepairItem.maxDurability) * 100
    : 100
  
  const bertramComment = selectedRepairItem
    ? getBertramComment(durabilityPercent, reputation)
    : getBertramContextualDialogue(reputation)
  
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
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          FORGE DE BERTRAM
        </div>
        <div style={{
          fontSize: '1rem',
          color: '#aaa'
        }}>
          Or : <span style={{ color: '#ca8', fontWeight: 'bold' }}>{gold}💰</span>
          {' | '}
          Réputation : <span style={{ color: '#ddd' }}>{'⭐'.repeat(reputation)}</span>
        </div>
      </div>
      
      {/* Dialogue Bertram */}
      <div style={{
        background: '#2a2a2a',
        padding: '1rem',
        borderRadius: '8px',
        border: '2px solid #555'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: '#aaa',
          fontStyle: 'italic',
          lineHeight: '1.6',
          marginBottom: '0.5rem'
        }}>
          "{getBertramIntroduction(hasVisitedForge)}"
        </div>
        {selectedRepairItem && (
          <div style={{
            fontSize: '0.9rem',
            color: '#ca8',
            fontStyle: 'italic',
            lineHeight: '1.6'
          }}>
            "{bertramComment}"
          </div>
        )}
        {!selectedRepairItem && (
          <div style={{
            fontSize: '0.9rem',
            color: '#888',
            fontStyle: 'italic',
            lineHeight: '1.6'
          }}>
            "{bertramComment}"
          </div>
        )}
      </div>
      
      {/* RÉPARATION */}
      <div style={{
        background: '#2a2a2a',
        padding: '1rem',
        borderRadius: '8px',
        border: '2px solid #555'
      }}>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          RÉPARATION
        </div>
        
        {itemsToRepair.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
            Aucun item à réparer
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {itemsToRepair.map(({ item, location, slot }) => {
              const repairCost = calculateRepairCost(item, narrativeCounters, relics)
              const rarityColor = getRarityColor(item.rarity)
              const canAfford = gold >= repairCost
              
              return (
                <div
                  key={`${location}_${item.id}_${slot || ''}`}
                  style={{
                    background: '#1a1a1a',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: `1px solid ${rarityColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    opacity: canAfford ? 1 : 0.6
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: rarityColor
                      }}>
                        {item.name}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#888'
                      }}>
                        {getRarityName(item.rarity)} {location === 'equipment' ? '(Équipé)' : ''}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: canAfford ? '#ca8' : '#c44'
                    }}>
                      {repairCost}💰
                    </div>
                  </div>
                  
                  <DurabilityBar item={item} size="small" showLabel={true} />
                  
                  <button
                    onClick={() => setSelectedRepairItem(item)}
                    disabled={!canAfford}
                    style={{
                      fontSize: '0.9rem',
                      padding: '0.5rem',
                      opacity: canAfford ? 1 : 0.5,
                      cursor: canAfford ? 'pointer' : 'not-allowed'
                    }}
                  >
                    RÉPARER
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      {/* ACHAT ITEM RARE */}
      {forgeStock && (
        <div style={{
          background: '#2a2a2a',
          padding: '1rem',
          borderRadius: '8px',
          border: '2px solid #555'
        }}>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            OBJET ARTISANAL
          </div>
          
          <div style={{
            background: '#1a1a1a',
            padding: '0.75rem',
            borderRadius: '4px',
            border: `2px solid ${getRarityColor(forgeStock.rarity)}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: getRarityColor(forgeStock.rarity)
                }}>
                  {forgeStock.name}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#888'
                }}>
                  {getRarityName(forgeStock.rarity)} — Qualité artisanale
                </div>
              </div>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: gold >= forgeStock.value * 2 ? '#ca8' : '#c44'
              }}>
                {forgeStock.value * 2}💰
              </div>
            </div>
            
            <DurabilityBar item={forgeStock} size="small" showLabel={false} />
            
            <button
              onClick={handleBuyForgeItem}
              disabled={gold < forgeStock.value * 2 || inventory.length >= 10}
              style={{
                fontSize: '0.9rem',
                padding: '0.5rem',
                opacity: (gold >= forgeStock.value * 2 && inventory.length < 10) ? 1 : 0.5,
                cursor: (gold >= forgeStock.value * 2 && inventory.length < 10) ? 'pointer' : 'not-allowed'
              }}
            >
              ACHETER
            </button>
          </div>
        </div>
      )}
      
      {/* Bouton retour */}
      <button
        onClick={closeInventory}
        style={{
          fontSize: '1rem',
          padding: '1rem',
          width: '100%'
        }}
      >
        RETOUR
      </button>
      
      {/* Modale de confirmation réparation */}
      {selectedRepairItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#2a2a2a',
            padding: '2rem',
            borderRadius: '8px',
            border: '2px solid #555',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Réparer {selectedRepairItem.name} ?
            </div>
            <div style={{
              fontSize: '1.1rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: gold >= calculateRepairCost(selectedRepairItem, narrativeCounters, relics) ? '#ca8' : '#c44'
            }}>
              {calculateRepairCost(selectedRepairItem, narrativeCounters, relics)}💰
            </div>
            {gold < calculateRepairCost(selectedRepairItem, narrativeCounters, relics) && (
              <div style={{
                color: '#c44',
                textAlign: 'center',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                Or insuffisant
              </div>
            )}
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={() => setSelectedRepairItem(null)}
                style={{ flex: 1 }}
              >
                ANNULER
              </button>
              <button
                onClick={() => handleRepair(selectedRepairItem)}
                disabled={gold < calculateRepairCost(selectedRepairItem, narrativeCounters, relics)}
                style={{
                  flex: 1,
                  background: '#3a2a2a',
                  opacity: gold >= calculateRepairCost(selectedRepairItem, narrativeCounters, relics) ? 1 : 0.5
                }}
              >
                RÉPARER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
