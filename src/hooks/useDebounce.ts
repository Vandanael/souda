import { useState, useEffect, useRef } from 'react'

/**
 * Hook pour débouncer une fonction
 * Empêche les appels multiples rapides (double-clics, etc.)
 * 
 * @param callback Fonction à débouncer
 * @param delay Délai en ms (défaut: 500ms)
 * @returns Fonction débouncée et état de chargement
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): [T, boolean] {
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // Mettre à jour la référence du callback
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedCallback = ((...args: Parameters<T>) => {
    // Annuler le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Désactiver le bouton immédiatement
    setIsLoading(true)

    // Créer un nouveau timeout
    timeoutRef.current = setTimeout(() => {
      // Exécuter le callback
      callbackRef.current(...args)
      
      // Réactiver après un court délai
      setTimeout(() => {
        setIsLoading(false)
      }, 100)
    }, delay)
  }) as T

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [debouncedCallback, isLoading]
}

/**
 * Hook simplifié pour protéger un bouton contre les double-clics
 * Retourne une fonction wrapper et un état disabled
 */
export function useButtonProtection(
  callback: () => void,
  delay: number = 500
): [() => void, boolean] {
  const [isDisabled, setIsDisabled] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const protectedCallback = () => {
    if (isDisabled) return

    setIsDisabled(true)
    callback()

    timeoutRef.current = setTimeout(() => {
      setIsDisabled(false)
    }, delay)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [protectedCallback, isDisabled]
}
