# SOUDA: Terra Incognita - Plan de Développement Prototype v0.1

> **Philosophie de dev :** Fun d'abord, contraintes ensuite.
> Le joueur doit ressentir l'appel de l'inconnu avant de gérer son sac.

---

## 1. Stack & Architecture

### Stack Technique

| Catégorie | Choix | Justification |
|-----------|-------|---------------|
| **Framework** | React 18 + TypeScript | Écosystème mature, itération rapide, hooks pour état local |
| **State Manager** | Zustand | Léger, API simple, persist localStorage natif, zéro boilerplate |
| **Styling** | Tailwind CSS | Greyboxing ultra-rapide, classes utilitaires, responsive natif |
| **Bundler** | Vite | HMR instantané, config minimale, build rapide |
| **Structure** | Feature-based | `/features/map`, `/features/loot`, `/features/combat` |

### Installation Rapide

```bash
npm create vite@latest souda-prototype -- --template react-ts
cd souda-prototype
npm install zustand tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Architecture GameState (Zustand)

**Principe :** Le `WorldMap` et le `PlayerPosition` sont au centre. Tout le reste en découle.

```typescript
// store/gameStore.ts

interface Tile {
  id: string;
  x: number;
  y: number;
  type: 'hub' | 'plain' | 'forest' | 'hills' | 'ruins' | 'village';
  isRevealed: boolean;
  isExplored: boolean;      // Visité au moins une fois
  hasDanger: boolean;       // Ennemi présent
  loot: LootCard[] | null;  // Loot disponible sur cette tuile
}

interface LootCard {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'skill' | 'treasure';
  weight: number;           // kg
  stats?: { atk?: number; def?: number; heal?: number };
  description: string;
}

interface PlayerState {
  hp: number;
  maxHp: number;
  hunger: number;           // Jours restants
  gold: number;
}

interface InventoryState {
  bag: LootCard[];
  equipped: {
    weapon: LootCard | null;
    armor: LootCard | null;
    skills: LootCard[];
  };
  maxWeight: number;        // 10kg par défaut
}

interface WorldState {
  tiles: Map<string, Tile>; // key = "x,y"
  playerPosition: { x: number; y: number };
  time: { hour: number; day: number };
}

interface CombatState {
  isActive: boolean;
  enemy: Enemy | null;
  turn: number;
  playerAction: 'attack' | 'defend' | 'flee' | null;
}

interface GameStore {
  // === WORLD (Priorité #1) ===
  world: WorldState;
  moveTo: (x: number, y: number) => void;
  revealTile: (x: number, y: number) => void;
  getAdjacentTiles: () => Tile[];
  
  // === LOOT (Priorité #2) ===
  currentLoot: LootCard | null;
  takeLoot: (loot: LootCard) => void;
  leaveLoot: () => void;
  
  // === PLAYER (Priorité #3) ===
  player: PlayerState;
  inventory: InventoryState;
  getCurrentWeight: () => number;
  canCarryMore: (weight: number) => boolean;
  
  // === COMBAT (Priorité #4) ===
  combat: CombatState;
  startCombat: (enemy: Enemy) => void;
  performAction: (action: 'attack' | 'defend' | 'flee') => void;
}
```

### Structure des Fichiers

```
src/
├── store/
│   └── gameStore.ts          # Zustand store unique
├── features/
│   ├── map/
│   │   ├── WorldMap.tsx      # Grille cliquable
│   │   ├── Tile.tsx          # Tuile individuelle
│   │   └── FogOfWar.tsx      # Overlay brouillard
│   ├── loot/
│   │   ├── LootPopup.tsx     # Modal découverte
│   │   └── LootCard.tsx      # Affichage carte
│   ├── inventory/
│   │   ├── Backpack.tsx      # Liste items
│   │   └── WeightBar.tsx     # Jauge poids
│   └── combat/
│       ├── CombatScreen.tsx  # Écran combat
│       └── EnemyCard.tsx     # Stats ennemi
├── data/
│   ├── tiles.json            # Config tuiles prototype
│   ├── loot.json             # Pool de loot
│   └── enemies.json          # Types d'ennemis
├── App.tsx
└── main.tsx
```

---

## 2. Roadmap par Blocs Jouables

### Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│  BLOC 1: LE MONDE INCONNU     │  Durée estimée: 4-6h            │
│  ─────────────────────────────│                                 │
│  ✦ Grille 5x5 cliquable       │  "Je peux me balader et         │
│  ✦ Brouillard de guerre       │   peindre la carte"             │
│  ✦ Biomes visuels distincts   │                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  BLOC 2: LE LOOT              │  Durée estimée: 3-4h            │
│  ─────────────────────────────│                                 │
│  ✦ Popup découverte           │  "Je trouve une épée,           │
│  ✦ Système Prendre/Laisser    │   elle va dans mon sac"         │
│  ✦ Liste sac à dos            │                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  BLOC 3: LES CONTRAINTES      │  Durée estimée: 2-3h            │
│  ─────────────────────────────│                                 │
│  ✦ Limite poids 10kg          │  "Je dois choisir quoi          │
│  ✦ Timer temps/faim           │   garder"                       │
│  ✦ Feedback surcharge         │                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  BLOC 4: LA MENACE            │  Durée estimée: 4-5h            │
│  ─────────────────────────────│                                 │
│  ✦ Rencontres aléatoires      │  "C'est dangereux,              │
│  ✦ Combat ATK/DEF/FLEE        │   je risque de mourir"          │
│  ✦ Patterns ennemis           │                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  BLOC 5: LE REFUGE            │  Durée estimée: 3-4h            │
│  ─────────────────────────────│                                 │
│  ✦ Hub central (Auberge)      │  "Je rentre pour souffler       │
│  ✦ Repos, marchand, coffre    │   et m'équiper"                 │
│  ✦ Boucle complète            │                                 │
└─────────────────────────────────────────────────────────────────┘

TOTAL ESTIMÉ: 16-22h de développement
```

---

### BLOC 1 : Le Monde Inconnu (Map & Brouillard)

