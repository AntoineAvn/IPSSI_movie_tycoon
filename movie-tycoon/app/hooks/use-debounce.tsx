import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Définir un timer pour retarder la mise à jour de la valeur
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Nettoyer le timer si la valeur change à nouveau avant l'expiration du délai
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
} 