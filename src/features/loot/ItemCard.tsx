import { Item, getRarityName, getRarityColor } from '../../types/item'
import DurabilityBar from '../durability/DurabilityBar'

interface ItemCardProps {
  item: Item
  showBack?: boolean
}

const SLOT_ICONS: Record<string, string> = {
  head: '⛑️',
  torso: '🛡️',
  legs: '👢',
  hands: '🧤',
  weapon: '⚔️',
  offhand: '🛡️',
  accessory: '🧣'
}

const PROPERTY_LABELS: Record<string, string> = {
  light: 'Léger',
  heavy: 'Lourd',
  rusty: 'Rouillé',
  bloody: 'Ensanglanté',
  blessed: 'Béni',
  stolen: 'Volé',
  solid: 'Solide'
}

export default function ItemCard({ item, showBack = false }: ItemCardProps) {
  const rarityColor = getRarityColor(item.rarity)
  
  if (showBack) {
    // Face verso de la carte
    return (
      <div style={{
        width: '200px',
        height: '280px',
        background: '#333',
        border: '3px solid #555',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Pattern de dos de carte */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'repeating-linear-gradient(45deg, #2a2a2a, #2a2a2a 10px, #333 10px, #333 20px)',
          opacity: 0.3
        }} />
        <div style={{
          fontSize: '3rem',
          color: '#555',
          zIndex: 1
        }}>
          ?
        </div>
      </div>
    )
  }
  
  // Face recto avec item
  return (
    <div style={{
      width: '200px',
      height: '280px',
      background: '#2a2a2a',
      border: `3px solid ${rarityColor}`,
      borderRadius: '12px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Bordure de rareté */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: rarityColor
      }} />
      
      {/* Icône rareté */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        fontSize: '1.2rem',
        color: rarityColor
      }}>
        {item.rarity === 'common' ? '●' : item.rarity === 'uncommon' ? '■' : item.rarity === 'rare' ? '◆' : '★'}
      </div>
      
      {/* Nom */}
      <div style={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: item.cursed ? '#c44' : rarityColor,
        marginTop: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {item.name}
        {item.cursed && (
          <span style={{
            fontSize: '0.7rem',
            padding: '0.2rem 0.4rem',
            background: '#c44',
            color: '#fff',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            COMPROMIS
          </span>
        )}
      </div>
      
      {/* Rareté */}
      <div style={{
        fontSize: '0.75rem',
        color: '#999',
        textTransform: 'uppercase'
      }}>
        {getRarityName(item.rarity)}
      </div>
      
      {/* Effet compromis - Amélioré */}
      {item.cursed && (
        <div style={{
          fontSize: '0.7rem',
          color: '#c44',
          padding: '0.75rem',
          background: '#2a1a1a',
          borderRadius: '4px',
          border: '2px solid #c44',
          marginTop: '0.5rem'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            ⚠️ ITEM COMPROMIS
          </div>
          {item.curseDescription && (
            <div style={{ marginBottom: '0.5rem', fontSize: '0.7rem', color: '#a88', lineHeight: '1.4' }}>
              {item.curseDescription}
            </div>
          )}
          {item.curseEffect && (
            <div style={{ marginBottom: '0.5rem', fontSize: '0.7rem', color: '#f44', fontWeight: 'bold' }}>
              Effet : {item.curseEffect}
            </div>
          )}
          {(item.hiddenMalus || item.visibleMalus) && (
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #c44' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.7rem' }}>Malus appliqués :</div>
              {item.visibleMalus && (
                <div style={{ fontSize: '0.65rem' }}>
                  {item.visibleMalus.atk && <div style={{ color: '#f44' }}>• ATK: -{item.visibleMalus.atk}</div>}
                  {item.visibleMalus.def && <div style={{ color: '#f44' }}>• DEF: -{item.visibleMalus.def}</div>}
                  {item.visibleMalus.vit && <div style={{ color: '#f44' }}>• VIT: -{item.visibleMalus.vit}</div>}
                </div>
              )}
              {item.hiddenMalus && (
                <div style={{ fontSize: '0.65rem', marginTop: '0.25rem', color: '#a88', fontStyle: 'italic' }}>
                  {item.hiddenMalus.atk && <div>• ATK: -{item.hiddenMalus.atk} (malus caché, appliqué automatiquement)</div>}
                  {item.hiddenMalus.def && <div>• DEF: -{item.hiddenMalus.def} (malus caché, appliqué automatiquement)</div>}
                  {item.hiddenMalus.vit && <div>• VIT: -{item.hiddenMalus.vit} (malus caché, appliqué automatiquement)</div>}
                </div>
              )}
            </div>
          )}
          <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #c44', fontSize: '0.65rem', color: '#888', fontStyle: 'italic' }}>
            💡 Les items compromis ont des défauts (lourdeur, réputation, etc.). Les malus sont appliqués même si non visibles.
          </div>
        </div>
      )}
      
      {/* Slot avec icône */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        color: '#ccc'
      }}>
        <span>{SLOT_ICONS[item.slot] || '📦'}</span>
        <span style={{ textTransform: 'capitalize' }}>{item.slot}</span>
      </div>
      
      {/* Stats */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        fontSize: '0.85rem',
        color: '#aaa',
        marginTop: '0.5rem'
      }}>
        {item.stats.atk > 0 && (
          <div>Attaque : <span style={{ color: '#fff' }}>+{item.stats.atk}</span></div>
        )}
        {item.stats.def > 0 && (
          <div>Défense : <span style={{ color: '#fff' }}>+{item.stats.def}</span></div>
        )}
        {item.stats.vit > 0 && (
          <div>Vitesse : <span style={{ color: '#fff' }}>+{item.stats.vit}</span></div>
        )}
      </div>
      
      {/* Propriétés spéciales */}
      {item.properties.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25rem',
          marginTop: '0.5rem'
        }}>
          {item.properties.map((prop, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.7rem',
                padding: '0.2rem 0.4rem',
                background: '#1a1a1a',
                border: `1px solid ${rarityColor}`,
                borderRadius: '4px',
                color: rarityColor
              }}
            >
              {PROPERTY_LABELS[prop] || prop}
            </div>
          ))}
        </div>
      )}
      
      {/* Durabilité */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '0.5rem'
      }}>
        <DurabilityBar item={item} size="small" />
      </div>
      
      {/* Description (petite) */}
      <div style={{
        fontSize: '0.7rem',
        color: '#777',
        fontStyle: 'italic',
        marginTop: '0.5rem',
        lineHeight: '1.3',
        maxHeight: '2.6rem',
        overflow: 'hidden'
      }}>
        {item.description}
      </div>
    </div>
  )
}
