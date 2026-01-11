import { useGameStore } from '../../store/gameStore';
import { useEffect } from 'react';
import type { LootType } from '../../types';
import { sounds } from '../../utils/sounds';

const TYPE_COLORS: Record<LootType, string> = {
  weapon: 'border-red-500 bg-gradient-to-b from-red-950 to-zinc-900',
  armor: 'border-blue-500 bg-gradient-to-b from-blue-950 to-zinc-900',
  consumable: 'border-green-500 bg-gradient-to-b from-green-950 to-zinc-900',
  skill: 'border-purple-500 bg-gradient-to-b from-purple-950 to-zinc-900',
  treasure: 'border-yellow-500 bg-gradient-to-b from-yellow-950 to-zinc-900',
};

const TYPE_LABELS: Record<LootType, string> = {
  weapon: 'Arme',
  armor: 'Armure',
  consumable: 'Consommable',
  skill: 'Compétence',
  treasure: 'Trésor',
};

export function LootPopup() {
  const currentLoot = useGameStore(state => state.currentLoot);
  const takeLoot = useGameStore(state => state.takeLoot);
  const leaveLoot = useGameStore(state => state.leaveLoot);
  const canCarryMore = useGameStore(state => state.canCarryMore);
  const getCurrentWeight = useGameStore(state => state.getCurrentWeight);
  const maxWeight = useGameStore(state => state.inventory.maxWeight);
  
  useEffect(() => {
    if (currentLoot) sounds.lootFound();
  }, [currentLoot]);
  
  if (!currentLoot) return null;
  
  const currentWeight = getCurrentWeight();
  const canTake = canCarryMore(currentLoot.weight);
  const weightAfter = currentWeight + currentLoot.weight;
  
  const handleTake = () => {
    sounds.lootTake();
    takeLoot();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div 
        className={`
          w-full max-w-sm p-6 rounded-xl border-2 
          ${TYPE_COLORS[currentLoot.type]}
          shadow-2xl
          animate-in zoom-in-95 duration-300
        `}
      >
        {/* Badge type */}
        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 bg-black/30 rounded-full text-xs uppercase tracking-wider">
            {TYPE_LABELS[currentLoot.type]}
          </span>
        </div>
        
        {/* Nom */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white">{currentLoot.name}</h2>
          <p className="text-zinc-400">{currentLoot.weight}kg</p>
        </div>
        
        {/* Stats */}
        {(currentLoot.stats.atk || currentLoot.stats.def || currentLoot.stats.heal) && (
          <div className="flex justify-center gap-6 mb-4 text-lg">
            {currentLoot.stats.atk && (
              <span className="text-red-400 font-bold">
                ATK +{currentLoot.stats.atk}
              </span>
            )}
            {currentLoot.stats.def && (
              <span className="text-blue-400 font-bold">
                DEF +{currentLoot.stats.def}
              </span>
            )}
            {currentLoot.stats.heal && (
              <span className="text-green-400 font-bold">
                +{currentLoot.stats.heal} HP
              </span>
            )}
          </div>
        )}
        
        {/* Description */}
        <p className="text-zinc-300 italic text-center mb-6 text-sm">
          {currentLoot.description}
        </p>
        
        {/* Avertissement poids */}
        {!canTake && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 mb-4 text-center">
            <p className="text-red-400 font-bold">Sac plein</p>
            <p className="text-sm text-red-300">
              {weightAfter.toFixed(1)}kg / {maxWeight}kg
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Jette quelque chose d'abord.
            </p>
          </div>
        )}
        
        {/* Prévisualisation poids */}
        {canTake && (
          <div className="text-sm text-zinc-400 mb-4 text-center">
            Poids après : {weightAfter.toFixed(1)}kg / {maxWeight}kg
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleTake}
            disabled={!canTake}
            className={`
              flex-1 py-4 rounded-lg font-bold text-lg transition-all
              ${canTake 
                ? 'bg-emerald-600 hover:bg-emerald-500 hover:scale-105 active:scale-95' 
                : 'bg-zinc-700 cursor-not-allowed opacity-50'}
            `}
          >
            {canTake ? 'Prendre' : 'Trop lourd'}
          </button>
          <button
            onClick={leaveLoot}
            className="flex-1 py-4 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95"
          >
            Laisser
          </button>
        </div>
      </div>
    </div>
  );
}
