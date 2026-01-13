import { Location, LocationType, LocationEvent, ExplorationResult, LOCATION_TYPES } from '../../types/location'
import { getRandomEnemy } from '../../types/enemy'
import { generateLoot } from '../loot'
import { resolveCombat } from '../combat'
import { PlayerStats } from '../../utils/stats'
import { Item } from '../../types/item'
import { SeededRandom } from '../combat/combat.logic'
import { Rumor } from '../taverne/rumors.logic'
import { BALANCE_CONFIG } from '../../config/balance'

/**
 * Probabilités d'événements par lieu
 */
const EVENT_PROBABILITIES: Record<LocationEvent, number> = {
  loot: 0.40,    // 40%
  combat: 0.30,  // 30%
  choice: 0.20,  // 20%
  empty: 0.10   // 10%
}

/**
 * Génère un risque ajusté selon le jour (scaling léger)
 */
function calculateScaledRisk(baseRisk: number, day: number): number {
  // Augmentation de 0.1 par jour, max +1
  const scaling = Math.min(1, (day - 1) * 0.1)
  return Math.min(4, Math.floor(baseRisk + scaling))
}

/**
 * Génère 5 lieux pour une journée
 * @param day Jour actuel
 * @param seed Seed pour génération aléatoire (optionnel)
 * @param existingLocations Lieux existants à réutiliser (optionnel)
 */
export function generateDailyLocations(
  day: number,
  seed?: number,
  _existingLocations?: Location[]
): Location[] {
  const random = seed !== undefined ? new SeededRandom(seed) : undefined
  
  // Créer un pool de types de lieux selon leur fréquence
  const locationPool: LocationType[] = []
  Object.entries(LOCATION_TYPES).forEach(([type, config]) => {
    const count = Math.floor(config.frequency / 5) // Normaliser pour 5 lieux
    for (let i = 0; i < count; i++) {
      locationPool.push(type as LocationType)
    }
  })
  
  // Sélectionner 5 lieux aléatoires
  const selectedTypes: LocationType[] = []
  const availablePool = [...locationPool]
  
  for (let i = 0; i < 5; i++) {
    if (availablePool.length === 0) {
      // Si le pool est vide, réinitialiser
      availablePool.push(...locationPool)
    }
    
    const index = random
      ? random.nextInt(0, availablePool.length - 1)
      : Math.floor(Math.random() * availablePool.length)
    
    const selectedType = availablePool[index]
    selectedTypes.push(selectedType)
    availablePool.splice(index, 1) // Retirer pour éviter doublons
  }
  
  // Générer les lieux avec risque et richesse
  const locations: Location[] = selectedTypes.map((type, index) => {
    const config = LOCATION_TYPES[type]
    const [minRisk, maxRisk] = config.riskRange
    
    // Risque aléatoire dans la plage
    const baseRisk = random
      ? random.nextInt(minRisk, maxRisk)
      : Math.floor(Math.random() * (maxRisk - minRisk + 1)) + minRisk
    
    const scaledRisk = calculateScaledRisk(baseRisk, day)
    
    return {
      id: `location_${day}_${index}_${Date.now()}`,
      type,
      name: config.name,
      description: config.description,
      risk: scaledRisk,
      richness: config.richness,
      explored: false,
      explorationCount: 0,
      firstSeenDay: day
    }
  })
  
  return locations
}

/**
 * Détermine le type d'événement selon les probabilités
 * @param activeRumors Rumeurs actives pour ce lieu (optionnel)
 * @param locationId ID du lieu exploré (pour vérifier si une rumeur le cible)
 * @param random Générateur aléatoire (optionnel)
 */
