"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { fallbackActors, fallbackDirectors } from "../lib/fallback-data"

type Actor = {
  _id: string
  name: string
  films_played?: number
  popularity: boolean
}

type Director = {
  _id: string
  name: string
  popularity: boolean
}

interface MovieDataContextType {
  actors: Actor[]
  directors: Director[]
  isLoading: boolean
  searchActors: (query: string) => Actor[]
  searchDirectors: (query: string) => Director[]
}

const MovieDataContext = createContext<MovieDataContextType | undefined>(undefined)

export function MovieDataProvider({ children }: { children: ReactNode }) {
  const [actors, setActors] = useState<Actor[]>([])
  const [directors, setDirectors] = useState<Director[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true)
      try {
        // Récupérer tous les acteurs
        const actorsResponse = await fetch('/api/actors/all')
        const actorsData = await actorsResponse.json()
        if (Array.isArray(actorsData)) {
          setActors(actorsData)
        } else {
          console.error('Format de données acteurs invalide:', actorsData)
          setActors(fallbackActors)
        }

        // Récupérer tous les réalisateurs
        const directorsResponse = await fetch('/api/directors/all')
        const directorsData = await directorsResponse.json()
        if (Array.isArray(directorsData)) {
          setDirectors(directorsData)
        } else {
          console.error('Format de données réalisateurs invalide:', directorsData)
          setDirectors(fallbackDirectors)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        // Utiliser les données de secours en cas d'erreur
        setActors(fallbackActors)
        setDirectors(fallbackDirectors)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [])

  // Fonction pour rechercher des acteurs localement
  const searchActors = (query: string): Actor[] => {
    if (!query) return []
    
    const normalizedQuery = query.toLowerCase().trim()
    return actors
      .filter(actor => actor.name.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => {
        // Trier d'abord par nombre de films joués (si disponible)
        const filmsPlayedA = a.films_played || 0
        const filmsPlayedB = b.films_played || 0
        if (filmsPlayedB !== filmsPlayedA) {
          return filmsPlayedB - filmsPlayedA
        }
        // Ensuite par popularité
        if (a.popularity !== b.popularity) {
          return a.popularity ? -1 : 1
        }
        // Enfin par ordre alphabétique
        return a.name.localeCompare(b.name)
      })
      .slice(0, 10) // Limiter à 10 résultats
  }

  // Fonction pour rechercher des réalisateurs localement
  const searchDirectors = (query: string): Director[] => {
    if (!query) return []
    
    const normalizedQuery = query.toLowerCase().trim()
    return directors
      .filter(director => director.name.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => {
        // Trier par popularité
        if (a.popularity !== b.popularity) {
          return a.popularity ? -1 : 1
        }
        // Puis par ordre alphabétique
        return a.name.localeCompare(b.name)
      })
      .slice(0, 10) // Limiter à 10 résultats
  }

  return (
    <MovieDataContext.Provider 
      value={{ actors, directors, isLoading, searchActors, searchDirectors }}
    >
      {children}
    </MovieDataContext.Provider>
  )
}

export function useMovieData() {
  const context = useContext(MovieDataContext)
  if (context === undefined) {
    throw new Error('useMovieData must be used within a MovieDataProvider')
  }
  return context
} 