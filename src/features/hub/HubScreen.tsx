import { useState, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { LootCard } from '../../types';
import { getRandomRumors } from '../../data/rumors';
import { QUESTS, type Quest } from '../../data/quests';
import { sounds } from '../../utils/sounds';

type HubTab = 'rest' | 'shop' | 'quests' | 'equipment' | 'chest' | 'rumors' | 'stats';

export function HubScreen() {
  const screen = useGameStore(state => state.screen);
  const setScreen = useGameStore(state => state.setScreen);
  const player = useGameStore(state => state.player);
  const inventory = useGameStore(state => state.inventory);
  const stats = useGameStore(state => state.stats);
  const restAtHub = useGameStore(state => state.restAtHub);
  const equipItem = useGameStore(state => state.equipItem);
  const sellItem = useGameStore(state => state.sellItem);
  const storeInChest = useGameStore(state => state.storeInChest);
  const retrieveFromChest = useGameStore(state => state.retrieveFromChest);
  const activeQuests = useGameStore(state => state.activeQuests);
  const completedQuests = useGameStore(state => state.completedQuests);
  const acceptQuest = useGameStore(state => state.acceptQuest);
  const completeQuest = useGameStore(state => state.completeQuest);
  
  const [activeTab, setActiveTab] = useState<HubTab>('rest');
  const [message, setMessage] = useState<string | null>(null);
  
  const rumors = useMemo(() => getRandomRumors(4), []);
  
  if (screen !== 'hub') return null;
  
  const handleRest = (option: 'basic' | 'luxury') => {
    const success = restAtHub(option);
    if (success) {
      sounds.purchase();
      setMessage(option === 'basic' 
        ? 'Tu te sens mieux apres un bon repas.' 
        : 'Une nuit parfaite. Tu es comme neuf !');
    } else {
      sounds.error();
      setMessage('Pas assez de pieces...');
    }
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleEquip = (item: LootCard) => {
    sounds.lootTake();
    equipItem(item);
    setMessage(`${item.name} equipe !`);
    setTimeout(() => setMessage(null), 2000);
  };
  
  const handleSell = (index: number) => {
    const result = sellItem(index);
    if (result.success) {
      sounds.purchase();
      setMessage(result.message);
    } else {
      sounds.error();
      setMessage(result.message);
    }
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-40 flex flex-col"
      style={{ background: 'var(--bg-dark)' }}
    >
      {/* Header */}
      <div className="safe-top px-4 py-3 text-center border-b" style={{ borderColor: '#2a2a2a' }}>
        <h1 
          className="text-xl font-bold"
          style={{ color: 'var(--copper)' }}
        >
          Auberge du Carrefour
        </h1>
        <p 
          className="text-xs italic mt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          "Bienvenue, mercenaire."
        </p>
      </div>
      
      {/* Stats joueur compact */}
      <div 
        className="px-4 py-2 flex justify-center gap-6 border-b"
        style={{ borderColor: '#1a1a1a' }}
      >
        <div className="text-center">
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>HP</p>
          <p 
            className="font-bold"
            style={{ color: player.hp < 50 ? 'var(--danger-light)' : 'var(--positive-light)' }}
          >
            {player.hp}/{player.maxHp}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Faim</p>
          <p 
            className="font-bold"
            style={{ color: player.hunger < 2 ? 'var(--copper)' : 'var(--text-primary)' }}
          >
            {player.hunger.toFixed(1)}j
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Or</p>
          <p className="font-bold" style={{ color: 'var(--copper)' }}>{player.gold}</p>
        </div>
      </div>
      
      {/* Message feedback */}
      {message && (
        <div 
          className="mx-4 mt-2 p-2 text-center text-sm animate-in fade-in rounded"
          style={{ background: 'var(--bg-surface)', border: '1px solid #3a3a3a' }}
        >
          {message}
        </div>
      )}
      
      {/* Tabs - Scrollable horizontal */}
      <div 
        className="flex gap-1 px-4 py-2 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {[
          { id: 'rest' as const, label: 'Repos' },
          { id: 'shop' as const, label: 'Marchand' },
          { id: 'quests' as const, label: 'Quetes' },
          { id: 'equipment' as const, label: 'Equipement' },
          { id: 'chest' as const, label: 'Coffre' },
          { id: 'rumors' as const, label: 'Annonces' },
          { id: 'stats' as const, label: 'Stats' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-shrink-0 px-3 py-2 rounded text-sm font-semibold transition-all active:scale-95"
            style={{
              background: activeTab === tab.id ? 'var(--copper)' : 'var(--bg-surface)',
              color: activeTab === tab.id ? 'var(--bg-dark)' : 'var(--text-muted)',
              border: `1px solid ${activeTab === tab.id ? 'var(--copper-light)' : '#2a2a2a'}`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Contenu tab - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="card-metal p-4 min-h-[200px]">
          {activeTab === 'rest' && <RestTab player={player} onRest={handleRest} />}
          {activeTab === 'shop' && <ShopTab inventory={inventory} onSell={handleSell} />}
          {activeTab === 'quests' && (
            <QuestsTab 
              stats={stats}
              activeQuests={activeQuests}
              completedQuests={completedQuests}
              onAccept={acceptQuest}
              onComplete={completeQuest}
              setMessage={setMessage}
            />
          )}
          {activeTab === 'equipment' && <EquipmentTab inventory={inventory} onEquip={handleEquip} />}
          {activeTab === 'chest' && <ChestTab inventory={inventory} onStore={storeInChest} onRetrieve={retrieveFromChest} />}
          {activeTab === 'rumors' && <RumorsTab rumors={rumors} />}
          {activeTab === 'stats' && <StatsTab stats={stats} />}
        </div>
      </div>
      
      {/* Zone du pouce - Bouton partir */}
      <div 
        className="p-4"
        style={{ 
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--bg-dark) 90%, transparent)'
        }}
      >
        <button
          onClick={() => setScreen('map')}
          className="btn-copper w-full"
        >
          Repartir en Exploration
        </button>
      </div>
    </div>
  );
}

// === SUB-COMPONENTS ===

function RestTab({ player, onRest }: { 
  player: { hp: number; maxHp: number; hunger: number; gold: number };
  onRest: (option: 'basic' | 'luxury') => void;
}) {
  const options = [
    { id: 'basic' as const, name: 'Repos & Repas', cost: 5, heal: 50, hunger: 3, desc: 'Ragout chaud et pain frais' },
    { id: 'luxury' as const, name: 'Chambre Luxe', cost: 15, heal: 100, hunger: 4, desc: 'Lit propre, eau chaude' },
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
        Services de l'auberge
      </h3>
      
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onRest(opt.id)}
          disabled={player.gold < opt.cost}
          className="w-full p-4 rounded text-left transition-all active:scale-[0.98]"
          style={{
            background: player.gold >= opt.cost ? 'var(--bg-elevated)' : 'var(--bg-surface)',
            border: `1px solid ${player.gold >= opt.cost ? '#3a3a3a' : '#1a1a1a'}`,
            opacity: player.gold >= opt.cost ? 1 : 0.5,
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>{opt.name}</h4>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
              <p className="text-sm mt-1">
                <span style={{ color: 'var(--positive-light)' }}>+{opt.heal} HP</span>
                <span style={{ color: 'var(--text-dim)' }}> / </span>
                <span style={{ color: 'var(--copper)' }}>+{opt.hunger}j</span>
              </p>
            </div>
            <div 
              className="text-xl font-bold"
              style={{ color: player.gold >= opt.cost ? 'var(--copper)' : 'var(--text-dim)' }}
            >
              {opt.cost}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function ShopTab({ inventory, onSell }: { inventory: { bag: LootCard[] }; onSell: (index: number) => void }) {
  const sellable = inventory.bag.map((item, index) => ({ item, index })).filter(({ item }) => item.value && item.value > 0);
  
  return (
    <div>
      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Marchand</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>"Je rachete a 60%."</p>
      
      {sellable.length === 0 ? (
        <p className="text-center py-6 italic" style={{ color: 'var(--text-dim)' }}>Rien a vendre</p>
      ) : (
        <div className="space-y-2">
          {sellable.map(({ item, index }) => {
            const price = Math.floor((item.value || 0) * 0.6);
            return (
              <div 
                key={`sell-${index}`}
                className="flex items-center gap-3 p-3 rounded"
                style={{ background: 'var(--bg-surface)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-dim)' }}>{item.description}</p>
                </div>
                <span className="font-bold" style={{ color: 'var(--copper)' }}>{price}</span>
                <button onClick={() => onSell(index)} className="btn-copper text-sm px-3 py-1.5">
                  Vendre
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EquipmentTab({ inventory, onEquip }: { 
  inventory: { bag: LootCard[]; equipped: { weapon: LootCard | null; armor: LootCard | null; skills: LootCard[] } };
  onEquip: (item: LootCard) => void;
}) {
  const equipables = inventory.bag.filter(item => ['weapon', 'armor', 'skill'].includes(item.type));
  
  return (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Equipement</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded" style={{ background: 'var(--bg-surface)' }}>
          <p className="text-xs uppercase mb-1" style={{ color: 'var(--text-dim)' }}>Arme</p>
          {inventory.equipped.weapon ? (
            <>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{inventory.equipped.weapon.name}</p>
              <p className="text-xs" style={{ color: 'var(--stat-atk)' }}>ATK +{inventory.equipped.weapon.stats.atk}</p>
            </>
          ) : <p style={{ color: 'var(--text-dim)' }}>-</p>}
        </div>
        <div className="p-3 rounded" style={{ background: 'var(--bg-surface)' }}>
          <p className="text-xs uppercase mb-1" style={{ color: 'var(--text-dim)' }}>Armure</p>
          {inventory.equipped.armor ? (
            <>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{inventory.equipped.armor.name}</p>
              <p className="text-xs" style={{ color: 'var(--stat-def)' }}>DEF +{inventory.equipped.armor.stats.def}</p>
            </>
          ) : <p style={{ color: 'var(--text-dim)' }}>-</p>}
        </div>
      </div>
      
      <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Dans le sac :</p>
      {equipables.length === 0 ? (
        <p className="italic" style={{ color: 'var(--text-dim)' }}>Aucun equipement</p>
      ) : (
        <div className="space-y-2">
          {equipables.map((item, i) => (
            <button
              key={`${item.id}-${i}`}
              onClick={() => onEquip(item)}
              className="w-full p-3 rounded text-left transition-all active:scale-[0.98]"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--copper-dark)' }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {item.stats.atk && <span style={{ color: 'var(--stat-atk)' }}>ATK +{item.stats.atk} </span>}
                    {item.stats.def && <span style={{ color: 'var(--stat-def)' }}>DEF +{item.stats.def}</span>}
                  </p>
                </div>
                <span className="text-xs" style={{ color: 'var(--copper)' }}>Equiper</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChestTab({ inventory, onStore, onRetrieve }: {
  inventory: { bag: LootCard[]; chest: LootCard[] };
  onStore: (index: number) => void;
  onRetrieve: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Sac ({inventory.bag.length})</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {inventory.bag.map((item, i) => (
            <div key={`bag-${i}`} className="flex items-center gap-2 p-2 rounded text-xs" style={{ background: 'var(--bg-surface)' }}>
              <span className="flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
              <button onClick={() => onStore(i)} className="px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--copper)' }}>+</button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Coffre ({inventory.chest.length})</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {inventory.chest.length === 0 ? (
            <p className="text-xs italic" style={{ color: 'var(--text-dim)' }}>Vide</p>
          ) : inventory.chest.map((item, i) => (
            <div key={`chest-${i}`} className="flex items-center gap-2 p-2 rounded text-xs" style={{ background: 'var(--bg-surface)' }}>
              <span className="flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
              <button onClick={() => onRetrieve(i)} className="px-2 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--copper)' }}>-</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestsTab({ stats, activeQuests, completedQuests, onAccept, onComplete, setMessage }: {
  stats: { tilesExplored: number; biomesExplored: Record<string, number>; enemiesKilledByType: Record<string, number> };
  activeQuests: string[];
  completedQuests: string[];
  onAccept: (id: string) => void;
  onComplete: (id: string, reward: { gold: number; karma?: number }) => void;
  setMessage: (msg: string) => void;
}) {
  const checkProgress = (quest: Quest) => {
    let current = 0;
    const target = quest.target.count;
    if (quest.type === 'explore') {
      current = quest.target.biome ? (stats.biomesExplored[quest.target.biome] || 0) : stats.tilesExplored;
    } else if (quest.type === 'kill' && quest.target.enemyId) {
      current = stats.enemiesKilledByType[quest.target.enemyId] || 0;
    }
    return { current: Math.min(current, target), target, complete: current >= target };
  };
  
  const available = QUESTS.filter(q => !activeQuests.includes(q.id) && !completedQuests.includes(q.id));
  const active = QUESTS.filter(q => activeQuests.includes(q.id));
  
  return (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quetes</h3>
      
      {active.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-bold mb-2" style={{ color: 'var(--copper)' }}>En cours</p>
          {active.map(q => {
            const p = checkProgress(q);
            return (
              <div key={q.id} className="p-3 rounded mb-2" style={{ background: 'var(--bg-surface)', border: '1px solid var(--copper-dark)' }}>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{q.title}</span>
                  <span className="text-sm" style={{ color: 'var(--copper)' }}>{q.reward.gold} or</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-void)' }}>
                    <div className="h-full" style={{ width: `${(p.current / p.target) * 100}%`, background: 'var(--copper)' }} />
                  </div>
                  <span className="text-xs font-bold">{p.current}/{p.target}</span>
                  {p.complete && (
                    <button 
                      onClick={() => { sounds.purchase(); onComplete(q.id, q.reward); setMessage(`+${q.reward.gold} or`); }}
                      className="btn-copper text-xs px-2 py-1"
                    >
                      OK
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Disponibles</p>
      {available.slice(0, 3).map(q => (
        <div key={q.id} className="p-3 rounded mb-2" style={{ background: 'var(--bg-surface)' }}>
          <div className="flex justify-between mb-1">
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{q.title}</span>
            <span className="text-sm" style={{ color: 'var(--copper)' }}>{q.reward.gold} or</span>
          </div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{q.description}</p>
          <button 
            onClick={() => { sounds.click(); onAccept(q.id); setMessage(`Quete acceptee`); }}
            className="btn-copper text-xs px-3 py-1.5"
          >
            Accepter
          </button>
        </div>
      ))}
    </div>
  );
}

function RumorsTab({ rumors }: { rumors: { id: string; author: string; date: string; content: string; hint?: string }[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Annonces</h3>
      <div className="space-y-3">
        {rumors.map(r => (
          <div 
            key={r.id} 
            className="p-3 rounded"
            style={{ background: 'var(--bg-surface)', borderLeft: '3px solid var(--copper-dark)' }}
          >
            <div className="flex justify-between mb-1">
              <span className="font-bold text-sm" style={{ color: 'var(--copper)' }}>{r.author}</span>
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{r.date}</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsTab({ stats }: { stats: { tilesExplored: number; enemiesKilled: number; itemsCollected: number; deaths: number; biomesExplored: Record<string, number>; enemiesKilledByType: Record<string, number> } }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Statistiques</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded text-center" style={{ background: 'var(--bg-surface)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--copper)' }}>{stats.tilesExplored}</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Zones</p>
        </div>
        <div className="p-3 rounded text-center" style={{ background: 'var(--bg-surface)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--stat-atk)' }}>{stats.enemiesKilled}</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Ennemis</p>
        </div>
        <div className="p-3 rounded text-center" style={{ background: 'var(--bg-surface)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--positive-light)' }}>{stats.itemsCollected}</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Objets</p>
        </div>
        <div className="p-3 rounded text-center" style={{ background: 'var(--bg-surface)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-dim)' }}>{stats.deaths}</p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Morts</p>
        </div>
      </div>
    </div>
  );
}
