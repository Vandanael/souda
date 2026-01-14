import { motion } from 'framer-motion'
import { CombatBreakdown } from './combat.logic'

interface CombatBreakdownDisplayProps {
  breakdown: CombatBreakdown
  outcome: string
}

export default function CombatBreakdownDisplay({ breakdown, outcome }: CombatBreakdownDisplayProps) {
  const getOutcomeColor = () => {
    switch (outcome) {
      case 'crushing':
        return '#ffd700'
      case 'victory':
        return '#4a8'
      case 'costly':
        return '#ca8'
      case 'flee':
        return '#888'
      case 'defeat':
        return '#c44'
      default:
        return '#ddd'
    }
  }

  const outcomeColor = getOutcomeColor()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#1a1a1a',
        borderRadius: '8px',
        border: '1px solid #333',
        fontSize: '0.85rem',
        color: '#ddd'
      }}
    >
      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '0.75rem', 
        color: outcomeColor,
        fontSize: '0.95rem',
        textAlign: 'center'
      }}>
        Détails du Combat
      </div>

      {/* Puissance Joueur */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5rem', 
          color: '#ca8',
          fontSize: '0.9rem'
        }}>
          Ta Puissance : {breakdown.player.total.toFixed(1)}
        </div>
        <div style={{ 
          paddingLeft: '0.75rem', 
          fontSize: '0.8rem',
          lineHeight: '1.6',
          opacity: 0.9
        }}>
          <div>ATK × 0.5 = {breakdown.player.atkContribution.toFixed(1)}</div>
          <div>DEF × 0.3 = {breakdown.player.defContribution.toFixed(1)}</div>
          <div>VIT × 0.2 = {breakdown.player.vitContribution.toFixed(1)}</div>
          <div style={{ marginTop: '0.25rem', borderTop: '1px solid #333', paddingTop: '0.25rem' }}>
            Base : {breakdown.player.base.toFixed(1)}
          </div>
          <div style={{ color: '#888', fontStyle: 'italic' }}>
            RNG : {breakdown.player.randomRoll.toFixed(1)} (7-11)
          </div>
        </div>
      </div>

      {/* Puissance Ennemi */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5rem', 
          color: '#888',
          fontSize: '0.9rem'
        }}>
          Puissance Ennemi : {breakdown.enemy.total.toFixed(1)}
        </div>
        <div style={{ 
          paddingLeft: '0.75rem', 
          fontSize: '0.8rem',
          lineHeight: '1.6',
          opacity: 0.9
        }}>
          <div>ATK × 0.5 = {breakdown.enemy.atkContribution.toFixed(1)}</div>
          <div>DEF × 0.3 = {breakdown.enemy.defContribution.toFixed(1)}</div>
          <div>VIT × 0.2 = {breakdown.enemy.vitContribution.toFixed(1)}</div>
          <div style={{ marginTop: '0.25rem', borderTop: '1px solid #333', paddingTop: '0.25rem' }}>
            Base : {breakdown.enemy.base.toFixed(1)}
          </div>
          <div style={{ color: '#888', fontStyle: 'italic' }}>
            RNG : {breakdown.enemy.randomRoll.toFixed(1)} (5-9)
          </div>
        </div>
      </div>

      {/* Ratio et Explication */}
      <div style={{ 
        marginTop: '1rem', 
        paddingTop: '1rem', 
        borderTop: '2px solid #333',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '1.1rem', 
          fontWeight: 'bold', 
          color: outcomeColor,
          marginBottom: '0.5rem'
        }}>
          Ratio : {breakdown.ratio.toFixed(2)}
        </div>
        <div style={{ 
          fontSize: '0.8rem', 
          color: '#aaa',
          fontStyle: 'italic',
          marginTop: '0.5rem'
        }}>
          {breakdown.ratio > breakdown.thresholds.crushing && '→ Victoire Écrasante (ratio > 1.4)'}
          {breakdown.ratio > breakdown.thresholds.victory && breakdown.ratio <= breakdown.thresholds.crushing && '→ Victoire (ratio > 1.0)'}
          {breakdown.ratio > breakdown.thresholds.costly && breakdown.ratio <= breakdown.thresholds.victory && '→ Victoire Coûteuse (ratio > 0.7)'}
          {breakdown.ratio > breakdown.thresholds.flee && breakdown.ratio <= breakdown.thresholds.costly && '→ Fuite (ratio > 0.4)'}
          {breakdown.ratio <= breakdown.thresholds.flee && '→ Défaite (ratio ≤ 0.4)'}
        </div>
      </div>
    </motion.div>
  )
}
