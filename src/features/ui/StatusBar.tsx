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
  
  const hpPercent = (player.hp / maxHp) * 100;
  const isHpCritical = player.hp < 30;
  const isHungerCritical = player.hunger < 1;

  return (
    <div 
      className="card-metal p-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
    >
      {/* HP avec barre */}
      <div className="flex items-center gap-2 min-w-[100px]">
        <span 
          className="text-xs font-semibold uppercase"
          style={{ color: isHpCritical ? 'var(--danger-light)' : 'var(--text-muted)' }}
        >
          HP
        </span>
        <div className="flex-1 flex flex-col gap-0.5">
          <span 
            className={`font-bold tabular-nums text-sm ${isHpCritical ? 'animate-pulse' : ''}`}
            style={{ color: isHpCritical ? 'var(--danger-light)' : 'var(--positive-light)' }}
          >
            {player.hp}/{maxHp}
          </span>
          <div 
            className="h-1 rounded-full overflow-hidden"
            style={{ background: 'var(--bg-void)' }}
          >
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${hpPercent}%`,
                background: isHpCritical ? 'var(--danger-light)' : 'var(--positive)'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Separateur */}
      <div className="h-6 w-px hidden sm:block" style={{ background: '#2a2a2a' }} />
      
      {/* Faim */}
      <div className="flex items-center gap-2">
        <span 
          className="text-xs font-semibold uppercase"
          style={{ color: isHungerCritical ? 'var(--danger-light)' : 'var(--text-muted)' }}
        >
          Faim
        </span>
        <span 
          className={`font-bold tabular-nums text-sm ${isHungerCritical ? 'animate-pulse' : ''}`}
          style={{ color: isHungerCritical ? 'var(--danger-light)' : 'var(--text-primary)' }}
        >
          {player.hunger.toFixed(1)}j
        </span>
      </div>
      
      {/* Separateur */}
      <div className="h-6 w-px hidden sm:block" style={{ background: '#2a2a2a' }} />
      
      {/* Poids */}
      <div className="flex items-center gap-2">
        <span 
          className="text-xs font-semibold uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Poids
        </span>
        <span 
          className="font-bold tabular-nums text-sm"
          style={{ 
            color: weight > maxWeight * 0.9 ? 'var(--danger-light)' : 'var(--text-primary)' 
          }}
        >
          {weight.toFixed(1)}/{maxWeight}
        </span>
      </div>
      
      {/* Separateur */}
      <div className="h-6 w-px hidden sm:block" style={{ background: '#2a2a2a' }} />
      
      {/* Stats combat */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>ATK</span>
          <span className="font-bold text-sm" style={{ color: 'var(--stat-atk)' }}>{atk}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>DEF</span>
          <span className="font-bold text-sm" style={{ color: 'var(--stat-def)' }}>{def}</span>
        </div>
      </div>
      
      {/* Separateur */}
      <div className="h-6 w-px hidden sm:block" style={{ background: '#2a2a2a' }} />
      
      {/* Or */}
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--text-dim)' }}>Or</span>
        <span className="font-bold tabular-nums text-sm" style={{ color: 'var(--copper)' }}>
          {player.gold}
        </span>
      </div>
      
      {/* Karma (compact) */}
      {player.karma !== 0 && (
        <>
          <div className="h-6 w-px hidden sm:block" style={{ background: '#2a2a2a' }} />
          <div className="flex items-center gap-1">
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>K</span>
            <span 
              className="font-bold text-sm tabular-nums"
              style={{ 
                color: player.karma > 0 ? 'var(--positive-light)' : 'var(--danger-light)' 
              }}
            >
              {player.karma > 0 ? '+' : ''}{player.karma}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
