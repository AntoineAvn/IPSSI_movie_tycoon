"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { VideotapeIcon as FilmReel, TrendingUp, DollarSign, Award } from "lucide-react"
import { useEffect, useState } from "react"

type PlayerSidebarProps = {
  money: number
  xp: number
  level: number
  onHistoryClick: () => void
  nextLevelXp?: number
  currentLevelXp: number
}

export function PlayerSidebar({ money, xp, level, onHistoryClick, nextLevelXp, currentLevelXp }: PlayerSidebarProps) {
  // Calculate XP progress to next level (based on the new level system)
  const xpForNextLevel = nextLevelXp || currentLevelXp + 1000;
  const xpNeededForNextLevel = xpForNextLevel - currentLevelXp;
  const currentLevelProgress = xp - currentLevelXp;
  const xpProgress = nextLevelXp ? (currentLevelProgress / xpNeededForNextLevel) * 100 : 100;
  
  // Animation for money and XP counters
  const [displayMoney, setDisplayMoney] = useState(money)
  const [displayXP, setDisplayXP] = useState(currentLevelProgress)
  
  useEffect(() => {
    // Animate money counter
    const start = displayMoney
    const end = money
    const duration = 1000
    const startTime = performance.now()
    
    const animateMoney = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const currentValue = Math.floor(start + (end - start) * progress)
      
      setDisplayMoney(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animateMoney)
      }
    }
    
    if (start !== end) {
      requestAnimationFrame(animateMoney)
    }
    
    // Animate XP counter
    const startXP = displayXP
    const endXP = currentLevelProgress
    
    const animateXP = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const currentValue = Math.floor(startXP + (endXP - startXP) * progress)
      
      setDisplayXP(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animateXP)
      }
    }
    
    if (startXP !== endXP) {
      requestAnimationFrame(animateXP)
    }
  }, [money, xp, displayMoney, displayXP, currentLevelProgress])

  return (
    <div className="lg:w-80 flex flex-col gap-4 fade-in">
      <Card className="cinema-card border-2 border-amber-500 shadow-xl game-card">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Player level badge */}
            <div className="flex justify-center -mt-4 mb-2">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-700 to-red-700 flex items-center justify-center border-4 border-amber-500 animated-float">
                  <Award className="h-6 w-6 text-amber-300 absolute top-2" />
                  <span className="mt-6 text-2xl font-bold text-amber-300">{level}</span>
                </div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-amber-800 text-amber-200 text-xs px-2 py-1 rounded-full border border-amber-500">
                  Niveau
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full">
                <DollarSign className="h-6 w-6 text-amber-100" />
              </div>
              <div>
                <h3 className="text-amber-300 text-lg font-semibold">Argent</h3>
                <p className="text-amber-100 text-2xl font-bold">${displayMoney.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full">
                    <TrendingUp className="h-6 w-6 text-amber-100" />
                  </div>
                  <h3 className="text-amber-300 text-lg font-semibold">XP</h3>
                </div>
                <span className="text-amber-200 text-sm">
                  {displayXP}/{xpNeededForNextLevel} XP
                </span>
              </div>
              <Progress value={xpProgress} className="h-2 bg-amber-900/50 [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-amber-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={onHistoryClick}
        className="bg-gradient-to-r from-red-800 to-orange-800 hover:from-red-700 hover:to-orange-700 text-amber-300 text-xl font-bold py-6 border-2 border-amber-500 hover:border-amber-400 rounded-lg shadow-lg transition-all transform hover:scale-105 game-button"
      >
        <FilmReel className="mr-2 h-5 w-5 animate-pulse" />
        MES FILMS
      </Button>
    </div>
  )
}
