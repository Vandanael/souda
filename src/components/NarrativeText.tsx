import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

interface NarrativeTextProps {
  text: string
  speed?: number // Délai entre chaque lettre en ms (défaut: 30ms, 20ms sur mobile)
  onComplete?: () => void
  skipOnClick?: boolean // Permet de skip l'animation en cliquant
  style?: React.CSSProperties
}

/**
 * Types de mots spéciaux pour la coloration
 */
type WordType = 'name' | 'danger' | 'item' | 'normal'

interface ParsedWord {
  text: string
  type: WordType
}

/**
 * Parse le texte markdown custom et identifie les mots spéciaux
 * Syntaxe : **mot** = nom (jaune), __mot__ = danger (rouge), *mot* = item (bleu)
 */
function parseNarrativeText(text: string): ParsedWord[] {
  const words: ParsedWord[] = []
  
  // Regex pour trouver les patterns markdown
  const namePattern = /\*\*([^*]+)\*\*/g // **nom**
  const dangerPattern = /__([^_]+)__/g // __danger__
  const itemPattern = /\*([^*_]+)\*/g // *item* (mais pas ** ou __)
  
  // Remplacer les patterns par des placeholders temporaires
  const placeholders: { [key: string]: { text: string; type: WordType } } = {}
  let placeholderIndex = 0
  
  let processedText = text
  
  // Traiter les noms (**texte**)
  processedText = processedText.replace(namePattern, (_match, content) => {
    const key = `__PLACEHOLDER_${placeholderIndex}__`
    placeholders[key] = { text: content, type: 'name' }
    placeholderIndex++
    return key
  })
  
  // Traiter les dangers (__texte__)
  processedText = processedText.replace(dangerPattern, (_match, content) => {
    const key = `__PLACEHOLDER_${placeholderIndex}__`
    placeholders[key] = { text: content, type: 'danger' }
    placeholderIndex++
    return key
  })
  
  // Traiter les items (*texte*)
  processedText = processedText.replace(itemPattern, (_match, content) => {
    const key = `__PLACEHOLDER_${placeholderIndex}__`
    placeholders[key] = { text: content, type: 'item' }
    placeholderIndex++
    return key
  })
  
  // Parser le texte final en mots
  const parts = processedText.split(/(\s+)/)
  
  parts.forEach(part => {
    if (part.trim() === '') {
      // Espaces
      words.push({ text: part, type: 'normal' })
    } else if (part.startsWith('__PLACEHOLDER_') && part.endsWith('__')) {
      // Placeholder trouvé
      const placeholder = placeholders[part]
      if (placeholder) {
        words.push(placeholder)
      }
    } else {
      // Texte normal
      words.push({ text: part, type: 'normal' })
    }
  })
  
  return words
}

/**
 * Obtient la couleur selon le type de mot
 */
function getWordColor(type: WordType): string {
  switch (type) {
    case 'name':
      return '#f4d03f' // Jaune pâle
    case 'danger':
      return '#8B0000' // Rouge sang
    case 'item':
      return '#5dade2' // Bleu délavé
    default:
      return '#ffffff' // Blanc
  }
}

export default function NarrativeText({ 
  text, 
  speed,
  onComplete,
  skipOnClick = true,
  style 
}: NarrativeTextProps) {
  const isMobile = useIsMobile()
  const actualSpeed = speed || (isMobile ? 20 : 30) // Plus rapide sur mobile
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const currentIndexRef = useRef(0)
  
  useEffect(() => {
    // Réinitialiser au montage
    currentIndexRef.current = 0
    setDisplayedText('')
    setIsComplete(false)
    
    // Animer lettre par lettre
    const animate = () => {
      if (currentIndexRef.current >= text.length) {
        setIsComplete(true)
        if (onComplete) {
          onComplete()
        }
        return
      }
      
      // Avancer d'un caractère
      currentIndexRef.current++
      const newText = text.substring(0, currentIndexRef.current)
      setDisplayedText(newText)
      
      // Son de cliquetis (optionnel, très léger)
      // playSound('text_tick') // À implémenter dans audioManager si nécessaire
      
      // Continuer l'animation
      animationRef.current = setTimeout(animate, actualSpeed)
    }
    
    // Démarrer l'animation
    animationRef.current = setTimeout(animate, actualSpeed)
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [text, actualSpeed, onComplete])
  
  const handleClick = () => {
    if (skipOnClick && !isComplete) {
      // Skip l'animation
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
      setDisplayedText(text)
      setIsComplete(true)
      if (onComplete) {
        onComplete()
      }
    }
  }
  
  // Reconstruire le texte avec les couleurs
  const renderColoredText = () => {
    const words = parseNarrativeText(displayedText)
    const result: JSX.Element[] = []
    let keyIndex = 0
    
    words.forEach((word, index) => {
      const color = getWordColor(word.type)
      const isLastWord = index === words.length - 1
      
      // Ajouter le curseur clignotant si on n'est pas à la fin
      if (isLastWord && !isComplete) {
        result.push(
          <span key={`word-${keyIndex++}`} style={{ color }}>
            {word.text}
          </span>
        )
        result.push(
          <motion.span
            key={`cursor-${keyIndex++}`}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ color, marginLeft: '2px' }}
          >
            |
          </motion.span>
        )
      } else {
        result.push(
          <span key={`word-${keyIndex++}`} style={{ color }}>
            {word.text}
          </span>
        )
      }
    })
    
    return result
  }
  
  return (
    <div
      onClick={handleClick}
      style={{
        cursor: skipOnClick && !isComplete ? 'pointer' : 'default',
        lineHeight: '1.8',
        fontFamily: 'serif',
        ...style
      }}
    >
      {renderColoredText()}
    </div>
  )
}
