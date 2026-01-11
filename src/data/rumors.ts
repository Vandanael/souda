// ============================================
// RUMEURS & ANNONCES - SOUDA: Terra Incognita
// ============================================

export interface Rumor {
  id: string;
  author: string;
  date: string;
  content: string;
  hint?: string;  // Indice de gameplay optionnel
}

export const RUMORS: Rumor[] = [
  {
    id: 'patrol_chief',
    author: 'Marcus',
    date: 'il y a 2 jours',
    content: 'ATTENTION : Chef de patrouille vu près des Ruines au Nord. Armure lourde, épée longue. Très dangereux.\n\nIl porte une bourse bien remplie, paraît-il.',
    hint: 'Les ruines contiennent des ennemis puissants mais du bon loot.',
  },
  {
    id: 'hidden_cache',
    author: 'Anonyme',
    date: 'semaine dernière',
    content: 'Les Collines de l\'Est cachent des coffres. Anciennes caches de contrebandiers de la guerre.\n\nCherchez sous les rochers marqués.',
    hint: 'Les collines ont un meilleur taux de loot.',
  },
  {
    id: 'wolf_pack',
    author: 'Sarah',
    date: 'hier',
    content: 'La Forêt Sombre, au Sud-Ouest : j\'y ai vu une meute de loups. 4 ou 5 bêtes.\n\nFuyez si vous n\'êtes pas bien équipé. Ou chassez-les si vous avez faim.',
    hint: 'Les loups donnent de la viande.',
  },
  {
    id: 'campfire_warning',
    author: 'Voyageur fatigué',
    date: 'ce matin',
    content: 'Si vous voyez un feu de camp dans la forêt, approchez. Les voyageurs sont accueillants ces temps-ci.\n\nOn partage ce qu\'on a. C\'est comme ça qu\'on survit.',
    hint: 'Les feux de camp offrent repos et soins gratuits.',
  },
  {
    id: 'merchant_route',
    author: 'Aldric le marchand',
    date: 'permanent',
    content: 'Des marchands ambulants parcourent encore les plaines. Si vous en croisez un, il aura peut-être ce dont vous avez besoin.',
    hint: 'Les marchands vendent nourriture et soins.',
  },
  {
    id: 'village_loot',
    author: 'Pillard repenti',
    date: 'il y a 3 jours',
    content: 'Le Village Abandonné au sud a été fouillé cent fois, mais il reste toujours quelque chose.\n\nLes caves sont difficiles d\'accès. Peu de gens y vont.',
    hint: 'Les villages abandonnés ont beaucoup de loot.',
  },
  {
    id: 'negotiation_tip',
    author: 'Vieux mercenaire',
    date: 'sagesse ancienne',
    content: 'Tout le monde n\'est pas là pour se battre. Parfois, un mot bien placé vaut mieux qu\'une épée.\n\nLes bandits sont désespérés. Les déserteurs, fatigués. Parlez-leur.',
    hint: 'L\'option "Parler" fonctionne contre les humains.',
  },
];

// Fonction pour obtenir des rumeurs aléatoires (pour varier l'affichage)
export function getRandomRumors(count: number = 4): Rumor[] {
  const shuffled = [...RUMORS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
