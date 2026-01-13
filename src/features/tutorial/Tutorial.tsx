import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cleanupTutorial } from './tutorialManager'
import { saveTutorialState } from './tutorialPersistence'
import { TutorialStep } from './types'

interface TutorialProps {
  onSkip: () => void
  onStepChange?: (step: number) => void
}

export default function Tutorial({ onSkip, onStepChange }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState<TutorialStep>(0)
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)
  const [typewriterText, setTypewriterText] = useState('')
  const [typewriterIndex, setTypewriterIndex] = useState(0)
  
  const stepTexts = [
    ['La bataille est perdue.', 'Vos compagnons sont morts.', 'Vous fuyez dans la nuit...'],
    [],
    [],
    []
  ]
  
  const currentStepTexts = stepTexts[currentStep] || []
  const currentText = currentStepTexts[typewriterIndex] || ''
  
  // Étape 1 : La Fuite (20s)
  useEffect(() => {
    if (currentStep === 0) {
      setTypewriterText('')
      setTypewriterIndex(0)
      
      // Timer pour passer à l'étape 2 après que tous les textes soient affichés
      const totalTextTime = currentStepTexts.length * 3000 + 2000 // 3s par texte + 2s de marge
      const timer = setTimeout(() => {
        setCurrentStep(1)
        if (onStepChange) onStepChange(1)
      }, Math.max(20000, totalTextTime))
      
      return () => clearTimeout(timer)
    }
  }, [currentStep, currentStepTexts.length])
  
  // Typewriter effect pour l'étape 1
  useEffect(() => {
    if (currentStep === 0 && currentText) {
      if (typewriterText.length < currentText.length) {
        const timer = setTimeout(() => {
          setTypewriterText(currentText.slice(0, typewriterText.length + 1))
        }, 50)
        return () => clearTimeout(timer)
      } else {
        // Passer au texte suivant après un délai
        const timer = setTimeout(() => {
          if (typewriterIndex < currentStepTexts.length - 1) {
            setTypewriterIndex(typewriterIndex + 1)
            setTypewriterText('')
          }
        }, 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [currentStep, currentText, typewriterText, typewriterIndex, currentStepTexts.length])
  
  // Étape 2 : L'Arrivée (20s)
  useEffect(() => {
    if (currentStep === 1) {
      cleanupTutorial()
      
      const timer = setTimeout(() => {
        setCurrentStep(2)
        if (onStepChange) onStepChange(2)
      }, 20000)
      
      return () => clearTimeout(timer)
    }
  }, [currentStep, onStepChange])
  
  // Étape 3 : Équipement (30s) - géré par TutorialScreen
  // Étape 4 : Première Exploration (20s) - géré par TutorialScreen
  
  
  // @ts-expect-error - Fonction définie mais non utilisée actuellement (peut être utilisée dans le futur)
  const handleSkip = async () => {
    if (!showSkipConfirm) {
      setShowSkipConfirm(true)
      return
    }
    
    cleanupTutorial()
    await saveTutorialState(true)
    onSkip()
  }
  
  // Étape 1 : La Fuite
  if (currentStep === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        {/* Pas de bouton skip pour l'étape 0 (obligatoire) */}
        
        <AnimatePresence mode="wait">
          {currentStepTexts.map((text, index) => {
            if (index !== typewriterIndex) return null
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  fontSize: '1.5rem',
                  color: '#ca8',
                  lineHeight: '1.8',
                  minHeight: '3rem'
                }}
              >
                {typewriterText}
                {typewriterText.length === text.length && (
                  <span style={{ opacity: 1 }}>|</span>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    )
  }
  
  // Étape 2 : L'Arrivée
  if (currentStep === 1) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          padding: '2rem'
        }}
      >
        {/* Pas de bouton skip pour l'étape 1 (obligatoire) */}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: '#2a2a2a',
            padding: '2rem',
            borderRadius: '8px',
            border: '2px solid #555',
            maxWidth: '500px',
            width: '100%'
          }}
        >
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#ca8'
          }}>
            Morten
          </div>
          
          <div style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '1.5rem',
            color: '#ddd'
          }}>
            "Ah, un autre rat qui fuit le navire..."
            <br /><br />
            "Je peux te cacher. Mais rien n'est gratuit."
            <br /><br />
            "Tu me dois 80 pièces d'or. Tu as 20 jours."
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#c44',
              marginBottom: '1rem',
              textAlign: 'center'
            }}
          >
            Dette : 80💰
          </motion.div>
          
          <div style={{
            fontSize: '0.9rem',
            color: '#aaa',
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            Chaque jour, les intérêts augmentent...
          </div>
        </motion.div>
      </motion.div>
    )
  }
  
  // Étape 3 : Équipement - Overlay avec instructions
  if (currentStep === 2) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          pointerEvents: 'none'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(42, 42, 42, 0.95)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #555',
            maxWidth: '500px',
            width: '90%',
            pointerEvents: 'auto'
          }}
        >
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#ca8'
          }}>
            Voici tout ce qu'il te reste.
          </div>
          <div style={{
            fontSize: '0.95rem',
            color: '#ddd',
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            Équipe ton arme pour commencer.
          </div>
        </motion.div>
      </motion.div>
    )
  }
  
  // Étape 4 : Exploration - Overlay avec instructions
  if (currentStep === 3) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          pointerEvents: 'none'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(42, 42, 42, 0.95)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #555',
            maxWidth: '500px',
            width: '90%',
            pointerEvents: 'auto'
          }}
        >
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#ca8'
          }}>
            Explore les environs.
          </div>
          <div style={{
            fontSize: '0.95rem',
            color: '#ddd',
            lineHeight: '1.6'
          }}>
            Trouve de quoi rembourser. Chaque objet a une valeur. Revends au marché.
          </div>
        </motion.div>
      </motion.div>
    )
  }
  
  return null
}
