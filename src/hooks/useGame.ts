// ============================================
// HOOKS - Game Store Selectors
// ============================================

import { useGameStore } from '../store/gameStore';

/**
 * Hook pour accéder à l'état du joueur
 */
export function usePlayer() {
  return useGameStore(state => ({
    ...state.player,
    maxHp: state.getPlayerMaxHp(),
    atk: state.getPlayerAtk(),
    def: state.getPlayerDef(),
  }));
}

/**
 * Hook pour accéder à l'inventaire
 */
export function useInventory() {
  const inventory = useGameStore(state => state.inventory);
  const getCurrentWeight = useGameStore(state => state.getCurrentWeight);
  const canCarryMore = useGameStore(state => state.canCarryMore);
  
  return {
    ...inventory,
    currentWeight: getCurrentWeight(),
    canCarryMore,
  };
}

/**
 * Hook pour accéder à l'état du combat
 */
export function useCombat() {
  const combat = useGameStore(state => state.combat);
  const performCombat = useGameStore(state => state.performCombat);
  const tryFlee = useGameStore(state => state.tryFlee);
  const tryTalk = useGameStore(state => state.tryTalk);
  const endCombat = useGameStore(state => state.endCombat);
  
  return {
    ...combat,
    performCombat,
    tryFlee,
    tryTalk,
    endCombat,
  };
}

/**
 * Hook pour accéder aux quêtes
 */
export function useQuests() {
  const activeQuests = useGameStore(state => state.activeQuests);
  const completedQuests = useGameStore(state => state.completedQuests);
  const stats = useGameStore(state => state.stats);
  const acceptQuest = useGameStore(state => state.acceptQuest);
  const completeQuest = useGameStore(state => state.completeQuest);
  
  return {
    activeQuests,
    completedQuests,
    stats,
    acceptQuest,
    completeQuest,
  };
}

/**
 * Hook pour accéder à l'écran actuel
 */
export function useScreen() {
  const screen = useGameStore(state => state.screen);
  const setScreen = useGameStore(state => state.setScreen);
  
  return { screen, setScreen };
}
