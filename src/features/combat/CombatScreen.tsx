import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

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
  
  if (!enemy || !combat.isActive) return null;
  
  const playerAtk = getPlayerAtk();
  const playerDef = getPlayerDef();
  
  // Estimation du combat
  const damageToEnemy = Math.max(1, playerAtk - enemy.def);
  const damageToPlayer = Math.max(1, enemy.atk - playerDef);
  const turnsToKill = Math.ceil(enemyHp / damageToEnemy);
  const estimatedDamage = turnsToKill * damageToPlayer;
  
  // Chances de succès RP selon l'ennemi
  const getRpChance = () => {
    switch (enemy.id) {
      case 'wolf':
      case 'wolf_pack_alpha':
        return 0;
      case 'bandit':
        return 0.4;
      case 'mercenary':
        return 0.3;
      case 'deserter':
        return 0.5;
      case 'patrol_chief':
        return 0.1;
      default:
        return 0.2;
    }
  };
  
  const rpChance = getRpChance();
  const canTalk = rpChance > 0;
  
  const handleAttack = async () => {
    setIsResolving(true);
    const res = performCombat();
    
    if (res.victory) {
      setResult(`Victoire ! ${enemy.name} est vaincu.`);
    } else if (res.died) {
      setResult('Tu es tombé au combat...');
    }
    
    setTimeout(() => {
      setResult(null);
      setIsResolving(false);
    }, 1500);
  };
  
  const handleFlee = () => {
    setIsResolving(true);
    const res = tryFlee();
    
    if (res.fled) {
      setResult('Tu fuis le combat !');
    } else {
      setResult(`Fuite échouée ! -${res.damageTaken} HP`);
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
    <div className="fixed inset-0 bg-gradient-to-b from-red-950/95 to-zinc-900 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <h2 className="text-center text-2xl font-bold text-red-500 mb-4 tracking-wide">
          RENCONTRE
        </h2>
        
        {/* Ennemi */}
        <div className="text-center bg-zinc-800/70 rounded-xl p-6 mb-6 border border-zinc-700">
          <h3 className="text-2xl font-bold mb-2">{enemy.name}</h3>
          <p className="text-zinc-400 italic mb-4 text-sm">{enemy.description}</p>
          
          {/* Stats ennemi */}
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <p className="text-xs text-zinc-500 uppercase">HP</p>
              <p className="text-red-400 font-bold">{enemyHp}/{enemy.hp}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 uppercase">ATK</p>
              <p className="text-orange-400 font-bold">{enemy.atk}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-500 uppercase">DEF</p>
              <p className="text-blue-400 font-bold">{enemy.def}</p>
            </div>
          </div>
        </div>
        
        {/* Estimation */}
        <div className="text-center mb-6 p-3 bg-zinc-800/50 rounded-lg text-sm">
          <p className="text-zinc-400">
            Estimation : <span className={estimatedDamage > player.hp ? 'text-red-400 font-bold' : 'text-yellow-400'}>
              ~{estimatedDamage} HP perdus
            </span>
            {estimatedDamage > player.hp && <span className="text-red-400"> — DANGER</span>}
          </p>
        </div>
        
        {/* Résultat temporaire */}
        {result && (
          <div className="text-center mb-6 p-4 bg-zinc-800 rounded-xl animate-in text-lg font-bold">
            {result}
          </div>
        )}
        
        {/* Actions */}
        {!isResolving && (
          <div className="space-y-3">
            {/* COMBATTRE */}
            <button
              onClick={handleAttack}
              className="w-full p-4 bg-red-800 hover:bg-red-700 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] border border-red-600"
            >
              <div className="font-bold text-xl">Combattre</div>
              <div className="text-sm text-red-300">
                Résolution immédiate — ~{estimatedDamage} HP perdus
              </div>
            </button>
            
            {/* FUIR */}
            <button
              onClick={handleFlee}
              className="w-full p-4 bg-zinc-700 hover:bg-zinc-600 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] border border-zinc-600"
            >
              <div className="font-bold text-xl">Fuir</div>
              <div className="text-sm text-zinc-300">
                {Math.round(enemy.fleeChance * 100)}% de succès — Échec = 1 coup
              </div>
            </button>
            
            {/* PARLER */}
            <button
              onClick={handleTalk}
              disabled={!canTalk}
              className={`w-full p-4 rounded-xl transition-all border
                ${canTalk 
                  ? 'bg-amber-800 hover:bg-amber-700 hover:scale-[1.02] active:scale-[0.98] border-amber-600' 
                  : 'bg-zinc-800 border-zinc-700 opacity-50 cursor-not-allowed'}
              `}
            >
              <div className="font-bold text-xl">Parler</div>
              <div className="text-sm text-amber-300">
                {canTalk 
                  ? `${Math.round(rpChance * 100)}% de succès — Négocier, intimider...`
                  : 'Impossible avec cette créature'
                }
              </div>
            </button>
          </div>
        )}
        
        {/* Stats joueur */}
        <div className="mt-6 flex justify-center gap-6 text-sm text-zinc-400">
          <span>HP {player.hp}/{player.maxHp}</span>
          <span>ATK {playerAtk}</span>
          <span>DEF {playerDef}</span>
        </div>
      </div>
    </div>
  );
}
