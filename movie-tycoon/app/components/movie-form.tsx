"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Film } from "../lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

// Constantes pour les coûts de production
const BUDGET_COSTS = {
  1: 1000,  // Petit budget
  2: 5000,  // Budget moyen
  3: 15000, // Gros budget
};

const formSchema = z.object({
  name: z.string().min(1, "Le titre est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  genre: z.string().min(1, "Le genre est requis"),
  annee: z.coerce.number().int().min(1900).max(2030),
  director: z.string().min(1, "Le réalisateur est requis"),
  acteur: z.string().min(1, "Les acteurs sont requis"),
  duree: z.coerce.number().int().min(30).max(300),
  budget: z.coerce.number().int().min(1).max(3),
})

type MovieFormProps = {
  onSubmit: (data: Omit<Film, "id" | "note" | "date">) => void
  unlockedGenres: string[]
  allGenres: { name: string; level: number }[]
  currentLevel: number
}

export function MovieForm({ onSubmit, unlockedGenres, allGenres, currentLevel }: MovieFormProps) {
  const [directors, setDirectors] = useState<{name: string, popularity?: number}[]>([]);
  const [actors, setActors] = useState<{name: string, popularity?: number}[]>([]);
  const [directorsFilteredSuggestions, setDirectorsFilteredSuggestions] = useState<{name: string, popularity?: number}[]>([]);
  const [actorsFilteredSuggestions, setActorsFilteredSuggestions] = useState<{name: string, popularity?: number}[]>([]);
  const [showDirectorSuggestions, setShowDirectorSuggestions] = useState(false);
  const [showActorSuggestions, setShowActorSuggestions] = useState(false);

  const defaultValues = {
    name: "",
    description: "",
    genre: unlockedGenres[0] || "Action",
    annee: new Date().getFullYear(),
    director: "",
    acteur: "",
    duree: 90,
    budget: 1,
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Récupérer la liste des réalisateurs
  useEffect(() => {
    fetch('/api/directors/all')
      .then(response => response.json())
      .then(data => {
        console.log("Réalisateurs chargés:", data.length);
        setDirectors(data.map((director: any) => ({ 
          name: director.name || director.nom || "",
          popularity: director.popularity
        })));
      })
      .catch(error => console.error("Erreur lors de la récupération des réalisateurs:", error));
  }, []);

  // Récupérer la liste des acteurs
  useEffect(() => {
    fetch('/api/actors/all')
      .then(response => response.json())
      .then(data => {
        console.log("Acteurs chargés:", data.length);
        setActors(data.map((actor: any) => ({ 
          name: actor.name || actor.nom || "",
          popularity: actor.popularity || actor.films_played
        })));
      })
      .catch(error => console.error("Erreur lors de la récupération des acteurs:", error));
  }, []);

  // Filtrer les suggestions de réalisateurs
  const filterDirectors = (value: string) => {
    if (!value.trim()) {
      setDirectorsFilteredSuggestions([]);
      return;
    }
    
    const filtered = directors
      .filter(director => director.name.toLowerCase().includes(value.toLowerCase()))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10);
    
    setDirectorsFilteredSuggestions(filtered);
  };

  // Filtrer les suggestions d'acteurs
  const filterActors = (value: string) => {
    const lastValue = value.split(',').pop()?.trim() || "";
    
    if (!lastValue) {
      setActorsFilteredSuggestions([]);
      return;
    }
    
    const filtered = actors
      .filter(actor => actor.name.toLowerCase().includes(lastValue.toLowerCase()))
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10);
    
    setActorsFilteredSuggestions(filtered);
  };

  // Sélectionner un réalisateur (approche simplifiée)
  const selectDirector = (director: string) => {
    console.log("Réalisateur sélectionné:", director);
    form.setValue("director", director, { shouldValidate: true });
    setShowDirectorSuggestions(false);
  };

  // Sélectionner un acteur (approche simplifiée)
  const selectActor = (actor: string) => {
    console.log("Acteur sélectionné:", actor);
    const currentValue = form.getValues("acteur");
    
    // Gestion des acteurs multiples
    let newValue: string;
    if (!currentValue) {
      newValue = actor;
    } else {
      const values = currentValue.split(',').map(v => v.trim()).filter(Boolean);
      const lastPartial = values.pop(); // Enlever la partie en cours de saisie
      values.push(actor); // Ajouter l'acteur sélectionné
      newValue = values.join(', ');
    }
    
    console.log("Nouvelle valeur:", newValue);
    form.setValue("acteur", newValue, { shouldValidate: true });
    setShowActorSuggestions(false);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      moneyEarned: 0,
      xpEarned: 0
    })
    
    form.reset(defaultValues)
  }

  // Gestion du clic en dehors des suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.director-suggestions-container')) {
        setShowDirectorSuggestions(false);
      }
      if (!(event.target as Element).closest('.actor-suggestions-container')) {
        setShowActorSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card className="cinema-card border-2 border-amber-500 shadow-xl game-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl text-center text-amber-300 font-bold animated-fire-glow">CRÉER UN FILM</CardTitle>
        <div className="text-center text-amber-200 mt-1">
          Niveau actuel: <span className="font-bold">{currentLevel}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-200 text-xl">Titre</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-amber-100/90 border-amber-500 text-amber-950 focus:ring-2 focus:ring-amber-400 transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-200 text-xl">Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-amber-100/90 border-amber-500 text-amber-950 min-h-[100px] focus:ring-2 focus:ring-amber-400 transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-200 text-xl">Genre</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-amber-100/90 border-amber-500 text-amber-950 focus:ring-2 focus:ring-amber-400 transition-all">
                          <SelectValue placeholder="Sélectionner un genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-amber-50 border-amber-500 text-amber-950">
                        {unlockedGenres.map((genre) => (
                          <SelectItem key={genre} value={genre} className="text-amber-950 hover:bg-amber-100 focus:bg-amber-100">
                            {genre}
                          </SelectItem>
                        ))}
                        
                        {/* Genres verrouillés (grisés) */}
                        {allGenres
                          .filter(genre => !unlockedGenres.includes(genre.name))
                          .sort((a, b) => a.level - b.level)
                          .map(genre => (
                            <div 
                              key={genre.name} 
                              className="px-2 py-1.5 text-gray-400 flex justify-between items-center cursor-not-allowed"
                              title={`Se débloque au niveau ${genre.level}`}
                            >
                              <span>{genre.name}</span>
                              <span className="text-xs bg-amber-800/30 text-amber-300/50 px-2 py-0.5 rounded-full">
                                Niv. {genre.level}
                              </span>
                            </div>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-200 text-xl">Année</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-amber-100/90 border-amber-500 text-amber-950 focus:ring-2 focus:ring-amber-400 transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-200 text-xl">Réalisateur</FormLabel>
                    <FormControl>
                      <div className="relative director-suggestions-container">
                        <Input 
                          {...field} 
                          className="bg-amber-100/90 border-amber-500 text-amber-950 focus:ring-2 focus:ring-amber-400 transition-all" 
                          onChange={(e) => {
                            field.onChange(e);
                            filterDirectors(e.target.value);
                            setShowDirectorSuggestions(true);
                          }}
                          onFocus={() => {
                            filterDirectors(field.value);
                            setShowDirectorSuggestions(true);
                          }}
                        />
                        {showDirectorSuggestions && directorsFilteredSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full bg-amber-50 border border-amber-500 rounded-b-lg mt-[-1px] max-h-[200px] overflow-y-auto">
                            {directorsFilteredSuggestions.map((director, index) => (
                              <button 
                                type="button"
                                key={index} 
                                className="w-full px-3 py-2 text-left cursor-pointer hover:bg-amber-200 text-amber-950"
                                onClick={() => selectDirector(director.name)}
                              >
                                {director.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acteur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-200 text-xl">Acteurs</FormLabel>
                    <FormControl>
                      <div className="relative actor-suggestions-container">
                        <Input 
                          {...field} 
                          className="bg-amber-100/90 border-amber-500 text-amber-950 focus:ring-2 focus:ring-amber-400 transition-all" 
                          onChange={(e) => {
                            field.onChange(e);
                            filterActors(e.target.value);
                            setShowActorSuggestions(true);
                          }}
                          onFocus={() => {
                            filterActors(field.value);
                            setShowActorSuggestions(true);
                          }}
                        />
                        {showActorSuggestions && actorsFilteredSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full bg-amber-50 border border-amber-500 rounded-b-lg mt-[-1px] max-h-[200px] overflow-y-auto">
                            {actorsFilteredSuggestions.map((actor, index) => (
                              <button 
                                type="button"
                                key={index} 
                                className="w-full px-3 py-2 text-left cursor-pointer hover:bg-amber-200 text-amber-950"
                                onClick={() => selectActor(actor.name)}
                              >
                                {actor.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <p className="text-xs text-amber-200/70 mt-1">Tip: Vous pouvez saisir plusieurs acteurs séparés par des virgules</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-200 text-xl">Durée (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-amber-100/90 border-amber-500 text-amber-950 focus:ring-2 focus:ring-amber-400 transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-200 text-xl">Niveau de budget</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-amber-100/90 border-amber-500 text-amber-950 focus:ring-2 focus:ring-amber-400 transition-all">
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-amber-50 border-amber-500 text-amber-950">
                        <SelectItem value="1" className="text-amber-950 hover:bg-amber-100 focus:bg-amber-100">1 - Petit budget ($1,000)</SelectItem>
                        <SelectItem value="2" className="text-amber-950 hover:bg-amber-100 focus:bg-amber-100">2 - Budget moyen ($5,000)</SelectItem>
                        <SelectItem value="3" className="text-amber-950 hover:bg-amber-100 focus:bg-amber-100">3 - Gros budget ($15,000)</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center mt-2 text-amber-300">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>Coût de production: <strong>${BUDGET_COSTS[field.value as keyof typeof BUDGET_COSTS].toLocaleString()}</strong></span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 flex justify-center">
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-600 hover:to-red-600 text-amber-200 text-xl font-bold py-6 px-12 rounded-lg shadow-lg border-2 border-amber-500 hover:border-amber-400 transition-all transform hover:scale-105 game-button animated-fire-glow"
              >
                CRÉER
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
