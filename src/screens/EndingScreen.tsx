import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { Ending, injectEndingVariables } from '../features/endings/endings.logic'
import EndingParticles from '../features/endings/EndingParticles'
import RunSummary, { type RunData } from '../components/RunSummary'

interface EndingScreenProps {
  ending: Ending
  xpGained?: number
}

export default function EndingScreen({ ending, xpGained }: EndingScreenProps) {
  const { 
    day, 
    gold, 
    reputation,
    equipment,
    inventory,
    combatsWon,
    combatsFled,
    combatsLost,
    legendaryItemsFound,
    resetGame
  } = useGameStore()
  
  const [showContent, setShowContent] = useState(false)
  const [textLines, setTextLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  
  useEffect(() => {
    // Fade in après un court délai
    const timer = setTimeout(() => setShowContent(true), 500)
    
    // Découper le texte en lignes pour l'animation
    const injectedText = injectEndingVariables(ending.text, ending.variables)
    const lines = injectedText.split('. ').filter(line => line.trim().length > 0)
    setTextLines(lines)
    
    return () => clearTimeout(timer)
  }, [ending])
  
  // Animation ligne par ligne
  useEffect(() => {
    if (textLines.length === 0) return
    
    if (currentLineIndex < textLines.length) {
      const timer = setTimeout(() => {
        setCurrentLineIndex(currentLineIndex + 1)
      }, 1500) // 1.5s par ligne
      
      return () => clearTimeout(timer)
    }
  }, [currentLineIndex, textLines.length])
  
  const runData: RunData = {
    day,
    gold,
    reputation,
    equipment,
    inventory,
    combatsWon,
    combatsFled,
    combatsLost,
    legendaryItemsFound
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showContent ? 1 : 0 }}
      transition={{ duration: 1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: ending.ambiance.backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        overflowY: 'auto',
        zIndex: 10000
      }}
    >
      {/* Particules d'ambiance */}
      <EndingParticles ambiance={ending.ambiance} />
      
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: showContent ? 1 : 0, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontSize: ending.type === 'victory' ? '3rem' : '2.5rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
            color: ending.ambiance.titleColor,
            textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
            lineHeight: '1.2'
          }}
        >
          {ending.title}
        </motion.div>
        
        {/* Texte avec animation ligne par ligne */}
        <motion.div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '2rem',
            borderRadius: '8px',
            border: `2px solid ${ending.ambiance.textColor}40`,
            marginBottom: '2rem',
            minHeight: '200px'
          }}
        >
          <AnimatePresence mode="wait">
            {textLines.slice(0, currentLineIndex).map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: '1.1rem',
                  color: ending.ambiance.textColor,
                  lineHeight: '1.8',
                  marginBottom: index < textLines.length - 1 ? '1rem' : '0',
                  fontStyle: 'italic',
                  textAlign: 'left'
                }}
              >
                {line.trim()}.
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Stats de run (compact) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: currentLineIndex >= textLines.length ? 1 : 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: `1px solid ${ending.ambiance.textColor}40`,
            marginBottom: '2rem'
          }}
        >
          <RunSummary runData={runData} compact xpGained={xpGained} />
        </motion.div>
        
        {/* Boutons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: currentLineIndex >= textLines.length ? 1 : 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => {
              const { setPhase } = useGameStore.getState()
              setPhase('hallOfFame')
            }}
            style={{
              fontSize: '1.1rem',
              padding: '1rem 2rem',
              background: '#2a2a2a',
              border: '2px solid #555',
              minWidth: '150px',
              color: ending.ambiance.textColor
            }}
          >
            HALL OF FAME
          </button>
          
          <button
            onClick={resetGame}
            style={{
              fontSize: '1.1rem',
              padding: '1rem 2rem',
              background: ending.type === 'victory' ? '#3a2a2a' : '#2a1a1a',
              border: `2px solid ${ending.ambiance.titleColor}80`,
              minWidth: '150px',
              color: ending.ambiance.textColor
            }}
          >
            {ending.type === 'victory' ? 'NOUVELLE PARTIE' : 'RÉESSAYER'}
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
