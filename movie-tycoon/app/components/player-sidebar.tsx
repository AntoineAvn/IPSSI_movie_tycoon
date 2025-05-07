"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { VideotapeIcon as FilmReel, TrendingUp, DollarSign, Award, Star, BarChart3, History } from "lucide-react"
import { useEffect, useState } from "react"

type PlayerSidebarProps = {
  money: number
  xp: number
  level: number
  onHistoryClick: () => void
  onStatsClick: () => void
  nextLevelXp?: number
  currentLevelXp: number
}

export function PlayerSidebar({ 
  money, 
  xp, 
  level,
  onHistoryClick,
  onStatsClick,
  nextLevelXp,
  currentLevelXp 
}: PlayerSidebarProps) {
  // Calculer le pourcentage de progression vers le niveau suivant
  const progressToNextLevel = nextLevelXp 
    ? Math.min(100, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100)
    : 100; // Si pas de niveau suivant, progression à 100%

  // Animation for money and XP counters
  const [displayMoney, setDisplayMoney] = useState(money)
  
  useEffect(() => {
    // Animate money counter
    const startMoney = displayMoney
    const endMoney = money
    const duration = 1000 // ms
    const startTime = performance.now()
    
    const animateMoney = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      if (elapsedTime >= duration) {
        setDisplayMoney(endMoney)
        return
      }
      
      const progress = elapsedTime / duration
      setDisplayMoney(Math.floor(startMoney + (endMoney - startMoney) * progress))
      requestAnimationFrame(animateMoney)
    }
    
    requestAnimationFrame(animateMoney)
  }, [money, displayMoney])

  return (
    <div className="w-full lg:max-w-[300px]">
      <Card className="cinema-card border-2 border-amber-500 shadow-xl game-card">
        <CardContent className="p-4 space-y-4">
          {/* Niveau du joueur */}
          <div className="text-center">
            <div className="text-amber-300 text-2xl font-bold animated-fire-glow">
              Niveau {level}
            </div>
            <div className="mt-1 flex items-center space-x-2">
              <div className="text-amber-200 text-xs">
                {currentLevelXp} XP
              </div>
              <div className="flex-1">
                <Progress value={progressToNextLevel} className="h-2 bg-amber-900/60 border border-amber-700/50" />
              </div>
              <div className="text-amber-200 text-xs">
                {nextLevelXp || "MAX"} XP
              </div>
            </div>
          </div>

          {/* Expérience */}
          <div className="flex items-center justify-between bg-gradient-to-r from-amber-900/40 to-red-900/40 rounded-lg p-3 border-l-4 border-amber-500">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-amber-300 mr-2" />
              <div className="text-amber-200">Expérience</div>
            </div>
            <div className="text-amber-300 font-bold">{xp} XP</div>
          </div>

          {/* Argent */}
          <div className="flex items-center justify-between bg-gradient-to-r from-amber-900/40 to-red-900/40 rounded-lg p-3 border-l-4 border-amber-500">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-amber-300 mr-2" />
              <div className="text-amber-200">Argent</div>
            </div>
            <div className="text-amber-300 font-bold">${displayMoney.toLocaleString()}</div>
          </div>

          {/* Bouton Historique */}
          <Button 
            onClick={onHistoryClick}
            className="w-full bg-gradient-to-r from-amber-800 to-red-800 hover:from-amber-700 hover:to-red-700 text-amber-200 flex items-center justify-center gap-2 py-5 game-button"
          >
            <History className="h-5 w-5" />
            Historique des Films
          </Button>
          
          {/* Bouton Statistiques */}
          <Button 
            onClick={onStatsClick}
            className="w-full bg-gradient-to-r from-amber-800 to-red-800 hover:from-amber-700 hover:to-red-700 text-amber-200 flex items-center justify-center gap-2 py-5 game-button"
          >
            <BarChart3 className="h-5 w-5" />
            Statistiques
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