> **Objectif Émotionnel :** Le joueur doit ressentir l'appel de l'inconnu.
> Chaque case cachée = une promesse de découverte.

#### Fonctionnalités

| # | Feature | Description | Priorité |
|---|---------|-------------|----------|
| 1.1 | Grille 5x5 | Génération d'une grille de 25 tuiles (extensible à 15 pour le prototype final) | 🔴 Critical |
| 1.2 | Brouillard Total | Toutes les tuiles sont cachées sauf le Hub (centre) | 🔴 Critical |
| 1.3 | Révélation Adjacente | Cliquer sur une tuile adjacente au joueur → Elle se révèle | 🔴 Critical |
| 1.4 | Biomes Visuels | Couleurs distinctes : Hub (or), Plaine (vert clair), Forêt (vert foncé), Collines (marron), Ruines (gris) | 🟡 High |
| 1.5 | Position Joueur | Marqueur visible sur la tuile actuelle | 🔴 Critical |
| 1.6 | Animation Reveal | Transition douce quand le brouillard se lève | 🟢 Nice-to-have |

#### Implémentation

```typescript
// features/map/WorldMap.tsx

const GRID_SIZE = 5;
const HUB_POSITION = { x: 2, y: 2 }; // Centre de la grille 5x5

const biomeColors: Record<TileType, string> = {
  hub: 'bg-amber-500',      // Or - Sécurité
  plain: 'bg-lime-400',     // Vert clair - Facile
  forest: 'bg-emerald-700', // Vert foncé - Danger moyen
  hills: 'bg-stone-500',    // Marron - Loot caché
  ruins: 'bg-slate-600',    // Gris - Danger élevé
  village: 'bg-orange-300', // Orange - Variable
};

const fogStyle = 'bg-zinc-900 opacity-90'; // Brouillard épais

function WorldMap() {
  const { world, moveTo, getAdjacentTiles } = useGameStore();
  const adjacentIds = getAdjacentTiles().map(t => t.id);
  
  return (
    <div className="grid grid-cols-5 gap-1 p-4 bg-zinc-800 rounded-lg">
      {Array.from(world.tiles.values()).map(tile => (
        <Tile
          key={tile.id}
          tile={tile}
          isPlayerHere={tile.x === world.playerPosition.x && tile.y === world.playerPosition.y}
          isClickable={adjacentIds.includes(tile.id)}
          onClick={() => moveTo(tile.x, tile.y)}
        />
      ))}
    </div>
  );
}
```

```typescript
// features/map/Tile.tsx

interface TileProps {
  tile: Tile;
  isPlayerHere: boolean;
  isClickable: boolean;
  onClick: () => void;
}

function Tile({ tile, isPlayerHere, isClickable, onClick }: TileProps) {
  // Tuile non révélée = Brouillard
  if (!tile.isRevealed) {
    return (
      <div 
        className={`
          w-16 h-16 rounded 
          ${isClickable ? 'bg-zinc-700 cursor-pointer hover:bg-zinc-600 border-2 border-dashed border-zinc-500' : 'bg-zinc-900'}
          flex items-center justify-center
          transition-all duration-300
        `}
        onClick={isClickable ? onClick : undefined}
      >
        {isClickable && <span className="text-zinc-400 text-2xl">?</span>}
      </div>
    );
  }
  
  // Tuile révélée
  return (
    <div 
      className={`
        w-16 h-16 rounded 
        ${biomeColors[tile.type]}
        ${isClickable ? 'cursor-pointer ring-2 ring-white/50 hover:ring-white' : ''}
        ${isPlayerHere ? 'ring-4 ring-yellow-400' : ''}
        flex items-center justify-center
        transition-all duration-300
      `}
      onClick={isClickable ? onClick : undefined}
    >
      {isPlayerHere && <span className="text-2xl">🧭</span>}
      {tile.loot && !isPlayerHere && <span className="text-xl">✨</span>}
      {tile.hasDanger && !isPlayerHere && <span className="text-xl">⚠️</span>}
    </div>
  );
}
```

#### Données de Test (Bloc 1)

```typescript
// data/prototypeMap.ts

export const PROTOTYPE_MAP: Omit<Tile, 'isRevealed' | 'isExplored'>[] = [
  // Ligne 0 (Nord)
  { id: '0,0', x: 0, y: 0, type: 'ruins', hasDanger: true, loot: null },
  { id: '1,0', x: 1, y: 0, type: 'forest', hasDanger: false, loot: null },
  { id: '2,0', x: 2, y: 0, type: 'hills', hasDanger: false, loot: null },
  { id: '3,0', x: 3, y: 0, type: 'forest', hasDanger: true, loot: null },
  { id: '4,0', x: 4, y: 0, type: 'ruins', hasDanger: true, loot: null },
  
  // Ligne 1
  { id: '0,1', x: 0, y: 1, type: 'plain', hasDanger: false, loot: null },
  { id: '1,1', x: 1, y: 1, type: 'plain', hasDanger: false, loot: null },
  { id: '2,1', x: 2, y: 1, type: 'forest', hasDanger: false, loot: null },
  { id: '3,1', x: 3, y: 1, type: 'plain', hasDanger: false, loot: null },
  { id: '4,1', x: 4, y: 1, type: 'hills', hasDanger: false, loot: null },
  
  // Ligne 2 (Centre - Hub)
  { id: '0,2', x: 0, y: 2, type: 'forest', hasDanger: true, loot: null },
  { id: '1,2', x: 1, y: 2, type: 'plain', hasDanger: false, loot: null },
  { id: '2,2', x: 2, y: 2, type: 'hub', hasDanger: false, loot: null }, // SPAWN
  { id: '3,2', x: 3, y: 2, type: 'plain', hasDanger: false, loot: null },
  { id: '4,2', x: 4, y: 2, type: 'village', hasDanger: false, loot: null },
  
  // Ligne 3
  { id: '0,3', x: 0, y: 3, type: 'hills', hasDanger: false, loot: null },
  { id: '1,3', x: 1, y: 3, type: 'forest', hasDanger: true, loot: null },
  { id: '2,3', x: 2, y: 3, type: 'plain', hasDanger: false, loot: null },
  { id: '3,3', x: 3, y: 3, type: 'forest', hasDanger: false, loot: null },
  { id: '4,3', x: 4, y: 3, type: 'ruins', hasDanger: true, loot: null },
  
  // Ligne 4 (Sud)
  { id: '0,4', x: 0, y: 4, type: 'village', hasDanger: false, loot: null },
  { id: '1,4', x: 1, y: 4, type: 'plain', hasDanger: false, loot: null },
  { id: '2,4', x: 2, y: 4, type: 'hills', hasDanger: false, loot: null },
  { id: '3,4', x: 3, y: 4, type: 'plain', hasDanger: false, loot: null },
  { id: '4,4', x: 4, y: 4, type: 'forest', hasDanger: true, loot: null },
];
```

