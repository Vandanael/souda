import { useEffect, useRef, useState, useMemo } from 'react'
import { Item } from '../../types/item'
import { renderCharacter } from './renderCharacter'
import { useIsLowEndDevice } from '../../hooks/useIsMobile'
import { useGameStore } from '../../store/gameStore'

interface CharacterCanvasProps {
  equipment: Partial<Record<string, Item>>
  showPreview?: Item
  size?: number // Taille d'affichage (défaut: 128)
}

export default function CharacterCanvas({ 
  equipment, 
  showPreview, 
  size = 128 
}: CharacterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isLowEnd = useIsLowEndDevice()
  const { narrativeCounters } = useGameStore()
  
  // Calculer les intensités des auras basées sur les compteurs narratifs
  const humanite = narrativeCounters.humanite || 0
  const cynisme = narrativeCounters.cynisme || 0
  const pragmatisme = narrativeCounters.pragmatisme || 0
  
  // Intensité de chaque aura (0-1) basée sur la valeur du compteur
  const auraIntensities = {
    humanite: Math.min(1, humanite / 10),
    cynisme: Math.min(1, cynisme / 10),
    pragmatisme: Math.min(1, pragmatisme / 10)
  }
  
  // Déterminer quelle(s) aura(s) afficher (seulement si >= 3)
  const showAuras = {
    humanite: humanite >= 3,
    cynisme: cynisme >= 3,
    pragmatisme: pragmatisme >= 3
  }
  
  // Mémoriser le hash de l'équipement pour éviter les re-renders inutiles
  const equipmentHash = useMemo(() => {
    return JSON.stringify(equipment)
  }, [equipment])
  
  const previewHash = useMemo(() => {
    return showPreview ? `${showPreview.slot}:${showPreview.id}` : null
  }, [showPreview])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d', {
      // Options de performance pour appareils bas de gamme
      alpha: !isLowEnd, // Désactiver alpha sur bas de gamme
      desynchronized: isLowEnd, // Mode désynchronisé pour meilleures performances
      willReadFrequently: false
    })
    if (!ctx) return
    
    setIsLoading(true)
    setError(null)
    
    // Rendre le personnage (lazy loading avec debounce sur bas de gamme)
    const renderPromise = isLowEnd
      ? new Promise<ImageData>((resolve) => {
          // Debounce de 50ms sur bas de gamme pour éviter les re-renders trop fréquents
          setTimeout(() => {
            renderCharacter(equipment, showPreview).then(resolve)
          }, 50)
        })
      : renderCharacter(equipment, showPreview)
    
    renderPromise
      .then((imageData) => {
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Dessiner l'ImageData
        ctx.putImageData(imageData, 0, 0)
        
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to render character:', err)
        setError('Erreur de rendu')
        setIsLoading(false)
      })
  }, [equipmentHash, previewHash, isLowEnd])
  
  // Calculer les couleurs des auras avec opacité basée sur l'intensité
  const getAuraStyle = (type: 'humanite' | 'cynisme' | 'pragmatisme'): React.CSSProperties | undefined => {
    if (!showAuras[type]) return undefined
    
    const colors = {
      humanite: '#4a4',
      cynisme: '#c44',
      pragmatisme: '#88a'
    }
    
    const intensity = auraIntensities[type]
    const opacity = 0.15 + (intensity * 0.25) // Opacité entre 0.15 et 0.4
    
    return {
      position: 'absolute' as const,
      top: '-2px',
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      borderRadius: '6px',
      border: `2px solid ${colors[type]}`,
      opacity,
      boxShadow: `0 0 ${8 + intensity * 12}px ${colors[type]}`,
      pointerEvents: 'none' as const,
      transition: 'opacity 0.3s, box-shadow 0.3s'
    }
  }
  
  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a1a',
      borderRadius: '4px',
      border: '1px solid #555'
    }}>
      {/* Auras visuelles pour les compteurs narratifs */}
      {showAuras.humanite && (
        <div style={getAuraStyle('humanite')} />
      )}
      {showAuras.cynisme && (
        <div style={getAuraStyle('cynisme')} />
      )}
      {showAuras.pragmatisme && (
        <div style={getAuraStyle('pragmatisme')} />
      )}
      
      <canvas
        ref={canvasRef}
        width={64}
        height={64}
        style={{
          width: size,
          height: size,
          imageRendering: 'pixelated', // Pour un rendu pixel art net
          position: 'relative',
          zIndex: 1
        }}
      />
      
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#888',
          fontSize: '0.8rem',
          zIndex: 2
        }}>
          Chargement...
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#c44',
          fontSize: '0.8rem',
          textAlign: 'center',
          zIndex: 2
        }}>
          {error}
        </div>
      )}
    </div>
  )
}
