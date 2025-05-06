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

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      moneyEarned: 0,
      xpEarned: 0
    })
    
    form.reset(defaultValues)
  }

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
                      <Input {...field} className="bg-amber-100/90 border-amber-500 text-amber-950 focus:ring-2 focus:ring-amber-400 transition-all" />
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
                      <Input
                        {...field}
                        placeholder="Ex: Brad Pitt, Emma Stone"
                        className="bg-amber-100/90 border-amber-500 text-amber-950 focus:ring-2 focus:ring-amber-400 transition-all"
                      />
                    </FormControl>
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
