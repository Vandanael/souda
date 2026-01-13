import { NarrativeEvent } from '../../types/event'

/**
 * Pool d'événements narratifs
 */

export const EVENT_POOL: NarrativeEvent[] = [
  {
    id: 'convoi',
    title: 'La Rumeur du Convoi',
    description: 'Un marchand mentionne un convoi de ravitaillement mal protégé qui traverse la région. Une opportunité... ou un piège ?',
    triggerCondition: (state) => {
      return state.day >= 4 && state.day <= 6 && !state.npcFlags.convoiDone
    },
    oneTime: true,
    choices: [
      {
        id: 'embuscade',
        text: 'Tendre une embuscade',
        consequences: {
          gold: Math.floor(Math.random() * 21) + 30, // 30-50💰
          reputation: -1,
          counters: { cynisme: 1 },
          flags: { convoiDone: true }, // FIX: Audit 1 - Flag pour empêcher répétition
          narrative: 'Tu as tendu une embuscade au convoi. L\'or est dans ta poche, mais tu as laissé des traces. Ta réputation en prend un coup.'
        }
      },
      {
        id: 'ignorer',
        text: 'Ignorer',
        consequences: {
          counters: { humanite: 1 },
          narrative: 'Tu laisses passer le convoi. Parfois, la meilleure action est de ne rien faire.'
        }
      },
      {
        id: 'prevenir',
        text: 'Prévenir les gardes',
        consequences: {
          reputation: 1,
          counters: { humanite: 1 },
          flags: { convoiDone: true }, // FIX: Audit 1 - Flag pour empêcher répétition
          narrative: 'Tu as prévenu les gardes. Ils t\'en sont reconnaissants. Ta réputation s\'améliore légèrement.'
        }
      }
    ]
  },
  {
    id: 'collecteurs',
    title: 'Les Collecteurs',
    description: 'Deux hommes de Morten vous trouvent à la taverne. Leurs regards sont froids. "Il est temps de régler tes comptes."',
    triggerCondition: (state) => {
      // FIX: Audit 1 - Empêcher répétition après paiement
      return state.day >= 12 && state.debt > 100 && !state.npcFlags.collecteursPaid
    },
    oneTime: false,
    choices: [
      {
        id: 'payer',
        text: 'Payer 20💰 immédiatement',
        requirements: {
          gold: 20
        },
        consequences: {
          gold: -20,
          flags: { collecteursPaid: true }, // FIX: Audit 1 - Flag pour empêcher répétition
          narrative: 'Tu leur donnes l\'or. Ils partent, mais tu sais qu\'ils reviendront.'
        }
      },
      {
        id: 'negocier',
        text: 'Négocier un délai',
        requirements: {
          reputation: 3 // Réputation minimale pour négocier
        },
        consequences: {
          gold: -5, // FIX: Audit 2 - Coût minimal pour éviter exploit gratuit
          debt: -10, // Réduction symbolique
          counters: { pragmatisme: 1 },
          narrative: 'Tu négocies un délai. Ta réputation t\'a sauvé, mais la dette reste.'
        }
      },
      {
        id: 'resister',
        text: 'Résister',
        consequences: {
          durabilityLoss: 20, // Perte de durabilité sur combat difficile
          debt: -30,
          counters: { cynisme: 1 },
          narrative: 'Tu as résisté. C\'était dur, mais tu as gagné. La dette diminue, mais tu es marqué.'
        }
      }
    ]
  },
  {
    id: 'peste',
    title: 'La Peste',
    description: 'La maladie se répand dans la région. Les villages se ferment. Les morts s\'accumulent. Que fais-tu ?',
    triggerCondition: (state) => {
      return state.day >= 10 && Math.random() < 0.15 && !state.npcFlags.pesteActive
    },
    oneTime: false,
    choices: [
      {
        id: 'eviter',
        text: 'Éviter les villages',
        consequences: {
          actionsRemaining: -1, // -1 lieu explorable pendant 3 jours
          flags: { pesteActive: true },
          narrative: 'Tu évites les villages. Moins de lieux à explorer, mais tu restes en vie.'
        }
      },
      {
        id: 'masque',
        text: 'Porter un masque (10💰)',
        requirements: {
          gold: 10
        },
        consequences: {
          gold: -10,
          flags: { pesteActive: true },
          narrative: 'Tu portes un masque. C\'est une protection, mais rien n\'est sûr.'
        }
      },
      {
        id: 'aider',
        text: 'Aider les malades',
        requirements: {
          gold: 5
        },
        consequences: {
          gold: -5,
          reputation: 1,
          counters: { humanite: 4 }, // Augmenté de 3 à 4
          flags: { pesteActive: true },
          narrative: 'Tu aides les malades. C\'est risqué, mais tu as fait le bon choix. Ta réputation grandit.'
        }
      }
    ]
  },
  {
    id: 'marchand',
    title: 'Le Marchand Mystérieux',
    description: 'Un homme encapuchonné vous aborde dans une ruelle. "J\'ai des objets... particuliers. Intéressé ?"',
    triggerCondition: (state) => {
      return state.day >= 7 && state.day <= 15 && !state.npcFlags.marchandMet && Math.random() < 0.1
    },
    oneTime: true,
    choices: [
      {
        id: 'objet_compromis',
        text: 'Acheter l\'objet compromis (30💰)',
        requirements: {
          gold: 30
        },
        consequences: {
          gold: -30,
          items: ['cursed_item'], // Item légendaire avec malus caché
          counters: { cynisme: 1 },
          flags: { marchandMet: true }, // FIX: Audit 1 - Flag pour empêcher répétition
          narrative: 'Tu achètes l\'objet. Il a l\'air puissant, mais quelque chose ne va pas. Des marques suspectes, un poids inhabituel... Tu sens qu\'il y a un prix à payer.'
        }
      },
      {
        id: 'carte',
        text: 'Acheter la carte (20💰)',
        requirements: {
          gold: 20
        },
        consequences: {
          gold: -20,
          flags: { carteRevelee: true, marchandMet: true }, // FIX: Audit 1 - Flag pour empêcher répétition
          narrative: 'Tu achètes la carte. Elle révèle un lieu riche que tu n\'avais pas encore exploré.'
        }
      },
      {
        id: 'decliner',
        text: 'Décliner poliment',
        consequences: {
          counters: { pragmatisme: 1 },
          flags: { marchandMet: true }, // FIX: Audit 1 - Flag pour empêcher répétition
          narrative: 'Tu déclines. Mieux vaut ne pas s\'embarrasser d\'affaires douteuses.'
        }
      },
      {
        id: 'denoncer',
        text: 'Le dénoncer',
        consequences: {
          reputation: 1,
          counters: { cynisme: 1 },
          flags: { marchandMet: true }, // FIX: Audit 1 - Flag pour empêcher répétition
          narrative: 'Tu le dénonces aux autorités. Il disparaît dans la nuit. Ta réputation s\'améliore, mais tu as peut-être fait une erreur.'
        }
      }
    ]
  },
  {
    id: 'refugies',
    title: 'Rencontre avec des Réfugiés',
    description: 'Une famille de réfugiés vous supplie de l\'aide. Ils ont faim, ils ont froid. Que fais-tu ?',
    triggerCondition: (state) => {
      // FIX: Audit 2 - Limiter à 5 déclenchements max sur 20 jours pour éviter répétition excessive
      const refugiesCount = state.narrativeCounters._refugiesCount || 0
      if (refugiesCount >= 5) return false
      return Math.random() < 0.15 // 15% chance par exploration
    },
    oneTime: false,
    choices: [
      {
        id: 'donner_or',
        text: 'Donner 8💰',
        requirements: {
          gold: 8
        },
        consequences: {
          gold: -8,
          counters: { 
            humanite: 4, // Augmenté de 3 à 4
            _refugiesCount: 1 // FIX: Audit 2 - Incrémenter compteur (clé spéciale avec _)
          },
          narrative: 'Tu leur donnes de l\'or. Leurs yeux s\'illuminent. Tu as fait une bonne action.'
        }
      },
      {
        id: 'partager',
        text: 'Partager de la nourriture',
        consequences: {
          actionsRemaining: -1, // -1 action pour partager
          counters: { 
            humanite: 2, // Augmenté de 1 à 2
            _refugiesCount: 1 // FIX: Audit 2 - Incrémenter compteur (clé spéciale avec _)
          },
          narrative: 'Tu partages ta nourriture. C\'est peu, mais c\'est mieux que rien.'
        }
      },
      {
        id: 'ignorer',
        text: 'Les ignorer',
        consequences: {
          counters: { cynisme: 1 },
          narrative: 'Tu les ignores. Tu as tes propres problèmes. Mais ça te pèse.'
        }
      },
      {
        id: 'voler',
        text: 'Les voler',
        consequences: {
          gold: Math.floor(Math.random() * 11) + 5, // 5-15💰
          reputation: -1,
          counters: { 
            cynisme: 2,
            _refugiesCount: 1 // FIX: Audit 2 - Incrémenter compteur même si vol (événement déclenché)
          },
          narrative: 'Tu les voles. L\'or est dans ta poche, mais tu as perdu quelque chose d\'autre.'
        }
      }
    ]
  }
]
