"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Film } from "../lib/types"
import { DollarSign, TrendingUp, Star, Award, Film as FilmIcon } from "lucide-react"
import { useEffect, useState } from "react"

type ResultModalProps = {
  film: Film
  onClose: () => void
  productionCost?: number
}

export function ResultModal({ film, onClose, productionCost }: ResultModalProps) {
  const isSuccess = film.note >= 6
  const [showScore, setShowScore] = useState(false)
  const [showVerdict, setShowVerdict] = useState(false)
  const [showRewards, setShowRewards] = useState(false)

  useEffect(() => {
    // Animation sequences
    const timer1 = setTimeout(() => setShowScore(true), 500)
    const timer2 = setTimeout(() => setShowVerdict(true), 2000)
    const timer3 = setTimeout(() => setShowRewards(true), 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="cinema-card border-2 border-amber-500 text-amber-100 max-w-md game-card">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-300 flex items-center justify-center gap-2">
            <FilmIcon className="h-6 w-6 text-amber-300" />
            <span className="animated-fire-glow">Résultat du Film</span>
            <FilmIcon className="h-6 w-6 text-amber-300" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-amber-200">{film.name}</h3>

            <div className="flex justify-center items-center my-8 relative">
              <div className={`transition-all duration-1000 ${showScore ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-600 to-orange-500 flex items-center justify-center relative animated-pulse overflow-hidden">
                  {/* Star background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(8)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="absolute text-white" 
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          fontSize: `${Math.random() * 20 + 10}px`,
                          transform: `rotate(${Math.random() * 360}deg)`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Score with counter effect */}
                  <span className="text-4xl font-bold text-amber-950 relative z-10 animated-fire-glow">
                    {film.note.toFixed(1)}
                  </span>
                </div>
                <span className="absolute -bottom-2 right-0 text-lg font-bold text-amber-300">/10</span>
              </div>
            </div>

            <div className={`mt-6 text-center transition-all duration-1000 ${showVerdict ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              {isSuccess ? (
                <div className="flex flex-col items-center">
                  <Award className="w-12 h-12 text-amber-400 mb-2 animate-pulse" />
                  <p className="text-2xl font-bold mb-2 text-amber-400 animated-fire-glow">SUCCÈS!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Award className="w-12 h-12 text-red-400 mb-2 animate-pulse" style={{ transform: 'rotate(180deg)' }} />
                  <p className="text-2xl font-bold mb-2 text-red-400">FLOP!</p>
                </div>
              )}
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-4 mt-8 transition-all duration-1000 ${showRewards ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="bg-gradient-to-b from-amber-900/60 to-red-900/60 p-3 rounded-lg flex flex-col items-center transform hover:scale-105 transition-transform border border-amber-500/50">
              <DollarSign className="h-6 w-6 text-amber-300 mb-1" />
              <p className="text-sm text-amber-200">Argent gagné</p>
              <p className="text-xl font-bold reward-badge">${film.moneyEarned}</p>
            </div>

            <div className="bg-gradient-to-b from-amber-900/60 to-red-900/60 p-3 rounded-lg flex flex-col items-center transform hover:scale-105 transition-transform border border-amber-500/50">
              <TrendingUp className="h-6 w-6 text-amber-300 mb-1" />
              <p className="text-sm text-amber-200">XP gagné</p>
              <p className="text-xl font-bold reward-badge">+{film.xpEarned} XP</p>
            </div>

            {productionCost && (
              <>
                <div className="bg-gradient-to-b from-amber-900/60 to-red-900/60 p-3 rounded-lg flex flex-col items-center transform hover:scale-105 transition-transform border border-amber-500/50">
                  <FilmIcon className="h-6 w-6 text-amber-300 mb-1" />
                  <p className="text-sm text-amber-200">Coût de production</p>
                  <p className="text-xl font-bold reward-badge">${productionCost.toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-b from-amber-900/60 to-red-900/60 p-3 rounded-lg flex flex-col items-center transform hover:scale-105 transition-transform border border-amber-500/50">
                  <Award className={`h-6 w-6 ${film.moneyEarned > productionCost ? 'text-amber-300' : 'text-red-400'} mb-1`} />
                  <p className="text-sm text-amber-200">{film.moneyEarned > productionCost ? 'Profit' : 'Perte'}</p>
                  <p className={`text-xl font-bold reward-badge ${film.moneyEarned > productionCost ? 'text-amber-300' : 'text-red-400'}`}>
                    {film.moneyEarned > productionCost
                      ? `+$${(film.moneyEarned - productionCost).toLocaleString()}`
                      : `-$${(productionCost - film.moneyEarned).toLocaleString()}`}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button onClick={onClose} className="bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-600 hover:to-red-600 text-amber-200 font-bold px-6 py-2 game-button border border-amber-500">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
