/**
 * Types pour le système de PNJ
 */

export interface DialogueLine {
  text: string
  speaker: 'npc' | 'player'
  choices?: DialogueChoice[]
}

export interface DialogueChoice {
  text: string
  nextDialogueId?: string
  flag?: string // Flag à activer après ce choix
  action?: () => void // Action à exécuter
}

export interface NPC {
  id: string
  name: string
  description: string
  dialogues: Record<string, DialogueLine[]>
  available: (day: number, flags: Record<string, boolean>) => boolean
  firstVisitDialogue?: string
}

/**
 * Pool de PNJ disponibles
 */
export const NPC_POOL: NPC[] = [
  {
    id: 'gareth',
    name: 'Gareth le Borgne',
    description: 'Un vétéran avec une cicatrice sur l\'œil. Il observe tout.',
    available: (day) => day >= 3,
    firstVisitDialogue: 'gareth_intro',
    dialogues: {
      gareth_intro: [
        {
          text: 'Gareth le Borgne. J\'ai survécu à trois guerres. Toi, tu vas survivre à quoi ?',
          speaker: 'npc',
          choices: [
            {
              text: 'Des conseils ?',
              nextDialogueId: 'gareth_advice',
              flag: 'metGareth'
            },
            {
              text: 'Juste observer.',
              nextDialogueId: 'gareth_observe'
            }
          ]
        }
      ],
      gareth_advice: [
        {
          text: 'Écoute. Les combats, c\'est 70% préparation, 30% chance. Équipe-toi bien.',
          speaker: 'npc'
        },
        {
          text: 'Et n\'oublie pas : parfois, fuir, c\'est survivre.',
          speaker: 'npc'
        }
      ],
      gareth_observe: [
        {
          text: 'Bien. Observer, c\'est apprendre.',
          speaker: 'npc'
        }
      ]
    }
  },
  {
    id: 'margaux',
    name: 'Sœur Margaux',
    description: 'Une religieuse qui aide les perdus. Elle a l\'air fatiguée.',
    available: (day) => day >= 5,
    firstVisitDialogue: 'margaux_intro',
    dialogues: {
      margaux_intro: [
        {
          text: 'Tu as l\'air perdu. Je peux t\'aider, si tu veux.',
          speaker: 'npc',
          choices: [
            {
              text: 'Parler de la dette.',
              nextDialogueId: 'margaux_debt',
              flag: 'metMargaux'
            },
            {
              text: 'Juste écouter.',
              nextDialogueId: 'margaux_listen'
            }
          ]
        }
      ],
      margaux_debt: [
        {
          text: 'La dette... C\'est un poids. Mais tu n\'es pas seul.',
          speaker: 'npc'
        },
        {
          text: 'Certains disent qu\'il y a des trésors dans les ruines au nord. Peut-être une solution ?',
          speaker: 'npc'
        }
      ],
      margaux_listen: [
        {
          text: 'Parfois, écouter, c\'est déjà beaucoup.',
          speaker: 'npc'
        }
      ]
    }
  },
  {
    id: 'colporteur',
    name: 'Le Colporteur',
    description: 'Un marchand itinérant avec un sac plein de curiosités.',
    available: () => Math.random() < 0.3, // 30% chance
    firstVisitDialogue: 'colporteur_intro',
    dialogues: {
      colporteur_intro: [
        {
          text: 'Des objets rares, des nouvelles, des secrets... Tout se vend, tout s\'achète.',
          speaker: 'npc',
          choices: [
            {
              text: 'Quelles nouvelles ?',
              nextDialogueId: 'colporteur_news',
              flag: 'metColporteur'
            },
            {
              text: 'Voir tes objets.',
              nextDialogueId: 'colporteur_items'
            }
          ]
        }
      ],
      colporteur_news: [
        {
          text: 'On dit qu\'un convoi traverse la région bientôt. Riche, mais bien gardé.',
          speaker: 'npc'
        },
        {
          text: 'Et il y a des rumeurs sur un trésor dans les ruines du fort abandonné.',
          speaker: 'npc'
        }
      ],
      colporteur_items: [
        {
          text: 'Je n\'ai rien de spécial aujourd\'hui. Reviens demain.',
          speaker: 'npc'
        }
      ]
    }
  },
  {
    id: 'ivrogne',
    name: 'L\'Ivrogne',
    description: 'Un homme qui boit depuis le matin. Il marmonne des choses incompréhensibles.',
    available: () => true, // Toujours présent
    firstVisitDialogue: 'ivrogne_intro',
    dialogues: {
      ivrogne_intro: [
        {
          text: 'Mmmh... Tu sais... Les murs... Ils écoutent...',
          speaker: 'npc',
          choices: [
            {
              text: 'Que veux-tu dire ?',
              nextDialogueId: 'ivrogne_walls'
            },
            {
              text: 'Ignorer.',
              nextDialogueId: 'ivrogne_ignore'
            }
          ]
        }
      ],
      ivrogne_walls: [
        {
          text: 'Les murs... Ils savent tout... Morten... Il écoute...',
          speaker: 'npc'
        },
        {
          text: 'Fais attention... Fais attention...',
          speaker: 'npc'
        }
      ],
      ivrogne_ignore: [
        {
          text: 'Mmmh... Tu verras... Tu verras...',
          speaker: 'npc'
        }
      ]
    }
  }
]
