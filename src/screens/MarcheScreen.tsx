import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { calculateSellPrice, calculateBuyPrice } from '../features/economy/priceCalculation'
import { Item, getRarityName, getRarityColor } from '../types/item'
import DurabilityBar from '../features/durability/DurabilityBar'
import { useAudio } from '../features/audio/useAudio'

export default function MarcheScreen() {
  const { 
    inventory, 
    marketStock, 
    gold, 
    reputation,
    sellItem, 
    buyItem, 
    generateMarketStock,
    closeInventory
  } = useGameStore()
  
  const [selectedSellItem, setSelectedSellItem] = useState<Item | null>(null)
  const [selectedBuyItem, setSelectedBuyItem] = useState<Item | null>(null)
  const { playSound, playHaptic } = useAudio()
  
  // Générer le stock si nécessaire (au montage)
  useEffect(() => {
    if (marketStock.length === 0) {
      generateMarketStock()
    }
  }, [marketStock.length, generateMarketStock])
  
  const handleSellClick = (item: Item) => {
    setSelectedSellItem(item)
  }
  
  const handleConfirmSell = () => {
    if (selectedSellItem) {
      sellItem(selectedSellItem)
      playSound('coins')
      playHaptic('button_press')
      setSelectedSellItem(null)
    }
  }
  
  const handleBuyClick = (item: Item) => {
    setSelectedBuyItem(item)
  }
  
  const handleConfirmBuy = () => {
    if (selectedBuyItem) {
      const success = buyItem(selectedBuyItem)
      if (success) {
        playSound('coins_loss')
        playHaptic('button_press')
        setSelectedBuyItem(null)
      }
    }
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
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          MARCHÉ AUX CHAROGNES
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
      
      {/* VENTE */}
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
          VENTE
        </div>
        
        {inventory.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
            Inventaire vide
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {inventory.map((item) => {
              const sellPrice = calculateSellPrice(item, reputation)
              const rarityColor = getRarityColor(item.rarity)
              
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#1a1a1a',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: `1px solid ${rarityColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
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
                        {getRarityName(item.rarity)}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: '#ca8'
                    }}>
                      {sellPrice}💰
                    </div>
                  </div>
                  
                  <DurabilityBar item={item} size="small" showLabel={false} />
                  
                  <button
                    onClick={() => handleSellClick(item)}
                    style={{
                      fontSize: '0.9rem',
                      padding: '0.5rem'
                    }}
                  >
                    VENDRE
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      {/* ACHAT */}
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
          ACHAT
        </div>
        
        {marketStock.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
            Stock vide
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {marketStock.map((item) => {
              const buyPrice = calculateBuyPrice(item, reputation)
              const rarityColor = getRarityColor(item.rarity)
              const canAfford = gold >= buyPrice
              
              return (
                <div
                  key={item.id}
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
                        {getRarityName(item.rarity)}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: canAfford ? '#ca8' : '#c44'
                    }}>
                      {buyPrice}💰
                    </div>
                  </div>
                  
                  <DurabilityBar item={item} size="small" showLabel={false} />
                  
                  <button
                    onClick={() => handleBuyClick(item)}
                    disabled={!canAfford}
                    style={{
                      fontSize: '0.9rem',
                      padding: '0.5rem',
                      opacity: canAfford ? 1 : 0.5,
                      cursor: canAfford ? 'pointer' : 'not-allowed'
                    }}
                  >
                    ACHETER
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
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
      
      {/* Modales de confirmation */}
      {selectedSellItem && (
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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: '#2a2a2a',
              padding: '2rem',
              borderRadius: '8px',
              border: '2px solid #555',
              maxWidth: '400px',
              width: '90%'
            }}
          >
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Vendre {selectedSellItem.name} ?
            </div>
            <div style={{
              fontSize: '1.1rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: '#ca8'
            }}>
              {calculateSellPrice(selectedSellItem, reputation)}💰
            </div>
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={() => setSelectedSellItem(null)}
                style={{ flex: 1 }}
              >
                ANNULER
              </button>
              <button
                onClick={handleConfirmSell}
                style={{ flex: 1, background: '#3a2a2a' }}
              >
                VENDRE
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {selectedBuyItem && (
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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: '#2a2a2a',
              padding: '2rem',
              borderRadius: '8px',
              border: '2px solid #555',
              maxWidth: '400px',
              width: '90%'
            }}
          >
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Acheter {selectedBuyItem.name} ?
            </div>
            <div style={{
              fontSize: '1.1rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: gold >= calculateBuyPrice(selectedBuyItem, reputation) ? '#ca8' : '#c44'
            }}>
              {calculateBuyPrice(selectedBuyItem, reputation)}💰
            </div>
            {gold < calculateBuyPrice(selectedBuyItem, reputation) && (
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
                onClick={() => setSelectedBuyItem(null)}
                style={{ flex: 1 }}
              >
                ANNULER
              </button>
              <button
                onClick={handleConfirmBuy}
                disabled={gold < calculateBuyPrice(selectedBuyItem, reputation)}
                style={{ 
                  flex: 1, 
                  background: '#3a2a2a',
                  opacity: gold >= calculateBuyPrice(selectedBuyItem, reputation) ? 1 : 0.5
                }}
              >
                ACHETER
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
