import { motion } from 'framer-motion'
import { CharacterArc } from '../features/narrative/characterArcs'

interface CharacterArcIndicatorProps {
  arc: CharacterArc | null
  characterName: string
}

export default function CharacterArcIndicator({ arc, characterName }: CharacterArcIndicatorProps) {
  if (!arc) {
    return null
  }
  
  const trustLevel = arc.trustLevel
  const storyStage = arc.storyStage
  
  // Couleur de la barre selon le trustLevel
  const getTrustColor = (level: number): string => {
    if (level <= 2) return '#c44' // Rouge (méfiant)
    if (level <= 5) return '#ca8' // Jaune (neutre)
    if (level <= 7) return '#4a8' // Vert clair (confiant)
    return '#2ecc71' // Vert (très confiant)
  }
  
  // Nom du stage en français
  const getStageName = (stage: string): string => {
    switch (stage) {
      case 'menaces':
        return 'Menaces'
      case 'negociations':
        return 'Négociations'
      case 'ultimatum':
        return 'Ultimatum'
      case 'consequences':
        return 'Conséquences'
      default:
        return stage
    }
  }
  
  return (
    <div style={{
      background: '#1a1a1a',
      padding: '1rem',
      borderRadius: '6px',
      border: '1px solid #444',
      marginTop: '1rem'
    }}>
      <div style={{
        fontSize: '0.9rem',
        fontWeight: 'bold',
        marginBottom: '0.75rem',
        color: '#ca8',
        textAlign: 'center'
      }}>
        Relation avec {characterName}
      </div>
      
      {/* Barre de confiance */}
      <div style={{
        marginBottom: '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.25rem',
          fontSize: '0.8rem',
          color: '#aaa'
        }}>
          <span>Confiance</span>
          <span style={{ color: getTrustColor(trustLevel), fontWeight: 'bold' }}>
            {trustLevel}/10
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          background: '#2a2a2a',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid #444'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(trustLevel / 10) * 100}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${getTrustColor(trustLevel)} 0%, ${getTrustColor(trustLevel)}80 100%)`,
              borderRadius: '6px'
            }}
          />
        </div>
      </div>
      
      {/* Stage narratif */}
      <div style={{
        fontSize: '0.85rem',
        color: '#888',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Stage : {getStageName(storyStage)}
      </div>
    </div>
  )
}
