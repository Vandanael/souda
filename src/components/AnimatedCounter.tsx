/**
 * Compteur avec animation numérique
 */

import { useState, useEffect } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  style?: React.CSSProperties
}

export default function AnimatedCounter({ 
  value, 
  duration = 0.8,
  prefix = '',
  suffix = '',
  style 
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(value)
  
  useEffect(() => {
    const start = display
    const end = value
    const diff = end - start
    const steps = Math.ceil(duration * 60) // 60 FPS
    let currentStep = 0
    
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const eased = 1 - Math.pow(1 - progress, 3) // Ease out cubic
      setDisplay(Math.round(start + diff * eased))
      
      if (currentStep >= steps) {
        setDisplay(end)
        clearInterval(interval)
      }
    }, duration * 1000 / steps)
    
    return () => clearInterval(interval)
  }, [value, duration])
  
  return (
    <span style={style}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
