/**
 * Système d'arcs narratifs pour les personnages récurrents
 * Gère la progression des relations et des histoires sur plusieurs jours
 */

export interface CharacterArc {
  characterId: string
  trustLevel: number // 0-10
  storyStage: string
  flags: Record<string, boolean>
  lastInteractionDay: number
}

export type StoryStage = 'menaces' | 'negociations' | 'ultimatum' | 'consequences'

/**
 * Configuration des arcs narratifs pour chaque personnage
 */
export interface CharacterArcConfig {
  characterId: string
  stages: {
    stage: StoryStage
    dayRange: [number, number] // [jourMin, jourMax]
    conditions?: (day: number, debt: number, trustLevel: number, flags: Record<string, boolean>) => boolean
  }[]
  dialogues: Record<StoryStage, string[]>
}

/**
 * Configuration de l'arc narratif de Morten (l'usurier)
 */
export const MORTEN_ARC_CONFIG: CharacterArcConfig = {
  characterId: 'morten',
  stages: [
    {
      stage: 'menaces',
      dayRange: [1, 5],
      conditions: (day) => day >= 1 && day <= 5
    },
    {
      stage: 'negociations',
      dayRange: [6, 10],
      conditions: (day, debt) => day >= 6 && day <= 10 && debt < 60 // Si progrès sur la dette
    },
    {
      stage: 'ultimatum',
      dayRange: [11, 20],
      conditions: (day, debt) => day >= 11 && debt >= 40 // Si dette encore élevée
    },
    {
      stage: 'consequences',
      dayRange: [16, 20],
      conditions: (day, debt) => day >= 16 && debt > 0 // Derniers jours avec dette
    }
  ],
  dialogues: {
    menaces: [
      "Tu me dois 80 pièces d'or. Tu as 20 jours. Ne me déçois pas.",
      "Le temps passe. Chaque jour qui passe, ta dette grandit.",
      "Je ne suis pas patient. Tu ferais mieux de trouver cet argent.",
      "Les autres déserteurs ont payé. Toi, tu traînes.",
      "Attention. Mes créanciers ne sont pas tendres avec ceux qui ne paient pas."
    ],
    negociations: [
      "Tu as fait des progrès. Peut-être que tu n'es pas complètement perdu.",
      "Continue comme ça et on pourra peut-être négocier.",
      "Je vois que tu travailles. C'est bien. Mais il faut plus.",
      "Si tu continues, je pourrais réduire les intérêts.",
      "Tu es sur la bonne voie. Ne gâche pas tout maintenant."
    ],
    ultimatum: [
      "Le temps presse. Tu n'as plus beaucoup de jours.",
      "Je commence à perdre patience. Trouve cet argent.",
      "Dernier avertissement. Paye ou subis les conséquences.",
      "Les autres ont payé. Pourquoi pas toi ?",
      "Tu joues avec le feu. Je ne plaisante pas."
    ],
    consequences: [
      "C'est trop tard. Tu as échoué.",
      "Tu n'as pas tenu ta promesse. Il y a un prix à payer.",
      "Les créanciers arrivent. Tu as choisi ton destin.",
      "Tu aurais dû m'écouter. Maintenant, c'est fini.",
      "Trop tard. Tu paieras d'une autre manière."
    ]
  }
}

/**
 * Détermine le stage actuel d'un arc narratif
 */
export function getCurrentStoryStage(
  config: CharacterArcConfig,
  day: number,
  debt: number,
  trustLevel: number,
  flags: Record<string, boolean>
): StoryStage {
  // Parcourir les stages dans l'ordre inverse pour trouver le premier qui correspond
  for (let i = config.stages.length - 1; i >= 0; i--) {
    const stageConfig = config.stages[i]
    const condition = stageConfig.conditions || (() => true)
    
    if (
      day >= stageConfig.dayRange[0] &&
      day <= stageConfig.dayRange[1] &&
      condition(day, debt, trustLevel, flags)
    ) {
      return stageConfig.stage
    }
  }
  
  // Par défaut, retourner le premier stage
  return config.stages[0].stage
}

/**
 * Obtient un dialogue aléatoire pour un stage donné
 * @deprecated Non utilisé - à supprimer ou implémenter dans MortenScreen
 */
// @ts-ignore - Fonction dépréciée, non utilisée
function _getDialogueForStage(
  config: CharacterArcConfig,
  stage: StoryStage
): string {
  const dialogues = config.dialogues[stage]
  if (!dialogues || dialogues.length === 0) {
    return "..."
  }
  
  const randomIndex = Math.floor(Math.random() * dialogues.length)
  return dialogues[randomIndex]
}

/**
 * Met à jour le niveau de confiance selon les actions du joueur
 */
export function updateTrustLevel(
  currentTrust: number,
  action: 'repay' | 'ignore' | 'negotiate',
  amount?: number
): number {
  let newTrust = currentTrust
  
  switch (action) {
    case 'repay':
      // Rembourser augmente la confiance
      const trustGain = amount ? Math.min(2, Math.floor(amount / 20)) : 1
      newTrust = Math.min(10, currentTrust + trustGain)
      break
    case 'ignore':
      // Ignorer diminue la confiance
      newTrust = Math.max(0, currentTrust - 1)
      break
    case 'negotiate':
      // Négocier peut augmenter légèrement
      newTrust = Math.min(10, currentTrust + 1)
      break
  }
  
  return newTrust
}

/**
 * Initialise un arc narratif pour un personnage
 */
export function initializeCharacterArc(characterId: string, day: number): CharacterArc {
  return {
    characterId,
    trustLevel: 5, // Niveau de départ neutre
    storyStage: 'menaces',
    flags: {},
    lastInteractionDay: day
  }
}
