// ============================================
// QUÊTES - SOUDA: Terra Incognita
// ============================================

export interface Quest {
  id: string;
  title: string;
  description: string;
  giver: string;
  type: 'explore' | 'kill' | 'collect';
  target: {
    count: number;
    biome?: string;
    enemyId?: string;
    itemId?: string;
  };
  reward: {
    gold: number;
    karma?: number;
  };
}

export const QUESTS: Quest[] = [
  {
    id: 'quest_explore_ruins',
    title: 'Cartographier les Ruines',
    description: 'Les ruines au nord cachent des secrets. Explore 3 ruines et reviens me faire un rapport.',
    giver: 'Aldric le Cartographe',
    type: 'explore',
    target: { count: 3, biome: 'ruins' },
    reward: { gold: 30, karma: 2 },
  },
  {
    id: 'quest_kill_wolves',
    title: 'Chasse aux Loups',
    description: 'Les loups menacent les voyageurs. Élimine 3 loups pour sécuriser les routes.',
    giver: 'Gareth le Garde',
    type: 'kill',
    target: { count: 3, enemyId: 'wolf' },
    reward: { gold: 25, karma: 1 },
  },
  {
    id: 'quest_explore_villages',
    title: 'Villages Perdus',
    description: 'On dit que les villages abandonnés contiennent encore des provisions. Fouille 2 villages.',
    giver: 'Elena la Marchande',
    type: 'explore',
    target: { count: 2, biome: 'village' },
    reward: { gold: 20 },
  },
  {
    id: 'quest_kill_bandits',
    title: 'Justice Expéditive',
    description: 'Les bandits rançonnent les voyageurs. Mets-en 2 hors d\'état de nuire.',
    giver: 'Marcus le Vétéran',
    type: 'kill',
    target: { count: 2, enemyId: 'bandit' },
    reward: { gold: 35, karma: 2 },
  },
  {
    id: 'quest_explore_all',
    title: 'Le Grand Tour',
    description: 'Explore 15 zones différentes. Un vrai mercenaire connaît son territoire.',
    giver: 'Le Tavernier',
    type: 'explore',
    target: { count: 15 },
    reward: { gold: 50, karma: 3 },
  },
];

// Obtenir 3 quêtes aléatoires
export function getRandomQuests(count: number = 3): Quest[] {
  const shuffled = [...QUESTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