function determineEventType(
  activeRumors?: Rumor[],
  locationId?: string,
  random?: SeededRandom
): LocationEvent {
  // Probabilités de base
  let probabilities = { ...EVENT_PROBABILITIES }
  
  // Vérifier si des rumeurs actives modifient les probabilités
  if (activeRumors && locationId) {
    const relevantRumors = activeRumors.filter(r => 
      r.targetLocationId === locationId || 
      (r.hintType === 'loot' && !r.targetLocationId) ||
      (r.hintType === 'combat' && !r.targetLocationId) ||
      (r.hintType === 'event' && !r.targetLocationId)
    )
    
    for (const rumor of relevantRumors) {
      if (rumor.hintType === 'loot' && (rumor.targetLocationId === locationId || !rumor.targetLocationId)) {
        // Augmenter probabilité de loot de 40% à 60%
        probabilities.loot = 0.60
        probabilities.combat = 0.20
        probabilities.choice = 0.15
        probabilities.empty = 0.05
      } else if (rumor.hintType === 'combat' && (rumor.targetLocationId === locationId || !rumor.targetLocationId)) {
        // Augmenter probabilité de combat de 30% à 50%
        probabilities.loot = 0.30
        probabilities.combat = 0.50
        probabilities.choice = 0.15
        probabilities.empty = 0.05
      } else if (rumor.hintType === 'event' && (rumor.targetLocationId === locationId || !rumor.targetLocationId)) {
        // Forcer événement choice
        probabilities.loot = 0.20
        probabilities.combat = 0.20
        probabilities.choice = 0.50
        probabilities.empty = 0.10
      }
    }
  }
  
  const rand = random ? random.next() : Math.random()
  
  if (rand < probabilities.loot) {
    return 'loot'
  } else if (rand < probabilities.loot + probabilities.combat) {
    return 'combat'
  } else if (rand < probabilities.loot + probabilities.combat + probabilities.choice) {
    return 'choice'
  } else {
    return 'empty'
  }
}

/**
 * Résout l'exploration d'un lieu
 * @param location Lieu à explorer
 * @param playerStats Stats du joueur
 * @param equipment Équipement du joueur
 * @param activeRumors Rumeurs actives pour ce lieu (optionnel)
 * @param random Générateur aléatoire (optionnel)
 */
export function resolveExploration(
  location: Location,
  playerStats: PlayerStats,
  equipment: Partial<Record<string, Item>>,
  activeRumors?: Rumor[],
  random?: SeededRandom
): ExplorationResult {
  // Vérifier si c'est une revisite
  const isRevisit = location.explored && (location.explorationCount ?? 0) > 0
  
  const eventType = determineEventType(activeRumors, location.id, random)
  
  const result: ExplorationResult = {
    event: eventType,
    location
  }
  
  switch (eventType) {
    case 'combat': {
      // Générer ennemi selon le risque
      const enemy = getRandomEnemy(location.risk)
      const combatResult = resolveCombat(playerStats, enemy, equipment, random)
      
      result.enemyId = enemy.id
      result.combatResult = combatResult
      break
    }
    
    case 'loot': {
      // Vérifier si une rumeur 'loot' est active pour ce lieu
      const hasLootRumor = activeRumors?.some(r => 
        (r.hintType === 'loot' && r.targetLocationId === location.id) ||
        (r.hintType === 'loot' && !r.targetLocationId)
      )
      
      // Générer loot selon la richesse, avec bonus si rumeur active
      const item = generateLoot(location.risk, undefined, random, hasLootRumor)
      
      // 70% item, 30% or (réduit à 50% si revisite)
      const itemChance = isRevisit ? 0.5 : 0.7
      if (random ? random.next() < itemChance : Math.random() < itemChance) {
        result.item = item
        if (isRevisit) {
          result.specialMessage = 'Tu as déjà exploré ce lieu. Moins de découvertes.'
        }
      } else {
        // Or selon richesse (réduit de 50% si revisite)
        // Augmenté : richness * 10 à richness * 30 (au lieu de 8-24, +25%)
        const baseGold = random
          ? random.nextInt(location.richness * 10, location.richness * 30)
          : Math.floor(Math.random() * (location.richness * 30 - location.richness * 10 + 1)) + location.richness * 10
        // Appliquer multiplicateur global depuis BALANCE_CONFIG (+35%) sauf si revisite
        const goldMultiplier = isRevisit ? 0.5 : BALANCE_CONFIG.economy.goldMultiplier
        const goldAmount = Math.floor(baseGold * goldMultiplier)
        result.gold = goldAmount
        if (isRevisit) {
          result.specialMessage = 'Tu as déjà exploré ce lieu. Moins de découvertes.'
        }
      }
      break
    }
    
    case 'choice': {
      // Choix narratif simple pour l'instant
      result.choiceId = `choice_${location.type}`
      result.choiceText = `Tu arrives à ${location.name}. Que fais-tu ?`
      result.choices = [
        {
          id: 'explore_careful',
          text: 'Explorer prudemment',
          consequence: 'Tu trouves quelque chose, mais tu perds du temps.'
        },
        {
          id: 'explore_fast',
          text: 'Fouiller rapidement',
          consequence: 'Tu trouves moins, mais tu es plus rapide.'
        },
        {
          id: 'leave',
          text: 'Partir',
          consequence: 'Tu quittes le lieu sans rien.'
        }
      ]
      break
    }
    
    case 'empty': {
      // Lieu vide avec description atmosphérique
      result.atmosphereText = `${location.description} Rien d'intéressant ici.`
      break
    }
  }
  
  return result
}
