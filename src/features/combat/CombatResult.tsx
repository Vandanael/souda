import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { CombatResult as CombatResultType } from './combat.logic'

interface CombatResultProps {
  result: CombatResultType
  onComplete: () => void
}

export default function CombatResult({ result, onComplete }: CombatResultProps) {
  const getOutcomeConfig = () => {
    switch (result.outcome) {
      case 'crushing':
        return {
          text: '✓ VICTOIRE ÉCRASANTE',
          color: '#ffd700', // Or/doré
          bgColor: 'rgba(255, 215, 0, 0.1)'
        }
      case 'victory':
        return {
          text: '✓ VICTOIRE',
          color: '#4a8', // Vert
          bgColor: 'rgba(68, 170, 136, 0.1)'
        }
      case 'costly':
        return {
          text: '✓ VICTOIRE COÛTEUSE',
          color: '#ca8', // Orange
          bgColor: 'rgba(204, 170, 136, 0.1)'
        }
      case 'flee':
        return {
          text: '⚠ FUITE',
          color: '#888', // Gris
          bgColor: 'rgba(136, 136, 136, 0.1)'
        }
      case 'defeat':
        return {
          text: '✗ MORT',
          color: '#c44', // Rouge
          bgColor: 'rgba(204, 68, 68, 0.1)'
        }
    }
  }
  
  const config = getOutcomeConfig()
  const showNearMiss = result.ratio >= 0.4 && result.ratio <= 0.5 && result.outcome !== 'defeat'
  const breakdown = result.breakdown
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [onComplete])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: '#2a2a2a',
        padding: '2rem',
        borderRadius: '8px',
        border: `2px solid ${config.color}`,
        textAlign: 'center',
        backgroundImage: `linear-gradient(${config.bgColor}, ${config.bgColor})`
      }}
    >
      {/* Titre résultat */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, type: 'spring' }}
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: config.color,
          marginBottom: '1rem'
        }}
      >
        {config.text}
      </motion.div>
      
      {/* Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '1rem',
          lineHeight: '1.6'
        }}
      >
        {result.message}
      </motion.div>
      
      {/* Breakdown simple */}
      {breakdown && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#1a1a1a',
            borderRadius: '6px',
            border: '1px solid #333',
            color: '#ddd',
            fontSize: '0.9rem',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span>Ratio</span>
            <strong style={{ color: config.color }}>{breakdown.ratio.toFixed(2)}</strong>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.15rem', color: '#ca8' }}>Toi</div>
              <div style={{ opacity: 0.8 }}>
                ATK {breakdown.player.atkContribution.toFixed(1)} + DEF {breakdown.player.defContribution.toFixed(1)} + VIT {breakdown.player.vitContribution.toFixed(1)}
              </div>
              <div style={{ opacity: 0.7 }}>
                RNG {breakdown.player.randomRoll.toFixed(1)} → <strong>{breakdown.player.total.toFixed(1)}</strong>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.15rem', color: '#888' }}>Ennemi</div>
              <div style={{ opacity: 0.8 }}>
                ATK {breakdown.enemy.atkContribution.toFixed(1)} + DEF {breakdown.enemy.defContribution.toFixed(1)} + VIT {breakdown.enemy.vitContribution.toFixed(1)}
              </div>
              <div style={{ opacity: 0.7 }}>
                RNG {breakdown.enemy.randomRoll.toFixed(1)} → <strong>{breakdown.enemy.total.toFixed(1)}</strong>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#aaa', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>Seuils:</span>
            <span>Écrasante &gt; {breakdown.thresholds.crushing}</span>
            <span>Victoire &gt; {breakdown.thresholds.victory}</span>
            <span>Coûteuse &gt; {breakdown.thresholds.costly}</span>
            <span>Fuite &gt; {breakdown.thresholds.flee}</span>
          </div>
        </motion.div>
      )}
      
      {/* Near Miss */}
      {showNearMiss && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#c44',
            fontStyle: 'italic',
            border: '1px solid #c44'
          }}
        >
          💬 Vous avez frôlé la mort. Un coup de plus et c'en était fini.
        </motion.div>
      )}
      
      {/* Near Miss Message standard */}
      {result.nearMissMessage && !showNearMiss && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#ddd',
            fontStyle: 'italic'
          }}
        >
          💬 {result.nearMissMessage}
        </motion.div>
      )}
      
      {/* Or gagné */}
      {result.gold && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: '1rem',
            fontSize: '1.3rem',
            color: '#ddd',
            fontWeight: 'bold'
          }}
        >
          +{result.gold}💰
        </motion.div>
      )}
      
      {/* Durabilité perdue */}
      {result.durabilityLoss.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: result.outcome === 'costly' ? '#ca8' : '#c84',
            fontStyle: 'italic'
          }}
        >
          → {result.outcome === 'costly' ? 'Équipement endommagé' : 'Matériel perdu'} ({result.durabilityLoss.map(l => `-${l.amount}%`).join(', ')})
        </motion.div>
      )}
    </motion.div>
  )
}
