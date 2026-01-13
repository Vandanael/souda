/**
 * Logique de détermination des fins multiples
 */

import { GameState } from '../../store/gameStore'
import { Ending } from './types'

// Export Ending pour utilisation dans les screens
export type { Ending } from './types'

/**
 * Détermine la fin selon l'état du jeu
 */
export function determineEnding(state: GameState): Ending {
  // Vérifier d'abord les conditions de défaite
  const defeatEnding = determineDefeatEnding(state)
  if (defeatEnding) {
    return defeatEnding
  }
  
  // Sinon, déterminer la fin de victoire
  return determineVictoryEnding(state)
}

/**
 * Détermine la fin de défaite (priorité haute)
 */
function determineDefeatEnding(state: GameState): Ending | null {
  const { day, debt, reputation, combatResult, currentEnemy } = state
  
  // 1. MORT AU COMBAT
  if (combatResult?.outcome === 'defeat') {
    return {
      id: 'mort_combat',
      type: 'defeat',
      title: 'Mort au Combat',
      text: `${currentEnemy?.name || 'Un ennemi'} a eu raison de vous. Votre cadavre sera pillé comme vous avez pillé tant d'autres. Terra Incognita n'a pas de pitié pour les faibles.`,
      ambiance: {
        backgroundColor: '#1a0000',
        textColor: '#ccc',
        titleColor: '#c44',
        particles: 'ashes',
        musicId: 'defeat'
      },
      variables: {
        enemyName: currentEnemy?.name || 'Un ennemi'
      }
    }
  }
  
  // 2. LA DETTE DE SANG (jour 20+, dette > 0, réputation < 4)
  if (day >= 20 && debt > 0 && reputation < 4) {
    return {
      id: 'dette_sang',
      type: 'defeat',
      title: 'La Dette de Sang',
      text: 'Les hommes de Morten vous trouvent à l\'aube. Pas de négociation. Pas de pitié. Votre corps rejoint les autres dans la fosse derrière l\'échoppe. La dette est payée.',
      ambiance: {
        backgroundColor: '#2a0000',
        textColor: '#ccc',
        titleColor: '#c44',
        particles: 'ashes',
        musicId: 'defeat'
      }
    }
  }
  
  // 3. LA FUITE (jour 20+, dette > 0, réputation >= 4)
  if (day >= 20 && debt > 0 && reputation >= 4) {
    return {
      id: 'fuite',
      type: 'defeat',
      title: 'La Fuite',
      text: 'Votre réputation vous permet de fuir avant que Morten n\'envoie ses hommes. Mais vous fuyez sans rien. À nouveau déserteur. À nouveau seul. La dette vous suivra.',
      ambiance: {
        backgroundColor: '#1a1a1a',
        textColor: '#aaa',
        titleColor: '#888',
        particles: 'mist',
        musicId: 'flee'
      }
    }
  }
  
  return null
}

/**
 * Détermine la fin de victoire (priorité haute → basse)
 */
