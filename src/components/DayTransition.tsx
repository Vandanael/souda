import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DayTransitionProps {
  currentDay: number
  nextDay: number
  onComplete: () => void
}

/**
 * Citations et conseils pour les transitions de jour
 */
const DAY_QUOTES = [
  "La nuit efface les traces. Le jour les révèle.",
  "Chaque aube est une nouvelle chance. Ou une nouvelle dette.",
  "Les murs écoutent. Les ombres jugent.",
  "Dans l'obscurité, les choix deviennent plus clairs.",
  "Le sommeil n'efface pas les dettes. Seul l'or le fait.",
  "Les ruines gardent leurs secrets. Et leurs trésors.",
  "Morten attend. Le temps passe.",
  "La survie n'est pas une victoire. C'est juste un autre jour.",
  "Les combats d'hier forgent les choix de demain.",
  "L'or brille dans l'obscurité. Mais la dette aussi."
]

/**
 * Conseils pratiques pour les transitions
 */
const DAY_TIPS = [
  "Explorer tôt permet de trouver plus de lieux.",
  "Manger à la taverne restaure l'humanité.",
  "Rembourser régulièrement améliore ta relation avec Morten.",
  "Les items légendaires valent cher au marché.",
  "La forge peut réparer tes équipements endommagés.",
  "Les rumeurs à la taverne révèlent des trésors cachés.",
  "Survivre sans manger réduit tes actions le lendemain.",
  "Les choix narratifs influencent tes fins possibles."
]

export default function DayTransition({ nextDay, onComplete }: DayTransitionProps) {
  const [phase, setPhase] = useState<'fadeOut' | 'black' | 'fadeIn'>('fadeOut')
  const [quote, setQuote] = useState<string>('')
  
  useEffect(() => {
    // Phase 1 : Fade Out (2 secondes)
    const fadeOutTimer = setTimeout(() => {
      setPhase('black')
      // Sélectionner une citation aléatoire
      const quotes = [...DAY_QUOTES, ...DAY_TIPS]
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setQuote(randomQuote)
    }, 2000)
    
    // Phase 2 : Écran noir avec citation (2 secondes)
    const blackTimer = setTimeout(() => {
      setPhase('fadeIn')
    }, 4000)
    
    // Phase 3 : Fade In (1 seconde) puis compléter
    const fadeInTimer = setTimeout(() => {
      onComplete()
    }, 5000)
    
    return () => {
      clearTimeout(fadeOutTimer)
      clearTimeout(blackTimer)
      clearTimeout(fadeInTimer)
    }
  }, [onComplete])
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: phase === 'fadeOut' ? 1 : phase === 'black' ? 1 : 0
      }}
      transition={{ duration: 2, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: phase === 'black' ? '#000000' : 'rgba(0, 0, 0, 0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        pointerEvents: 'none'
      }}
    >
      <AnimatePresence>
        {phase === 'black' && quote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: '500px',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <div style={{
              fontSize: '1.1rem',
              color: '#888',
              fontStyle: 'italic',
              lineHeight: '1.8',
              marginBottom: '2rem'
            }}>
              "{quote}"
            </div>
            
            <div style={{
              fontSize: '0.9rem',
              color: '#555',
              marginTop: '2rem'
            }}>
              JOUR {nextDay}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
