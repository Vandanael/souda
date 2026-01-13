import { Item } from '../types/item'
import { getEffectiveStats } from '../features/durability/durability.logic'

export interface PlayerStats {
  atk: number
  def: number
  vit: number
}

/**
 * Calcule les stats totales à partir de l'équipement (avec dégradation)
 */
export function calculateStatsFromEquipment(equipment: Partial<Record<string, Item>>): PlayerStats {
  let atk = 0
  let def = 0
  let vit = 0
  
  Object.values(equipment).forEach(item => {
    if (!item) return
    
    // Obtenir les stats effectives avec dégradation
    const effectiveStats = getEffectiveStats(item)
    
    // Appliquer les multiplicateurs de rareté
    let multiplier = 1
    switch (item.rarity) {
      case 'uncommon':
        multiplier = 1.15
        break
      case 'rare':
        multiplier = 1.30
        break
      case 'legendary':
        multiplier = 1.50
        break
    }
    
    // Appliquer les propriétés
    let vitModifier = 0
    let defModifier = 0
    let atkModifier = 0
    
    item.properties.forEach(prop => {
      switch (prop) {
        case 'light':
          vitModifier += 1
          break
        case 'heavy':
          vitModifier -= 1
          defModifier += 2
          break
        case 'rusty':
          atkModifier -= Math.floor(effectiveStats.atk * 0.1)
          break
      }
    })
    
    atk += Math.floor(effectiveStats.atk * multiplier) + atkModifier
    def += Math.floor(effectiveStats.def * multiplier) + defModifier
    vit += Math.floor(effectiveStats.vit * multiplier) + vitModifier
    
    // Appliquer les malus cachés des items maudits
    if (item.cursed && item.hiddenMalus) {
      atk += item.hiddenMalus.atk || 0
      def += item.hiddenMalus.def || 0
      vit += item.hiddenMalus.vit || 0
    }
  })
  
  // Stats de base du personnage (sans équipement)
  // Le Soudard a une base de survie même sans équipement
  atk = Math.max(2, atk + 2) // Minimum 2
  def = Math.max(1, def + 1) // Minimum 1
  vit = Math.max(3, vit + 2) // Minimum 3 (base de mobilité)
  
  return { atk, def, vit }
}

/**
 * Convertit les stats en langage immersif pour un Soudard
 */
export function getStatsDescription(stats: PlayerStats): {
  attack: string
  defense: string
  speed: string
} {
  // Attaque
  let attack = ''
  if (stats.atk >= 15) {
    attack = 'Je me sens assez fort pour les faire.'
  } else if (stats.atk >= 10) {
    attack = 'Mon arme devrait suffire.'
  } else if (stats.atk >= 6) {
    attack = 'Je peux tenir, mais ça sera serré.'
  } else {
    attack = 'Je ne suis pas sûr de gagner.'
  }
  
  // Défense
  let defense = ''
  if (stats.def >= 15) {
    defense = 'Bien protégé. Ils auront du mal à me toucher.'
  } else if (stats.def >= 10) {
    defense = 'Mon armure devrait tenir.'
  } else if (stats.def >= 6) {
    defense = 'Je ne suis pas bien couvert.'
  } else {
    defense = 'Presque à découvert. Dangereux.'
  }
  
  // Vitesse
  let speed = ''
  if (stats.vit >= 8) {
    speed = 'Léger. Je peux esquiver facilement.'
  } else if (stats.vit >= 6) {
    speed = 'Je bouge normalement.'
  } else if (stats.vit >= 4) {
    speed = 'Un peu lourd. Je bouge lentement.'
  } else {
    speed = 'Très lourd. Difficile de fuir.'
  }
  
  return { attack, defense, speed }
}

/**
 * Format court pour affichage
 * @deprecated Non utilisé - à supprimer
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
// @ts-ignore - Fonction dépréciée, non utilisée
function getStatsShort(_stats: PlayerStats): string {
  const desc = getStatsDescription(_stats)
  return `${desc.attack} ${desc.defense} ${desc.speed}`
}
