import { Item } from '../../types/item'

/**
 * Ordre des couches de rendu (z-index)
 * Les couches sont dessinées dans cet ordre, de bas en haut
 */
export const LAYER_ORDER: Array<keyof typeof SLOT_TO_LAYER> = [
  'legs',
  'torso',
  'head',
  'hands',
  'weapon',
  'offhand',
  'accessory'
]

/**
 * Mapping slot -> numéro de couche
 */
export const SLOT_TO_LAYER: Record<string, number> = {
  legs: 1,
  torso: 2,
  head: 3,
  hands: 4,
  weapon: 5,
  offhand: 6,
  accessory: 7
}

/**
 * Génère un hash unique pour l'équipement
 * Format: "slot1:itemId1_slot2:itemId2_..."
 */
export function generateEquipmentHash(equipment: Partial<Record<string, Item>>): string {
  const slots = LAYER_ORDER.filter(slot => equipment[slot])
  return slots
    .map(slot => `${slot}:${equipment[slot]!.id}`)
    .join('_')
}

/**
 * Obtient le chemin du sprite pour un item
 * Format: {slot}_{rarity}_{itemId}.png (ou .svg pour placeholders)
 */
export function getSpritePath(item: Item): string {
  // Pour l'instant, on utilise les placeholders
  // Plus tard, on pourra avoir de vrais sprites .png
  return `/sprites/${item.slot}_${item.rarity}_${item.id}.png`
}

/**
 * Obtient le chemin du sprite placeholder pour un slot et rareté
 */
export function getPlaceholderPath(slot: string, rarity: string): string {
  return `/sprites/${slot}_${rarity}_placeholder.svg`
}

/**
 * Charge une image depuis un chemin
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}
