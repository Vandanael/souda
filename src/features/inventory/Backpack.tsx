import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { LootType } from '../../types';

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

export function Backpack() {
  const inventory = useGameStore(state => state.inventory);
  const getCurrentWeight = useGameStore(state => state.getCurrentWeight);
  const dropItem = useGameStore(state => state.dropItem);
  const screen = useGameStore(state => state.screen);
  
  const [confirmDrop, setConfirmDrop] = useState<number | null>(null);
  
  const currentWeight = getCurrentWeight();
  const weightPercent = (currentWeight / inventory.maxWeight) * 100;
  
  // Couleur de la jauge selon le remplissage
  const getWeightColor = () => {
    if (weightPercent > 90) return 'bg-red-500';
    if (weightPercent > 70) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };
  
  const handleDrop = (index: number) => {
    if (confirmDrop === index) {
      dropItem(index);
      setConfirmDrop(null);
    } else {
      setConfirmDrop(index);
    }
  };

  return (
    <div className="w-full max-w-xs bg-zinc-800/80 backdrop-blur rounded-xl p-4 border border-zinc-700">
      <h3 className="text-lg font-bold mb-3">Inventaire</h3>
      
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
            <div 
              key={`${item.id}-${index}`}
              className="flex items-center gap-2 p-2 bg-zinc-700/50 rounded group hover:bg-zinc-700 transition-colors"
            >
              <span className={`text-xs font-medium w-12 ${TYPE_COLORS[item.type]}`}>
                {TYPE_LABELS[item.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm">{item.name}</p>
              </div>
              <span className="text-zinc-500 text-xs">{item.weight}kg</span>
              
              {/* Bouton jeter */}
              {(screen === 'map' || screen === 'hub') && (
                <button
                  onClick={() => handleDrop(index)}
                  className={`
                    px-2 py-1 rounded text-xs transition-all
                    ${confirmDrop === index 
                      ? 'bg-red-600 hover:bg-red-500' 
                      : 'bg-zinc-600 hover:bg-zinc-500 opacity-0 group-hover:opacity-100'}
                  `}
                >
                  {confirmDrop === index ? 'Sûr ?' : 'Jeter'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Compteur */}
      <div className="mt-3 pt-3 border-t border-zinc-700 text-xs text-zinc-500 text-center">
        {inventory.bag.length} objet{inventory.bag.length > 1 ? 's' : ''}
      </div>
    </div>
  );
}
