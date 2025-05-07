"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Film } from "../lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Clock, 
  FilmIcon, 
  Star, 
  DollarSign, 
  TrendingUp, 
  Award, 
  User2 as DirectorIcon, 
  Tag as GenreIcon,
  CalendarIcon,
  Filter
} from "lucide-react"
import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type HistoryModalProps = {
  films: Film[]
  onClose: () => void
}

export function HistoryModal({ films, onClose }: HistoryModalProps) {
  const [genreFilter, setGenreFilter] = useState<string>("all")
  const [noteFilter, setNoteFilter] = useState<string>("all")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Extraire tous les genres uniques des films
  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>()
    films.forEach(film => genres.add(film.genre))
    return Array.from(genres).sort()
  }, [films])

  // Filtrer les films en fonction des filtres sélectionnés
  const filteredFilms = useMemo(() => {
    return films.filter(film => {
      // Filtre par genre
      if (genreFilter !== "all" && film.genre !== genreFilter) {
        return false
      }
      
      // Filtre par note
      if (noteFilter !== "all") {
        const note = film.note
        switch (noteFilter) {
          case "excellent":
            return note >= 9
          case "bon":
            return note >= 7 && note < 9
          case "moyen":
            return note >= 5 && note < 7
          case "mauvais":
            return note < 5
          default:
            return true
        }
      }
      
      return true
    })
  }, [films, genreFilter, noteFilter])

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="cinema-card border-2 border-amber-500 text-amber-100 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-300 flex items-center justify-center gap-2">
            <FilmIcon className="h-6 w-6 text-amber-300" />
            <span className="animated-fire-glow">Historique de vos Films</span>
            <FilmIcon className="h-6 w-6 text-amber-300" />
          </DialogTitle>
        </DialogHeader>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Filter className="h-4 w-4 text-amber-400" />
              <span className="text-amber-200 text-sm">Filtrer par genre</span>
            </div>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger className="bg-amber-900/60 border-amber-500 text-amber-100">
                <SelectValue placeholder="Tous les genres" />
              </SelectTrigger>
              <SelectContent className="bg-amber-900/90 border-amber-500 text-amber-100">
                <SelectItem value="all" className="text-amber-100 hover:bg-amber-800/80 focus:bg-amber-800/80">
                  Tous les genres
                </SelectItem>
                {uniqueGenres.map(genre => (
                  <SelectItem 
                    key={genre} 
                    value={genre}
                    className="text-amber-100 hover:bg-amber-800/80 focus:bg-amber-800/80"
                  >
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-4 w-4 text-amber-400" />
              <span className="text-amber-200 text-sm">Filtrer par note</span>
            </div>
            <Select value={noteFilter} onValueChange={setNoteFilter}>
              <SelectTrigger className="bg-amber-900/60 border-amber-500 text-amber-100">
                <SelectValue placeholder="Toutes les notes" />
              </SelectTrigger>
              <SelectContent className="bg-amber-900/90 border-amber-500 text-amber-100">
                <SelectItem value="all" className="text-amber-100 hover:bg-amber-800/80 focus:bg-amber-800/80">
                  Toutes les notes
                </SelectItem>
                <SelectItem value="excellent" className="text-amber-100 hover:bg-amber-800/80 focus:bg-amber-800/80">
                  Excellent (9-10)
                </SelectItem>
                <SelectItem value="bon" className="text-amber-100 hover:bg-amber-800/80 focus:bg-amber-800/80">
                  Bon (7-8.9)
                </SelectItem>
                <SelectItem value="moyen" className="text-amber-100 hover:bg-amber-800/80 focus:bg-amber-800/80">
                  Moyen (5-6.9)
                </SelectItem>
                <SelectItem value="mauvais" className="text-amber-100 hover:bg-amber-800/80 focus:bg-amber-800/80">
                  Mauvais (0-4.9)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="h-[60vh] pr-4">
          {filteredFilms.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-amber-200">Aucun film ne correspond à vos critères de filtrage.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFilms.map((film, index) => (
                <div 
                  key={film.id} 
                  className="bg-gradient-to-b from-amber-900/40 to-red-900/40 rounded-lg p-4 border-l-4 border-amber-500 hover:border-l-amber-400 transition-all hover:translate-x-1 fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-amber-300">{film.name}</h3>
                      <p className="text-sm text-amber-200/80 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(film.date)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-3 py-1 rounded-full flex items-center gap-1 shadow-md animated-pulse">
                        <Star className="h-4 w-4 text-amber-200" />
                        <span className="text-lg font-bold text-amber-100">{film.note.toFixed(1)}/10</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-amber-100/90 line-clamp-2">{film.description}</p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <GenreIcon className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-amber-200/90">Genre:</span> 
                      <span className="text-amber-100">{film.genre}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DirectorIcon className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-amber-200/90">Réalisateur:</span> 
                      <span className="text-amber-100">{film.director}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-amber-200/90">Année:</span> 
                      <span className="text-amber-100">{film.annee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-amber-200/90">Budget:</span>
                      <span className="text-amber-100">
                        {film.budget === 1 ? "Petit" : film.budget === 2 ? "Moyen" : "Gros"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between text-sm pt-2 border-t border-amber-700/30">
                    <div className="text-amber-400 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-bold">+${film.moneyEarned}</span>
                    </div>
                    <div className="text-amber-400 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-bold">+{film.xpEarned} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-center pt-2">
          <Button 
            onClick={onClose} 
            className="bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-600 hover:to-red-600 text-amber-200 font-bold px-6 py-2 game-button border border-amber-500"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
