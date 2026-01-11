import { useState, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { LootCard, LootType } from '../../types';
import { getRandomRumors } from '../../data/rumors';

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

type HubTab = 'rest' | 'equipment' | 'chest' | 'rumors' | 'stats';

export function HubScreen() {
  const screen = useGameStore(state => state.screen);
  const setScreen = useGameStore(state => state.setScreen);
  const player = useGameStore(state => state.player);
  const inventory = useGameStore(state => state.inventory);
  const stats = useGameStore(state => state.stats);
  const restAtHub = useGameStore(state => state.restAtHub);
  const equipItem = useGameStore(state => state.equipItem);
  const storeInChest = useGameStore(state => state.storeInChest);
  const retrieveFromChest = useGameStore(state => state.retrieveFromChest);
  
  const [activeTab, setActiveTab] = useState<HubTab>('rest');
  const [message, setMessage] = useState<string | null>(null);
  
  // Mémoriser les rumeurs pour cette session au hub
  const rumors = useMemo(() => getRandomRumors(4), []);
  
  if (screen !== 'hub') return null;
  
  const handleRest = (option: 'basic' | 'luxury') => {
    const success = restAtHub(option);
    if (success) {
      setMessage(option === 'basic' 
        ? 'Tu te sens mieux après un bon repas.' 
        : 'Une nuit parfaite. Tu es comme neuf !');
    } else {
      setMessage('Pas assez de pièces...');
    }
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleEquip = (item: LootCard) => {
    equipItem(item);
    setMessage(`${item.name} équipé !`);
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-amber-950/90 to-zinc-900 z-40 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">
            Auberge du Carrefour
          </h1>
          <p className="text-zinc-400 italic">
            "Bienvenue, mercenaire. Qu'est-ce qui te ferait plaisir ?"
          </p>
        </div>
        
        {/* Stats joueur */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
          <div className="text-center">
            <p className="text-xs text-zinc-500 uppercase">HP</p>
            <p className={`font-bold ${player.hp < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
              {player.hp}/{player.maxHp}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500 uppercase">Faim</p>
            <p className={`font-bold ${player.hunger < 2 ? 'text-yellow-400' : 'text-zinc-300'}`}>
              {player.hunger.toFixed(1)}j
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500 uppercase">Or</p>
            <p className="font-bold text-amber-400">{player.gold}</p>
          </div>
        </div>
        
        {/* Message */}
        {message && (
          <div className="mb-4 p-3 bg-zinc-700/50 rounded-lg text-center animate-in fade-in">
            {message}
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'rest' as const, label: 'Repos' },
            { id: 'equipment' as const, label: 'Équipement' },
            { id: 'chest' as const, label: 'Coffre' },
            { id: 'rumors' as const, label: 'Annonces' },
            { id: 'stats' as const, label: 'Stats' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 min-w-24 p-3 rounded-lg transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-amber-600 text-white scale-105' 
                  : 'bg-zinc-700 hover:bg-zinc-600'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Contenu tab */}
        <div className="bg-zinc-800/80 rounded-xl p-4 sm:p-6 min-h-[300px] border border-zinc-700">
          {activeTab === 'rest' && (
            <RestTab player={player} onRest={handleRest} />
          )}
          {activeTab === 'equipment' && (
            <EquipmentTab 
              inventory={inventory} 
              onEquip={handleEquip}
            />
          )}
          {activeTab === 'chest' && (
            <ChestTab 
              inventory={inventory}
              onStore={storeInChest}
              onRetrieve={retrieveFromChest}
            />
          )}
          {activeTab === 'rumors' && (
            <RumorsTab rumors={rumors} />
          )}
          {activeTab === 'stats' && (
            <StatsTab stats={stats} />
          )}
        </div>
        
        {/* Bouton partir */}
        <button
          onClick={() => setScreen('map')}
          className="w-full mt-6 p-4 bg-emerald-700 hover:bg-emerald-600 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] border border-emerald-600"
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
    { 
      id: 'basic' as const, 
      name: 'Repos & Repas', 
      cost: 5, 
      heal: 50, 
      hunger: 3,
      desc: 'Ragoût chaud et pain frais',
    },
    { 
      id: 'luxury' as const, 
      name: 'Chambre Luxe', 
      cost: 15, 
      heal: 100, 
      hunger: 4,
      desc: 'Lit propre, eau chaude, vraie nourriture',
    },
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Services de l'auberge</h3>
      
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onRest(opt.id)}
          disabled={player.gold < opt.cost}
          className={`
            w-full p-4 rounded-xl text-left transition-all
            ${player.gold >= opt.cost 
              ? 'bg-zinc-700/50 hover:bg-zinc-700 hover:scale-[1.01]' 
              : 'bg-zinc-800/50 opacity-50 cursor-not-allowed'}
          `}
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-lg">{opt.name}</h4>
              <p className="text-sm text-zinc-400">{opt.desc}</p>
              <p className="text-sm mt-1">
                <span className="text-red-400">+{opt.heal} HP</span>
                {' · '}
                <span className="text-green-400">+{opt.hunger}j faim</span>
              </p>
            </div>
            <div className={`text-2xl font-bold ${player.gold >= opt.cost ? 'text-amber-400' : 'text-zinc-500'}`}>
              {opt.cost}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function EquipmentTab({ inventory, onEquip }: {
  inventory: {
    bag: LootCard[];
    equipped: { weapon: LootCard | null; armor: LootCard | null; skills: LootCard[] };
  };
  onEquip: (item: LootCard) => void;
}) {
  const equipables = inventory.bag.filter(item => item.type === 'weapon' || item.type === 'armor' || item.type === 'skill');
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Équipement actuel</h3>
      
      {/* Équipé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-zinc-700/30 rounded-xl">
          <p className="text-xs text-zinc-500 uppercase mb-2">Arme</p>
          {inventory.equipped.weapon ? (
            <div>
              <p className="font-bold">{inventory.equipped.weapon.name}</p>
              <p className="text-red-400 text-sm">ATK +{inventory.equipped.weapon.stats.atk}</p>
            </div>
          ) : (
            <p className="text-zinc-500 italic">—</p>
          )}
        </div>
        
        <div className="p-4 bg-zinc-700/30 rounded-xl">
          <p className="text-xs text-zinc-500 uppercase mb-2">Armure</p>
          {inventory.equipped.armor ? (
            <div>
              <p className="font-bold">{inventory.equipped.armor.name}</p>
              <p className="text-blue-400 text-sm">DEF +{inventory.equipped.armor.stats.def}</p>
            </div>
          ) : (
            <p className="text-zinc-500 italic">—</p>
          )}
        </div>
        
        <div className="p-4 bg-zinc-700/30 rounded-xl sm:col-span-2">
          <p className="text-xs text-zinc-500 uppercase mb-2">Compétences</p>
          {inventory.equipped.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {inventory.equipped.skills.map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-purple-600/30 rounded text-purple-300 text-sm">
                  {skill.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 italic">—</p>
          )}
        </div>
      </div>
      
      {/* Équipables dans le sac */}
      <h4 className="font-bold mb-2 text-zinc-400">Dans ton sac :</h4>
      {equipables.length === 0 ? (
        <p className="text-zinc-500 italic">Aucun équipement</p>
      ) : (
        <div className="space-y-2">
          {equipables.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              onClick={() => onEquip(item)}
              className="w-full p-3 bg-zinc-700/30 hover:bg-zinc-700/50 rounded-lg flex items-center gap-3 transition-all"
            >
              <span className={`text-xs font-medium ${TYPE_COLORS[item.type]}`}>
                {TYPE_LABELS[item.type]}
              </span>
              <div className="flex-1 text-left">
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-zinc-400">
                  {item.stats.atk && <span className="text-red-400">ATK +{item.stats.atk} </span>}
                  {item.stats.def && <span className="text-blue-400">DEF +{item.stats.def} </span>}
                  {item.type === 'skill' && <span className="text-purple-400">{item.description}</span>}
                </p>
              </div>
              <span className="text-emerald-400 text-sm">Équiper</span>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sac */}
      <div>
        <h4 className="font-bold mb-3">Sac ({inventory.bag.length})</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {inventory.bag.length === 0 ? (
            <p className="text-zinc-500 italic text-sm">Vide</p>
          ) : (
            inventory.bag.map((item, index) => (
              <div 
                key={`bag-${index}`}
                className="flex items-center gap-2 p-2 bg-zinc-700/30 rounded-lg"
              >
                <span className={`text-xs ${TYPE_COLORS[item.type]}`}>{TYPE_LABELS[item.type]}</span>
                <span className="flex-1 truncate text-sm">{item.name}</span>
                <button
                  onClick={() => onStore(index)}
                  className="text-xs px-2 py-1 bg-zinc-600 hover:bg-zinc-500 rounded"
                >
                  Stocker
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Coffre */}
      <div>
        <h4 className="font-bold mb-3">Coffre ({inventory.chest.length})</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {inventory.chest.length === 0 ? (
            <p className="text-zinc-500 italic text-sm">Vide</p>
          ) : (
            inventory.chest.map((item, index) => (
              <div 
                key={`chest-${index}`}
                className="flex items-center gap-2 p-2 bg-zinc-700/30 rounded-lg"
              >
                <span className={`text-xs ${TYPE_COLORS[item.type]}`}>{TYPE_LABELS[item.type]}</span>
                <span className="flex-1 truncate text-sm">{item.name}</span>
                <button
                  onClick={() => onRetrieve(index)}
                  className="text-xs px-2 py-1 bg-zinc-600 hover:bg-zinc-500 rounded"
                >
                  Prendre
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function RumorsTab({ rumors }: {
  rumors: { id: string; author: string; date: string; content: string; hint?: string }[];
}) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Tableau d'Annonces</h3>
      <p className="text-sm text-zinc-500 mb-4">
        Les voyageurs partagent leurs informations ici.
      </p>
      
      <div className="space-y-4">
        {rumors.map(rumor => (
          <div 
            key={rumor.id}
            className="p-4 bg-zinc-700/30 rounded-xl border-l-4 border-amber-600/50"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-amber-400">{rumor.author}</span>
              <span className="text-xs text-zinc-500">{rumor.date}</span>
            </div>
            <p className="text-zinc-300 whitespace-pre-line text-sm leading-relaxed">
              {rumor.content}
            </p>
            {rumor.hint && (
              <p className="mt-2 text-xs text-zinc-500 italic">
                [{rumor.hint}]
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsTab({ stats }: {
  stats: { tilesExplored: number; enemiesKilled: number; itemsCollected: number; deaths: number };
}) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Statistiques</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-zinc-700/30 rounded-xl text-center">
          <p className="text-2xl font-bold">{stats.tilesExplored}</p>
          <p className="text-sm text-zinc-400">Zones explorées</p>
        </div>
        
        <div className="p-4 bg-zinc-700/30 rounded-xl text-center">
          <p className="text-2xl font-bold">{stats.enemiesKilled}</p>
          <p className="text-sm text-zinc-400">Ennemis vaincus</p>
        </div>
        
        <div className="p-4 bg-zinc-700/30 rounded-xl text-center">
          <p className="text-2xl font-bold">{stats.itemsCollected}</p>
          <p className="text-sm text-zinc-400">Objets collectés</p>
        </div>
        
        <div className="p-4 bg-zinc-700/30 rounded-xl text-center">
          <p className="text-2xl font-bold">{stats.deaths}</p>
          <p className="text-sm text-zinc-400">Morts</p>
        </div>
      </div>
    </div>
  );
}
