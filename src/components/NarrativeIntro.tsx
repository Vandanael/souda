import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NarrativeIntroProps {
  onComplete: () => void
}

const INTRO_TEXTS = [
  "La guerre est finie depuis longtemps.",
  "Les armées ont disparu.",
  "Il ne reste que les ruines...",
  "Et ceux qui les pillent.",
  "Tu es arrivé à Bourg-Creux.",
  "Un refuge pour les perdants.",
  "Morten t'a trouvé."
]

export default function NarrativeIntro({ onComplete }: NarrativeIntroProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [showSkipHint, setShowSkipHint] = useState(false)
  const timersRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    // Afficher l'indication de skip après 2 secondes
    const skipHintTimer = setTimeout(() => {
      setShowSkipHint(true)
    }, 2000)
    timersRef.current.push(skipHintTimer)

    // Afficher chaque texte avec un délai
    INTRO_TEXTS.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCurrentTextIndex(index)
      }, index * 2000) // 2 secondes entre chaque texte
      timersRef.current.push(timer)
    })

    // Afficher le dialogue Morten après le dernier texte
    const buttonTimer = setTimeout(() => {
      setShowButton(true)
    }, INTRO_TEXTS.length * 2000 + 2000) // 2 secondes après le dernier texte pour laisser le temps de lire "PAYE... OU MEURS."

    timersRef.current.push(buttonTimer)

    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer))
      timersRef.current = []
    }
  }, [])

  const handleSkip = () => {
    // Nettoyer tous les timers
    timersRef.current.forEach(timer => clearTimeout(timer))
    timersRef.current = []
    // Appeler onComplete immédiatement
    onComplete()
  }

  const isLastText = currentTextIndex === INTRO_TEXTS.length - 1
  const currentText = INTRO_TEXTS[currentTextIndex] || ""

  return (
    <div
      onClick={handleSkip}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {/* Indication de skip */}
      {showSkipHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            fontSize: '0.85rem',
            color: '#666',
            fontStyle: 'italic',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          Appuyez n'importe où pour passer
        </motion.div>
      )}
      <AnimatePresence mode="wait">
        {currentText && (
          <motion.div
            key={currentTextIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              // Tremblement subtil pour le dernier texte
              x: isLastText ? [0, -1, 1, -1, 1, 0] : 0
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              opacity: { duration: 1.5, ease: 'easeOut' },
              y: { duration: 1.5, ease: 'easeOut' },
              x: isLastText ? {
                duration: 0.5,
                repeat: 2,
                repeatType: 'reverse' as const,
                ease: 'easeInOut'
              } : undefined
            }}
            style={{
              fontSize: isLastText ? '2.5rem' : '2rem',
              fontWeight: 'bold',
              color: isLastText ? '#8B0000' : '#ffffff', // Rouge sombre pour le dernier texte
              textAlign: 'center',
              padding: '2rem',
              textShadow: isLastText 
                ? '0 0 10px rgba(139, 0, 0, 0.8), 0 0 20px rgba(139, 0, 0, 0.5)'
                : '0 0 10px rgba(255, 255, 255, 0.3)',
              letterSpacing: isLastText ? '0.2em' : '0.1em',
              fontFamily: 'serif'
            }}
          >
            {currentText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section dialogue Morten (après les textes) */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{
              marginTop: '3rem',
              background: '#2a2a2a',
              padding: '2rem',
              borderRadius: '8px',
              border: '2px solid #555',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()} // Empêcher le skip en cliquant sur le dialogue
          >
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#ca8'
            }}>
              Morten l'Usurier
            </div>
            
            <div style={{
              fontSize: '1rem',
              lineHeight: '1.6',
              marginBottom: '1.5rem',
              color: '#ddd'
            }}>
              "Bienvenue à Bourg-Creux, déserteur."
              <br /><br />
              "Ici, on survit. On pille les ruines. On rembourse ses dettes."
              <br /><br />
              "Tu me dois 80 pièces d'or. Tu as 20 jours pour me payer."
              <br /><br />
              <span style={{ color: '#c44', fontWeight: 'bold' }}>
                "Chaque jour qui passe, ta dette grandit."
              </span>
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#c44',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}
            >
              80💰 aujourd'hui
            </motion.div>
            
            <div style={{
              fontSize: '0.9rem',
              color: '#aaa',
              fontStyle: 'italic',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              +5💰 d'intérêts chaque jour
            </div>

            {/* Bouton qui apparaît après le dialogue */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              onClick={(e) => {
                e.stopPropagation()
                onComplete()
              }}
              style={{
                width: '100%',
                padding: '1.2rem 3rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                border: '2px solid #8B0000',
                color: '#8B0000',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'serif',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#8B0000'
                e.currentTarget.style.color = '#000000'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 0, 0, 0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#8B0000'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              COMMENCER
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
