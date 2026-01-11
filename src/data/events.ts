import type { TileType } from '../types';

// ============================================
// ÉVÉNEMENTS NARRATIFS - SOUDA: Terra Incognita
// ============================================

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  effects: {
    hp?: number;
    hunger?: number;
    gold?: number;
    karma?: number;
  };
  successChance?: number;  // Si défini, l'effet dépend d'un jet
  successMessage?: string;
  failMessage?: string;
  failEffects?: {
    hp?: number;
    hunger?: number;
    gold?: number;
  };
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  biomes: TileType[];     // Où cet événement peut apparaître
  chance: number;          // Probabilité d'apparition (0-1)
}

export const EVENTS: GameEvent[] = [
  // === LE VOYAGEUR BLESSÉ ===
  {
    id: 'wounded_traveler',
    title: 'Le Voyageur Blessé',
    description: 'Un homme est adossé à un arbre, tenant sa jambe ensanglantée. Sa besace est ouverte à côté de lui. Il te regarde approcher avec des yeux fiévreux.\n\n"Aide... moi..."',
    choices: [
      {
        id: 'help',
        label: 'L\'aider',
        description: 'Utiliser un bandage pour le soigner',
        effects: { karma: 2 },
        successChance: 1,
        successMessage: 'Tu panses sa blessure. Il te serre la main.\n"Merci, étranger. Les ruines au nord cachent un coffre sous l\'autel."',
      },
      {
        id: 'rob',
        label: 'Prendre ses affaires',
        description: 'Il ne peut pas t\'en empêcher',
        effects: { gold: 8, karma: -2 },
        successChance: 1,
        successMessage: 'Tu prends sa besace sans un mot. Il ne dit rien. Son regard te suit longtemps.',
      },
      {
        id: 'mercy',
        label: 'Abréger ses souffrances',
        description: 'Il ne survivra pas la nuit de toute façon',
        effects: { gold: 12, karma: -5 },
        successChance: 1,
        successMessage: 'Tu fais ce qui doit être fait. Rapidement. Sa besace contenait plus que prévu.',
      },
      {
        id: 'leave',
        label: 'Continuer ta route',
        description: 'Ce ne sont pas tes affaires',
        effects: {},
        successChance: 1,
        successMessage: 'Tu passes ton chemin. Ses gémissements s\'éloignent derrière toi.',
      },
    ],
    biomes: ['plain', 'forest', 'hills'],
    chance: 0.15,
  },

  // === LE FEU DE CAMP ===
  {
    id: 'campfire',
    title: 'Feu de Camp',
    description: 'De la fumée au loin. Tu approches prudemment.\n\nDeux voyageurs sont assis près d\'un feu, mains visibles, armes posées. L\'un d\'eux te fait signe.\n\n"Approche, on mord pas. La nuit va être froide."',
    choices: [
      {
        id: 'join',
        label: 'Rejoindre le feu',
        description: 'Accepter leur hospitalité',
        effects: { hp: 15, hunger: 1, karma: 1 },
        successChance: 1,
        successMessage: 'Tu t\'assois près du feu. La chaleur. Les voix. Un moment de paix rare.\n\nL\'un d\'eux sort une flasque. Vous partagez. Personne ne demande ton nom.',
      },
      {
        id: 'watch',
        label: 'Observer de loin',
        description: 'Ne pas prendre de risque',
        effects: {},
        successChance: 1,
        successMessage: 'Tu observes un moment puis reprends ta route. Ils ne t\'ont probablement pas vu.',
      },
      {
        id: 'attack',
        label: 'Les attaquer',
        description: 'Ils ne s\'y attendent pas',
        effects: { gold: 25, karma: -10 },
        successChance: 0.6,
        successMessage: 'L\'effet de surprise joue. Tu récupères leurs affaires sur leurs corps refroidis.',
        failMessage: 'Ils étaient plus alertes qu\'ils en avaient l\'air.',
        failEffects: { hp: -35 },
      },
    ],
    biomes: ['forest', 'hills', 'plain'],
    chance: 0.08,
  },

  // === LA FERME ABANDONNÉE ===
  {
    id: 'abandoned_farm',
    title: 'La Ferme Abandonnée',
    description: 'Une ferme aux portes ouvertes. Silence total.\n\nTu entres. Cuisine. Table mise. Nourriture encore sur les assiettes. Intacte mais... étrange odeur de moisi.',
    choices: [
      {
        id: 'eat',
        label: 'Manger la nourriture',
        description: 'Tu as faim et elle a l\'air bonne',
        effects: { hunger: 3 },
        successChance: 0.5,
        successMessage: 'La nourriture était bonne. Tu te sens rassasié.',
        failMessage: 'Ton estomac se retourne violemment. Quelque chose n\'allait pas.',
        failEffects: { hp: -25, hunger: -1 },
      },
      {
        id: 'search',
        label: 'Fouiller la maison',
        description: 'Il doit y avoir des choses de valeur',
        effects: { gold: 12 },
        successChance: 0.7,
        successMessage: 'Tu trouves quelques pièces cachées et des provisions.',
        failMessage: 'Un vieux piège s\'active. Une flèche te touche à l\'épaule.',
        failEffects: { hp: -15 },
      },
      {
        id: 'leave',
        label: 'Partir immédiatement',
        description: 'Ton instinct te dit de fuir',
        effects: {},
        successChance: 1,
        successMessage: 'Tu fais demi-tour. Quelque chose ne va pas ici.',
      },
    ],
    biomes: ['village', 'plain'],
    chance: 0.12,
  },

  // === LES TRACES FRAÎCHES ===
  {
    id: 'fresh_tracks',
    title: 'Traces Fraîches',
    description: 'Le sol est meuble ici. Des traces.\n\nTu t\'accroupis pour les examiner. Trois personnes, lourdement chargées. Passées il y a une ou deux heures. Direction nord.\n\nL\'une d\'elles boite.',
    choices: [
      {
        id: 'follow',
        label: 'Suivre les traces',
        description: 'Les rattraper',
        effects: { gold: 15 },
        successChance: 0.7,
        successMessage: 'Tu les rattrapes. Bandits blessés. Combat facile. Bon butin.',
        failMessage: 'Tu perds leur trace dans les fourrés.',
        failEffects: {},
      },
      {
        id: 'ambush',
        label: 'Tendre une embuscade',
        description: 'Attendre sur leur route',
        effects: { gold: 25 },
        successChance: 0.5,
        successMessage: 'L\'embuscade fonctionne. Tu les prends par surprise.',
        failMessage: 'Ils ne reviennent jamais par ce chemin.',
        failEffects: {},
      },
      {
        id: 'ignore',
        label: 'Ignorer',
        description: 'Ce n\'est pas ton problème',
        effects: {},
        successChance: 1,
        successMessage: 'Tu continues ta route. Leurs affaires ne t\'intéressent pas.',
      },
    ],
    biomes: ['forest', 'hills'],
    chance: 0.10,
  },

  // === LE MARCHAND AMBULANT ===
  {
    id: 'wandering_merchant',
    title: 'Marchand Ambulant',
    description: 'Un homme pousse une carriole sur le chemin. Il s\'arrête en te voyant.\n\n"Eh, voyageur ! J\'ai de bonnes affaires pour toi. Pain frais, bandages, et même une lame de qualité si tu as de quoi payer."',
    choices: [
      {
        id: 'buy_food',
        label: 'Acheter à manger',
        description: '3 pièces',
        effects: { gold: -3, hunger: 2 },
        successChance: 1,
        successMessage: 'Tu achètes du pain frais. Ça fait du bien.',
      },
      {
        id: 'buy_bandage',
        label: 'Acheter des bandages',
        description: '5 pièces',
        effects: { gold: -5, hp: 25 },
        successChance: 1,
        successMessage: 'Tu achètes de quoi te soigner. Le marchand te montre comment bien les appliquer.',
      },
      {
        id: 'trade_info',
        label: 'Échanger des informations',
        description: 'Les nouvelles voyagent avec les marchands',
        effects: { karma: 1 },
        successChance: 1,
        successMessage: '"Les ruines au nord sont dangereuses. Un chef de patrouille y a établi son camp. Méfie-toi."',
      },
      {
        id: 'leave',
        label: 'Décliner poliment',
        description: 'Tu n\'as besoin de rien',
        effects: {},
        successChance: 1,
        successMessage: '"Bonne route alors. Et fais attention à toi."',
      },
    ],
    biomes: ['plain', 'village'],
    chance: 0.10,
  },
];

// Fonction pour obtenir un événement aléatoire selon le biome
export function rollEvent(biome: TileType): GameEvent | null {
  const possibleEvents = EVENTS.filter(e => e.biomes.includes(biome));
  
  for (const event of possibleEvents) {
    if (Math.random() < event.chance) {
      return event;
    }
  }
  
  return null;
}

// Fonction pour obtenir un événement par ID
export function getEventById(id: string): GameEvent | undefined {
  return EVENTS.find(e => e.id === id);
}
