import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'
import { useAudio } from '../features/audio/useAudio'

interface HubDrawerProps {
  isOpen: boolean
  onClose: () => void
  onInventory: () => void
  onMarche: () => void
  onMorten: () => void
  onForge: () => void
  onTaverne: () => void
}

export default function HubDrawer({
  isOpen,
  onClose,
  onInventory,
  onMarche,
  onMorten,
  onForge,
  onTaverne
}: HubDrawerProps) {
  const isMobile = useIsMobile()
  const { playSound, playHaptic } = useAudio()

  const handleAction = (action: () => void) => {
    playSound('ui_open')
    playHaptic('button_press')
    action()
    onClose()
  }

  const menuItems = [
    { label: 'INVENTAIRE', action: onInventory, icon: '💼' },
    { label: 'MARCHÉ', action: onMarche, icon: '🏪' },
    { label: 'USURIER', action: onMorten, icon: '⚖️' },
    { label: 'FORGE', action: onForge, icon: '⚒️' },
    { label: 'TAVERNE', action: onTaverne, icon: '🍺' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 9998,
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)'
            }}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: isMobile ? '280px' : '320px',
              maxWidth: '85vw',
              background: '#1a1a1a',
              borderLeft: '2px solid #444',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #444',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                MENU
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#aaa',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  lineHeight: 1,
                  minHeight: 'auto',
                  minWidth: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#aaa'
                }}
              >
                ×
              </button>
            </div>

            {/* Menu Items */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.5rem'
            }}>
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleAction(item.action)}
                  style={{
                    width: '100%',
                    padding: isMobile ? '1rem' : '1.25rem',
                    marginBottom: '0.5rem',
                    background: '#2a2a2a',
                    border: '2px solid #555',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: isMobile ? '0.95rem' : '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textAlign: 'left',
                    minHeight: isMobile ? '56px' : '60px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#333'
                    e.currentTarget.style.borderColor = '#666'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#2a2a2a'
                    e.currentTarget.style.borderColor = '#555'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
