import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { Item } from '../types/item'
import LootReveal from '../features/loot/LootReveal'

interface LootRevealScreenProps {
  item: Item
  gold?: number
  onContinue: () => void
}

export default function LootRevealScreen({ item, gold, onContinue }: LootRevealScreenProps) {
  const { addItemToInventory, inventory } = useGameStore()
  const [revealComplete, setRevealComplete] = useState(false)
  const inventoryFull = inventory.length >= 10
  
  const handleRevealComplete = () => {
    setRevealComplete(true)
  }
  
  const handleTakeItem = () => {
    if (!inventoryFull) {
      addItemToInventory(item)
    }
    onContinue()
  }
  
  const handleLeaveItem = () => {
    onContinue()
  }
  
  // Afficher l'animation de révélation
  if (!revealComplete) {
    return (
      <LootReveal
        item={item}
        onRevealComplete={handleRevealComplete}
        autoStart={true}
      />
    )
  }
  
  // Après révélation, afficher les boutons d'action
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        fontSize: '1.2rem',
        color: '#ccc',
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        {item.name} trouvé !
      </div>
      
      {gold && (
        <div style={{
          fontSize: '1.3rem',
          color: '#ddd',
          fontWeight: 'bold'
        }}>
          +{gold}💰
        </div>
      )}
      
      {inventoryFull && (
        <div style={{
          padding: '1rem',
          background: '#3a2a2a',
          borderRadius: '4px',
          color: '#c44',
          fontSize: '0.9rem',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          Inventaire plein ! Tu dois laisser un item.
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
        <button
          onClick={handleTakeItem}
          disabled={inventoryFull}
          style={{ flex: 1 }}
        >
          PRENDRE
        </button>
        <button
          onClick={handleLeaveItem}
          style={{ flex: 1 }}
        >
          LAISSER
        </button>
      </div>
    </div>
  )
}