function determineVictoryEnding(state: GameState): Ending {
  const { gold, reputation, debt, narrativeCounters } = state
  
  // Vérifier que la dette est payée
  if (debt > 0) {
    // Fallback si dette non payée mais jour 20 (ne devrait pas arriver normalement)
    return getSurvivantEnding()
  }
  
  const cynisme = narrativeCounters.cynisme || 0
  const humanite = narrativeCounters.humanite || 0
  const pragmatisme = narrativeCounters.pragmatisme || 0
  
  // NOUVELLES FINS BASÉES SUR COMPTEURS NARRATIFS (priorité haute)
  // 1. FIN HUMANITÉ (humanité >= 10, réduit de 12 à 10)
  if (humanite >= 10) {
    return {
      id: 'humanite',
      type: 'victory',
      title: 'La Rédemption',
      text: 'Vous avez choisi l\'humanité. Malgré les ténèbres, vous avez gardé votre cœur. Les réfugiés que vous avez aidés parlent de vous comme d\'un protecteur. Sœur Margaux vous offre une place au monastère. Vous avez racheté vos erreurs.',
      ambiance: {
        backgroundColor: '#1a2a1a',
        textColor: '#ddd',
        titleColor: '#fff',
        particles: 'light',
        musicId: 'victory'
      }
    }
  }
  
  // 2. FIN CYNISME (cynisme >= 10, réduit de 12 à 10)
  if (cynisme >= 10) {
    return {
      id: 'cynisme',
      type: 'victory',
      title: 'La Survie',
      text: 'Vous avez survécu. Peu importe le prix. Vous avez fait ce qu\'il fallait. Les autres peuvent juger, mais vous êtes vivant. C\'est tout ce qui compte. La dette est payée, mais votre âme aussi.',
      ambiance: {
        backgroundColor: '#2a1a1a',
        textColor: '#aaa',
        titleColor: '#c44',
        particles: 'ashes',
        musicId: 'defeat'
      }
    }
  }
  
  // 3. FIN PRAGMATISME (pragmatisme >= 10, réduit de 12 à 10)
  if (pragmatisme >= 10) {
    return {
      id: 'pragmatisme',
      type: 'victory',
      title: 'L\'Efficacité',
      text: 'Vous avez gagné. Par la logique et l\'efficacité. Vous avez calculé chaque mouvement, chaque choix. La dette est payée. Vous êtes libre. Et vous avez appris que dans ce monde, seule la logique compte.',
      ambiance: {
        backgroundColor: '#1a1a2a',
        textColor: '#aaa',
        titleColor: '#88a',
        particles: 'mist',
        musicId: 'victory'
      }
    }
  }
  
  // 4. FIN ÉQUILIBRÉE (compteurs équilibrés, tous >= 3, différence < 7)
  const differences = [
    Math.abs(humanite - cynisme),
    Math.abs(humanite - pragmatisme),
    Math.abs(cynisme - pragmatisme)
  ]
  const isBalanced = differences.every(diff => diff < 7) && 
                     humanite >= 3 && cynisme >= 3 && pragmatisme >= 3
  if (isBalanced) {
    return {
      id: 'equilibre',
      type: 'victory',
      title: 'L\'Équilibre',
      text: 'Vous avez trouvé l\'équilibre. Entre tout et rien. Entre le bien et le mal. Entre la logique et l\'émotion. Vous avez payé votre dette. Vous êtes libre. Et vous êtes humain, dans toute votre complexité.',
      ambiance: {
        backgroundColor: '#1a1a1a',
        textColor: '#aaa',
        titleColor: '#888',
        particles: 'none',
        musicId: 'victory'
      }
    }
  }
  
  // FINS EXISTANTES (priorité moyenne)
  // 5. LE SEIGNEUR (priorité la plus haute parmi les anciennes)
  if (reputation === 5 && gold >= 200 && humanite > cynisme) {
    return {
      id: 'seigneur',
      type: 'victory',
      title: 'Le Seigneur des Ruines',
      text: 'Votre réputation vous précède. Les seigneurs locaux vous offrent terres et titre. De mercenaire, vous devenez noble. La dette n\'était que le premier chapitre.',
      ambiance: {
        backgroundColor: '#2a2a00',
        textColor: '#ddd',
        titleColor: '#ca8',
        particles: 'gold',
        musicId: 'victory'
      }
    }
  }
  
  // 6. LE MARCHAND
  if (gold >= 300) {
    return {
      id: 'marchand',
      type: 'victory',
      title: 'Le Roi des Charognes',
      text: 'L\'or appelle l\'or. Vous rachetez l\'échoppe de Morten, puis une autre, puis une autre. Bientôt, c\'est vous qui prêtez aux désespérés. Le cycle continue.',
      ambiance: {
        backgroundColor: '#2a1a00',
        textColor: '#ddd',
        titleColor: '#ca8',
        particles: 'gold',
        musicId: 'victory'
      }
    }
  }
  
  // 7. LE RÉDEMPTEUR (ancienne version, si humanité < 15)
  if (humanite >= 10 && cynisme < 3) {
    return {
      id: 'redempteur',
      type: 'victory',
      title: 'Le Rédempteur',
      text: 'Vous avez payé votre dette, mais aussi celle de votre conscience. Les réfugiés que vous avez aidés parlent de vous comme d\'un saint. Sœur Margaux vous offre une place au monastère.',
      ambiance: {
        backgroundColor: '#2a2a1a',
        textColor: '#ddd',
        titleColor: '#fff',
        particles: 'light',
        musicId: 'victory'
      }
    }
  }
  
  // 8. LE FANTÔME
  if (reputation <= 2 && pragmatisme > humanite && pragmatisme > cynisme) {
    return {
      id: 'fantome',
      type: 'victory',
      title: 'Le Fantôme',
      text: 'Personne ne se souvient de vous. Vous payez Morten dans l\'ombre et disparaissez avant l\'aube. Quelque part, une nouvelle guerre commence. Vous y serez.',
      ambiance: {
        backgroundColor: '#1a1a1a',
        textColor: '#888',
        titleColor: '#666',
        particles: 'mist',
        musicId: 'flee'
      }
    }
  }
  
  // 9. LE SURVIVANT (défaut)
  return getSurvivantEnding()
}

/**
 * Fin par défaut : Le Survivant
 */
function getSurvivantEnding(): Ending {
  return {
    id: 'survivant',
    type: 'victory',
    title: 'Le Survivant',
    text: 'Vous avez survécu. C\'est plus que la plupart peuvent dire. La route continue, sans gloire ni honte. Juste un autre jour.',
    ambiance: {
      backgroundColor: '#1a1a1a',
      textColor: '#aaa',
      titleColor: '#888',
      particles: 'none',
      musicId: 'victory'
    }
  }
}

/**
 * Injecte les variables dans le texte de fin
 */
export function injectEndingVariables(text: string, variables?: Record<string, string>): string {
  if (!variables) return text
  
  let result = text
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\[${key}\\]`, 'g'), value)
  })
  
  return result
}
