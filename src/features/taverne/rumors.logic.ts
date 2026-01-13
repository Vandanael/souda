/**
 * Génère des rumeurs pour la journée
 */

import { LocationType } from '../../types/location'

export interface Rumor {
  id: string
  text: string
  day: number // Jour où la rumeur a été générée
  hintType: 'combat' | 'loot' | 'event' | 'location' // Maintenant obligatoire
  targetLocationType?: LocationType // Type de lieu ciblé (pour rumeurs spécifiques)
  targetLocationId?: string // ID de lieu spécifique (pour rumeurs pointant vers un lieu précis)
}

const RUMOR_TEMPLATES: Array<{ text: string; hintType?: Rumor['hintType'] }> = [
  { text: "On dit qu'un convoi traverse la région bientôt. Riche, mais bien gardé.", hintType: 'combat' },
  { text: "Il y a des rumeurs sur un trésor dans les ruines du fort abandonné.", hintType: 'loot' },
  { text: "Des voyageurs parlent d'un groupe de bandits dans les bois.", hintType: 'combat' },
  { text: "Un marchand a perdu sa cargaison près du village fantôme.", hintType: 'loot' },
  { text: "On raconte qu'un ancien guerrier a caché son équipement dans les ruines.", hintType: 'loot' },
  { text: "Des lumières étranges ont été vues dans la forêt la nuit dernière.", hintType: 'event' },
  { text: "Un groupe de pillards rôde dans la région. Ils sont bien équipés.", hintType: 'combat' },
  { text: "Il y a une cache d'armes dans l'ancien monastère.", hintType: 'loot' },
  { text: "Des créatures rôdent dans les champs de bataille abandonnés.", hintType: 'combat' },
  { text: "Un trésor a été enterré près de la carrière. Personne ne l'a encore trouvé.", hintType: 'loot' }
]

/**
 * Génère 1-2 rumeurs pour la journée
 * @param day Jour actuel
 * @param existingRumors Rumeurs existantes
 * @param availableLocations Lieux disponibles pour lier les rumeurs (optionnel)
 */
export function generateDailyRumors(
  day: number, 
  existingRumors: Rumor[],
  availableLocations?: Array<{ id: string; type: LocationType }>
): Rumor[] {
  // Ne pas générer de nouvelles rumeurs si on en a déjà pour ce jour
  const todayRumors = existingRumors.filter(r => r.day === day)
  if (todayRumors.length > 0) {
    return todayRumors
  }
  
  // Générer 1-2 rumeurs
  const count = Math.floor(Math.random() * 2) + 1 // 1 ou 2
  const rumors: Rumor[] = []
  const usedTemplates = new Set<number>()
  
  // Utiliser le nombre total de rumeurs existantes comme base pour garantir l'unicité
  const baseId = existingRumors.length
  
  for (let i = 0; i < count; i++) {
    let templateIndex: number
    do {
      templateIndex = Math.floor(Math.random() * RUMOR_TEMPLATES.length)
    } while (usedTemplates.has(templateIndex))
    
    usedTemplates.add(templateIndex)
    const template = RUMOR_TEMPLATES[templateIndex]
    
    // Générer un ID unique en combinant le jour, l'index dans la boucle, 
    // la base ID et un timestamp avec microsecondes simulées
    const uniqueId = `${day}_${baseId + i}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const rumorId = `rumor_${uniqueId}`
    
    // Lier la rumeur à un lieu si disponible et si hintType est 'location'
    let targetLocationId: string | undefined
    let targetLocationType: LocationType | undefined
    
    if (availableLocations && availableLocations.length > 0 && template.hintType === 'location') {
      // Lier à un lieu aléatoire
      const randomLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)]
      targetLocationId = randomLocation.id
      targetLocationType = randomLocation.type
    } else if (availableLocations && availableLocations.length > 0 && (template.hintType === 'loot' || template.hintType === 'combat')) {
      // Pour loot/combat, lier à un lieu compatible (optionnel, mais améliore l'expérience)
      const compatibleLocations = availableLocations.filter(_loc => {
        // Pour loot, préférer lieux avec richesse élevée
        // Pour combat, préférer lieux avec risque élevé
        // Pour l'instant, on prend juste un lieu aléatoire
        return true
      })
      
      if (compatibleLocations.length > 0) {
        const randomLocation = compatibleLocations[Math.floor(Math.random() * compatibleLocations.length)]
        targetLocationId = randomLocation.id
        targetLocationType = randomLocation.type
      }
    }
    
    rumors.push({
      id: rumorId,
      text: template.text,
      day,
      hintType: template.hintType || 'event', // Fallback si undefined
      targetLocationId,
      targetLocationType
    })
  }
  
  return rumors
}