#### Critère de Validation ✅

```
□ Je lance le jeu → Je vois une grille 5x5
□ Seule la case centrale (Hub) est visible, colorée en or
□ Les 4 cases adjacentes au Hub affichent "?" et sont cliquables
□ Je clique sur une case "?" → Elle se révèle avec sa couleur de biome
□ Ma position (🧭) se déplace sur la nouvelle case
□ Les nouvelles cases adjacentes deviennent cliquables
□ Je peux "peindre" toute la carte en me déplaçant
```

---

### BLOC 2 : Le Loot (Reward System)

> **Objectif Émotionnel :** Chaque tuile révélée peut cacher un trésor.
> Le joueur doit ressentir l'excitation de la découverte.

#### Fonctionnalités

| # | Feature | Description | Priorité |
|---|---------|-------------|----------|
| 2.1 | Loot Aléatoire | 40% de chance qu'une tuile contienne du loot | 🔴 Critical |
| 2.2 | Popup Découverte | Modal affichant la carte trouvée (nom, stats, poids) | 🔴 Critical |
| 2.3 | Prendre / Laisser | Deux boutons clairs pour décider | 🔴 Critical |
| 2.4 | Sac à Dos | Liste visuelle des items possédés (sidebar) | 🔴 Critical |
| 2.5 | Indicateur Loot | Sparkle (✨) sur les tuiles avec loot non récupéré | 🟡 High |
| 2.6 | Catégories Loot | Armes (🗡️), Armures (🛡️), Consommables (🍞), Trésors (💰) | 🟡 High |

#### Pool de Loot (Prototype)

```typescript
// data/lootPool.ts

export const LOOT_POOL: LootCard[] = [
  // === ARMES ===
  {
    id: 'wpn_dagger',
    name: 'Dague Rapide',
    type: 'weapon',
    weight: 0.5,
    stats: { atk: 3 },
    description: 'Légère et maniable. Pour les combattants agiles.',
  },
  {
    id: 'wpn_longsword',
    name: 'Épée Longue',
    type: 'weapon',
    weight: 2,
    stats: { atk: 5 },
    description: 'Équilibrée. Le choix du professionnel.',
  },
  {
    id: 'wpn_axe',
    name: 'Hache de Guerre',
    type: 'weapon',
    weight: 3.5,
    stats: { atk: 7 },
    description: 'Frappe lourde. Pour ceux qui ont la force.',
  },
  
  // === ARMURES ===
  {
    id: 'arm_gambeson',
    name: 'Gambeson Renforcé',
    type: 'armor',
    weight: 2,
    stats: { def: 2 },
    description: 'Tissu matelassé. Protection décente.',
  },
  {
    id: 'arm_chainmail',
    name: 'Maille Légère',
    type: 'armor',
    weight: 3.5,
    stats: { def: 3 },
    description: 'Anneaux de fer. Solide.',
  },
  
  // === CONSOMMABLES ===
  {
    id: 'cons_bread',
    name: 'Pain Frais',
    type: 'consumable',
    weight: 0.3,
    stats: { heal: 10 },
    description: '+1 jour faim, +10 HP',
  },
  {
    id: 'cons_meat',
    name: 'Viande Séchée',
    type: 'consumable',
    weight: 0.5,
    stats: { heal: 15 },
    description: '+2 jours faim, +15 HP',
  },
  {
    id: 'cons_bandage',
    name: 'Bandage Propre',
    type: 'consumable',
    weight: 0.2,
    stats: { heal: 30 },
    description: '+30 HP',
  },
  
  // === TRÉSORS ===
  {
    id: 'gold_pouch',
    name: 'Bourse de Pièces',
    type: 'treasure',
    weight: 0.1,
    stats: {},
    description: '5-15 pièces de cuivre',
  },
  {
    id: 'wolf_pelt',
    name: 'Peau de Loup',
    type: 'treasure',
    weight: 0.5,
    stats: {},
    description: 'Vaut 5 pièces chez le marchand.',
  },
];

// Fonction de drop selon biome
export function rollLoot(tileType: TileType): LootCard | null {
  const dropChance: Record<TileType, number> = {
    hub: 0,
    plain: 0.3,
    forest: 0.4,
    hills: 0.5,
    ruins: 0.7,
    village: 0.6,
  };
  
  if (Math.random() > dropChance[tileType]) return null;
  
  // Pondération selon biome
  const pool = LOOT_POOL.filter(loot => {
    if (tileType === 'ruins') return true; // Tout peut drop
    if (tileType === 'forest') return loot.type !== 'armor'; // Pas d'armure en forêt
    if (tileType === 'hills') return loot.type === 'treasure' || loot.type === 'weapon';
    return loot.type === 'consumable' || loot.type === 'treasure';
  });
  
  return pool[Math.floor(Math.random() * pool.length)];
}
```

#### Implémentation

