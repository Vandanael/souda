import { useGameStore } from '../store/gameStore'

interface EndingProgressProps {
  compact?: boolean
  isMobile?: boolean
}

export default function EndingProgress({ compact = false, isMobile = false }: EndingProgressProps) {
  const { narrativeCounters } = useGameStore()
  
  const humanite = narrativeCounters.humanite || 0
  const cynisme = narrativeCounters.cynisme || 0
  const pragmatisme = narrativeCounters.pragmatisme || 0
  
  if (compact || isMobile) {
    return (
      <div style={{
        background: '#1a1a1a',
        padding: isMobile ? '0.5rem' : '0.75rem',
        borderRadius: '4px',
        fontSize: isMobile ? '0.8rem' : '0.85rem'
      }}>
        <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#ddd' }}>
          État d'esprit
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ color: '#4a4' }}>Humanité</span>
              <span style={{ color: '#aaa' }}>{humanite}/10</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${Math.min(100, (humanite / 10) * 100)}%`, 
                height: '100%', 
                background: '#4a4',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ color: '#c44' }}>Cynisme</span>
              <span style={{ color: '#aaa' }}>{cynisme}/10</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${Math.min(100, (cynisme / 10) * 100)}%`, 
                height: '100%', 
                background: '#c44',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ color: '#88a' }}>Pragmatisme</span>
              <span style={{ color: '#aaa' }}>{pragmatisme}/10</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${Math.min(100, (pragmatisme / 10) * 100)}%`, 
                height: '100%', 
                background: '#88a',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div style={{
      background: '#2a2a2a',
      padding: isMobile ? '0.75rem' : '1rem',
      borderRadius: '8px',
      border: '2px solid #555',
      marginTop: '1rem'
    }}>
      <div style={{ fontSize: isMobile ? '1rem' : '1.1rem', marginBottom: isMobile ? '0.75rem' : '1rem', fontWeight: 'bold' }}>
        État d'esprit
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Compteurs narratifs */}
        <div>
          <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#aaa' }}>
            Compteurs narratifs
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#4a4' }}>Humanité</span>
                <span style={{ color: '#aaa' }}>{humanite}/10</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(100, (humanite / 10) * 100)}%`, 
                  height: '100%', 
                  background: '#4a4',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#c44' }}>Cynisme</span>
                <span style={{ color: '#aaa' }}>{cynisme}/10</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(100, (cynisme / 10) * 100)}%`, 
                  height: '100%', 
                  background: '#c44',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#88a' }}>Pragmatisme</span>
                <span style={{ color: '#aaa' }}>{pragmatisme}/10</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min(100, (pragmatisme / 10) * 100)}%`, 
                  height: '100%', 
                  background: '#88a',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
