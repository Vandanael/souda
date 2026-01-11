import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  GameStore, 
  GameState, 
  Tile, 
  LootCard, 
  Enemy,
  CombatResult,
  GameScreen 
} from '../types';
import { 
  generateMap, 
  HUB_POSITION, 
  getAdjacentPositions,
  areAdjacent,
  TRAVEL_TIME 
} from '../data/map';
import { rollLoot, STARTER_WEAPON, STARTER_ARMOR, STARTER_ITEMS, getLootById } from '../data/loot';
import { spawnEnemy } from '../data/enemies';
import { rollEvent } from '../data/events';
import type { EventChoice } from '../types';

// ============================================
// GAME STORE - SOUDA: Terra Incognita
// ============================================

// État initial
const createInitialState = (): GameState => ({
  screen: 'map',
  
  player: {
    hp: 100,
    maxHp: 100,
    hunger: 4, // 4 jours de faim
    gold: 5,
  },
  
  inventory: {
    bag: [...STARTER_ITEMS],
    equipped: {
      weapon: { ...STARTER_WEAPON },
      armor: { ...STARTER_ARMOR },
      skills: [],
    },
    chest: [],
    maxWeight: 10,
  },
  
  world: {
    tiles: generateMap(),
    playerPosition: { ...HUB_POSITION },
    time: { hour: 8, day: 1 },
  },
  
  combat: {
    isActive: false,
    enemy: null,
    enemyHp: 0,
    turn: 0,
    defendBonus: 0,
    log: [],
  },
  
  currentLoot: null,
  currentEvent: null,
  
  stats: {
    tilesExplored: 1, // Hub déjà exploré
    enemiesKilled: 0,
    itemsCollected: 0,
    deaths: 0,
  },
});

