import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Enemy } from '../../types/enemy'
import { CombatResult, resolveCombat } from './combat.logic'
import { PlayerStats } from '../../utils/stats'
import EnemyDisplay from './EnemyDisplay'
import CombatAnimation from './CombatAnimation'
import CombatResultDisplay from './CombatResult'
import CombatBreakdownDisplay from './CombatBreakdownDisplay'
import { audioManager } from '../audio/audioManager'
import { ScreenShakeWrapper } from '../../hooks/useScreenShake'
import { autoSave } from '../game/saveSystem'
import { useGameStore } from '../../store/gameStore'

type CombatPhase = 'anticipation' | 'tension' | 'resolution' | 'result' | 'complete'

interface CombatScreenProps {
  enemy: Enemy
  playerStats: PlayerStats
  onCombatEnd: (result: CombatResult) => void
}

export default function CombatScreen({ 
  enemy, 
  playerStats,
  onCombatEnd 
}: CombatScreenProps) {
  const relics = useGameStore((state) => state.relics)
  const [phase, setPhase] = useState<CombatPhase>('anticipation')
  const [combatResult, setCombatResult] = useState<CombatResult | null>(null)
  const [shouldShake, setShouldShake] = useState(false)
  
  // Résoudre le combat immédiatement (logique pure)
  useEffect(() => {
    const result = resolveCombat(playerStats, enemy, undefined, undefined, relics)
    setCombatResult(result)
    
    // Déclencher shake si le joueur prend des dégâts
    if (result.outcome === 'costly' || result.outcome === 'flee' || result.outcome === 'defeat') {
      setShouldShake(true)
      setTimeout(() => setShouldShake(false), 500)
    }
    
    // Sauvegarder l'état au début du combat (phase anticipation)
    const gameState = useGameStore.getState()
    autoSave({
      ...gameState,
      currentEnemy: enemy,
      combatResult: result,
      currentEvent: 'combat'
    }).catch(() => {})
  }, [enemy, playerStats])
  
  // Phase 1 : Anticipation (0.5s) -> Tension
  useEffect(() => {
    if (phase === 'anticipation') {
      // Crossfade vers musique de combat
      audioManager.crossfadeMusic('ambient_combat', 1000)
      audioManager.playSound('combat_start')
      
      // Sauvegarder au début de la phase anticipation
      const gameState = useGameStore.getState()
      autoSave({
        ...gameState,
        currentEnemy: enemy,
        combatResult: combatResult,
        currentEvent: 'combat',
        phase: 'exploration' // Garder la phase exploration pour la sauvegarde
      }).catch(() => {})
      
      const timer = setTimeout(() => {
        setPhase('tension')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [phase, enemy, combatResult])

  // Phase 1.5 : Tension (0.6s) avant résolution
  useEffect(() => {
    if (phase === 'tension') {
      audioManager.playSound('combat_start')
      const timer = setTimeout(() => {
        setPhase('resolution')
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [phase])
  
  // Sauvegarder au début de la phase resolution
  useEffect(() => {
    if (phase === 'resolution' && combatResult) {
      const gameState = useGameStore.getState()
      autoSave({
        ...gameState,
        currentEnemy: enemy,
        combatResult: combatResult,
        currentEvent: 'combat',
        phase: 'exploration'
      }).catch(() => {})
    }
  }, [phase, enemy, combatResult])
  
  // Sauvegarder au début de la phase result
  useEffect(() => {
    if (phase === 'result' && combatResult) {
      const gameState = useGameStore.getState()
      autoSave({
        ...gameState,
        currentEnemy: enemy,
        combatResult: combatResult,
        currentEvent: 'combat',
        phase: 'exploration'
      }).catch(() => {})
    }
  }, [phase, enemy, combatResult])
  
  // Nettoyer la musique de combat à la fin
  useEffect(() => {
    if (phase === 'complete') {
      // Crossfade retour vers musique d'exploration
      audioManager.crossfadeMusic('ambient_explore', 1000)
    }
    
    return () => {
      // Cleanup si le composant est démonté
      if (phase === 'complete') {
        audioManager.crossfadeMusic('ambient_explore', 1000)
      }
    }
  }, [phase])
  
  // Phase 2 : Résolution (2s) - gérée par CombatAnimation
  const handleResolutionComplete = () => {
    setPhase('result')
  }
  
  // Phase 3 : Résultat (1.5s) - gérée par CombatResult
  const handleResultComplete = () => {
    setPhase('complete')
    if (combatResult) {
      // Jouer le son de résultat
      if (combatResult.outcome === 'defeat') {
        audioManager.playSound('defeat')
      } else if (combatResult.outcome === 'flee') {
        audioManager.playSound('flee')
      } else {
        audioManager.playSound('victory')
      }
      
      onCombatEnd(combatResult)
    }
  }
  
  // Overlay sombre pour anticipation
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.7 },
    exit: { opacity: 0 }
  }
  
  return (
    <ScreenShakeWrapper intensity={4} duration={500} trigger={shouldShake}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}>
      {/* Overlay sombre pour anticipation */}
      <AnimatePresence>
        {phase === 'anticipation' && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#000',
              zIndex: 1
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Phase 1 : Anticipation */}
      <AnimatePresence>
        {phase === 'anticipation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: '500px',
              textAlign: 'center'
            }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                color: '#fff'
              }}
            >
              ⚔️ COMBAT !
            </motion.div>
            
            <EnemyDisplay enemy={enemy} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Phase 2 : Tension */}
      <AnimatePresence>
        {phase === 'tension' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              maxWidth: '500px',
              textAlign: 'center',
              padding: '1rem',
              zIndex: 2
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0.1, 1, 0.8, 1] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{
                height: '10px',
                background: 'linear-gradient(90deg, #c44, #ca8)',
                borderRadius: '6px',
                transformOrigin: 'left',
                boxShadow: '0 0 12px rgba(255,0,0,0.35)'
              }}
            />
            <div style={{ marginTop: '0.5rem', color: '#ccc', fontSize: '0.95rem', letterSpacing: '0.05em' }}>
              Suspense...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3 : Résolution */}
      <AnimatePresence>
        {phase === 'resolution' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              maxWidth: '500px',
              textAlign: 'center'
            }}
          >
            <CombatAnimation onComplete={handleResolutionComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Phase 4 : Résultat */}
      <AnimatePresence>
        {phase === 'result' && combatResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              maxWidth: '500px'
            }}
          >
            <CombatResultDisplay 
              result={combatResult} 
              onComplete={handleResultComplete}
            />
            {combatResult.breakdown && (
              <CombatBreakdownDisplay 
                breakdown={combatResult.breakdown}
                outcome={combatResult.outcome}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Phase 5 : Complete - transition automatique vers écran suivant */}
      {phase === 'complete' && (
        <div style={{ opacity: 0 }}>
          {/* Écran vide, la transition est gérée par onCombatEnd */}
        </div>
      )}
      </div>
    </ScreenShakeWrapper>
  )
}