```tsx
// features/loot/LootPopup.tsx

interface LootPopupProps {
  loot: LootCard;
  onTake: () => void;
  onLeave: () => void;
}

function LootPopup({ loot, onTake, onLeave }: LootPopupProps) {
  const typeIcons: Record<LootCard['type'], string> = {
    weapon: '🗡️',
    armor: '🛡️',
    consumable: '🍞',
    skill: '👁️',
    treasure: '💰',
  };
  
  const typeColors: Record<LootCard['type'], string> = {
    weapon: 'border-red-500 bg-red-950',
    armor: 'border-blue-500 bg-blue-950',
    consumable: 'border-green-500 bg-green-950',
    skill: 'border-purple-500 bg-purple-950',
    treasure: 'border-yellow-500 bg-yellow-950',
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className={`
        w-80 p-6 rounded-lg border-2 
        ${typeColors[loot.type]}
        shadow-2xl animate-in fade-in zoom-in duration-300
      `}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{typeIcons[loot.type]}</span>
          <div>
            <h2 className="text-xl font-bold text-white">{loot.name}</h2>
            <p className="text-zinc-400 text-sm">{loot.weight}kg</p>
          </div>
        </div>
        
        {/* Stats */}
        {loot.stats && (
          <div className="flex gap-4 mb-4 text-lg">
            {loot.stats.atk && <span className="text-red-400">ATK +{loot.stats.atk}</span>}
            {loot.stats.def && <span className="text-blue-400">DEF +{loot.stats.def}</span>}
            {loot.stats.heal && <span className="text-green-400">+{loot.stats.heal} HP</span>}
          </div>
        )}
        
        {/* Description */}
        <p className="text-zinc-300 italic mb-6">"{loot.description}"</p>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onTake}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded font-bold transition"
          >
            ✓ PRENDRE
          </button>
          <button
            onClick={onLeave}
            className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 rounded font-bold transition"
          >
            ✗ LAISSER
          </button>
        </div>
      </div>
    </div>
  );
}
```

