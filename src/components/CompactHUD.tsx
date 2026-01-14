import { useGameStore, calculateDebtProgress } from '../store/gameStore'
import { useIsMobile } from '../hooks/useIsMobile'
import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { BALANCE_CONFIG } from '../config/balance'
import { Item } from '../types/item'
import { colors } from '../design/tokens'

interface CompactHUDProps {
  showActions?: boolean
  showHunger?: boolean
}

export default function CompactHUD({ 
  showActions = false, 
  showHunger = false 
}: CompactHUDProps) {
  const { day, debt, gold, reputation, actionsRemaining, hasEatenToday, equipment, relics } = useGameStore()
  const isMobile = useIsMobile()
  const [pulseDebt, setPulseDebt] = useState(false)
  const [pulseHunger, setPulseHunger] = useState(false)
  
  // Calculer la progression de la dette
  const debtProgress = useMemo(() => calculateDebtProgress(debt, day), [debt, day])
  
  // Vérifier si la dette est critique (> 80% du maximum attendu)
  const maxDebt = 80 + (5 * 19) // 175 max
  const debtPercent = (debt / maxDebt) * 100
  const isDebtCritical = debtPercent > 80
  const TOTAL_DAYS = 20
  const daysRemaining = Math.max(1, TOTAL_DAYS - day + 1)
  const projectedInterest = BALANCE_CONFIG.economy.dailyInterest * Math.max(0, daysRemaining - 1)
  const projectedRent = 2 * Math.max(0, daysRemaining - 1)
  const projectedDebt = debt + projectedInterest + projectedRent
  const targetDay20 = BALANCE_CONFIG.economy.initialDebt + (BALANCE_CONFIG.economy.dailyInterest * (TOTAL_DAYS - 1))
  const netToCover = Math.max(0, projectedDebt - gold)
  const requiredPerDay = Math.max(0, Math.ceil(netToCover / daysRemaining))
  const formattedActions = Number.isInteger(actionsRemaining) ? actionsRemaining : actionsRemaining.toFixed(1)
  const durabilityInfo = useMemo(() => {
    const equipped = Object.values(equipment || {}).filter((i): i is Item => !!i && typeof i === 'object' && 'durability' in i)
    if (equipped.length === 0) return null
    const ratios = equipped
      .filter((i): i is Item & { durability: number; maxDurability: number } => 
        typeof i.durability === 'number' && typeof i.maxDurability === 'number'
      )
      .map(i => (i.durability / i.maxDurability) * 100)
    if (ratios.length === 0) return null
    const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length
    let label = 'État'
    let color = colors.gold.tarnished
    if (avg < 25) { label = 'Brisé'; color = colors.blood.carmine }
    else if (avg < 50) { label = 'Usé'; color = colors.gold.burnt }
    else if (avg < 75) { label = 'Abîmé'; color = colors.gold.bone }
    return { avg: Math.round(avg), label, color }
  }, [equipment])
  
  // Vérifier si la faim est critique (pas mangé aujourd'hui)
  const isHungerCritical = !hasEatenToday
  
  // Déterminer la couleur selon le jour (rouge si proche de la fin)
  const getDayColor = () => {
    if (day >= 15) return colors.blood.carmine // Rouge si jour 15+
    if (day >= 10) return colors.gold.tarnished // Orange si jour 10-14
    return colors.neutral.ivory // Ivoire si jour 1-9
  }
  
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
      background: `linear-gradient(180deg, ${colors.neutral.charcoal} 0%, ${colors.neutral.charcoal}E6 100%)`,
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      borderBottom: `1px solid ${colors.neutral.soot}`,
      padding: isMobile ? '0.4rem 0.5rem' : '0.5rem 0.6rem',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '0.3rem' : '0.4rem',
      minHeight: 'auto'
    }}>
      {/* Ligne 1 : Éléments principaux */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: isMobile ? '0.4rem' : '0.6rem',
        width: '100%',
        flexWrap: 'nowrap',
        overflow: 'hidden'
      }}>
        {/* Jour (gauche) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
          fontWeight: 'bold',
          color: colors.neutral.ivory,
          flexShrink: 0
        }}>
          <span style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.7 }}>J</span>
          <span style={{ 
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            color: getDayColor(),
            lineHeight: 1
          }}>
            {day}
          </span>
          <span style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.5 }}>/20</span>
        </div>
        
        {/* Économie (centre) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '0.5rem' : '0.75rem',
          flex: 1,
          justifyContent: 'center',
          minWidth: 0
        }}>
          {/* Dette avec progression */}
          <motion.div
            animate={pulseDebt ? { 
              scale: [1, 1.1, 1],
              color: [colors.blood.carmine, colors.blood.deep, colors.blood.carmine]
            } : {}}
            transition={{ duration: 0.5, repeat: pulseDebt ? Infinity : 0, repeatDelay: 1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.1rem',
              flexShrink: 0,
              minWidth: isMobile ? '60px' : '70px'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              color: isDebtCritical ? colors.blood.carmine : colors.gold.tarnished,
              fontWeight: isDebtCritical ? 'bold' : 'normal',
              fontSize: isMobile ? '0.7rem' : '0.8rem'
            }}>
              <span style={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}>⚖️</span>
              <span>{debt}</span>
            </div>
            {/* Barre de progression */}
            <div style={{
              width: '100%',
              height: '3px',
              background: colors.neutral.slate,
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${debtProgress.percentage}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  height: '100%',
                  background: debtProgress.status === 'ahead' ? colors.gold.tarnished : 
                             debtProgress.status === 'behind' ? colors.blood.carmine : colors.gold.burnt,
                  borderRadius: '2px'
                }}
              />
            </div>
            <div style={{
              fontSize: isMobile ? '0.55rem' : '0.6rem',
              color: debtProgress.status === 'ahead' ? colors.gold.tarnished : 
                     debtProgress.status === 'behind' ? colors.blood.carmine : colors.neutral.ash,
              opacity: 0.8
            }}>
              {debtProgress.percentage.toFixed(0)}%
            </div>
          </motion.div>
          
          {/* Or */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            color: colors.gold.tarnished,
            fontWeight: 'bold',
            fontSize: isMobile ? '0.7rem' : '0.8rem',
            flexShrink: 0
          }}>
            <span style={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}>💰</span>
            <span>{gold}</span>
          </div>
        </div>
        
        {/* Droite : Réputation et Reliques */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '0.3rem' : '0.4rem',
          flexShrink: 0
        }}>
          {/* Reliques */}
          {relics.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.1rem',
                color: '#4a9eff',
                fontSize: isMobile ? '0.65rem' : '0.75rem',
                fontWeight: 'bold',
                padding: '0.1rem 0.3rem',
                background: 'rgba(74, 158, 255, 0.1)',
                borderRadius: '4px',
                border: '1px solid rgba(74, 158, 255, 0.3)'
              }}
            >
              <span>⚡</span>
              <span>{relics.length}</span>
            </div>
          )}
          
          {/* Réputation */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.1rem',
              color: reputation <= 2 ? colors.blood.carmine : reputation >= 4 ? colors.gold.tarnished : colors.gold.burnt,
              fontSize: isMobile ? '0.65rem' : '0.75rem',
              fontWeight: reputation <= 2 || reputation >= 4 ? 'bold' : 'normal'
            }}
          >
            <span style={{ lineHeight: 1 }}>{'⭐'.repeat(reputation)}</span>
          </div>
        </div>
      </div>
      
      {/* Ligne 2 : Stats secondaires (si nécessaire) */}
      {(showActions || showHunger || durabilityInfo) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: isMobile ? '0.4rem' : '0.6rem',
          width: '100%',
          fontSize: isMobile ? '0.65rem' : '0.7rem',
          flexWrap: 'wrap'
        }}>
          {/* Gauche : Objectif dette (compact) */}
          <div style={{
            display: 'flex',
            gap: isMobile ? '0.4rem' : '0.5rem',
            color: colors.neutral.ash,
            flex: 1,
            minWidth: 0
          }}>
            <span style={{ whiteSpace: 'nowrap' }}>Obj: {targetDay20}💰</span>
            <span style={{ color: '#ca8', whiteSpace: 'nowrap' }}>~{requiredPerDay}💰/j</span>
          </div>
          
          {/* Droite : Stats secondaires */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.4rem' : '0.5rem',
            flexShrink: 0
          }}>
            {/* Faim */}
            {showHunger && (
              <motion.div
                animate={pulseHunger ? { 
                  scale: [1, 1.15, 1],
                  color: [colors.blood.carmine, colors.blood.deep, colors.blood.carmine]
                } : {}}
                transition={{ duration: 0.5, repeat: pulseHunger ? Infinity : 0, repeatDelay: 1 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  color: isHungerCritical ? colors.blood.carmine : colors.neutral.ash,
                  fontWeight: isHungerCritical ? 'bold' : 'normal'
                }}
              >
                <span>🍖</span>
                <span>{hasEatenToday ? '✓' : '✗'}</span>
              </motion.div>
            )}
            
            {/* Actions */}
            {showActions && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                color: actionsRemaining === 0 ? colors.blood.carmine : colors.neutral.ash
              }}>
                <span>⚡</span>
                <span>{formattedActions}</span>
              </div>
            )}
            
            {/* État équipement */}
            {durabilityInfo && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                color: durabilityInfo.color
              }}>
                <span>🧥</span>
                <span>{durabilityInfo.label}</span>
                <span style={{ opacity: 0.7 }}>{durabilityInfo.avg}%</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Si pas de ligne 2, afficher objectif en ligne 1 (version compacte) */}
      {!(showActions || showHunger || durabilityInfo) && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '0.4rem' : '0.5rem',
          fontSize: isMobile ? '0.65rem' : '0.7rem',
          color: '#888',
          width: '100%'
        }}>
          <span>Obj J20: {targetDay20}💰</span>
          <span style={{ color: '#ca8' }}>~{requiredPerDay}💰/j</span>
        </div>
      )}
    </div>
  )
}
