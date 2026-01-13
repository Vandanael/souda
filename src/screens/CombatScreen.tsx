import { type CombatResult } from '../features/combat'

interface CombatScreenProps {
  combatResult: CombatResult
  enemyName: string
  enemyDescription: string
  onContinue: () => void
}

export default function CombatScreen({ 
  combatResult, 
  enemyName, 
  enemyDescription,
  onContinue 
}: CombatScreenProps) {
  const getOutcomeText = () => {
    switch (combatResult.outcome) {
      case 'crushing':
        return '✓ VICTOIRE ÉCRASANTE'
      case 'victory':
        return '✓ VICTOIRE'
      case 'costly':
        return '✓ VICTOIRE COÛTEUSE'
      case 'flee':
        return '⚠ FUITE'
      case 'defeat':
        return '✗ DÉFAITE'
    }
  }
  
  const getOutcomeColor = () => {
    switch (combatResult.outcome) {
      case 'crushing':
      case 'victory':
        return '#4a8'
      case 'costly':
        return '#ca8'
      case 'flee':
        return '#c84'
      case 'defeat':
        return '#c44'
    }
  }
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      flex: 1,
      justifyContent: 'center'
    }}>
      {/* Phase 1 : Anticipation */}
      <div style={{
        background: '#2a2a2a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '2px solid #555',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          ⚔️ COMBAT !
        </div>
        <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          {enemyName}
        </div>
        <div style={{ 
          fontSize: '0.9rem', 
          color: '#999',
          fontStyle: 'italic',
          marginBottom: '1rem'
        }}>
          {enemyDescription}
        </div>
      </div>
      
      {/* Phase 2-3 : Résultat */}
      <div style={{
        background: '#2a2a2a',
        padding: '2rem',
        borderRadius: '8px',
        border: `2px solid ${getOutcomeColor()}`,
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: getOutcomeColor(),
          marginBottom: '1rem'
        }}>
          {getOutcomeText()}
        </div>
        
        <div style={{
          fontSize: '1rem',
          color: '#ccc',
          marginBottom: '1rem',
          lineHeight: '1.6'
        }}>
          {combatResult.message}
        </div>
        
        {combatResult.nearMissMessage && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#ddd',
            fontStyle: 'italic'
          }}>
            💬 {combatResult.nearMissMessage}
          </div>
        )}
        
        {combatResult.gold && (
          <div style={{
            marginTop: '1rem',
            fontSize: '1.2rem',
            color: '#ddd'
          }}>
            +{combatResult.gold}💰
          </div>
        )}
        
        {combatResult.outcome === 'costly' && combatResult.durabilityLoss.length > 0 && (
          <div style={{
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: '#ca8',
            fontStyle: 'italic'
          }}>
            → Équipement endommagé ({combatResult.durabilityLoss.map(l => `-${l.amount}%`).join(', ')})
          </div>
        )}
        
        {combatResult.outcome === 'flee' && combatResult.durabilityLoss.length > 0 && (
          <div style={{
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: '#c84',
            fontStyle: 'italic'
          }}>
            → Matériel perdu ({combatResult.durabilityLoss.map(l => `-${l.amount}%`).join(', ')})
          </div>
        )}
      </div>
      
      {/* Détails techniques (debug) */}
      <div style={{
        fontSize: '0.8rem',
        color: '#666',
        textAlign: 'center',
        opacity: 0.6
      }}>
        Ratio: {(combatResult.ratio * 100).toFixed(0)}% | 
        Puissance: {combatResult.playerPower.toFixed(1)} vs {combatResult.enemyPower.toFixed(1)}
      </div>
      
      <button
        onClick={onContinue}
        style={{
          fontSize: '1.1rem',
          padding: '1rem',
          width: '100%'
        }}
      >
        {combatResult.outcome === 'defeat' ? 'VOIR LA DÉFAITE' : 'CONTINUER'}
      </button>
    </div>
  )
}
