import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { sounds } from '../../utils/sounds';

export function CombatScreen() {
  const combat = useGameStore(state => state.combat);
  const player = useGameStore(state => state.player);
  const performCombat = useGameStore(state => state.performCombat);
  const tryFlee = useGameStore(state => state.tryFlee);
  const tryTalk = useGameStore(state => state.tryTalk);
  const getPlayerAtk = useGameStore(state => state.getPlayerAtk);
  const getPlayerDef = useGameStore(state => state.getPlayerDef);
  
  const [result, setResult] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  
  const { enemy, enemyHp } = combat;
  
  useEffect(() => {
    if (enemy && combat.isActive) sounds.combatStart();
  }, [enemy, combat.isActive]);
  
  if (!enemy || !combat.isActive) return null;
  
  const playerAtk = getPlayerAtk();
  const playerDef = getPlayerDef();
  
  // Estimation
  const damageToEnemy = Math.max(1, playerAtk - enemy.def);
  const damageToPlayer = Math.max(1, enemy.atk - playerDef);
  const turnsToKill = Math.ceil(enemyHp / damageToEnemy);
  const estimatedDamage = turnsToKill * damageToPlayer;
  const isDangerous = estimatedDamage > player.hp;
  
  // Chances RP
  const getRpChance = () => {
    const chances: Record<string, number> = {
      wolf: 0, wolf_pack_alpha: 0,
      bandit: 0.4, mercenary: 0.3, deserter: 0.5, patrol_chief: 0.1,
    };
    return chances[enemy.id] ?? 0.2;
  };
  
  const rpChance = getRpChance();
  const canTalk = rpChance > 0;
  
  const handleAttack = async () => {
    setIsResolving(true);
    sounds.attack();
    const res = performCombat();
    
    if (res.victory) {
      sounds.victory();
      setResult(`Victoire ! ${enemy.name} est vaincu.`);
    } else if (res.died) {
      sounds.defeat();
      setResult('Tu es tombe au combat...');
    }
    
    setTimeout(() => {
      setResult(null);
      setIsResolving(false);
    }, 1500);
  };
  
  const handleFlee = () => {
    setIsResolving(true);
    sounds.flee();
    const res = tryFlee();
    
    if (res.fled) {
      setResult('Tu fuis le combat !');
    } else {
      sounds.error();
      setResult(`Fuite echouee ! -${res.damageTaken} HP`);
    }
    
    setTimeout(() => {
      setResult(null);
      setIsResolving(false);
    }, 1500);
  };
  
  const handleTalk = () => {
    setIsResolving(true);
    const res = tryTalk();
    setResult(res.message);
    setTimeout(() => {
      setResult(null);
      setIsResolving(false);
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'linear-gradient(180deg, var(--danger) 0%, var(--bg-dark) 100%)' }}
    >
      {/* Header */}
      <div className="safe-top px-4 py-3 text-center">
        <h2 
          className="text-xl font-bold tracking-wider uppercase"
          style={{ color: 'var(--danger-light)' }}
        >
          Rencontre
        </h2>
      </div>
      
      {/* Contenu central */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto">
        {/* Ennemi */}
        <div className="card-metal p-5 w-full max-w-md text-center mb-4">
          <h3 
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {enemy.name}
          </h3>
          <p 
            className="italic text-sm mb-4"
            style={{ color: 'var(--text-muted)' }}
          >
            {enemy.description}
          </p>
          
          {/* Stats ennemi */}
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <p 
                className="text-xs uppercase mb-0.5"
                style={{ color: 'var(--text-dim)' }}
              >
                HP
              </p>
              <p 
                className="font-bold"
                style={{ color: 'var(--danger-light)' }}
              >
                {enemyHp}/{enemy.hp}
              </p>
            </div>
            <div className="text-center">
              <p 
                className="text-xs uppercase mb-0.5"
                style={{ color: 'var(--text-dim)' }}
              >
                ATK
              </p>
              <p 
                className="font-bold"
                style={{ color: 'var(--stat-atk)' }}
              >
                {enemy.atk}
              </p>
            </div>
            <div className="text-center">
              <p 
                className="text-xs uppercase mb-0.5"
                style={{ color: 'var(--text-dim)' }}
              >
                DEF
              </p>
              <p 
                className="font-bold"
                style={{ color: 'var(--stat-def)' }}
              >
                {enemy.def}
              </p>
            </div>
          </div>
        </div>
        
        {/* Estimation */}
        <div 
          className="card-metal p-3 w-full max-w-md text-center mb-4"
          style={{ borderColor: isDangerous ? 'var(--danger-light)' : '#2a2a2a' }}
        >
          <p style={{ color: 'var(--text-muted)' }}>
            Estimation : 
            <span 
              className="font-bold ml-1"
              style={{ color: isDangerous ? 'var(--danger-light)' : 'var(--copper)' }}
            >
              ~{estimatedDamage} HP
            </span>
            {isDangerous && (
              <span 
                className="ml-2 font-bold uppercase"
                style={{ color: 'var(--danger-light)' }}
              >
                DANGER
              </span>
            )}
          </p>
        </div>
        
        {/* Resultat temporaire */}
        {result && (
          <div 
            className="card-metal p-4 w-full max-w-md text-center mb-4 animate-in"
          >
            <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
              {result}
            </p>
          </div>
        )}
        
        {/* Stats joueur */}
        <div 
          className="flex justify-center gap-6 text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          <span>HP {player.hp}/{player.maxHp}</span>
          <span>ATK {playerAtk}</span>
          <span>DEF {playerDef}</span>
        </div>
      </div>
      
      {/* Zone du pouce - Boutons d'action */}
      {!isResolving && (
        <div 
          className="p-4 space-y-3"
          style={{ 
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            background: 'linear-gradient(to top, var(--bg-dark) 80%, transparent)'
          }}
        >
          {/* Combattre */}
          <button
            onClick={handleAttack}
            className="btn-danger w-full"
          >
            <div className="font-bold text-lg">Combattre</div>
            <div 
              className="text-xs mt-0.5"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Resolution immediate - ~{estimatedDamage} HP
            </div>
          </button>
          
          {/* Fuir et Parler */}
          <div className="flex gap-3">
            <button
              onClick={handleFlee}
              className="btn-neutral flex-1"
            >
              <div className="font-bold">Fuir</div>
              <div 
                className="text-xs mt-0.5"
                style={{ color: 'var(--text-dim)' }}
              >
                {Math.round(enemy.fleeChance * 100)}%
              </div>
            </button>
            
            <button
              onClick={handleTalk}
              disabled={!canTalk}
              className={canTalk ? 'btn-copper flex-1' : 'btn-neutral flex-1'}
              style={!canTalk ? { opacity: 0.4 } : undefined}
            >
              <div className="font-bold">Parler</div>
              <div 
                className="text-xs mt-0.5"
                style={{ color: canTalk ? 'rgba(0,0,0,0.6)' : 'var(--text-dim)' }}
              >
                {canTalk ? `${Math.round(rpChance * 100)}%` : 'Impossible'}
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
