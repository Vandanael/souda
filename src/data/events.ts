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
  successChance?: number;
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
  biomes: TileType[];
  chance: number;
}

export const EVENTS: GameEvent[] = [
  // === ÉVÉNEMENTS POSITIFS ===
  
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
    chance: 0.12,
  },

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
    chance: 0.1,
  },

  {
    id: 'hidden_cache',
    title: 'Cache Secrète',
    description: 'Une pierre différente des autres attire ton attention. Elle semble avoir été déplacée récemment.\n\nEn la soulevant, tu découvres un petit coffre en bois enterré.',
    choices: [
      {
        id: 'open',
        label: 'Ouvrir le coffre',
        description: 'Voir ce qu\'il contient',
        effects: { gold: 20 },
        successChance: 0.8,
        successMessage: 'Des pièces d\'or ! Quelqu\'un les avait cachées ici. Maintenant, elles sont à toi.',
        failMessage: 'Un mécanisme se déclenche. Une aiguille te pique le doigt. Le poison agit vite.',
        failEffects: { hp: -20 },
      },
      {
        id: 'leave',
        label: 'Le laisser',
        description: 'Ne pas toucher aux affaires des autres',
        effects: { karma: 1 },
        successChance: 1,
        successMessage: 'Tu remets la pierre en place. Ce n\'est pas à toi.',
      },
    ],
    biomes: ['hills', 'ruins', 'forest'],
    chance: 0.08,
  },

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
    chance: 0.12,
  },

  {
    id: 'spring',
    title: 'Source d\'Eau Claire',
    description: 'Une source naturelle jaillit entre les rochers. L\'eau est fraîche et limpide.\n\nTu n\'as pas vu d\'eau aussi pure depuis longtemps.',
    choices: [
      {
        id: 'drink',
        label: 'Boire et te reposer',
        description: 'Prendre le temps de récupérer',
        effects: { hp: 10, hunger: 0.5 },
        successChance: 1,
        successMessage: 'L\'eau est délicieuse. Tu te sens revigoré.',
      },
      {
        id: 'fill',
        label: 'Remplir ta gourde',
        description: 'Emporter de l\'eau pour plus tard',
        effects: { hunger: 1 },
        successChance: 1,
        successMessage: 'Ta gourde est pleine. Elle te servira sur la route.',
      },
    ],
    biomes: ['forest', 'hills'],
    chance: 0.1,
  },

  // === ÉVÉNEMENTS NEUTRES ===

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
    chance: 0.1,
  },

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
    chance: 0.08,
  },

  {
    id: 'old_shrine',
    title: 'Autel Ancien',
    description: 'Un petit autel de pierre couvert de mousse. Des offrandes anciennes ont pourri devant.\n\nUne présence étrange émane de ce lieu. Tu te sens observé.',
    choices: [
      {
        id: 'pray',
        label: 'S\'agenouiller et prier',
        description: 'Montrer du respect aux anciens dieux',
        effects: { hp: 20, karma: 2 },
        successChance: 0.7,
        successMessage: 'Une chaleur apaisante t\'envahit. Tu te sens... béni.',
        failMessage: 'Rien ne se passe. Les dieux sont silencieux.',
        failEffects: {},
      },
      {
        id: 'loot',
        label: 'Fouiller les offrandes',
        description: 'Il y a peut-être quelque chose de valeur',
        effects: { gold: 8 },
        successChance: 0.6,
        successMessage: 'Tu trouves quelques pièces parmi les débris.',
        failMessage: 'Un frisson te parcourt. Tu te sens soudain faible.',
        failEffects: { hp: -15 },
      },
      {
        id: 'leave',
        label: 'Passer ton chemin',
        description: 'Ne pas toucher à ça',
        effects: {},
        successChance: 1,
        successMessage: 'Tu contournes l\'autel. Mieux vaut ne pas s\'en mêler.',
      },
    ],
    biomes: ['ruins', 'forest', 'hills'],
    chance: 0.08,
  },

  // === ÉVÉNEMENTS DANGEREUX ===

  {
    id: 'trap_pit',
    title: 'Fosse Piégée',
    description: 'Le sol cède sous tes pieds !\n\nTu tombes de plusieurs mètres dans un trou sombre. Des pieux en bois sont plantés au fond.',
    choices: [
      {
        id: 'careful',
        label: 'Esquiver prudemment',
        description: 'Tenter de se rattraper',
        effects: {},
        successChance: 0.6,
        successMessage: 'Tu t\'accroches au bord et te hisses. Rien de cassé.',
        failMessage: 'Tu tombes lourdement. Un pieu t\'érafle la jambe.',
        failEffects: { hp: -30 },
      },
      {
        id: 'jump',
        label: 'Sauter pour éviter les pieux',
        description: 'Risqué mais efficace',
        effects: {},
        successChance: 0.4,
        successMessage: 'Tu atterris entre les pieux. De la terre et des os anciens.',
        failMessage: 'Tu atterris mal. Plusieurs pieux te transpercent.',
        failEffects: { hp: -50 },
      },
    ],
    biomes: ['ruins', 'forest'],
    chance: 0.06,
  },

  {
    id: 'ambush',
    title: 'Embuscade',
    description: 'Des silhouettes surgissent des buissons !\n\n"Ta bourse ou ta vie, voyageur !"',
    choices: [
      {
        id: 'fight',
        label: 'Résister',
        description: 'Dégainer et les affronter',
        effects: { gold: 10 },
        successChance: 0.5,
        successMessage: 'Le combat est bref. Ils fuient après avoir vu ta détermination. L\'un d\'eux laisse tomber sa bourse.',
        failMessage: 'Ils sont trop nombreux. Tu prends plusieurs coups avant de t\'enfuir.',
        failEffects: { hp: -35, gold: -5 },
      },
      {
        id: 'pay',
        label: 'Payer',
        description: 'Leur donner ce qu\'ils veulent',
        effects: { gold: -10 },
        successChance: 1,
        successMessage: 'Tu leur donnes quelques pièces. Ils disparaissent aussi vite qu\'ils sont apparus.',
      },
      {
        id: 'bluff',
        label: 'Bluffer',
        description: '"Je suis le capitaine de la garde !"',
        effects: {},
        successChance: 0.4,
        successMessage: 'Ils se regardent, hésitent, puis s\'enfuient. Bien joué.',
        failMessage: 'Ils rient. "Ouais, et moi je suis le roi." Ils te frappent avant de partir.',
        failEffects: { hp: -20, gold: -5 },
      },
    ],
    biomes: ['forest', 'hills', 'village'],
    chance: 0.08,
  },

  {
    id: 'cursed_chest',
    title: 'Coffre Maudit',
    description: 'Un coffre orné de symboles étranges. Il semble appeler ton nom.\n\nQuelque chose ne va pas ici. Mais le trésor à l\'intérieur doit être immense.',
    choices: [
      {
        id: 'open',
        label: 'L\'ouvrir',
        description: 'La curiosité est plus forte',
        effects: { gold: 50 },
        successChance: 0.3,
        successMessage: 'De l\'or ! Beaucoup d\'or ! Les symboles s\'effacent. Tu es riche.',
        failMessage: 'Une énergie noire t\'envahit. Tu te sens vidé de tes forces.',
        failEffects: { hp: -40, hunger: -2 },
      },
      {
        id: 'leave',
        label: 'S\'en éloigner',
        description: 'Ce n\'est pas normal',
        effects: { karma: 1 },
        successChance: 1,
        successMessage: 'Tu tournes le dos au coffre. La voix dans ta tête s\'estompe.',
      },
    ],
    biomes: ['ruins'],
    chance: 0.05,
  },

  {
    id: 'wild_animal',
    title: 'Animal Blessé',
    description: 'Un animal est pris dans un piège de braconnier. Il gémit de douleur.\n\nEn te voyant, il essaie de se débattre, aggravant ses blessures.',
    choices: [
      {
        id: 'free',
        label: 'Le libérer',
        description: 'L\'aider à s\'échapper',
        effects: { karma: 2 },
        successChance: 0.8,
        successMessage: 'Tu ouvres le piège avec précaution. L\'animal te regarde un instant, puis s\'enfuit.',
        failMessage: 'Il te mord dans sa panique. Tu réussis quand même à le libérer.',
        failEffects: { hp: -15 },
      },
      {
        id: 'kill',
        label: 'L\'achever',
        description: 'De la viande pour la route',
        effects: { hunger: 2 },
        successChance: 1,
        successMessage: 'C\'est une mort rapide. Tu récupères ce que tu peux.',
      },
      {
        id: 'leave',
        label: 'Continuer',
        description: 'Ce n\'est pas ton problème',
        effects: {},
        successChance: 1,
        successMessage: 'Tu continues ta route. Ses cris te suivent un moment.',
      },
    ],
    biomes: ['forest', 'hills', 'plain'],
    chance: 0.08,
  },

  {
    id: 'strange_fog',
    title: 'Brouillard Étrange',
    description: 'Un brouillard épais t\'entoure soudain. Tu n\'y vois pas à trois pas.\n\nDes voix semblent murmurer dans le brouillard. Ou est-ce le vent ?',
    choices: [
      {
        id: 'wait',
        label: 'Attendre que ça passe',
        description: 'Ne pas bouger',
        effects: {},
        successChance: 0.7,
        successMessage: 'Le brouillard se dissipe au bout d\'un moment. Tu es au même endroit.',
        failMessage: 'Tu as perdu du temps. Et de l\'énergie.',
        failEffects: { hunger: -0.5 },
      },
      {
        id: 'follow_voices',
        label: 'Suivre les voix',
        description: 'Elles semblent t\'appeler',
        effects: { gold: 15 },
        successChance: 0.4,
        successMessage: 'Les voix te mènent à un ancien trésor oublié.',
        failMessage: 'Tu te perds. Quand le brouillard se lève, tu es loin de ta route.',
        failEffects: { hp: -10, hunger: -1 },
      },
      {
        id: 'run',
        label: 'Courir tout droit',
        description: 'Sortir de là au plus vite',
        effects: {},
        successChance: 0.6,
        successMessage: 'Tu sors du brouillard, essoufflé mais intact.',
        failMessage: 'Tu trébuches sur quelque chose. Une chute douloureuse.',
        failEffects: { hp: -15 },
      },
    ],
    biomes: ['forest', 'ruins', 'hills'],
    chance: 0.06,
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
