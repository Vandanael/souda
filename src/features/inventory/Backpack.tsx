import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { LootCard, LootType } from '../../types';
import { sounds } from '../../utils/sounds';

const TYPE_LABELS: Record<LootType, string> = {
  weapon: 'Arme',
  armor: 'Armure',
  consumable: 'Conso.',
  skill: 'Skill',
  treasure: 'Tresor',
};

export function Backpack() {
  const inventory = useGameStore(state => state.inventory);
  const getCurrentWeight = useGameStore(state => state.getCurrentWeight);
  const dropItem = useGameStore(state => state.dropItem);
  const useItem = useGameStore(state => state.useItem);
  const equipItem = useGameStore(state => state.equipItem);
  const screen = useGameStore(state => state.screen);
  
  const [selectedItem, setSelectedItem] = useState<{ item: LootCard; index: number } | null>(null);
  const [confirmDrop, setConfirmDrop] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const currentWeight = getCurrentWeight();
  
  const handleDrop = () => {
    if (selectedItem && confirmDrop) {
      sounds.lootDrop();
      dropItem(selectedItem.index);
      setSelectedItem(null);
      setConfirmDrop(false);
    } else {
      setConfirmDrop(true);
    }
  };
  
  const handleUse = () => {
    if (!selectedItem) return;
    const result = useItem(selectedItem.index);
    if (result.success) {
      sounds.heal();
      setFeedback(result.message);
      setSelectedItem(null);
      setTimeout(() => setFeedback(null), 2000);
    }
  };
  
  const handleEquip = () => {
    if (!selectedItem) return;
    sounds.lootTake();
    equipItem(selectedItem.item);
    setFeedback(`${selectedItem.item.name} equipe !`);
    setSelectedItem(null);
    setTimeout(() => setFeedback(null), 2000);
  };
  
  const canEquip = (item: LootCard) => {
    return item.type === 'weapon' || item.type === 'armor' || item.type === 'skill';
  };

  return (
    <div className="w-full">
      {/* Feedback message */}
      {feedback && (
        <div 
          className="mb-2 p-2 text-center text-sm animate-in fade-in rounded"
          style={{ 
            background: 'var(--positive)', 
            color: 'var(--text-primary)',
            border: '1px solid var(--positive-light)'
          }}
        >
          {feedback}
        </div>
      )}
      
      {/* Header compact avec equipement */}
      <div className="card-metal p-2 mb-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {inventory.equipped.weapon && (
              <span style={{ color: 'var(--stat-atk)' }}>
                {inventory.equipped.weapon.name}
              </span>
            )}
            {inventory.equipped.armor && (
              <span style={{ color: 'var(--stat-def)' }}>
                {inventory.equipped.armor.name}
              </span>
            )}
          </div>
          <span style={{ color: 'var(--text-muted)' }}>
            {currentWeight.toFixed(1)}/{inventory.maxWeight}kg
          </span>
        </div>
      </div>
      
      {/* Liste horizontale scrollable */}
      <div 
        className="flex gap-2 overflow-x-auto pb-2"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {inventory.bag.length === 0 ? (
          <div 
            className="flex-1 text-center py-3 text-sm italic"
            style={{ color: 'var(--text-dim)' }}
          >
            Sac vide
          </div>
        ) : (
          inventory.bag.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              onClick={() => setSelectedItem({ item, index })}
              className="flex-shrink-0 card-loot p-2 min-w-[80px] text-center transition-transform active:scale-95"
            >
              <p 
                className="text-[10px] uppercase font-semibold mb-1"
                style={{ color: 'var(--copper)' }}
              >
                {TYPE_LABELS[item.type]}
              </p>
              <p 
                className="text-xs truncate font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.name}
              </p>
              <p 
                className="text-[10px] mt-1"
                style={{ color: 'var(--text-dim)' }}
              >
                {item.weight}kg
              </p>
            </button>
          ))
        )}
      </div>
      
      {/* Compteur */}
      <div 
        className="text-center text-xs mt-1"
        style={{ color: 'var(--text-dim)' }}
      >
        {inventory.bag.length} objet{inventory.bag.length !== 1 ? 's' : ''}
      </div>
      
      {/* Modal detail item */}
      {selectedItem && screen !== 'combat' && (
        <ItemDetailModal
          item={selectedItem.item}
          onClose={() => { setSelectedItem(null); setConfirmDrop(false); }}
          onUse={handleUse}
          onEquip={handleEquip}
          onDrop={handleDrop}
          canEquip={canEquip(selectedItem.item)}
          confirmDrop={confirmDrop}
        />
      )}
    </div>
  );
}

// === MODAL DETAIL ITEM ===

function ItemDetailModal({ 
  item, 
  onClose, 
  onUse, 
  onEquip, 
  onDrop,
  canEquip,
  confirmDrop,
}: {
  item: LootCard;
  onClose: () => void;
  onUse: () => void;
  onEquip: () => void;
  onDrop: () => void;
  canEquip: boolean;
  confirmDrop: boolean;
}) {
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col animate-in fade-in"
      style={{ background: 'rgba(10, 10, 10, 0.95)' }}
      onClick={onClose}
    >
      {/* Contenu centre */}
      <div 
        className="flex-1 flex flex-col items-center justify-center p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Badge */}
        <div className="badge-copper mb-4">
          {TYPE_LABELS[item.type]}
        </div>
        
        {/* Nom */}
        <h3 
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--copper-light)' }}
        >
          {item.name}
        </h3>
        
        {/* Poids */}
        <p 
          className="text-sm mb-4"
          style={{ color: 'var(--text-muted)' }}
        >
          {item.weight}kg
        </p>
        
        {/* Stats */}
        {(item.stats.atk || item.stats.def || item.stats.heal || item.stats.hungerRestore) && (
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {item.stats.atk && (
              <span className="font-bold" style={{ color: 'var(--stat-atk)' }}>
                ATK +{item.stats.atk}
              </span>
            )}
            {item.stats.def && (
              <span className="font-bold" style={{ color: 'var(--stat-def)' }}>
                DEF +{item.stats.def}
              </span>
            )}
            {item.stats.heal && (
              <span className="font-bold" style={{ color: 'var(--positive-light)' }}>
                +{item.stats.heal} HP
              </span>
            )}
            {item.stats.hungerRestore && (
              <span className="font-bold" style={{ color: 'var(--copper)' }}>
                +{item.stats.hungerRestore}j faim
              </span>
            )}
          </div>
        )}
        
        {/* Description */}
        <p 
          className="text-center italic text-sm max-w-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          {item.description}
        </p>
        
        {/* Valeur */}
        {item.value && (
          <p 
            className="text-xs mt-4"
            style={{ color: 'var(--text-dim)' }}
          >
            Valeur : {item.value} pieces
          </p>
        )}
      </div>
      
      {/* Zone du pouce - Actions */}
      <div 
        className="p-4 space-y-3"
        style={{ 
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--bg-dark) 80%, transparent)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Actions principales */}
        <div className="flex gap-3">
          {item.type === 'consumable' && (
            <button onClick={onUse} className="btn-copper flex-1">
              Utiliser
            </button>
          )}
          
          {canEquip && (
            <button onClick={onEquip} className="btn-copper flex-1">
              Equiper
            </button>
          )}
          
          <button
            onClick={onDrop}
            className={confirmDrop ? 'btn-danger flex-1' : 'btn-neutral flex-1'}
          >
            {confirmDrop ? 'Confirmer' : 'Jeter'}
          </button>
        </div>
        
        {/* Fermer */}
        <button
          onClick={onClose}
          className="w-full py-3 text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
