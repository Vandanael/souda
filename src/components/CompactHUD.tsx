import { useGameStore } from '../store/gameStore'
import { useIsMobile } from '../hooks/useIsMobile'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface CompactHUDProps {
  showActions?: boolean
  showHunger?: boolean
}

export default function CompactHUD({ 
  showActions = false, 
  showHunger = false 
}: CompactHUDProps) {
  const { day, debt, gold, reputation, actionsRemaining, hasEatenToday } = useGameStore()
  const isMobile = useIsMobile()
  const [pulseDebt, setPulseDebt] = useState(false)
  const [pulseHunger, setPulseHunger] = useState(false)
  
  // Calculer jours restants
  const daysRemaining = 20 - day
  
  // Vérifier si la dette est critique (> 80% du maximum attendu)
  const maxDebt = 80 + (5 * 19) // 175 max
  const debtPercent = (debt / maxDebt) * 100
  const isDebtCritical = debtPercent > 80
  
  // Vérifier si la faim est critique (pas mangé aujourd'hui)
  const isHungerCritical = !hasEatenToday
  
  // Animation pulse pour dette critique
  useEffect(() => {
    if (isDebtCritical) {
      setPulseDebt(true)
      const timer = setTimeout(() => setPulseDebt(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isDebtCritical, debt])
  
  // Animation pulse pour faim critique
  useEffect(() => {
    if (isHungerCritical && showHunger) {
      setPulseHunger(true)
      const timer = setTimeout(() => setPulseHunger(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isHungerCritical, showHunger])
  
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      padding: isMobile ? '0.5rem' : '0.6rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '0.5rem',
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      minHeight: isMobile ? '40px' : '44px',
      maxHeight: isMobile ? '60px' : '64px'
    }}>
      {/* Colonne gauche : Jour restant (priorité haute) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        fontWeight: 'bold',
        color: '#fff'
      }}>
        <span style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', opacity: 0.7 }}>J</span>
        <span style={{ 
          fontSize: isMobile ? '0.9rem' : '1rem',
          color: daysRemaining <= 5 ? '#c44' : daysRemaining <= 10 ? '#ca8' : '#fff'
        }}>
          {daysRemaining}
        </span>
        <span style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', opacity: 0.5 }}>/20</span>
      </div>
      
      {/* Colonne centre : Économie (priorité haute) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '0.75rem' : '1rem'
      }}>
        {/* Dette */}
        <motion.div
          animate={pulseDebt ? { 
            scale: [1, 1.1, 1],
            color: ['#c44', '#f44', '#c44']
          } : {}}
          transition={{ duration: 0.5, repeat: pulseDebt ? Infinity : 0, repeatDelay: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: isDebtCritical ? '#c44' : '#ca8',
            fontWeight: isDebtCritical ? 'bold' : 'normal'
          }}
        >
          <span style={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}>💀</span>
          <span>{debt}</span>
        </motion.div>
        
        {/* Or */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          color: '#ca8',
          fontWeight: 'bold'
        }}>
          <span style={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}>💰</span>
          <span>{gold}</span>
        </div>
      </div>
      
      {/* Colonne droite : Stats secondaires (discrets) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '0.5rem' : '0.75rem'
      }}>
        {/* Faim (discret sauf si critique) */}
        {showHunger && (
          <motion.div
            animate={pulseHunger ? { 
              scale: [1, 1.15, 1],
              color: ['#c44', '#f44', '#c44']
            } : {}}
            transition={{ duration: 0.5, repeat: pulseHunger ? Infinity : 0, repeatDelay: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: isHungerCritical ? '#c44' : '#666',
              fontSize: isMobile ? '0.7rem' : '0.75rem',
              fontWeight: isHungerCritical ? 'bold' : 'normal'
            }}
            title={isHungerCritical ? 'Tu as faim !' : 'Rassasié'}
          >
            <span>🍖</span>
            <span>{hasEatenToday ? '✓' : '✗'}</span>
          </motion.div>
        )}
        
        {/* Actions restantes */}
        {showActions && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: actionsRemaining === 0 ? '#c44' : '#888',
            fontSize: isMobile ? '0.7rem' : '0.75rem'
          }}>
            <span>⚡</span>
            <span>{actionsRemaining}</span>
          </div>
        )}
        
        {/* Réputation (discret) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.15rem',
          color: '#666',
          fontSize: isMobile ? '0.65rem' : '0.7rem'
        }}>
          <span>{'⭐'.repeat(reputation)}</span>
        </div>
      </div>
    </div>
  )
}
