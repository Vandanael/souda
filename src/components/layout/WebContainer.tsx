import { useState, useEffect, ReactNode } from 'react'

interface WebContainerProps {
  children: ReactNode
}

/**
 * Wrapper responsive pour adapter le jeu au Web et Mobile
 * 
 * Sur Web (fenêtre > 500px) :
 * - Affiche un fond sombre
 * - Centre un conteneur de max-width 480px avec ombre
 * 
 * Sur Mobile ou petite fenêtre Web :
 * - Affiche plein écran sans wrapper
 */
export default function WebContainer({ children }: WebContainerProps) {
  const [isWebDesktop, setIsWebDesktop] = useState(() => {
    if (typeof window === 'undefined') return false
    // Détecter si on est sur Web (pas React Native)
    const isWeb = typeof window !== 'undefined' && window.document !== undefined
    // Détecter si la fenêtre est large (> 500px)
    const isWide = window.innerWidth > 500
    return isWeb && isWide
  })

  useEffect(() => {
    const handleResize = () => {
      const isWeb = typeof window !== 'undefined' && window.document !== undefined
      const isWide = window.innerWidth > 500
      setIsWebDesktop(isWeb && isWide)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Si Web Desktop : afficher le wrapper avec fond et conteneur centré
  if (isWebDesktop) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#0a0a0a', // Fond très sombre
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        padding: '1rem'
      }}>
        {/* Conteneur principal centré */}
        <div style={{
          maxWidth: '480px',
          width: '100%',
          height: '100%',
          maxHeight: '100vh',
          background: '#1a1a1a', // Fond du jeu
          borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {children}
        </div>
      </div>
    )
  }

  // Si Mobile ou petite fenêtre : afficher plein écran
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {children}
    </div>
  )
}