```tsx
// features/inventory/Backpack.tsx

function Backpack() {
  const { inventory, getCurrentWeight } = useGameStore();
  const currentWeight = getCurrentWeight();
  
  return (
    <div className="w-64 bg-zinc-800 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        🎒 Sac à Dos
      </h3>
      
      {/* Jauge de poids */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-zinc-400 mb-1">
          <span>Poids</span>
          <span>{currentWeight.toFixed(1)} / {inventory.maxWeight}kg</span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              currentWeight / inventory.maxWeight > 0.9 
                ? 'bg-red-500' 
                : currentWeight / inventory.maxWeight > 0.7 
                  ? 'bg-yellow-500' 
                  : 'bg-emerald-500'
            }`}
            style={{ width: `${(currentWeight / inventory.maxWeight) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Liste des items */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {inventory.bag.length === 0 ? (
          <p className="text-zinc-500 italic text-center py-4">Sac vide</p>
        ) : (
          inventory.bag.map((item, index) => (
            <div 
              key={`${item.id}-${index}`}
              className="flex items-center gap-2 p-2 bg-zinc-700 rounded"
            >
              <span>{typeIcons[item.type]}</span>
              <span className="flex-1 truncate">{item.name}</span>
              <span className="text-zinc-400 text-sm">{item.weight}kg</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

#### Critère de Validation ✅

```
□ Je me déplace sur une nouvelle tuile
□ Si loot présent → Popup apparaît avec la carte (nom, stats, poids)
□ Je clique "PRENDRE" → L'item apparaît dans ma liste "Sac à Dos"
□ Je clique "LAISSER" → Le popup se ferme, la tuile garde l'indicateur ✨
□ Je peux revenir sur une tuile avec loot laissé → Le popup réapparaît
□ Le sac affiche le poids total des items
```

---

### BLOC 3 : Les Contraintes (Poids & Temps)

> **Objectif Émotionnel :** Les trouvailles ont un coût.
> Chaque objet gardé = un choix fait.

#### Fonctionnalités

| # | Feature | Description | Priorité |
|---|---------|-------------|----------|
| 3.1 | Limite 10kg | Impossible de prendre un item si dépassement | 🔴 Critical |
| 3.2 | Feedback Surcharge | Message clair si on ne peut pas prendre | 🔴 Critical |
| 3.3 | Jeter Item | Possibilité de se délester depuis le sac | 🟡 High |
| 3.4 | Timer Temps | Compteur Heure/Jour qui avance à chaque mouvement | 🟡 High |
| 3.5 | Faim | Diminue avec le temps, affecte stats | 🟢 Medium |
| 3.6 | Ralentissement | Si poids > 80% max → Mouvement coûte +1h | 🟢 Medium |

#### Implémentation

```typescript
// store/gameStore.ts (ajouts Bloc 3)

// Dans le store Zustand
const useGameStore = create<GameStore>((set, get) => ({
  // ... (code précédent)
  
  getCurrentWeight: () => {
    const { inventory } = get();
    return inventory.bag.reduce((sum, item) => sum + item.weight, 0);
  },
  
  canCarryMore: (additionalWeight: number) => {
    const { inventory } = get();
    const currentWeight = get().getCurrentWeight();
    return currentWeight + additionalWeight <= inventory.maxWeight;
  },
  
  takeLoot: (loot: LootCard) => {
    const canCarry = get().canCarryMore(loot.weight);
    
    if (!canCarry) {
      // Feedback: impossible de prendre
      return { success: false, reason: 'surcharge' };
    }
    
    set(state => ({
      inventory: {
        ...state.inventory,
        bag: [...state.inventory.bag, loot],
      },
      currentLoot: null,
    }));
    
    // Retirer le loot de la tuile
    const pos = get().world.playerPosition;
    const tileId = `${pos.x},${pos.y}`;
    set(state => ({
      world: {
        ...state.world,
        tiles: new Map(state.world.tiles).set(tileId, {
          ...state.world.tiles.get(tileId)!,
          loot: null,
        }),
      },
    }));
    
    return { success: true };
  },
  
  dropItem: (itemIndex: number) => {
    set(state => ({
      inventory: {
        ...state.inventory,
        bag: state.inventory.bag.filter((_, i) => i !== itemIndex),
      },
    }));
  },
  
  advanceTime: (hours: number) => {
    set(state => {
      let newHour = state.world.time.hour + hours;
      let newDay = state.world.time.day;
      
      while (newHour >= 24) {
        newHour -= 24;
        newDay += 1;
      }
      
      // Faim diminue
      const hungerLoss = hours * 0.5; // 0.5 jour par heure
      const newHunger = Math.max(0, state.player.hunger - hungerLoss / 24);
      
      return {
        world: {
          ...state.world,
          time: { hour: newHour, day: newDay },
        },
        player: {
          ...state.player,
          hunger: newHunger,
        },
      };
    });
  },
  
  moveTo: (x: number, y: number) => {
    const { world, advanceTime, getCurrentWeight, inventory } = get();
    
    // Calcul temps de déplacement
    let travelTime = 1; // 1h par défaut
    
    // Surcharge = ralentissement
    if (getCurrentWeight() > inventory.maxWeight * 0.8) {
      travelTime = 2;
    }
    
    // Type de terrain (forêt/collines = plus lent)
    const targetTile = world.tiles.get(`${x},${y}`);
    if (targetTile?.type === 'forest' || targetTile?.type === 'hills') {
      travelTime += 1;
    }
    
    // Révéler et déplacer
    set(state => ({
      world: {
        ...state.world,
        playerPosition: { x, y },
        tiles: new Map(state.world.tiles).set(`${x},${y}`, {
          ...state.world.tiles.get(`${x},${y}`)!,
          isRevealed: true,
          isExplored: true,
        }),
      },
    }));
    
    advanceTime(travelTime);
    
    // Vérifier loot sur la tuile
    const loot = targetTile?.loot;
    if (loot) {
      set({ currentLoot: loot });
    }
  },
}));
```

```tsx
// Mise à jour LootPopup pour gérer la surcharge

function LootPopup({ loot, onTake, onLeave }: LootPopupProps) {
  const { canCarryMore, getCurrentWeight, inventory } = useGameStore();
  const canTake = canCarryMore(loot.weight);
  const currentWeight = getCurrentWeight();
  const weightAfter = currentWeight + loot.weight;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className={/* ... */}>
        {/* ... header et stats ... */}
        
        {/* Avertissement poids */}
        {!canTake && (
          <div className="bg-red-900/50 border border-red-500 rounded p-3 mb-4 text-center">
            <p className="text-red-400 font-bold">⚠️ SURCHARGÉ</p>
            <p className="text-sm text-red-300">
              {weightAfter.toFixed(1)}kg / {inventory.maxWeight}kg
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Jette quelque chose d'abord.
            </p>
          </div>
        )}
        
        {/* Prévisualisation poids */}
        {canTake && (
          <div className="text-sm text-zinc-400 mb-4 text-center">
            Poids après : {weightAfter.toFixed(1)}kg / {inventory.maxWeight}kg
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onTake}
            disabled={!canTake}
            className={`
              flex-1 py-3 rounded font-bold transition
              ${canTake 
                ? 'bg-emerald-600 hover:bg-emerald-500' 
                : 'bg-zinc-600 cursor-not-allowed opacity-50'}
            `}
          >
            {canTake ? '✓ PRENDRE' : '✗ TROP LOURD'}
          </button>
          <button
            onClick={onLeave}
            className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 rounded font-bold transition"
          >
            LAISSER
          </button>
        </div>
      </div>
    </div>
  );
}
```

```tsx
// features/ui/StatusBar.tsx

function StatusBar() {
  const { player, world, getCurrentWeight, inventory } = useGameStore();
  const weight = getCurrentWeight();
  
  return (
    <div className="flex items-center gap-6 p-4 bg-zinc-800 rounded-lg">
      {/* HP */}
      <div className="flex items-center gap-2">
        <span className="text-red-500">❤️</span>
        <span>{player.hp}/{player.maxHp}</span>
      </div>
      
      {/* Faim */}
      <div className="flex items-center gap-2">
        <span>🍖</span>
        <span className={player.hunger < 1 ? 'text-red-400' : ''}>
          {player.hunger.toFixed(1)}j
        </span>
      </div>
      
      {/* Poids */}
      <div className="flex items-center gap-2">
        <span>⚖️</span>
        <span className={weight > inventory.maxWeight * 0.8 ? 'text-yellow-400' : ''}>
          {weight.toFixed(1)}/{inventory.maxWeight}kg
        </span>
      </div>
      
      {/* Temps */}
      <div className="flex items-center gap-2">
        <span>🕐</span>
        <span>Jour {world.time.day}, {world.time.hour}h</span>
      </div>
      
      {/* Or */}
      <div className="flex items-center gap-2">
        <span>💰</span>
        <span>{player.gold}p</span>
      </div>
    </div>
  );
}
```

#### Critère de Validation ✅

```
□ Je trouve un item de 3kg alors que j'ai 8kg → Je peux le prendre (11kg > 10kg interdit)
□ Le bouton "PRENDRE" est grisé avec message "TROP LOURD"
□ Je peux jeter un item depuis mon sac → Poids diminue
□ Après avoir jeté, je peux prendre le nouvel item
□ Chaque déplacement fait avancer l'heure (+1h ou +2h)
□ Le jour change après 24h
□ La faim diminue visiblement au fil du temps
```

---

### BLOC 4 : La Menace (Rencontres & Combat)

> **Objectif Émotionnel :** L'exploration a un prix.
> Chaque case cachée peut être un danger.

#### Fonctionnalités

| # | Feature | Description | Priorité |
|---|---------|-------------|----------|
| 4.1 | Rencontre Aléatoire | Certaines tuiles déclenchent un combat à l'arrivée | 🔴 Critical |
| 4.2 | Écran Combat | Interface tour par tour avec stats visibles | 🔴 Critical |
| 4.3 | Action ATTAQUER | Dégâts = ATK joueur - DEF ennemi | 🔴 Critical |
| 4.4 | Action DÉFENDRE | Dégâts reçus /2, +1 ATK prochain tour | 🔴 Critical |
| 4.5 | Action FUIR | % de réussite, si échec = 1 coup gratuit ennemi | 🔴 Critical |
| 4.6 | Patterns Ennemis | IA prévisible (attaque/défend/recule) | 🟡 High |
| 4.7 | Loot Ennemi | Drop après victoire | 🟡 High |
| 4.8 | Game Over | HP = 0 → Respawn hub avec pénalités | 🟡 High |

#### Types d'Ennemis (Prototype)

```typescript
// data/enemies.ts

interface Enemy {
  id: string;
  name: string;
  hp: number;
  atk: number;
  def: number;
  pattern: ('attack' | 'defend' | 'rest')[];
  fleeChance: number;  // % de réussite fuite joueur
  loot: { itemId: string; chance: number }[];
  description: string;
}

export const ENEMIES: Enemy[] = [
  {
    id: 'wolf',
    name: 'Loup Errant',
    hp: 40,
    atk: 4,
    def: 0,
    pattern: ['attack', 'attack', 'rest'],
    fleeChance: 0.7,
    loot: [
      { itemId: 'cons_meat', chance: 0.5 },
      { itemId: 'wolf_pelt', chance: 0.3 },
    ],
    description: 'Affamé. Agressif. Yeux jaunes dans l\'ombre.',
  },
  {
    id: 'bandit',
    name: 'Bandit Solitaire',
    hp: 60,
    atk: 5,
    def: 1,
    pattern: ['attack', 'attack', 'attack'],
    fleeChance: 0.6,
    loot: [
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'wpn_dagger', chance: 0.4 },
    ],
    description: 'Haillons et lame rouillée. Désespéré.',
  },
  {
    id: 'mercenary',
    name: 'Mercenaire Rival',
    hp: 80,
    atk: 6,
    def: 2,
    pattern: ['attack', 'defend', 'attack', 'defend'],
    fleeChance: 0.8,
    loot: [
      { itemId: 'gold_pouch', chance: 1.0 },
      { itemId: 'wpn_longsword', chance: 0.6 },
      { itemId: 'arm_gambeson', chance: 0.4 },
    ],
    description: 'Armure usée mais entretenue. Regard calculateur.',
  },
];

// Spawn selon biome
export function spawnEnemy(tileType: TileType): Enemy | null {
  const spawnTable: Record<TileType, { enemyId: string; chance: number }[]> = {
    hub: [],
    plain: [{ enemyId: 'bandit', chance: 0.2 }],
    forest: [
      { enemyId: 'wolf', chance: 0.4 },
      { enemyId: 'bandit', chance: 0.2 },
    ],
    hills: [{ enemyId: 'bandit', chance: 0.3 }],
    ruins: [
      { enemyId: 'mercenary', chance: 0.5 },
      { enemyId: 'bandit', chance: 0.3 },
    ],
    village: [{ enemyId: 'bandit', chance: 0.1 }],
  };
  
  const table = spawnTable[tileType];
  for (const entry of table) {
    if (Math.random() < entry.chance) {
      return ENEMIES.find(e => e.id === entry.enemyId) || null;
    }
  }
  return null;
}
```

#### Implémentation Combat

```tsx
// features/combat/CombatScreen.tsx

function CombatScreen() {
  const { 
    combat, 
    player, 
    inventory,
    performAction,
    endCombat,
  } = useGameStore();
  
  const { enemy, turn, playerDefendBonus } = combat;
  if (!enemy) return null;
  
  // Calcul ATK/DEF joueur
  const playerAtk = (inventory.equipped.weapon?.stats?.atk || 1) + (playerDefendBonus || 0);
  const playerDef = inventory.equipped.armor?.stats?.def || 0;
  
  // Pattern ennemi
  const enemyAction = enemy.pattern[turn % enemy.pattern.length];
  
  // Prévisualisation dégâts
  const damageToEnemy = Math.max(1, playerAtk - enemy.def);
  const damageToPlayer = Math.max(1, enemy.atk - playerDef);
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl p-6 bg-zinc-900 rounded-lg border border-red-900">
        <h2 className="text-center text-2xl font-bold text-red-500 mb-6">
          ⚔️ COMBAT ⚔️
        </h2>
        
        {/* Combattants */}
        <div className="flex justify-between items-center mb-8">
          {/* Joueur */}
          <div className="text-center">
            <div className="text-4xl mb-2">🧭</div>
            <h3 className="font-bold">Toi</h3>
            <div className="text-red-400">{player.hp}/{player.maxHp} HP</div>
            <div className="text-sm text-zinc-400">
              ATK {playerAtk} | DEF {playerDef}
            </div>
          </div>
          
          <div className="text-4xl text-zinc-600">VS</div>
          
          {/* Ennemi */}
          <div className="text-center">
            <div className="text-4xl mb-2">
              {enemy.id === 'wolf' ? '🐺' : enemy.id === 'mercenary' ? '⚔️' : '🗡️'}
            </div>
            <h3 className="font-bold">{enemy.name}</h3>
            <div className="text-red-400">{combat.enemyHp}/{enemy.hp} HP</div>
            <div className="text-sm text-zinc-400">
              ATK {enemy.atk} | DEF {enemy.def}
            </div>
          </div>
        </div>
        
        {/* Info Pattern */}
        <div className="text-center mb-6 p-3 bg-zinc-800 rounded">
          <p className="text-sm text-zinc-400">Tour {turn + 1}</p>
          <p className="text-yellow-400">
            L'ennemi va probablement: {
              enemyAction === 'attack' ? '⚔️ ATTAQUER' :
              enemyAction === 'defend' ? '🛡️ DÉFENDRE' :
              '💤 SE REPOSER'
            }
          </p>
        </div>
        
        {/* Actions */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => performAction('attack')}
            className="p-4 bg-red-800 hover:bg-red-700 rounded-lg transition"
          >
            <div className="text-2xl mb-1">⚔️</div>
            <div className="font-bold">ATTAQUER</div>
            <div className="text-sm text-red-300">
              {damageToEnemy} dégâts
            </div>
          </button>
          
          <button
            onClick={() => performAction('defend')}
            className="p-4 bg-blue-800 hover:bg-blue-700 rounded-lg transition"
          >
            <div className="text-2xl mb-1">🛡️</div>
            <div className="font-bold">DÉFENDRE</div>
            <div className="text-sm text-blue-300">
              Dégâts ÷2, +1 ATK tour suivant
            </div>
          </button>
          
          <button
            onClick={() => performAction('flee')}
            className="p-4 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition"
          >
            <div className="text-2xl mb-1">🏃</div>
            <div className="font-bold">FUIR</div>
            <div className="text-sm text-zinc-300">
              {Math.round(enemy.fleeChance * 100)}% de succès
            </div>
          </button>
        </div>
        
        {/* Description */}
        <p className="mt-6 text-center text-zinc-500 italic">
          "{enemy.description}"
        </p>
      </div>
    </div>
  );
}
```

```typescript
// store/gameStore.ts (logique combat)

