import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { getRarityColor, Item } from '../types/item'
import { getStatsDescription, calculateStatsFromEquipment } from '../utils/stats'
import CharacterCanvas from '../features/character/CharacterCanvas'
import { useAudio } from '../features/audio/useAudio'

const SLOT_NAMES: Record<string, string> = {
  head: 'Tête',
  torso: 'Torse',
  legs: 'Jambes',
  hands: 'Mains',
  weapon: 'Arme',
  offhand: 'Secondaire',
  accessory: 'Accessoire'
}

export default function InventoryScreen() {
  const { 
    equipment, 
    inventory, 
    playerStats,
    equipItem, 
    unequipItem, 
    closeInventory 
  } = useGameStore()
  
  const [previewItem, setPreviewItem] = useState<Item | undefined>(undefined)
  const statsDesc = getStatsDescription(playerStats)
  const { playSound, playHaptic } = useAudio()
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      flex: 1,
      padding: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          INVENTAIRE
        </div>
        <button 
          onClick={() => {
            playSound('ui_close')
            playHaptic('button_press')
            closeInventory()
          }}
        >
          FERMER
        </button>
      </div>
      
      {/* Personnage et Stats */}
      <div style={{
        background: '#2a2a2a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '2px solid #555',
        marginBottom: '1rem',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        <CharacterCanvas equipment={equipment} showPreview={previewItem} size={128} />
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            État
          </div>
          <div style={{ fontSize: '0.95rem', color: '#ccc', lineHeight: '1.8' }}>
            <div>{statsDesc.attack}</div>
            <div>{statsDesc.defense}</div>
            <div>{statsDesc.speed}</div>
          </div>
        </div>
      </div>
      
      {/* Équipement */}
      <div style={{
        background: '#2a2a2a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '2px solid #555',
        marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Équipé
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Object.entries(equipment).map(([slot, item]) => {
            if (!item) return null
            return (
              <div
                key={slot}
                style={{
                  padding: '0.75rem',
                  background: '#1a1a1a',
                  borderRadius: '4px',
                  border: `1px solid ${getRarityColor(item.rarity)}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ 
                    color: item.cursed ? '#c44' : getRarityColor(item.rarity), 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {item.name}
                    {item.cursed && (
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.35rem',
                        background: '#c44',
                        color: '#fff',
                        borderRadius: '3px',
                        fontWeight: 'bold'
                      }}>
                        COMPROMIS
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#999' }}>
                    {SLOT_NAMES[slot]}
                    {item.cursed && item.curseEffect && (
                      <span style={{ color: '#c44', marginLeft: '0.5rem' }}>
                        • {item.curseEffect}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => unequipItem(slot)}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  RETIRER
                </button>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Inventaire */}
      <div
        data-tutorial-inventory
        style={{
          background: '#2a2a2a',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '2px solid #555',
          flex: 1,
          overflowY: 'auto'
        }}
      >
        <div style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Inventaire ({inventory.length}/10)
        </div>
        {inventory.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
            Vide
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {inventory.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '0.75rem',
                  background: '#1a1a1a',
                  borderRadius: '4px',
                  border: `1px solid ${getRarityColor(item.rarity)}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    color: item.cursed ? '#c44' : getRarityColor(item.rarity), 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {item.name}
                    {item.cursed && (
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.35rem',
                        background: '#c44',
                        color: '#fff',
                        borderRadius: '3px',
                        fontWeight: 'bold'
                      }}>
                        COMPROMIS
                      </span>
                    )}
                  </div>
                  {item.cursed && (
                    <>
                      {item.curseEffect && (
                        <div style={{ fontSize: '0.75rem', color: '#c44', fontStyle: 'italic', marginTop: '0.25rem' }}>
                          ⚠️ {item.curseEffect}
                        </div>
                      )}
                      {item.curseDescription && (
                        <div style={{ fontSize: '0.7rem', color: '#a88', marginTop: '0.25rem' }}>
                          {item.curseDescription}
                        </div>
                      )}
                      {(item.hiddenMalus || item.visibleMalus) && (
                        <div style={{ fontSize: '0.7rem', color: '#f44', marginTop: '0.25rem' }}>
                          Malus: {item.visibleMalus?.atk && `ATK -${item.visibleMalus.atk} `}
                          {item.visibleMalus?.def && `DEF -${item.visibleMalus.def} `}
                          {item.visibleMalus?.vit && `VIT -${item.visibleMalus.vit} `}
                          {item.hiddenMalus?.atk && `ATK -${item.hiddenMalus.atk}(caché) `}
                          {item.hiddenMalus?.def && `DEF -${item.hiddenMalus.def}(caché) `}
                          {item.hiddenMalus?.vit && `VIT -${item.hiddenMalus.vit}(caché) `}
                        </div>
                      )}
                      {/* Comparaison stats avant/après équipement */}
                      {(() => {
                        const currentStats = playerStats
                        const previewEquipment = { ...equipment, [item.slot]: item }
                        const previewStats = calculateStatsFromEquipment(previewEquipment)
                        const statDiff = {
                          atk: previewStats.atk - currentStats.atk,
                          def: previewStats.def - currentStats.def,
                          vit: previewStats.vit - currentStats.vit
                        }
                        return (
                          <div style={{ fontSize: '0.7rem', marginTop: '0.5rem', padding: '0.5rem', background: '#1a1a1a', borderRadius: '4px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Stats après équipement :</div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                              <div>ATK: <span style={{ color: statDiff.atk >= 0 ? '#4a4' : '#f44' }}>{statDiff.atk >= 0 ? '+' : ''}{statDiff.atk}</span></div>
                              <div>DEF: <span style={{ color: statDiff.def >= 0 ? '#4a4' : '#f44' }}>{statDiff.def >= 0 ? '+' : ''}{statDiff.def}</span></div>
                              <div>VIT: <span style={{ color: statDiff.vit >= 0 ? '#4a4' : '#f44' }}>{statDiff.vit >= 0 ? '+' : ''}{statDiff.vit}</span></div>
                            </div>
                          </div>
                        )
                      })()}
                    </>
                  )}
                  <div style={{ fontSize: '0.85rem', color: '#999' }}>
                    {SLOT_NAMES[item.slot]}
                  </div>
                </div>
                <button
                  data-tutorial-equip-button
                  onMouseEnter={() => setPreviewItem(item)}
                  onMouseLeave={() => setPreviewItem(undefined)}
                  onClick={() => {
                    equipItem(item)
                    setPreviewItem(undefined)
                    // Audio selon le type d'item
                    if (item.slot === 'weapon' || item.slot === 'offhand') {
                      playSound('equip_metal')
                    } else {
                      playSound('equip_leather')
                    }
                    playHaptic('button_press')
                  }}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  ÉQUIPER
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