// Store Zustand avec persistence
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      // ========================================
      // WORLD ACTIONS
      // ========================================

      getAdjacentTiles: (): Tile[] => {
        const { world } = get();
        const adjacentPositions = getAdjacentPositions(world.playerPosition);
        
        return adjacentPositions
          .map(pos => world.tiles.get(`${pos.x},${pos.y}`))
          .filter((tile): tile is Tile => tile !== undefined);
      },

      revealTile: (x: number, y: number) => {
        const tileId = `${x},${y}`;
        
        set(state => {
          const tile = state.world.tiles.get(tileId);
          if (!tile || tile.isRevealed) return state;
          
          const newTiles = new Map(state.world.tiles);
          newTiles.set(tileId, { ...tile, isRevealed: true });
          
          return {
            world: { ...state.world, tiles: newTiles },
          };
        });
      },

      moveTo: (x: number, y: number) => {
        const state = get();
        const { world, advanceTime, inventory } = state;
        const tileId = `${x},${y}`;
        const targetTile = world.tiles.get(tileId);
        
        if (!targetTile) return;
        
        // Vérifier si la tuile est adjacente
        if (!areAdjacent(world.playerPosition, { x, y })) return;
        
        // Vérifier si le joueur est surchargé (ne peut pas bouger si > maxWeight)
        const currentWeight = get().getCurrentWeight();
        if (currentWeight > inventory.maxWeight) {
          // Ne peut pas bouger si surchargé
          return;
        }
        
        // Calculer le temps de voyage
        let travelTime = TRAVEL_TIME[targetTile.type];
        
        // Ralentissement si poids > 80%
        if (currentWeight > inventory.maxWeight * 0.8) {
          travelTime += 1;
        }
        
        // Vérifier si c'est la première visite
        const isFirstVisit = !targetTile.isExplored;
        
        // Générer le contenu si première visite
        let loot: LootCard | null = null;
        let enemy: Enemy | null = null;
        
        if (isFirstVisit && targetTile.type !== 'hub') {
          loot = rollLoot(targetTile.type);
          enemy = spawnEnemy(targetTile.type);
        }
        
        // Mettre à jour les tuiles
        const newTiles = new Map(world.tiles);
        newTiles.set(tileId, {
          ...targetTile,
          isRevealed: true,
          isExplored: true,
          loot,
          hasDanger: enemy !== null,
        });
        
        // Révéler les tuiles adjacentes (brouillard partiel)
        const adjacentToNew = getAdjacentPositions({ x, y });
        adjacentToNew.forEach(pos => {
          const adjTile = newTiles.get(`${pos.x},${pos.y}`);
          if (adjTile && !adjTile.isRevealed) {
            // On ne révèle que partiellement (visible mais pas exploré)
            // Pour le prototype, on les laisse non-révélées jusqu'à ce qu'on y aille
          }
        });
        
        set(state => ({
          world: {
            ...state.world,
            tiles: newTiles,
            playerPosition: { x, y },
          },
          currentLoot: loot,
          stats: {
            ...state.stats,
            tilesExplored: isFirstVisit 
              ? state.stats.tilesExplored + 1 
              : state.stats.tilesExplored,
          },
        }));
        
        // Avancer le temps
        advanceTime(travelTime);
        
        // Déclencher le combat si ennemi
        if (enemy) {
          get().startCombat(enemy);
          return;
        }
        
        // Déclencher un événement aléatoire (si pas de combat et pas de loot)
        if (isFirstVisit && !loot && targetTile.type !== 'hub') {
          const event = rollEvent(targetTile.type);
          if (event) {
            set({ currentEvent: event });
            return;
          }
        }
        
        // Si c'est le hub, changer d'écran
        if (targetTile.type === 'hub') {
          set({ screen: 'hub' });
        }
      },

      // ========================================
      // LOOT ACTIONS
      // ========================================

      takeLoot: () => {
        const { currentLoot, inventory, world } = get();
        
        if (!currentLoot) {
          return { success: false, reason: 'no_loot' };
        }
        
        const currentWeight = get().getCurrentWeight();
        if (currentWeight + currentLoot.weight > inventory.maxWeight) {
          return { success: false, reason: 'overweight' };
        }
        
        // Ajouter au sac
        set(state => ({
          inventory: {
            ...state.inventory,
            bag: [...state.inventory.bag, currentLoot],
          },
          currentLoot: null,
          stats: {
            ...state.stats,
            itemsCollected: state.stats.itemsCollected + 1,
          },
        }));
        
        // Retirer le loot de la tuile
        const pos = world.playerPosition;
        const tileId = `${pos.x},${pos.y}`;
        
        set(state => {
          const newTiles = new Map(state.world.tiles);
          const tile = newTiles.get(tileId);
          if (tile) {
            newTiles.set(tileId, { ...tile, loot: null });
          }
          return { world: { ...state.world, tiles: newTiles } };
        });
        
        return { success: true };
      },

      leaveLoot: () => {
        set({ currentLoot: null });
      },

      dropItem: (index: number) => {
        set(state => ({
          inventory: {
            ...state.inventory,
            bag: state.inventory.bag.filter((_, i) => i !== index),
          },
        }));
      },

      // ========================================
      // PLAYER ACTIONS
      // ========================================

      getCurrentWeight: (): number => {
        const { inventory } = get();
        const bagWeight = inventory.bag.reduce((sum, item) => sum + item.weight, 0);
        const weaponWeight = inventory.equipped.weapon?.weight || 0;
        const armorWeight = inventory.equipped.armor?.weight || 0;
        return bagWeight + weaponWeight + armorWeight;
      },

      canCarryMore: (weight: number): boolean => {
        const { inventory } = get();
        return get().getCurrentWeight() + weight <= inventory.maxWeight;
      },

      getPlayerAtk: (): number => {
        const { inventory, combat } = get();
        const baseAtk = inventory.equipped.weapon?.stats.atk || 1;
        return baseAtk + combat.defendBonus;
      },

      getPlayerDef: (): number => {
        const { inventory } = get();
        return inventory.equipped.armor?.stats.def || 0;
      },

      // ========================================
      // COMBAT ACTIONS (Simplifié)
      // ========================================

      startCombat: (enemy: Enemy) => {
        set({
          combat: {
            isActive: true,
            enemy,
            enemyHp: enemy.hp,
            turn: 0,
            defendBonus: 0,
            log: [],
          },
          screen: 'combat',
        });
      },

      // Combat instantané - résolution complète
      performCombat: (): CombatResult => {
        const state = get();
        const { combat, player } = state;
        const enemy = combat.enemy;
        
        if (!enemy) return { success: false, message: 'Pas d\'ennemi' };
        
        const playerAtk = state.getPlayerAtk();
        const playerDef = state.getPlayerDef();
        
        // Calcul du combat complet
        const damageToEnemy = Math.max(1, playerAtk - enemy.def);
        const damageToPlayer = Math.max(1, enemy.atk - playerDef);
        
        // Nombre de tours pour tuer l'ennemi
        const turnsToKill = Math.ceil(combat.enemyHp / damageToEnemy);
        
        // Dégâts totaux subis
        const totalDamage = turnsToKill * damageToPlayer;
        const newPlayerHp = player.hp - totalDamage;
        
        // === MORT DU JOUEUR ===
        if (newPlayerHp <= 0) {
          set(state => ({
            player: { ...state.player, hp: 30 },
            combat: { 
              isActive: false, 
              enemy: null, 
              enemyHp: 0, 
              turn: 0, 
              defendBonus: 0,
              log: [],
            },
            world: {
              ...state.world,
              playerPosition: { ...HUB_POSITION },
            },
            screen: 'map',
            stats: {
              ...state.stats,
              deaths: state.stats.deaths + 1,
            },
          }));
          set(state => ({
            player: { ...state.player, gold: Math.floor(state.player.gold / 2) },
          }));
          
          return { success: false, died: true, message: 'Tu es tombé...' };
        }
        
        // === VICTOIRE ===
        const drops: LootCard[] = [];
        enemy.loot.forEach(drop => {
          if (Math.random() < drop.chance) {
            const item = getLootById(drop.itemId);
            if (item) drops.push({ ...item });
          }
        });
        
        set(state => ({
          player: { ...state.player, hp: newPlayerHp },
          combat: { 
            isActive: false, 
            enemy: null, 
            enemyHp: 0, 
            turn: 0, 
            defendBonus: 0,
            log: [],
          },
          screen: 'map',
          stats: {
            ...state.stats,
            enemiesKilled: state.stats.enemiesKilled + 1,
          },
          currentLoot: drops[0] || null,
        }));
        
        return { success: true, victory: true, drops, message: 'Victoire !' };
      },

      // Tentative de fuite
      tryFlee: (): { fled: boolean; damageTaken: number } => {
        const state = get();
        const { combat, player } = state;
        const enemy = combat.enemy;
        
        if (!enemy) return { fled: false, damageTaken: 0 };
        
        const playerDef = state.getPlayerDef();
        
        if (Math.random() < enemy.fleeChance) {
          // Fuite réussie
          set({
            combat: { 
              isActive: false, 
              enemy: null, 
              enemyHp: 0, 
              turn: 0, 
              defendBonus: 0,
              log: [],
            },
            screen: 'map',
          });
          return { fled: true, damageTaken: 0 };
        }
        
        // Fuite échouée - prend un coup
        const damage = Math.max(1, enemy.atk - playerDef);
        const newHp = Math.max(1, player.hp - damage); // Au moins 1 HP
        
        set(state => ({
          player: { ...state.player, hp: newHp },
        }));
        
        return { fled: false, damageTaken: damage };
      },

      // Tentative de dialogue/RP
      tryTalk: (): { success: boolean; message: string } => {
        const state = get();
        const { combat, player } = state;
        const enemy = combat.enemy;
        
        if (!enemy) return { success: false, message: 'Pas d\'ennemi' };
        
        // Chances selon le type d'ennemi
        const rpChances: Record<string, number> = {
          wolf: 0,
          wolf_pack_alpha: 0,
          bandit: 0.4,
          mercenary: 0.3,
          deserter: 0.5,
          patrol_chief: 0.1,
        };
        
        const chance = rpChances[enemy.id] || 0.2;
        
        // Impossible avec les animaux
        if (chance === 0) {
          return { success: false, message: 'Cette créature ne comprend pas tes paroles.' };
        }
        
        if (Math.random() < chance) {
          // Succès RP - l'ennemi laisse partir
          const messages: Record<string, string> = {
            bandit: '"Passe ton chemin, je veux pas d\'ennuis..."',
            mercenary: '"On a rien à se prouver. Bonne route."',
            deserter: '"J\'en ai assez de me battre. Va-t\'en."',
            patrol_chief: '"Tu as du cran. File avant que je change d\'avis."',
          };
          
          // Parfois l'ennemi donne quelque chose
          let goldGained = 0;
          if (Math.random() < 0.3) {
            goldGained = Math.floor(Math.random() * 5) + 3;
            set(state => ({
              player: { ...state.player, gold: state.player.gold + goldGained },
            }));
          }
          
          set({
            combat: { 
              isActive: false, 
              enemy: null, 
              enemyHp: 0, 
              turn: 0, 
              defendBonus: 0,
              log: [],
            },
            screen: 'map',
          });
          
          const baseMessage = messages[enemy.id] || '"D\'accord, tu peux passer."';
          return { 
            success: true, 
            message: goldGained > 0 
              ? `${baseMessage} (+${goldGained} pièces)` 
              : baseMessage 
          };
        }
        
        // Échec RP - l'ennemi attaque
        const playerDef = state.getPlayerDef();
        const damage = Math.max(1, enemy.atk - playerDef);
        const newHp = Math.max(1, player.hp - damage);
        
        set(state => ({
          player: { ...state.player, hp: newHp },
        }));
        
        const failMessages = [
          '"Tu te fous de moi ?!" (-' + damage + ' HP)',
          '"Ta gueule et bats-toi !" (-' + damage + ' HP)',
          '"Les mots ne marchent pas ici." (-' + damage + ' HP)',
        ];
        
        return { 
          success: false, 
          message: failMessages[Math.floor(Math.random() * failMessages.length)] 
        };
      },

      // Ancien performAction gardé pour compatibilité mais pas utilisé
      performAction: (action: 'attack' | 'defend' | 'flee'): CombatResult => {
        if (action === 'attack') return get().performCombat();
        if (action === 'flee') {
          const res = get().tryFlee();
          return { success: res.fled, fled: res.fled };
        }
        return { success: false };
      },

      endCombat: () => {
        set({
          combat: {
            isActive: false,
            enemy: null,
            enemyHp: 0,
            turn: 0,
            defendBonus: 0,
            log: [],
          },
          screen: 'map',
        });
      },

      // ========================================
      // EVENT ACTIONS
      // ========================================

      resolveEventChoice: (choice: EventChoice): { success: boolean; message: string } => {
        const chance = choice.successChance ?? 1;
        const isSuccess = Math.random() < chance;
        
        if (isSuccess) {
          // Appliquer les effets de succès
          const effects = choice.effects;
          set(s => ({
            player: {
              ...s.player,
              hp: Math.min(s.player.maxHp, Math.max(0, s.player.hp + (effects.hp || 0))),
              hunger: Math.max(0, s.player.hunger + (effects.hunger || 0)),
              gold: Math.max(0, s.player.gold + (effects.gold || 0)),
            },
            currentEvent: null,
          }));
          
          return {
            success: true,
            message: choice.successMessage || 'Succès.',
          };
        } else {
          // Appliquer les effets d'échec
          const failEffects = choice.failEffects || {};
          set(s => ({
            player: {
              ...s.player,
              hp: Math.min(s.player.maxHp, Math.max(0, s.player.hp + (failEffects.hp || 0))),
              hunger: Math.max(0, s.player.hunger + (failEffects.hunger || 0)),
              gold: Math.max(0, s.player.gold + (failEffects.gold || 0)),
            },
            currentEvent: null,
          }));
          
          return {
            success: false,
            message: choice.failMessage || 'Échec.',
          };
        }
      },

      // ========================================
      // HUB ACTIONS
      // ========================================

      restAtHub: (option: 'basic' | 'luxury'): boolean => {
        const { player } = get();
        const cost = option === 'basic' ? 5 : 15;
        
        if (player.gold < cost) return false;
        
        const healAmount = option === 'basic' ? 50 : player.maxHp;
        const hungerRestore = option === 'basic' ? 3 : 4;
        
        set(state => ({
          player: {
            ...state.player,
            hp: Math.min(state.player.maxHp, state.player.hp + healAmount),
            hunger: Math.min(7, state.player.hunger + hungerRestore),
            gold: state.player.gold - cost,
          },
        }));
        
        // Avancer le temps
        get().advanceTime(option === 'basic' ? 2 : 8);
        
        return true;
      },

      equipItem: (item: LootCard) => {
        if (item.type !== 'weapon' && item.type !== 'armor' && item.type !== 'skill') return;
        
        set(state => {
          // Retirer l'item du sac
          const bagIndex = state.inventory.bag.findIndex(i => i.id === item.id);
          const newBag = [...state.inventory.bag];
          if (bagIndex >= 0) newBag.splice(bagIndex, 1);
          
          // Équiper un skill
          if (item.type === 'skill') {
            // Vérifier si ce skill n'est pas déjà équipé
            const alreadyEquipped = state.inventory.equipped.skills.some(s => s.id === item.id);
            if (alreadyEquipped) return state;
            
            return {
              inventory: {
                ...state.inventory,
                bag: newBag,
                equipped: {
                  ...state.inventory.equipped,
                  skills: [...state.inventory.equipped.skills, item],
                },
              },
            };
          }
          
          // Équiper arme/armure
          const slot = item.type as 'weapon' | 'armor';
          const currentEquipped = state.inventory.equipped[slot];
          
          // Remettre l'ancien équipement dans le sac si existant
          if (currentEquipped) newBag.push(currentEquipped);
          
          return {
            inventory: {
              ...state.inventory,
              bag: newBag,
              equipped: {
                ...state.inventory.equipped,
                [slot]: item,
              },
            },
          };
        });
      },

      unequipItem: (slot: 'weapon' | 'armor') => {
        set(state => {
          const item = state.inventory.equipped[slot];
          if (!item) return state;
          
          return {
            inventory: {
              ...state.inventory,
              bag: [...state.inventory.bag, item],
              equipped: {
                ...state.inventory.equipped,
                [slot]: null,
              },
            },
          };
        });
      },

      storeInChest: (index: number) => {
        set(state => {
          const item = state.inventory.bag[index];
          if (!item) return state;
          
          return {
            inventory: {
              ...state.inventory,
              bag: state.inventory.bag.filter((_, i) => i !== index),
              chest: [...state.inventory.chest, item],
            },
          };
        });
      },

      retrieveFromChest: (index: number) => {
        set(state => {
          const item = state.inventory.chest[index];
          if (!item) return state;
          
          return {
            inventory: {
              ...state.inventory,
              chest: state.inventory.chest.filter((_, i) => i !== index),
              bag: [...state.inventory.bag, item],
            },
          };
        });
      },

      // ========================================
      // TIME ACTIONS
      // ========================================

      advanceTime: (hours: number) => {
        set(state => {
          let newHour = state.world.time.hour + hours;
          let newDay = state.world.time.day;
          
          while (newHour >= 24) {
            newHour -= 24;
            newDay += 1;
          }
          
          // Faim diminue: 0.1 jour par heure
          const hungerLoss = hours * 0.1;
          const newHunger = Math.max(0, state.player.hunger - hungerLoss);
          
          // Si faim à 0, perte de HP
          let newHp = state.player.hp;
          if (newHunger <= 0) {
            newHp = Math.max(0, newHp - 5 * hours); // -5 HP par heure sans nourriture
          }
          
          // Game Over si HP à 0
          if (newHp <= 0) {
            return {
              ...state,
              player: { ...state.player, hp: 0, hunger: 0 },
              screen: 'gameover' as const,
            };
          }
          
          return {
            world: {
              ...state.world,
              time: { hour: newHour, day: newDay },
            },
            player: {
              ...state.player,
              hp: newHp,
              hunger: newHunger,
            },
          };
        });
      },

      // ========================================
      // GAME ACTIONS
      // ========================================

      setScreen: (screen: GameScreen) => {
        set({ screen });
      },

      resetGame: () => {
        set(createInitialState());
      },
    }),
    {
      name: 'souda-save',
      // Sérialisation personnalisée pour Map
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          // Reconstruire les Maps
          if (data.state?.world?.tiles) {
            data.state.world.tiles = new Map(Object.entries(data.state.world.tiles));
          }
          return data;
        },
        setItem: (name, value) => {
          // Convertir les Maps en objets
          const toStore = {
            ...value,
            state: {
              ...value.state,
              world: {
                ...value.state.world,
                tiles: Object.fromEntries(value.state.world.tiles),
              },
            },
          };
          localStorage.setItem(name, JSON.stringify(toStore));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
