import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { LootCard, LootType } from '../../types';
import { sounds } from '../../utils/sounds';

const TYPE_LABELS: Record<LootType, string> = {
  weapon: 'Arme',
  armor: 'Armure',
  consumable: 'Conso.',
  skill: 'Skill',
  treasure: 'Trésor',
};

const TYPE_COLORS: Record<LootType, string> = {
  weapon: 'text-red-400',
  armor: 'text-blue-400',
  consumable: 'text-green-400',
  skill: 'text-purple-400',
  treasure: 'text-amber-400',
};

const TYPE_BG: Record<LootType, string> = {
  weapon: 'from-red-950 to-zinc-900 border-red-700',
  armor: 'from-blue-950 to-zinc-900 border-blue-700',
  consumable: 'from-green-950 to-zinc-900 border-green-700',
  skill: 'from-purple-950 to-zinc-900 border-purple-700',
  treasure: 'from-amber-950 to-zinc-900 border-amber-700',
};

export function Backpack() {
  const inventory = useGameStore(state => state.inventory);
  const getCurrentWeight = useGameStore(state => state.getCurrentWeight);
  const dropItem = useGameStore(state => state.dropItem);
  const useItem = useGameStore(state => state.useItem);
  const equipItem = useGameStore(state => state.equipItem);
  const screen = useGameStore(state => state.screen);
  
  const [confirmDrop, setConfirmDrop] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ item: LootCard; index: number } | null>(null);
  
  const currentWeight = getCurrentWeight();
  const weightPercent = (currentWeight / inventory.maxWeight) * 100;
  
  const getWeightColor = () => {
    if (weightPercent > 90) return 'bg-red-500';
    if (weightPercent > 70) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };
  
  const handleDrop = (index: number) => {
    if (confirmDrop === index) {
      sounds.lootDrop();
      dropItem(index);
      setConfirmDrop(null);
      setSelectedItem(null);
    } else {
      sounds.click();
      setConfirmDrop(index);
    }
  };
  
  const handleUse = (index: number) => {
    const result = useItem(index);
    if (result.success) {
      sounds.heal();
      setFeedback(result.message);
      setSelectedItem(null);
      setTimeout(() => setFeedback(null), 2000);
    }
  };
  
  const handleEquip = (item: LootCard) => {
    sounds.lootTake();
    equipItem(item);
    setSelectedItem(null);
    setFeedback(`${item.name} équipé !`);
    setTimeout(() => setFeedback(null), 2000);
  };
  
  const canEquip = (item: LootCard) => {
    return item.type === 'weapon' || item.type === 'armor' || item.type === 'skill';
  };

  return (
    <div className="w-full max-w-xs bg-zinc-800/80 backdrop-blur rounded-xl p-4 border border-zinc-700">
      <h3 className="text-lg font-bold mb-3">Inventaire</h3>
      
      {/* Feedback */}
      {feedback && (
        <div className="mb-3 p-2 bg-emerald-900/50 border border-emerald-700 rounded text-sm text-emerald-300 text-center animate-in fade-in">
          {feedback}
        </div>
      )}
      
      {/* Jauge de poids */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-zinc-400 mb-1">
          <span>Poids</span>
          <span className={weightPercent > 90 ? 'text-red-400 font-bold' : ''}>
            {currentWeight.toFixed(1)} / {inventory.maxWeight}kg
          </span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getWeightColor()}`}
            style={{ width: `${Math.min(100, weightPercent)}%` }}
          />
        </div>
        {weightPercent > 100 && (
          <p className="text-red-400 text-xs mt-1 animate-pulse">
            Surchargé ! Impossible de bouger.
          </p>
        )}
      </div>
      
      {/* Équipement */}
      <div className="mb-4 p-3 bg-zinc-900/50 rounded-lg">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Équipé</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-xs w-8">ATK</span>
            <span className="flex-1 truncate">
              {inventory.equipped.weapon?.name || '—'}
            </span>
            {inventory.equipped.weapon && (
              <span className="text-red-400 text-xs">
                +{inventory.equipped.weapon.stats.atk}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-xs w-8">DEF</span>
            <span className="flex-1 truncate">
              {inventory.equipped.armor?.name || '—'}
            </span>
            {inventory.equipped.armor && (
              <span className="text-blue-400 text-xs">
                +{inventory.equipped.armor.stats.def}
              </span>
            )}
          </div>
          {inventory.equipped.skills.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-purple-400 text-xs w-8">SKL</span>
              <span className="flex-1 truncate text-purple-300">
                {inventory.equipped.skills.map(s => s.name).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Liste des items */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {inventory.bag.length === 0 ? (
          <p className="text-zinc-500 italic text-center py-4 text-sm">
            Sac vide
          </p>
        ) : (
          inventory.bag.map((item, index) => (
            <button 
              key={`${item.id}-${index}`}
              onClick={() => setSelectedItem({ item, index })}
              className="w-full flex items-center gap-2 p-2 bg-zinc-700/50 rounded hover:bg-zinc-700 transition-colors text-left"
            >
              <span className={`text-xs font-medium w-12 ${TYPE_COLORS[item.type]}`}>
                {TYPE_LABELS[item.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm">{item.name}</p>
              </div>
              <span className="text-zinc-500 text-xs">{item.weight}kg</span>
            </button>
          ))
        )}
      </div>
      
      {/* Compteur */}
      <div className="mt-3 pt-3 border-t border-zinc-700 text-xs text-zinc-500 text-center">
        {inventory.bag.length} objet{inventory.bag.length > 1 ? 's' : ''} — Clique pour détails
      </div>
      
      {/* Modal détail item */}
      {selectedItem && screen !== 'combat' && (
        <ItemDetailModal
          item={selectedItem.item}
          onClose={() => { setSelectedItem(null); setConfirmDrop(null); }}
          onUse={() => handleUse(selectedItem.index)}
          onEquip={() => handleEquip(selectedItem.item)}
          onDrop={() => handleDrop(selectedItem.index)}
          canEquip={canEquip(selectedItem.item)}
          confirmDrop={confirmDrop === selectedItem.index}
        />
      )}
    </div>
  );
}

// === MODAL DÉTAIL ITEM ===

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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className={`w-full max-w-sm p-5 rounded-xl border-2 bg-gradient-to-b ${TYPE_BG[item.type]} shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-0.5 rounded text-xs uppercase ${TYPE_COLORS[item.type]} bg-black/30`}>
            {TYPE_LABELS[item.type]}
          </span>
          <span className="text-zinc-400 text-xs">{item.weight}kg</span>
        </div>
        
        {/* Nom */}
        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
        
        {/* Stats */}
        {(item.stats.atk || item.stats.def || item.stats.heal || item.stats.hungerRestore) && (
          <div className="flex flex-wrap gap-3 mb-3 text-sm">
            {item.stats.atk && (
              <span className="text-red-400 font-bold">ATK +{item.stats.atk}</span>
            )}
            {item.stats.def && (
              <span className="text-blue-400 font-bold">DEF +{item.stats.def}</span>
            )}
            {item.stats.heal && (
              <span className="text-green-400 font-bold">+{item.stats.heal} HP</span>
            )}
            {item.stats.hungerRestore && (
              <span className="text-yellow-400 font-bold">+{item.stats.hungerRestore}j faim</span>
            )}
          </div>
        )}
        
        {/* Description */}
        <p className="text-zinc-300 text-sm italic mb-4">
          {item.description}
        </p>
        
        {/* Valeur */}
        {item.value && (
          <p className="text-xs text-zinc-500 mb-4">
            Valeur : {item.value} pièces
          </p>
        )}
        
        {/* Actions */}
        <div className="flex gap-2">
          {item.type === 'consumable' && (
            <button
              onClick={onUse}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition-colors"
            >
              Utiliser
            </button>
          )}
          
          {canEquip && (
            <button
              onClick={onEquip}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold transition-colors"
            >
              Équiper
            </button>
          )}
          
          <button
            onClick={onDrop}
            className={`py-2.5 px-4 rounded-lg font-bold transition-colors ${
              confirmDrop 
                ? 'bg-red-600 hover:bg-red-500' 
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            {confirmDrop ? 'Confirmer' : 'Jeter'}
          </button>
        </div>
        
        {/* Fermer */}
        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-zinc-400 hover:text-zinc-300 text-sm transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
