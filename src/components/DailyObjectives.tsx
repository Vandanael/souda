import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  loadDailyObjectives, 
  updateObjectiveProgress, 
  saveDailyObjectives,
  type DailyObjective 
} from '../features/meta/dailyObjectives'
import { useMetaProgressionStore } from '../store/metaProgression'
import { useGameStore } from '../store/gameStore'

export default function DailyObjectives() {
  const [objectives, setObjectives] = useState<DailyObjective[]>([])
  const { addXP } = useMetaProgressionStore()
  const { gold, combatsWon, day, phase, persistentLocations, dailyLocations, hasEatenToday } = useGameStore()
  const lastGoldRef = useRef(0)
  const lastCombatsWonRef = useRef(0)
  const visitedMortenRef = useRef(false)
  const completedIdsRef = useRef<Set<string>>(new Set()) // Protection contre double-complétion
  
  // Charger les objectifs au montage
  useEffect(() => {
    const loaded = loadDailyObjectives()
    setObjectives(loaded)
    lastGoldRef.current = gold
    lastCombatsWonRef.current = combatsWon
    // Réinitialiser le Set des IDs complétés au chargement
    completedIdsRef.current = new Set(loaded.filter(o => o.completed).map(o => o.id))
  }, [])
  
  // Détecter la visite de Morten
  useEffect(() => {
    if (phase === 'morten' && !visitedMortenRef.current) {
      visitedMortenRef.current = true
      // Mettre à jour l'objectif NPC
      const npcObjective = objectives.find(obj => obj.type === 'npc' && !obj.completed)
      if (npcObjective) {
        const { objectives: updated, completed } = updateObjectiveProgress(
          objectives,
          'npc',
          1
        )
        
        completed.forEach(obj => {
          addXP(obj.xpReward)
        })
        
        setObjectives(updated)
      }
    }
    
    // Réinitialiser le flag quand on quitte l'écran Morten
    if (phase !== 'morten') {
      visitedMortenRef.current = false
    }
  }, [phase, objectives, addXP])
  
  // Vérifier la progression des objectifs
  useEffect(() => {
    if (objectives.length === 0) return
    
    const updated = objectives.map(obj => {
      if (obj.completed) return obj
      
      let newCurrent = obj.current
      
      switch (obj.type) {
        case 'gold':
          // Objectif : gagner X or (on vérifie l'or gagné depuis le début)
          // Pour simplifier, on vérifie si l'or actuel >= target
          if (gold >= obj.target) {
            newCurrent = obj.target
          }
          break
        case 'combat':
          // Objectif : gagner X combats
          if (combatsWon >= obj.target) {
            newCurrent = Math.min(combatsWon, obj.target)
          }
          break
        case 'exploration':
          // Objectif : explorer X lieux
          const exploredCount = [...persistentLocations, ...dailyLocations]
            .filter(loc => loc.explored).length
          if (exploredCount >= obj.target) {
            newCurrent = Math.min(exploredCount, obj.target)
          }
          break
        case 'survival':
          // Objectif : survivre sans manger 1 jour
          // Si on n'a pas mangé aujourd'hui et qu'on est au jour 2+, objectif complété
          if (!hasEatenToday && day >= 2 && obj.current < obj.target) {
            newCurrent = obj.target
          }
          break
      }
      
      return {
        ...obj,
        current: newCurrent,
        completed: newCurrent >= obj.target
      }
    })
    
    // Trouver les objectifs qui viennent d'être complétés
    const newlyCompleted = updated.filter((obj, index) => 
      obj.completed && !objectives[index]?.completed
    )
    
    // Mettre à jour les objectifs si nécessaire
    const hasChanges = updated.some((obj, index) => 
      obj.current !== objectives[index]?.current || 
      obj.completed !== objectives[index]?.completed
    )
    
    if (hasChanges) {
      saveDailyObjectives(updated)
      
      // Donner l'XP pour les objectifs complétés (avec protection contre double-complétion)
      newlyCompleted.forEach(obj => {
        // Vérifier que l'objectif n'a pas déjà été complété dans cette session
        if (obj.completed && obj.xpReward > 0 && !completedIdsRef.current.has(obj.id)) {
          completedIdsRef.current.add(obj.id)
          addXP(obj.xpReward)
        }
      })
      
      setObjectives(updated)
    }
  }, [gold, combatsWon, persistentLocations, dailyLocations, hasEatenToday, day, objectives, addXP])
  
  if (objectives.length === 0) {
    return null
  }
  
  return (
    <div style={{
      background: '#2a2a2a',
      padding: '1rem',
      borderRadius: '8px',
      border: '2px solid #555',
      marginBottom: '1rem'
    }}>
      <div style={{
        fontSize: '1rem',
        fontWeight: 'bold',
        marginBottom: '0.75rem',
        color: '#fff',
        textAlign: 'center'
      }}>
        📋 OBJECTIFS QUOTIDIENS
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {objectives.map((obj, index) => (
          <motion.div
            key={obj.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              background: obj.completed ? '#1a3a1a' : '#1a1a1a',
              border: `1px solid ${obj.completed ? '#2ecc71' : '#444'}`,
              borderRadius: '4px',
              padding: '0.75rem',
              fontSize: '0.85rem'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.25rem'
            }}>
              <div style={{
                color: obj.completed ? '#2ecc71' : '#ccc',
                fontWeight: obj.completed ? 'bold' : 'normal'
              }}>
                {obj.completed ? '✅' : '⭕'} {obj.title}
              </div>
              {obj.completed && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#2ecc71'
                }}>
                  +{obj.xpReward} XP
                </div>
              )}
            </div>
            
            <div style={{
              fontSize: '0.8rem',
              color: '#aaa',
              marginBottom: '0.25rem'
            }}>
              {obj.description}
            </div>
            
            {/* Barre de progression */}
            <div style={{
              width: '100%',
              height: '4px',
              background: '#1a1a1a',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '0.25rem'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (obj.current / obj.target) * 100)}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  height: '100%',
                  background: obj.completed ? '#2ecc71' : '#4a9eff',
                  borderRadius: '2px'
                }}
              />
            </div>
            
            <div style={{
              fontSize: '0.75rem',
              color: '#888',
              marginTop: '0.25rem',
              textAlign: 'right'
            }}>
              {obj.current} / {obj.target}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
