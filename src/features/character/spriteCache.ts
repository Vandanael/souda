/**
 * Cache LRU pour les sprites composés du personnage
 * Max 100 entrées, éviction du moins récemment utilisé
 */

interface CacheEntry {
  imageData: ImageData
  lastUsed: number
}

export class SpriteCache {
  private cache: Map<string, CacheEntry> = new Map()
  private maxSize: number = 100
  private accessCounter: number = 0

  /**
   * Obtient une entrée du cache
   */
  get(key: string): ImageData | null {
    const entry = this.cache.get(key)
    if (!entry) {
      return null
    }
    
    // Mettre à jour le timestamp d'accès
    entry.lastUsed = ++this.accessCounter
    return entry.imageData
  }

  /**
   * Ajoute une entrée au cache
   */
  set(key: string, imageData: ImageData): void {
    // Si le cache est plein, évincer le moins récemment utilisé
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU()
    }
    
    this.cache.set(key, {
      imageData,
      lastUsed: ++this.accessCounter
    })
  }

  /**
   * Évince l'entrée la moins récemment utilisée
   */
  private evictLRU(): void {
    let lruKey: string | null = null
    let lruTime = Infinity
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastUsed < lruTime) {
        lruTime = entry.lastUsed
        lruKey = key
      }
    }
    
    if (lruKey) {
      this.cache.delete(lruKey)
    }
  }

  /**
   * Vide le cache
   */
  clear(): void {
    this.cache.clear()
    this.accessCounter = 0
  }

  /**
   * Obtient la taille actuelle du cache
   */
  size(): number {
    return this.cache.size
  }
}

// Instance singleton du cache
export const spriteCache = new SpriteCache()
