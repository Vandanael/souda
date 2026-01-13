import { Item } from '../../types/item'
import { getDurabilityState, getDurabilityColor } from './durability.logic'

interface DurabilityBarProps {
  item: Item
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
}

const STATE_LABELS: Record<string, string> = {
  normal: 'Normal',
  worn: 'Abîmé',
  damaged: 'Endommagé',
  broken: 'Cassé'
}

export default function DurabilityBar({ 
  item, 
  showLabel = true,
  size = 'medium'
}: DurabilityBarProps) {
  const state = getDurabilityState(item)
  const percentage = (item.durability / item.maxDurability) * 100
  const color = getDurabilityColor(state)
  
  const height = size === 'small' ? '4px' : size === 'large' ? '8px' : '6px'
  const fontSize = size === 'small' ? '0.7rem' : size === 'large' ? '0.9rem' : '0.75rem'
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      width: '100%'
    }}>
      {showLabel && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: fontSize,
          color: '#888'
        }}>
          <span>Durabilité</span>
          <span style={{ 
            color: color,
            fontWeight: state === 'broken' ? 'bold' : 'normal'
          }}>
            {STATE_LABELS[state]} ({Math.floor(percentage)}%)
          </span>
        </div>
      )}
      
      <div style={{
        width: '100%',
        height: height,
        background: '#1a1a1a',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Barre de durabilité */}
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          transition: 'width 0.3s ease-out, background 0.3s',
          boxShadow: state === 'broken' ? 'none' : `0 0 4px ${color}40`
        }} />
        
        {/* Effet de dégradation (rayures pour abîmé/endommagé) */}
        {(state === 'worn' || state === 'damaged') && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: state === 'damaged' 
              ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)'
              : 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 8px)',
            pointerEvents: 'none'
          }} />
        )}
      </div>
      
      {!showLabel && (
        <div style={{
          fontSize: fontSize,
          color: color,
          textAlign: 'right',
          marginTop: '0.1rem'
        }}>
          {Math.floor(percentage)}%
        </div>
      )}
    </div>
  )
}
