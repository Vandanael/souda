import { Item } from '../../types/item'
import { LAYER_ORDER, getSpritePath, getPlaceholderPath, loadImage, generateEquipmentHash } from './layering'
import { spriteCache as cache } from './spriteCache'

const CANVAS_SIZE = 64 // Taille du canvas en pixels

// Détecter si on est sur un appareil bas de gamme
function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false
  const isSmallScreen = window.innerWidth < 400
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const lowCores = navigator.hardwareConcurrency < 4
  const lowMemory = (navigator as any).deviceMemory ? (navigator as any).deviceMemory < 4 : false
  return (isSmallScreen && hasTouch) || lowCores || lowMemory
}

/**
 * Rend le personnage avec son équipement
 * @param equipment Équipement actuel
 * @param previewItem Item en preview (optionnel, affiché en transparence)
 * @returns ImageData du personnage rendu
 */
export async function renderCharacter(
  equipment: Partial<Record<string, Item>>,
  previewItem?: Item
): Promise<ImageData> {
  const startTime = performance.now()
  
  // Générer le hash de l'équipement (incluant le preview si présent)
  const baseHash = generateEquipmentHash(equipment)
  const equipmentHash = previewItem
    ? `${baseHash}_preview:${previewItem.slot}:${previewItem.id}`
    : baseHash
  
  // Vérifier le cache
  const cached = cache.get(equipmentHash)
  if (cached) {
    return cached
  }
  
  // Créer un canvas offscreen
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }
  
  // Mode performance : utiliser placeholders uniquement sur appareils bas de gamme
  const usePerformanceMode = isLowEndDevice()
  
  // Charger toutes les images nécessaires (lazy loading)
  const imagePromises: Promise<{ slot: string; img: HTMLImageElement }>[] = []
  
  // Corps de base (toujours affiché)
  imagePromises.push(
    loadImage('/sprites/body_base.svg').catch(() => {
      // Si pas de sprite de base, créer un placeholder
      const placeholder = document.createElement('canvas')
      placeholder.width = CANVAS_SIZE
      placeholder.height = CANVAS_SIZE
      const placeholderCtx = placeholder.getContext('2d')!
      placeholderCtx.fillStyle = '#444'
      placeholderCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
      const img = new Image()
      img.src = placeholder.toDataURL()
      return img
    }).then(img => ({ slot: 'body', img }))
  )
  
  // Charger les sprites pour chaque slot équipé (lazy loading)
  for (const slot of LAYER_ORDER) {
    const item = equipment[slot]
    if (item) {
      // En mode performance, utiliser directement le placeholder
      if (usePerformanceMode) {
        imagePromises.push(
          createColorPlaceholder(slot, item.rarity).then(img => ({ slot, img }))
        )
      } else {
        // Sinon, essayer de charger le sprite réel
        const spritePath = getSpritePath(item)
        imagePromises.push(
          loadImage(spritePath).catch(() => {
            // Fallback sur placeholder si le sprite n'existe pas
            const placeholderPath = getPlaceholderPath(slot, item.rarity)
            return loadImage(placeholderPath).catch(() => {
              // Si même le placeholder n'existe pas, créer un rectangle coloré
              return createColorPlaceholder(slot, item.rarity)
            })
          }).then(img => ({ slot, img }))
        )
      }
    }
  }
  
  // Attendre que toutes les images soient chargées
  // En mode performance, charger séquentiellement pour éviter la surcharge
  let loadedImages: Array<{ slot: string; img: HTMLImageElement }>
  if (usePerformanceMode) {
    // Chargement séquentiel sur appareils bas de gamme
    loadedImages = []
    for (const promise of imagePromises) {
      try {
        const result = await Promise.race([
          promise,
          new Promise<{ slot: string; img: HTMLImageElement }>((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 500) // Timeout plus court
          })
        ])
        loadedImages.push(result)
      } catch {
        // En cas d'erreur, utiliser un placeholder
        const placeholder = await createColorPlaceholder('unknown', 'common')
        loadedImages.push({ slot: 'unknown', img: placeholder })
      }
    }
  } else {
    // Chargement parallèle sur appareils normaux
    loadedImages = await Promise.all(imagePromises)
  }
  
  // Dessiner le corps de base
  const bodyImage = loadedImages.find(img => img.slot === 'body')
  if (bodyImage) {
    ctx.drawImage(bodyImage.img, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
  }
  
  // Dessiner chaque couche dans l'ordre
  for (const slot of LAYER_ORDER) {
    const imageData = loadedImages.find(img => img.slot === slot)
    if (imageData) {
      ctx.drawImage(imageData.img, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
    }
  }
  
  // Si previewItem, dessiner par-dessus en transparence
  if (previewItem) {
    const previewPath = getSpritePath(previewItem)
    try {
      const previewImg = await loadImage(previewPath).catch(() => {
        const placeholderPath = getPlaceholderPath(previewItem.slot, previewItem.rarity)
        return loadImage(placeholderPath.replace('.png', '.svg')).catch(() => createColorPlaceholder(previewItem.slot, previewItem.rarity))
      })
      
      ctx.globalAlpha = 0.5
      ctx.drawImage(previewImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
      ctx.globalAlpha = 1.0
    } catch (error) {
      console.warn('Failed to load preview image:', error)
    }
  }
  
  // Obtenir l'ImageData
  const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  
  // Stocker dans le cache
  cache.set(equipmentHash, imageData)
  
  const renderTime = performance.now() - startTime
  // Sur mobile, on accepte jusqu'à 33ms (30 FPS) au lieu de 16ms (60 FPS)
  const targetTime = typeof window !== 'undefined' && window.innerWidth < 768 ? 33 : 16
  if (renderTime > targetTime) {
    console.warn(`Render took ${renderTime.toFixed(2)}ms (target: <${targetTime}ms)`)
  }
  
  return imageData
}

/**
 * Crée un placeholder coloré pour un slot et rareté
 */
function createColorPlaceholder(_slot: string, rarity: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = CANVAS_SIZE
    canvas.height = CANVAS_SIZE
    const ctx = canvas.getContext('2d')!
    
    // Couleur par rareté
    const colors: Record<string, string> = {
      common: '#808080',    // Gris
      uncommon: '#2ecc71',  // Vert
      rare: '#3498db',      // Bleu
      legendary: '#f39c12'  // Or
    }
    
    ctx.fillStyle = colors[rarity] || '#808080'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    
    // Ajouter un contour
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, CANVAS_SIZE - 2, CANVAS_SIZE - 2)
    
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = canvas.toDataURL()
  })
}
