import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { NPC_POOL, type NPC, type DialogueLine } from '../types/npc'
import NarrativeText from '../components/NarrativeText'
import { useIsMobile } from '../hooks/useIsMobile'

export default function TaverneScreen() {
  const {
    day,
    gold,
    npcFlags,
    rumors,
    hasEatenToday,
    setNPCFlag,
    generateRumors,
    buyMeal,
    closeInventory
  } = useGameStore()
  const isMobile = useIsMobile()
  
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null)
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine[]>([])
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [showRumorTutorial, setShowRumorTutorial] = useState(false)
  
  // Générer les rumeurs si nécessaire
  useEffect(() => {
    const todayRumors = rumors.filter(r => r.day === day)
    if (todayRumors.length === 0) {
      generateRumors()
    }
    // Afficher tutorial rumeurs au premier affichage
    if (todayRumors.length > 0 && !npcFlags.firstRumorSeen) {
      setShowRumorTutorial(true)
      useGameStore.setState({
        npcFlags: { ...npcFlags, firstRumorSeen: true }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, rumors]) // Ne dépendre que du jour pour éviter les re-générations multiples
  
  // Filtrer les PNJ disponibles
  const availableNPCs = NPC_POOL.filter(npc => npc.available(day, npcFlags))
  
  const handleNPCClick = (npc: NPC) => {
    setSelectedNPC(npc)
    const dialogueId = npcFlags[`met${npc.id.charAt(0).toUpperCase() + npc.id.slice(1)}`] 
      ? npc.firstVisitDialogue || 'intro'
      : npc.firstVisitDialogue || 'intro'
    
    const dialogue = npc.dialogues[dialogueId] || []
    setCurrentDialogue(dialogue)
    setDialogueIndex(0)
    
    // Marquer comme rencontré
    if (!npcFlags[`met${npc.id.charAt(0).toUpperCase() + npc.id.slice(1)}`]) {
      setNPCFlag(`met${npc.id.charAt(0).toUpperCase() + npc.id.slice(1)}`, true)
    }
  }
  
  const handleDialogueChoice = (choice: { nextDialogueId?: string; flag?: string; action?: () => void }) => {
    if (choice.flag) {
      setNPCFlag(choice.flag, true)
    }
    
    if (choice.action) {
      choice.action()
    }
    
    if (choice.nextDialogueId && selectedNPC) {
      const nextDialogue = selectedNPC.dialogues[choice.nextDialogueId] || []
      setCurrentDialogue(nextDialogue)
      setDialogueIndex(0)
    } else {
      // Fin du dialogue
      setSelectedNPC(null)
      setCurrentDialogue([])
      setDialogueIndex(0)
    }
  }
  
  const currentLine = currentDialogue[dialogueIndex]
  const todayRumors = rumors.filter(r => r.day === day)
  
  return (
    <>
      {/* Modal tutorial rumeurs */}
      {showRumorTutorial && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: '#2a2a2a',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            border: '2px solid #555'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#ddd' }}>Les Rumeurs</h2>
            <p style={{ color: '#aaa', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Les rumeurs t'aident à planifier tes explorations. Elles apparaissent avec une icône sur les lieux de la carte.
            </p>
            <div style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: '#1a1a1a', borderRadius: '4px' }}>
                <strong style={{ color: '#ddd' }}>⚔️ Combat</strong> : Plus de combats dans ce lieu
              </div>
              <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: '#1a1a1a', borderRadius: '4px' }}>
                <strong style={{ color: '#ddd' }}>💰 Trésor</strong> : Plus de loot et items meilleurs
              </div>
              <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: '#1a1a1a', borderRadius: '4px' }}>
                <strong style={{ color: '#ddd' }}>⚠️ Événement</strong> : Plus d'événements narratifs
              </div>
              <div style={{ padding: '0.75rem', background: '#1a1a1a', borderRadius: '4px' }}>
                <strong style={{ color: '#ddd' }}>📍 Lieu</strong> : Pointe un lieu à explorer
              </div>
            </div>
            <button
              onClick={() => setShowRumorTutorial(false)}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                background: '#4a4',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              Compris
            </button>
          </div>
        </div>
      )}
      
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      flex: 1,
      padding: '1rem',
      overflowY: 'auto'
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
          TAVERNE DU PENDU
        </div>
        <div style={{
          fontSize: '1rem',
          color: '#aaa'
        }}>
          Or : <span style={{ color: '#ca8', fontWeight: 'bold' }}>{gold}💰</span>
        </div>
      </div>
      
      {/* Ambiance */}
      <div style={{
        background: '#2a2a2a',
        padding: '1rem',
        borderRadius: '8px',
        border: '2px solid #555'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: '#aaa',
          fontStyle: 'italic',
          lineHeight: '1.6'
        }}>
          "La fumée de pipe, l'odeur de bière rance, les murmures. Ici, on parle, on écoute, on oublie."
        </div>
      </div>
      
      {/* Rumeurs */}
      {todayRumors.length > 0 && (
        <div style={{
          background: '#2a2a2a',
          padding: '1rem',
          borderRadius: '8px',
          border: '2px solid #555'
        }}>
          <div style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginBottom: '0.75rem'
          }}>
            RUMEURS
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {todayRumors.map((rumor) => {
              // Icône selon le type de rumeur
              const rumorIcon = rumor.hintType === 'combat' ? '⚔️' :
                               rumor.hintType === 'loot' ? '💰' :
                               rumor.hintType === 'event' ? '⚠️' :
                               rumor.hintType === 'location' ? '📍' : '💬'
              
              // Description de l'effet
              const effectDescription = rumor.hintType === 'combat' ? 'Augmente les chances de combat' :
                                       rumor.hintType === 'loot' ? 'Augmente les chances de trésor' :
                                       rumor.hintType === 'event' ? 'Peut déclencher un événement' :
                                       rumor.hintType === 'location' ? 'Cible un lieu spécifique' : ''
              
              return (
                <div
                  key={rumor.id}
                  style={{
                    padding: '0.75rem',
                    background: '#1a1a1a',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    color: '#ccc',
                    fontStyle: 'italic',
                    lineHeight: '1.6',
                    border: '1px solid #333',
                    position: 'relative'
                  }}
                  title={effectDescription}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{rumorIcon}</span>
                    <div style={{ flex: 1 }}>
                      <div>"{rumor.text}"</div>
                      {effectDescription && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#888',
                          marginTop: '0.25rem',
                          fontStyle: 'normal'
                        }}>
                          {effectDescription}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* PNJ */}
      <div style={{
        background: '#2a2a2a',
        padding: '1rem',
        borderRadius: '8px',
        border: '2px solid #555'
      }}>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '0.75rem'
        }}>
          PRÉSENTS ({availableNPCs.length})
        </div>
        
        {availableNPCs.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
            La taverne est vide
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {availableNPCs.map((npc) => (
              <div
                key={npc.id}
                onClick={() => handleNPCClick(npc)}
                style={{
                  padding: '0.75rem',
                  background: '#1a1a1a',
                  borderRadius: '4px',
                  border: '1px solid #555',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#222'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1a1a1a'
                }}
              >
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#ddd',
                  marginBottom: '0.25rem'
                }}>
                  {npc.name}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#888'
                }}>
                  {npc.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Services */}
      <div style={{
        background: '#2a2a2a',
        padding: '1rem',
        borderRadius: '8px',
        border: '2px solid #555'
      }}>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '0.75rem'
        }}>
          SERVICES
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{
            padding: '0.75rem',
            background: '#1a1a1a',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.95rem', color: '#ccc' }}>
                Logement (2💰/nuit)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>
                Déduit automatiquement au crépuscule
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              const success = buyMeal()
              if (success) {
                // Le state sera mis à jour automatiquement
              }
            }}
            disabled={hasEatenToday || gold < 4}
            style={{
              padding: '0.75rem',
              background: hasEatenToday || gold < 4 ? '#1a1a1a' : '#2a2a2a',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #555',
              cursor: hasEatenToday || gold < 4 ? 'not-allowed' : 'pointer',
              opacity: hasEatenToday || gold < 4 ? 0.6 : 1,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!hasEatenToday && gold >= 4) {
                e.currentTarget.style.background = '#333'
              }
            }}
            onMouseLeave={(e) => {
              if (!hasEatenToday && gold >= 4) {
                e.currentTarget.style.background = '#2a2a2a'
              }
            }}
          >
            <div>
              <div style={{ 
                fontSize: '0.95rem', 
                color: hasEatenToday || gold < 4 ? '#888' : '#ccc',
                textAlign: 'left'
              }}>
                Repas (4💰)
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: hasEatenToday ? '#ca8' : gold < 4 ? '#666' : '#888',
                textAlign: 'left'
              }}>
                {hasEatenToday 
                  ? '✓ Déjà mangé aujourd\'hui' 
                  : gold < 4 
                    ? 'Or insuffisant' 
                    : 'Restaure ton moral (+1 humanité)'}
              </div>
            </div>
          </button>
        </div>
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
      
      {/* Modale dialogue */}
      {selectedNPC && currentLine && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#2a2a2a',
            padding: '2rem',
            borderRadius: '8px',
            border: '2px solid #555',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#ca8'
            }}>
              {selectedNPC.name}
            </div>
            
            <NarrativeText
              text={currentLine.text}
              speed={30}
              style={{
                fontSize: isMobile ? '1.05rem' : '1rem',
                color: '#ddd',
                marginBottom: '1.5rem',
                fontStyle: currentLine.speaker === 'npc' ? 'italic' : 'normal'
              }}
            />
            
            {currentLine.choices && currentLine.choices.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {currentLine.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleDialogueChoice(choice)}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      fontSize: '0.95rem'
                    }}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (dialogueIndex < currentDialogue.length - 1) {
                    setDialogueIndex(dialogueIndex + 1)
                  } else {
                    setSelectedNPC(null)
                    setCurrentDialogue([])
                    setDialogueIndex(0)
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem'
                }}
              >
                {dialogueIndex < currentDialogue.length - 1 ? 'SUIVANT' : 'FERMER'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  )
}
