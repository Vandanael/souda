import { useGameStore } from '../../store/gameStore';

export function StatusBar() {
  const player = useGameStore(state => state.player);
  const getCurrentWeight = useGameStore(state => state.getCurrentWeight);
  const maxWeight = useGameStore(state => state.inventory.maxWeight);
  const getPlayerAtk = useGameStore(state => state.getPlayerAtk);
  const getPlayerDef = useGameStore(state => state.getPlayerDef);
  const getPlayerMaxHp = useGameStore(state => state.getPlayerMaxHp);
  
  const weight = getCurrentWeight();
  const atk = getPlayerAtk();
  const def = getPlayerDef();
  const maxHp = getPlayerMaxHp();
  
  // Calculs de pourcentages
  const hpPercent = (player.hp / maxHp) * 100;
  const weightPercent = (weight / maxWeight) * 100;
  
  // États critiques
  const isHpLow = player.hp < 30;
  const isHpMedium = player.hp < 60 && player.hp >= 30;
  const isHungerLow = player.hunger < 1;
  const isHungerMedium = player.hunger < 2 && player.hunger >= 1;
  const isOverweight = weightPercent > 90;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-zinc-800/80 backdrop-blur rounded-xl border border-zinc-700">
      {/* HP */}
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium ${isHpLow ? 'text-red-400' : isHpMedium ? 'text-yellow-400' : 'text-zinc-400'}`}>
          HP
        </span>
        <div className="flex flex-col">
          <span className={`font-bold tabular-nums ${isHpLow ? 'text-red-400 animate-pulse' : isHpMedium ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {player.hp}/{maxHp}
          </span>
          <div className="w-20 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${isHpLow ? 'bg-red-500' : isHpMedium ? 'bg-yellow-500' : 'bg-emerald-500'}`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Séparateur */}
      <div className="h-8 w-px bg-zinc-700" />
      
      {/* Faim */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${isHungerLow ? 'text-red-400' : isHungerMedium ? 'text-yellow-400' : 'text-zinc-400'}`}>
          Faim
        </span>
        <span className={`font-bold tabular-nums ${isHungerLow ? 'text-red-400 animate-pulse' : isHungerMedium ? 'text-yellow-400' : 'text-zinc-300'}`}>
          {player.hunger.toFixed(1)}j
        </span>
      </div>
      
      {/* Séparateur */}
      <div className="h-8 w-px bg-zinc-700" />
      
      {/* Poids */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${isOverweight ? 'text-red-400' : 'text-zinc-400'}`}>
          Poids
        </span>
        <span className={`font-bold tabular-nums ${isOverweight ? 'text-red-400 animate-pulse' : weightPercent > 70 ? 'text-yellow-400' : 'text-zinc-300'}`}>
          {weight.toFixed(1)}/{maxWeight}kg
        </span>
      </div>
      
      {/* Séparateur */}
      <div className="h-8 w-px bg-zinc-700" />
      
      {/* Stats combat */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-sm text-zinc-400">ATK</span>
          <span className="text-red-400 font-bold">{atk}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-zinc-400">DEF</span>
          <span className="text-blue-400 font-bold">{def}</span>
        </div>
      </div>
      
      {/* Séparateur */}
      <div className="h-8 w-px bg-zinc-700" />
      
      {/* Or */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">Or</span>
        <span className="font-bold text-amber-400 tabular-nums">{player.gold}</span>
      </div>
      
      {/* Séparateur */}
      <div className="h-8 w-px bg-zinc-700" />
      
      {/* Karma */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">Karma</span>
        <span className={`font-bold tabular-nums ${
          player.karma > 20 ? 'text-emerald-400' : 
          player.karma < -20 ? 'text-red-400' : 
          'text-zinc-400'
        }`}>
          {player.karma > 0 ? '+' : ''}{player.karma}
        </span>
      </div>
    </div>
  );
}
