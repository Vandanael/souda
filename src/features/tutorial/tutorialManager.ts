/**
 * Gestionnaire du tutorial - Highlights et état
 */

let highlightedElements: HTMLElement[] = []
let overlayElement: HTMLElement | null = null

/**
 * Ajoute un highlight pulsant sur un élément
 */
export function highlightElement(selector: string): void {
  clearHighlights()
  
  const elements = document.querySelectorAll(selector)
  elements.forEach((el) => {
    if (el instanceof HTMLElement) {
      el.classList.add('tutorial-highlight')
      highlightedElements.push(el)
    }
  })
}

/**
 * Supprime tous les highlights
 */
export function clearHighlights(): void {
  highlightedElements.forEach((el) => {
    el.classList.remove('tutorial-highlight')
  })
  highlightedElements = []
}

/**
 * Crée un overlay semi-transparent pour bloquer les interactions
 */
export function createOverlay(excludeSelectors: string[] = []): void {
  removeOverlay()
  
  const overlay = document.createElement('div')
  overlay.className = 'tutorial-overlay'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9998;
    pointer-events: auto;
  `
  
  // Permettre les clics sur les éléments highlightés
  overlay.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    
    // Vérifier si le clic est sur un élément highlighté
    const isHighlighted = highlightedElements.some((el) => el.contains(target))
    const isExcluded = excludeSelectors.some((selector) => {
      const elements = document.querySelectorAll(selector)
      return Array.from(elements).some((el) => el.contains(target))
    })
    
    if (!isHighlighted && !isExcluded) {
      e.stopPropagation()
      e.preventDefault()
    }
  })
  
  document.body.appendChild(overlay)
  overlayElement = overlay
}

/**
 * Supprime l'overlay
 */
export function removeOverlay(): void {
  if (overlayElement) {
    overlayElement.remove()
    overlayElement = null
  }
}

/**
 * Nettoie tous les effets du tutorial
 */
export function cleanupTutorial(): void {
  clearHighlights()
  removeOverlay()
}
