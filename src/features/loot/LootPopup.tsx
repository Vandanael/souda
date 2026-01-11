import { useGameStore } from '../../store/gameStore';
import { useEffect } from 'react';
import type { LootType } from '../../types';
import { sounds } from '../../utils/sounds';

const TYPE_LABELS: Record<LootType, string> = {
  weapon: 'Arme',
  armor: 'Armure',
  consumable: 'Consommable',
  skill: 'Competence',
  treasure: 'Tresor',
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
    <div 
      className="fixed inset-0 z-50 flex flex-col animate-in fade-in duration-200"
      style={{ background: 'rgba(10, 10, 10, 0.95)' }}
    >
      {/* Contenu centre */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Badge type */}
        <div 
          className="badge-copper mb-4"
        >
          {TYPE_LABELS[currentLoot.type]}
        </div>
        
        {/* Nom */}
        <h2 
          className="text-2xl sm:text-3xl font-bold text-center mb-2"
          style={{ color: 'var(--copper-light)' }}
        >
          {currentLoot.name}
        </h2>
        
        {/* Poids */}
        <p 
          className="text-sm mb-6"
          style={{ color: 'var(--text-muted)' }}
        >
          {currentLoot.weight} kg
        </p>
        
        {/* Stats */}
        {(currentLoot.stats.atk || currentLoot.stats.def || currentLoot.stats.heal || currentLoot.stats.hungerRestore) && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {currentLoot.stats.atk && (
              <span 
                className="font-bold text-lg"
                style={{ color: 'var(--stat-atk)' }}
              >
                ATK +{currentLoot.stats.atk}
              </span>
            )}
            {currentLoot.stats.def && (
              <span 
                className="font-bold text-lg"
                style={{ color: 'var(--stat-def)' }}
              >
                DEF +{currentLoot.stats.def}
              </span>
            )}
            {currentLoot.stats.heal && (
              <span 
                className="font-bold text-lg"
                style={{ color: 'var(--positive-light)' }}
              >
                +{currentLoot.stats.heal} HP
              </span>
            )}
            {currentLoot.stats.hungerRestore && (
              <span 
                className="font-bold text-lg"
                style={{ color: 'var(--copper)' }}
              >
                +{currentLoot.stats.hungerRestore}j faim
              </span>
            )}
          </div>
        )}
        
        {/* Description */}
        <p 
          className="text-center italic max-w-sm mb-6"
          style={{ color: 'var(--text-muted)' }}
        >
          {currentLoot.description}
        </p>
        
        {/* Avertissement poids */}
        {!canTake && (
          <div 
            className="card-metal p-4 mb-4 text-center max-w-sm"
            style={{ borderColor: 'var(--danger-light)' }}
          >
            <p 
              className="font-bold mb-1"
              style={{ color: 'var(--danger-light)' }}
            >
              Sac plein
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {weightAfter.toFixed(1)}kg / {maxWeight}kg
            </p>
          </div>
        )}
        
        {/* Previsualisation poids */}
        {canTake && (
          <p 
            className="text-sm mb-4"
            style={{ color: 'var(--text-dim)' }}
          >
            Apres : {weightAfter.toFixed(1)}kg / {maxWeight}kg
          </p>
        )}
      </div>
      
      {/* Zone du pouce - Boutons en bas */}
      <div 
        className="p-4 flex gap-3"
        style={{ 
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--bg-dark) 80%, transparent)'
        }}
      >
        <button
          onClick={handleTake}
          disabled={!canTake}
          className={canTake ? 'btn-copper flex-1' : 'btn-neutral flex-1'}
          style={!canTake ? { opacity: 0.4 } : undefined}
        >
          {canTake ? 'Prendre' : 'Trop lourd'}
        </button>
        <button
          onClick={leaveLoot}
          className="btn-neutral flex-1"
        >
          Laisser
        </button>
      </div>
    </div>
  );
}
