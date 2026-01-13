import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import CharacterArcIndicator from '../components/CharacterArcIndicator'
import { useScreenShake } from '../hooks/useScreenShake'

export default function MortenScreen() {
  const { debt, gold, repayDebt, closeInventory, setNPCFlag, npcFlags, day, getCharacterArc } = useGameStore()
  const [repayAmount, setRepayAmount] = useState(0)
  // FIX: Audit 3 - États pour animation et feedback après remboursement
  const [debtAnimation, setDebtAnimation] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [lastRepayAmount, setLastRepayAmount] = useState(0)
  const { triggerShake } = useScreenShake()
  
  // Marquer qu'on a visité Morten (pour les objectifs quotidiens)
  useEffect(() => {
    if (!npcFlags.metMorten) {
      setNPCFlag('metMorten', true)
    }
  }, [npcFlags.metMorten, setNPCFlag])
  
  // Calculer la dette initiale (approximative : 80 + (jour - 1) * 5)
  const initialDebt = 80
  const interestPaid = debt - initialDebt
  const totalDebt = debt
  
  const maxRepay = Math.min(gold, debt)
  
  const handleRepay = () => {
    if (repayAmount > 0 && repayAmount <= maxRepay) {
      repayDebt(repayAmount)
      setLastRepayAmount(repayAmount)
      
      // FIX: Audit 3 - Animation de feedback et screen shake
      setDebtAnimation(true)
      setShowConfirmation(true)
      triggerShake(2, 400)
      
      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setDebtAnimation(false)
        setShowConfirmation(false)
        setRepayAmount(0)
        setLastRepayAmount(0)
      }, 2000)
    }
  }
  
  // Obtenir l'arc narratif de Morten
  const mortenArc = getCharacterArc('morten')
  const storyStage = mortenArc?.storyStage || 'menaces'
  const trustLevel = mortenArc?.trustLevel || 0
  
  // Message contextuel de Morten basé sur l'arc narratif
  const getMortenMessage = () => {
    // Si dette payée
    if (debt === 0) {
      return {
        text: '"Tu as payé ta dette. Tu es libre. Mais souviens-toi : je n\'oublie jamais."',
        tone: 'respectful',
        color: '#4a8'
      }
    }
    
    // Utiliser les dialogues de l'arc narratif selon le stage
    const { MORTEN_ARC_CONFIG } = require('../features/narrative/characterArcs')
    const stageDialogues = MORTEN_ARC_CONFIG.dialogues[storyStage as keyof typeof MORTEN_ARC_CONFIG.dialogues] || []
    
    // Sélectionner un dialogue aléatoire basé sur le jour pour la cohérence
    const dialogueIndex = day % stageDialogues.length
    const dialogueText = stageDialogues[dialogueIndex] || stageDialogues[0] || '"Tu me dois de l\'argent."'
    
    // Déterminer le ton selon le stage
    let tone: 'threatening' | 'surprised' | 'neutral' | 'respectful' = 'neutral'
    let color = '#ccc'
    
    if (storyStage === 'menaces') {
      tone = 'threatening'
      color = '#c44'
    } else if (storyStage === 'negociations') {
      tone = trustLevel >= 5 ? 'surprised' : 'neutral'
      color = trustLevel >= 5 ? '#ca8' : '#ccc'
    } else if (storyStage === 'ultimatum') {
      tone = 'threatening'
      color = '#c44'
    } else if (storyStage === 'consequences') {
      tone = 'threatening'
      color = '#8B0000'
    }
    
    return {
      text: `"${dialogueText}"`,
      tone,
      color
    }
  }
  
  const mortenMessage = getMortenMessage()
  const messageColor = mortenMessage.color
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      flex: 1,
      padding: '1rem',
      justifyContent: 'center'
    }}>
      {/* En-tête */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          ÉCHOPPE DE MORTEN
        </div>
        <div style={{
          fontSize: '1rem',
          color: '#aaa'
        }}>
          Or : <span style={{ color: '#ca8', fontWeight: 'bold' }}>{gold}💰</span>
        </div>
      </div>
      
      {/* Dette breakdown */}
      <div style={{
        background: '#2a2a2a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '2px solid #555'
      }}>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          DETTE
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.95rem',
          color: '#ccc'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Dette initiale :</span>
            <span>{initialDebt}💰</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Intérêts :</span>
            <span style={{ color: '#c44' }}>+{interestPaid}💰</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid #555'
          }}>
            <span>Total :</span>
            <span style={{ color: '#c44' }}>{totalDebt}💰</span>
          </div>
        </div>
        
        {/* Message Morten */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#1a1a1a',
          borderRadius: '4px',
          border: `1px solid ${messageColor}`,
          fontSize: '0.95rem',
          color: messageColor,
          fontStyle: 'italic',
          lineHeight: '1.6'
        }}>
          {mortenMessage.text}
        </div>
        
        {/* Indicateur d'arc narratif */}
        <CharacterArcIndicator arc={mortenArc} characterName="Morten" />
      </div>
      
      {/* Remboursement */}
      <div style={{
        background: '#2a2a2a',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '2px solid #555'
      }}>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          REMBOURSER
        </div>
        
        {/* Slider */}
        <div style={{
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            color: '#aaa'
          }}>
            <span>Montant :</span>
            <span style={{ color: '#ca8', fontWeight: 'bold' }}>{repayAmount}💰</span>
          </div>
          <input
            type="range"
            min="0"
            max={maxRepay}
            value={repayAmount}
            onChange={(e) => setRepayAmount(parseInt(e.target.value) || 0)}
            style={{
              width: '100%',
              height: '8px',
              background: '#1a1a1a',
              borderRadius: '4px',
              outline: 'none'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#666',
            marginTop: '0.25rem'
          }}>
            <span>0💰</span>
            <span>{maxRepay}💰</span>
          </div>
        </div>
        
        {/* Boutons rapides */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => setRepayAmount(Math.min(10, maxRepay))}
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
          >
            10💰
          </button>
          <button
            onClick={() => setRepayAmount(Math.min(25, maxRepay))}
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
          >
            25💰
          </button>
          <button
            onClick={() => setRepayAmount(Math.min(50, maxRepay))}
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
          >
            50💰
          </button>
          <button
            onClick={() => setRepayAmount(maxRepay)}
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
          >
            TOUT
          </button>
        </div>
        
        {/* Bouton rembourser */}
        <button
          onClick={handleRepay}
          disabled={repayAmount === 0 || repayAmount > maxRepay}
          style={{
            width: '100%',
            fontSize: '1.1rem',
            padding: '1rem',
            opacity: (repayAmount > 0 && repayAmount <= maxRepay) ? 1 : 0.5,
            cursor: (repayAmount > 0 && repayAmount <= maxRepay) ? 'pointer' : 'not-allowed'
          }}
        >
          REMBOURSER {repayAmount}💰
        </button>
        
        {/* Affichage prévisionnel avant remboursement */}
        {repayAmount > 0 && !showConfirmation && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            fontSize: '0.9rem',
            color: '#aaa',
            textAlign: 'center'
          }}>
            Nouvelle dette : <span style={{ color: '#c44' }}>{debt - repayAmount}💰</span>
            {' | '}
            Or restant : <span style={{ color: '#ca8' }}>{gold - repayAmount}💰</span>
          </div>
        )}
        
        {/* FIX: Audit 3 - Affichage avec animation après remboursement */}
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#1a2a1a',
              borderRadius: '4px',
              border: '2px solid #4a4',
              fontSize: '1rem',
              textAlign: 'center'
            }}
          >
            <motion.div
              animate={debtAnimation ? { 
                scale: [1, 1.1, 1],
                color: ['#c44', '#4a4', '#c44']
              } : {}}
              transition={{ duration: 0.5 }}
              style={{ 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: '#4a4'
              }}
            >
              ✓ Remboursement effectué !
            </motion.div>
            <div style={{ fontSize: '0.95rem', color: '#ccc' }}>
              Nouvelle dette : <motion.span 
                animate={debtAnimation ? { scale: [1, 1.2, 1] } : {}}
                style={{ color: '#c44', fontWeight: 'bold' }}
              >
                {debt}💰
              </motion.span>
              {debtAnimation && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ color: '#4a4', marginLeft: '0.5rem', fontWeight: 'bold' }}
                >
                  -{lastRepayAmount}💰
                </motion.span>
              )}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '0.25rem' }}>
              Or restant : <span style={{ color: '#ca8' }}>{gold}💰</span>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Bouton retour */}
      <button
        onClick={closeInventory}
        style={{
          fontSize: '1rem',
          padding: '1rem',
          width: '100%'
        }}
      >
        RETOUR
      </button>
    </div>
  )
}
