import { Item } from '../types/item'

export interface RunData {
  day: number
  gold: number
  reputation: number
  equipment: Partial<Record<string, Item>>
  inventory: Item[]
  combatsWon?: number
  combatsFled?: number
  combatsLost?: number
  legendaryItemsFound?: number
}

interface RunSummaryProps {
  runData: RunData
  showTitle?: boolean
  compact?: boolean
}

export default function RunSummary({ runData, showTitle = true, compact = false }: RunSummaryProps) {
  // Compter les items légendaires
  const legendaryItems = [
    ...Object.values(runData.equipment),
    ...runData.inventory
  ].filter(item => item && item.rarity === 'legendary').length
  
  const legendaryCount = runData.legendaryItemsFound ?? legendaryItems
  
  return (
    <div style={{
      background: compact ? 'transparent' : '#2a2a2a',
      padding: compact ? '0' : '1.5rem',
      borderRadius: '8px',
      border: compact ? 'none' : '2px solid #555',
      width: '100%'
    }}>
      {showTitle && !compact && (
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          RÉCAPITULATIF
        </div>
      )}
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* Jours survécus */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.5rem',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          <span style={{ color: '#aaa' }}>Jours survécus :</span>
          <span style={{ color: '#ddd', fontWeight: 'bold' }}>{runData.day}/20</span>
        </div>
        
        {/* Or final */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.5rem',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          <span style={{ color: '#aaa' }}>Or final :</span>
          <span style={{ color: '#ca8', fontWeight: 'bold' }}>{runData.gold}💰</span>
        </div>
        
        {/* Réputation finale */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.5rem',
          background: '#1a1a1a',
          borderRadius: '4px'
        }}>
          <span style={{ color: '#aaa' }}>Réputation :</span>
          <span style={{ color: '#ddd', fontWeight: 'bold' }}>
            {'⭐'.repeat(runData.reputation)}
          </span>
        </div>
        
        {/* Items légendaires */}
        {legendaryCount > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            border: '1px solid #ca8'
          }}>
            <span style={{ color: '#aaa' }}>Items légendaires :</span>
            <span style={{ color: '#ca8', fontWeight: 'bold' }}>{legendaryCount}</span>
          </div>
        )}
        
        {/* Combats */}
        {(runData.combatsWon !== undefined || runData.combatsFled !== undefined || runData.combatsLost !== undefined) && (
          <div style={{
            padding: '0.5rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            marginTop: '0.5rem'
          }}>
            <div style={{ color: '#aaa', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Combats :
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              fontSize: '0.85rem'
            }}>
              {runData.combatsWon !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4a8' }}>Victoires :</span>
                  <span style={{ color: '#4a8' }}>{runData.combatsWon}</span>
                </div>
              )}
              {runData.combatsFled !== undefined && runData.combatsFled > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#ca8' }}>Fuit :</span>
                  <span style={{ color: '#ca8' }}>{runData.combatsFled}</span>
                </div>
              )}
              {runData.combatsLost !== undefined && runData.combatsLost > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#c44' }}>Défaites :</span>
                  <span style={{ color: '#c44' }}>{runData.combatsLost}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
