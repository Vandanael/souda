import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

interface GuideStep {
  id: string
  title: string
  text: string
  phase?: string
  condition?: (state: ReturnType<typeof useGameStore.getState>) => boolean
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'aube_first',
    title: 'Bienvenue à l\'Aube',
    text: 'C\'est le début de ta journée. Tu peux visiter le Marché, la Forge, l\'Usurier ou la Taverne. Puis pars en exploration.',
    phase: 'aube',
    condition: (state) => state.day === 1
  },
  {
    id: 'exploration_first',
    title: 'Exploration',
    text: 'Choisis un lieu à explorer. Les rumeurs (icônes) t\'aident à savoir où aller. Chaque exploration coûte 1 action.',
    phase: 'exploration',
    condition: (state) => state.day === 1 && state.actionsRemaining === 3
  },
  {
    id: 'inventory_first',
    title: 'Inventaire',
    text: 'Équipe tes meilleurs items pour augmenter tes stats (ATK, DEF, VIT). Les items compromis ont des malus cachés.',
    phase: 'inventory',
    condition: (state) => state.inventory.length > 0 && !state.npcFlags.inventoryGuideSeen
  },
  {
    id: 'taverne_rumors',
    title: 'Rumeurs',
    text: 'Les rumeurs apparaissent ici chaque jour. Elles t\'aident à planifier tes explorations. Clique sur "Détails" pour voir leur impact.',
    phase: 'taverne',
    condition: (state) => state.rumors.length > 0 && !state.npcFlags.taverneGuideSeen
  },
  {
    id: 'marche_first',
    title: 'Marché',
    text: 'Achète et vends des items ici. Les prix varient selon ta réputation et tes compteurs narratifs.',
    phase: 'marche',
    condition: (state) => state.day <= 3 && !state.npcFlags.marcheGuideSeen
  },
  {
    id: 'forge_first',
    title: 'Forge',
    text: 'Répare tes items ici. Plus l\'item est rare, plus c\'est cher. Le pragmatisme réduit les coûts.',
    phase: 'forge',
    condition: (state) => {
      const hasDamagedItem = Object.values(state.equipment).some(item => 
        item && item.durability && item.durability < 100
      )
      return hasDamagedItem && !state.npcFlags.forgeGuideSeen
    }
  },
  {
    id: 'morten_first',
    title: 'Usurier',
    text: 'Rembourse ta dette ici. Les intérêts augmentent chaque jour. Priorise le remboursement.',
    phase: 'morten',
    condition: (state) => state.debt > 100 && !state.npcFlags.mortenGuideSeen
  },
  {
    id: 'crepuscule_first',
    title: 'Crépuscule',
    text: 'C\'est la fin de ta journée. Tu peux avoir des événements du soir et voir ta progression vers les fins.',
    phase: 'crepuscule',
    condition: (state) => state.day === 1
  }
]

interface ContextualGuideProps {
  phase: string
}

export default function ContextualGuide({ phase }: ContextualGuideProps) {
  const [currentGuide, setCurrentGuide] = useState<GuideStep | null>(null)
  const [dismissedGuides, setDismissedGuides] = useState<Set<string>>(new Set())
  const state = useGameStore()
  
  // Réinitialiser les guides dismissés quand on commence une nouvelle partie (jour 1)
  useEffect(() => {
    if (state.day === 1 && state.phase === 'aube') {
      setDismissedGuides(new Set())
      setCurrentGuide(null)
    }
  }, [state.day, state.phase])
  
  useEffect(() => {
    // Ne pas afficher de guides si on n'est pas en jeu (start, origin, etc.)
    if (['start', 'origin', 'tutorial', 'settings', 'hallOfFame'].includes(phase)) {
      setCurrentGuide(null)
      return
    }
    
    // Trouver le guide approprié pour cette phase
    const availableGuide = GUIDE_STEPS.find(guide => {
      if (dismissedGuides.has(guide.id)) return false
      if (guide.phase && guide.phase !== phase) return false
      if (guide.condition && !guide.condition(state)) return false
      return true
    })
    
    if (availableGuide) {
      setCurrentGuide(availableGuide)
    } else {
      setCurrentGuide(null)
    }
  }, [phase, state, dismissedGuides])
  
  if (!currentGuide) return null
  
  const handleDismiss = () => {
    setDismissedGuides(prev => new Set([...prev, currentGuide.id]))
    setCurrentGuide(null)
    
    // Marquer le flag correspondant
    const flagKey = `${currentGuide.id.replace('_first', '')}GuideSeen`
    if (flagKey in state.npcFlags) {
      useGameStore.setState({
        npcFlags: { ...state.npcFlags, [flagKey]: true }
      })
    }
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      background: '#2a2a2a',
      border: '2px solid #4a4',
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '300px',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.5rem'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1rem',
          color: '#ddd',
          marginBottom: '0.5rem'
        }}>
          💡 {currentGuide.title}
        </h3>
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '0',
            marginLeft: '0.5rem'
          }}
        >
          ×
        </button>
      </div>
      <p style={{
        margin: 0,
        fontSize: '0.85rem',
        color: '#aaa',
        lineHeight: '1.5'
      }}>
        {currentGuide.text}
      </p>
    </div>
  )
}
