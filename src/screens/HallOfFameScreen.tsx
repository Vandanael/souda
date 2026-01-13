import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { ArchivedRun, GlobalStats } from '../features/meta/types'
import { getRuns, getStats } from '../features/meta/hallOfFame'

type FilterType = 'all' | 'victory' | 'defeat'

export default function HallOfFameScreen() {
  const { resetGame } = useGameStore()
  const [runs, setRuns] = useState<ArchivedRun[]>([])
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    setLoading(true)
    try {
      const [runsData, statsData] = await Promise.all([
        getRuns(),
        getStats()
      ])
      setRuns(runsData)
      setStats(statsData)
    } catch (error) {
      console.error('Erreur chargement Hall of Fame:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const filteredRuns = runs.filter(run => {
    if (filter === 'victory') return run.endType === 'victory'
    if (filter === 'defeat') return run.endType !== 'victory'
    return true
  })
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Chargement...</div>
      </div>
    )
  }
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      flex: 1,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      {/* En-tête */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          HALL OF FAME
        </div>
        <button
          onClick={resetGame}
          style={{
            fontSize: '0.9rem',
            padding: '0.5rem 1rem',
            marginTop: '0.5rem'
          }}
        >
          RETOUR
        </button>
      </div>
      
      {/* Stats globales */}
      {stats && (
        <div style={{
          background: '#2a2a2a',
          padding: '1rem',
          borderRadius: '8px',
          border: '2px solid #555'
        }}>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '0.75rem'
          }}>
            STATISTIQUES GLOBALES
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <div>Runs totales : <span style={{ color: '#ca8' }}>{stats.totalRuns}</span></div>
            <div>Victoires : <span style={{ color: '#2ecc71' }}>{stats.victories}</span></div>
            <div>Défaites : <span style={{ color: '#c44' }}>{stats.defeats}</span></div>
            <div>Meilleur score : <span style={{ color: '#ca8' }}>{stats.bestDays} jours</span></div>
            <div>Meilleur or : <span style={{ color: '#ca8' }}>{stats.bestGold}💰</span></div>
            <div>Items légendaires : <span style={{ color: '#f39c12' }}>{stats.totalLegendaryItems}</span></div>
          </div>
        </div>
      )}
      
      {/* Filtres */}
      <div style={{
        display: 'flex',
        gap: '0.5rem'
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: filter === 'all' ? '#3a3a3a' : '#1a1a1a',
            border: `1px solid ${filter === 'all' ? '#555' : '#333'}`
          }}
        >
          TOUTES
        </button>
        <button
          onClick={() => setFilter('victory')}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: filter === 'victory' ? '#3a3a3a' : '#1a1a1a',
            border: `1px solid ${filter === 'victory' ? '#555' : '#333'}`
          }}
        >
          VICTOIRES
        </button>
        <button
          onClick={() => setFilter('defeat')}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: filter === 'defeat' ? '#3a3a3a' : '#1a1a1a',
            border: `1px solid ${filter === 'defeat' ? '#555' : '#333'}`
          }}
        >
          DÉFAITES
        </button>
      </div>
      
      {/* Liste des runs */}
      {filteredRuns.length === 0 ? (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#888',
          fontStyle: 'italic'
        }}>
          Aucune run archivée
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {filteredRuns.map((run) => (
            <div
              key={run.id}
              style={{
                background: '#2a2a2a',
                padding: '1rem',
                borderRadius: '8px',
                border: `1px solid ${run.endType === 'victory' ? '#2ecc71' : '#c44'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: run.endType === 'victory' ? '#2ecc71' : '#c44'
                  }}>
                    {run.endTitle}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#888'
                  }}>
                    {run.origin} • {formatDate(run.timestamp)}
                  </div>
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#ca8'
                }}>
                  {run.daysLived} jours
                </div>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: '#aaa'
              }}>
                <div>Or final : <span style={{ color: '#ca8' }}>{run.finalGold}💰</span></div>
                <div>Dette : <span style={{ color: '#c44' }}>{run.finalDebt}💰</span></div>
                <div>Réputation : <span style={{ color: '#ddd' }}>{'⭐'.repeat(run.finalReputation)}</span></div>
                <div>Combats : <span style={{ color: '#2ecc71' }}>{run.combatsWon}</span> / <span style={{ color: '#c44' }}>{run.combatsLost}</span></div>
                {run.legendaryItems.length > 0 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    Items légendaires : <span style={{ color: '#f39c12' }}>{run.legendaryItems.length}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