performAction: (action: 'attack' | 'defend' | 'flee') => {
  const { combat, player, inventory } = get();
  const enemy = combat.enemy!;
  
  const playerAtk = (inventory.equipped.weapon?.stats?.atk || 1) + (combat.defendBonus || 0);
  const playerDef = inventory.equipped.armor?.stats?.def || 0;
  const enemyAction = enemy.pattern[combat.turn % enemy.pattern.length];
  
  let newPlayerHp = player.hp;
  let newEnemyHp = combat.enemyHp;
  let newDefendBonus = 0;
  
  // === ACTION JOUEUR ===
  if (action === 'attack') {
    const damage = Math.max(1, playerAtk - enemy.def);
    newEnemyHp -= damage;
  } else if (action === 'defend') {
    newDefendBonus = 1;
  } else if (action === 'flee') {
    if (Math.random() < enemy.fleeChance) {
      // Fuite réussie
      set({ combat: { isActive: false, enemy: null, turn: 0, enemyHp: 0, defendBonus: 0 } });
      return { success: true, fled: true };
    }
    // Fuite échouée = coup gratuit ennemi
    const damage = Math.max(1, enemy.atk - playerDef);
    newPlayerHp -= damage;
  }
  
  // === ACTION ENNEMI ===
  if (newEnemyHp > 0 && action !== 'flee') {
    if (enemyAction === 'attack') {
      let damage = Math.max(1, enemy.atk - playerDef);
      if (action === 'defend') damage = Math.floor(damage / 2);
      newPlayerHp -= damage;
    }
    // defend/rest = ennemi ne fait rien d'offensif
  }
  
  // === RÉSOLUTION ===
  
  // Mort joueur
  if (newPlayerHp <= 0) {
    set(state => ({
      player: { ...state.player, hp: 30 }, // Respawn blessé
      combat: { isActive: false, enemy: null, turn: 0, enemyHp: 0, defendBonus: 0 },
      // Pénalité: perte 50% or
      inventory: { ...state.inventory, gold: Math.floor(state.player.gold / 2) },
    }));
    // Téléport hub
    set(state => ({
      world: { ...state.world, playerPosition: { x: 2, y: 2 } },
    }));
    return { success: false, died: true };
  }
  
  // Victoire joueur
  if (newEnemyHp <= 0) {
    // Loot ennemi
    const drops = enemy.loot.filter(l => Math.random() < l.chance);
    
    set(state => ({
      player: { ...state.player, hp: newPlayerHp },
      combat: { isActive: false, enemy: null, turn: 0, enemyHp: 0, defendBonus: 0 },
    }));
    
    // Afficher loot via queue
    if (drops.length > 0) {
      // TODO: Queue de loot drops
    }
    
    return { success: true, victory: true, drops };
  }
  
  // Combat continue
  set(state => ({
    player: { ...state.player, hp: newPlayerHp },
    combat: { 
      ...state.combat, 
      enemyHp: newEnemyHp, 
      turn: state.combat.turn + 1,
      defendBonus: newDefendBonus,
    },
  }));
  
  return { success: true, continues: true };
},
```

#### Critère de Validation ✅

```
□ J'arrive sur une tuile avec ennemi → Écran combat s'affiche
□ Je vois mes stats (HP, ATK, DEF) et celles de l'ennemi
□ Le pattern ennemi est affiché/devinable
□ ATTAQUER → Je fais des dégâts (ATK - DEF ennemi)
□ L'ennemi riposte selon son pattern
□ DÉFENDRE → Je prends moitié dégâts, +1 ATK au tour suivant
□ FUIR → % de réussite, si échec je prends 1 coup
□ Victoire → Loot apparaît
□ Défaite → Respawn au Hub avec HP 30 et perte d'or
```

---

### BLOC 5 : Le Refuge (Hub & Boucle Complète)

> **Objectif Émotionnel :** Le retour au bercail.
> Après le danger, un moment de calme et de préparation.

#### Fonctionnalités

| # | Feature | Description | Priorité |
|---|---------|-------------|----------|
| 5.1 | Écran Hub | Interface dédiée quand on est sur la tuile Hub | 🔴 Critical |
| 5.2 | Repos | Dépenser or pour heal HP et faim | 🔴 Critical |
| 5.3 | Équipement | Changer arme/armure équipée depuis le coffre | 🔴 Critical |
| 5.4 | Coffre | Stockage illimité, persist entre sessions | 🟡 High |
| 5.5 | Marchand | Acheter/vendre items (prix fixes) | 🟡 High |
| 5.6 | Sauvegarde | LocalStorage auto-save | 🟡 High |

#### Implémentation

```tsx
// features/hub/HubScreen.tsx

