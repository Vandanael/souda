import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { Item } from '../types/item'
import LootReveal from '../features/loot/LootReveal'

interface LootRevealScreenProps {
  item: Item
  gold?: number
  relicFragmentId?: string
  relicFragmentAmount?: number
  onContinue: () => void
}

export default function LootRevealScreen({ item, gold, relicFragmentId, relicFragmentAmount, onContinue }: LootRevealScreenProps) {
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
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1.1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          style={{
            fontSize: '1.4rem',
            color: '#ffd27f',
            fontWeight: 'bold',
            textShadow: '0 0 8px rgba(255, 210, 127, 0.4)'
          }}
        >
          +{gold}💰
        </motion.div>
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
      
      {(relicFragmentId && relicFragmentAmount) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            padding: '0.75rem 1rem',
            background: '#1a1a2a',
            borderRadius: '6px',
            border: '1px solid #2f2f4a',
            color: '#b7a6ff',
            fontSize: '0.95rem',
            textAlign: 'center'
          }}
        >
          +{relicFragmentAmount} fragment{relicFragmentAmount > 1 ? 's' : ''} de relique
        </motion.div>
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
