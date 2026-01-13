import { motion } from 'framer-motion'
import { Enemy } from '../../types/enemy'

interface EnemyDisplayProps {
  enemy: Enemy
  showStats?: boolean
}

export default function EnemyDisplay({ enemy, showStats = false }: EnemyDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      {/* Sprite placeholder (64x64) */}
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          width: '64px',
          height: '64px',
          background: '#444',
          border: '2px solid #666',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem'
        }}
      >
        ⚔️
      </motion.div>
      
      {/* Nom */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        style={{
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: '#fff'
        }}
      >
        {enemy.name}
      </motion.div>
      
      {/* Description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        style={{
          fontSize: '0.9rem',
          color: '#999',
          fontStyle: 'italic',
          textAlign: 'center',
          maxWidth: '300px'
        }}
      >
        {enemy.description}
      </motion.div>
      
      {/* Stats (optionnel) */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          style={{
            fontSize: '0.85rem',
            color: '#aaa',
            display: 'flex',
            gap: '1rem'
          }}
        >
          <span>ATK: {enemy.atk}</span>
          <span>DEF: {enemy.def}</span>
          <span>VIT: {enemy.vit}</span>
        </motion.div>
      )}
    </motion.div>
  )
}