function HubScreen() {
  const { player, inventory, restAtHub, world } = useGameStore();
  const [activeTab, setActiveTab] = useState<'rest' | 'equipment' | 'chest' | 'shop'>('rest');
  
  // Vérifier qu'on est bien au hub
  const isAtHub = world.playerPosition.x === 2 && world.playerPosition.y === 2;
  if (!isAtHub) return null;
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-amber-950 to-zinc-900 z-40">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">
            🏠 Auberge du Carrefour
          </h1>
          <p className="text-zinc-400 italic">
            "Bienvenue, mercenaire. Qu'est-ce qui te ferait plaisir?"
          </p>
        </div>
        
        {/* Stats joueur */}
        <div className="flex justify-center gap-8 mb-6 p-4 bg-zinc-800/50 rounded-lg">
          <div>❤️ {player.hp}/{player.maxHp}</div>
          <div>🍖 {player.hunger.toFixed(1)}j</div>
          <div>💰 {player.gold}p</div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'rest', label: '🛏️ Repos', cost: '5p' },
            { id: 'equipment', label: '⚔️ Équipement', cost: '' },
            { id: 'chest', label: '📦 Coffre', cost: '' },
            { id: 'shop', label: '🛒 Marchand', cost: '' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex-1 p-3 rounded-lg transition
                ${activeTab === tab.id 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-zinc-700 hover:bg-zinc-600'}
              `}
            >
              {tab.label}
              {tab.cost && <span className="text-xs ml-1 opacity-70">{tab.cost}</span>}
            </button>
          ))}
        </div>
        
        {/* Contenu tab */}
        <div className="bg-zinc-800 rounded-lg p-6 min-h-[300px]">
          {activeTab === 'rest' && <RestTab />}
          {activeTab === 'equipment' && <EquipmentTab />}
          {activeTab === 'chest' && <ChestTab />}
          {activeTab === 'shop' && <ShopTab />}
        </div>
        
        {/* Bouton partir */}
        <button
          onClick={() => {/* Fermer hub screen, retour map */}}
          className="w-full mt-6 p-4 bg-emerald-700 hover:bg-emerald-600 rounded-lg font-bold text-lg transition"
        >
          🚪 Repartir en Exploration
        </button>
      </div>
    </div>
  );
}

function RestTab() {
  const { player, restAtHub } = useGameStore();
  
  const options = [
    { 
      id: 'basic', 
      name: 'Repos & Repas', 
      cost: 5, 
      heal: 50, 
      hunger: 3,
      desc: 'Ragoût chaud et pain frais',
    },
    { 
      id: 'luxury', 
      name: 'Chambre Luxe', 
      cost: 15, 
      heal: 100, 
      hunger: 4,
      desc: 'Lit propre, eau chaude, vraie nourriture',
    },
  ];
  
  return (
    <div className="space-y-4">
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => restAtHub(opt.id)}
          disabled={player.gold < opt.cost}
          className={`
            w-full p-4 rounded-lg text-left transition
            ${player.gold >= opt.cost 
              ? 'bg-zinc-700 hover:bg-zinc-600' 
              : 'bg-zinc-800 opacity-50 cursor-not-allowed'}
          `}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">{opt.name}</h3>
              <p className="text-sm text-zinc-400">{opt.desc}</p>
              <p className="text-sm mt-1">
                <span className="text-red-400">+{opt.heal} HP</span>
                {' • '}
                <span className="text-green-400">+{opt.hunger}j faim</span>
              </p>
            </div>
            <div className="text-xl font-bold text-amber-400">
              {opt.cost}p
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
```

#### Critère de Validation ✅

```
□ Arriver sur la tuile Hub → Écran spécial Auberge apparaît
□ Je peux voir mes stats actuelles (HP, faim, or)
□ "Repos & Repas" coûte 5p → +50 HP, +3j faim
□ "Chambre Luxe" coûte 15p → Full HP, +4j faim
□ Je peux équiper/déséquiper armes et armures
□ Je peux stocker items dans le coffre
□ Je peux vendre du loot au marchand
□ "Repartir" → Retour sur la carte, je peux explorer
□ La partie se sauvegarde automatiquement
```

---

## 3. Definition of Done (Prototype v0.1)

### Critères Globaux

```
□ Je peux lancer le jeu dans un navigateur
□ Je spawn au centre d'une grille 5x5 (Hub visible)
□ Je peux explorer en cliquant sur les cases adjacentes
□ Le brouillard se lève progressivement
□ Je trouve du loot aléatoire (armes, armures, consommables)
□ Je dois gérer mon poids (10kg max)
□ Je rencontre des ennemis (loups, bandits)
□ Le combat est tour par tour (ATK/DEF/FLEE)
□ Je peux mourir et respawn au hub
□ Le hub permet de me soigner et m'équiper
□ Une session dure 15-30 minutes
□ Le jeu sauvegarde automatiquement
```

### Métriques de Succès

| Métrique | Cible | Comment mesurer |
|----------|-------|-----------------|
| Temps avant abandon | > 10 min | Timer session |
| Tuiles explorées | > 8/25 | Compteur |
| Retour au hub | > 2 fois | Compteur |
| Combats tentés | > 3 | Compteur |
| Items ramassés | > 5 | Compteur |

---

## 4. Notes Techniques

### Performance

- Pas de re-render inutile (Zustand selectors)
- Map stockée en `Map<string, Tile>` pour accès O(1)
- Animations CSS uniquement (pas de JS)

### Accessibilité (Greybox)

- Contrastes forts (texte blanc sur fond sombre)
- Tailles cliquables généreuses (min 48px)
- Feedback visuel sur hover/focus

### Mobile-First

- Grid responsive (3x3 sur mobile, 5x5 sur desktop)
- Touch targets adaptés
- Popups en plein écran sur mobile

---

## 5. Prochaines Étapes (Post-Prototype)

1. **Étendre la carte** → 15 tuiles (layout du GDD)
2. **Événements narratifs** → Voyageur blessé, feu de camp
3. **Compétences** → Vigilant, Traqueur
4. **Élites** → Chef de patrouille
5. **Tableau d'annonces** → Rumeurs et quêtes informelles

---

*Document généré pour SOUDA: Terra Incognita v0.1*
*Approche: Exploration First, Fun Before Constraints*
