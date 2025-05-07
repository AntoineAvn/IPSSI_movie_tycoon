"use client"

import { useState, useEffect } from "react"
import { MovieForm } from "./movie-form"
import { PlayerSidebar } from "./player-sidebar"
import { ResultModal } from "../components/result-modal"
import { HistoryModal } from "./history-modal"
import { StatsModal } from "./stats-modal"
import type { Film } from "../lib/types"
import { toast } from "sonner" // Vous devrez installer cette dépendance: npm install sonner

// Constantes pour la logique économique du jeu
const BUDGET_COSTS = {
  1: 1000,  // Petit budget
  2: 5000,  // Budget moyen
  3: 15000, // Gros budget
};

const XP_REWARDS = {
  flop: 30,       // Note < 6
  average: 100,   // Note entre 6 et 8
  success: 200,   // Note >= 8
  blockbuster: 400, // Note >= 9
};

// Multiplicateur de retour sur investissement selon le budget
const ROI_MULTIPLIERS = {
  1: 2.5,   // Petit budget = plus grand retour potentiel (risque faible, gain potentiel élevé)
  2: 2.0,   // Budget moyen
  3: 1.8,   // Gros budget (risque élevé, gain potentiel modéré)
};

// XP nécessaire pour chaque niveau (progression plus rapide au début)
const XP_PER_LEVEL = [
  0,      // Niveau 1 (départ)
  100,    // Niveau 2
  300,    // Niveau 3
  600,    // Niveau 4
  1000,   // Niveau 5
  1500,   // Niveau 6
  2100,   // Niveau 7
  2800,   // Niveau 8
  3600,   // Niveau 9
  4500,   // Niveau 10
  5500,   // Niveau 11
  6600,   // Niveau 12
  7800,   // Niveau 13
  9100,   // Niveau 14
  10500,  // Niveau 15
  12000,  // Niveau 16
  13600,  // Niveau 17
  15300,  // Niveau 18
  17100,  // Niveau 19
  19000,  // Niveau 20
];

// Définition des genres de films débloqués à chaque niveau
export const GENRES_BY_LEVEL = {
  // Genres disponibles dès le début
  1: ["Action", "Comédie", "Drame"],
  
  // Genres débloqués progressivement
  2: ["Aventure"],
  3: ["Crime"],
  4: ["Animation"],
  5: ["Romance"],
  6: ["Thriller"],
  7: ["Horreur"],
  8: ["Science-Fiction"],
  9: ["Documentaire"],
  10: ["Fantastique"],
  12: ["Western"],
};

export function MovieTycoonApp() {
  const [money, setMoney] = useState(10000)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [films, setFilms] = useState<Film[]>([])
  const [showResultModal, setShowResultModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null)
  const [isLevelUp, setIsLevelUp] = useState(false)

  // Calculate level based on XP with the new progression system
  useEffect(() => {
    // Find the highest level the player has achieved based on XP
    let newLevel = 1;
    for (let i = 1; i < XP_PER_LEVEL.length; i++) {
      if (xp >= XP_PER_LEVEL[i]) {
        newLevel = i + 1;
      } else {
        break;
      }
    }
    
    // If level has changed, update it and show level up animation
    if (newLevel !== level) {
      setLevel(newLevel);
      if (level > 1) {
        setIsLevelUp(true);
        toast.success(`Félicitations ! Vous avez atteint le niveau ${newLevel} !`);
        setTimeout(() => setIsLevelUp(false), 3000);
      }
    }
  }, [xp, level]);

  // Obtenir tous les genres débloqués en fonction du niveau actuel
  const getUnlockedGenres = () => {
    const unlockedGenres = new Set<string>();
    
    // Ajouter tous les genres débloqués jusqu'au niveau actuel
    for (let i = 1; i <= level; i++) {
      const genresForLevel = GENRES_BY_LEVEL[i as keyof typeof GENRES_BY_LEVEL];
      if (genresForLevel) {
        genresForLevel.forEach(genre => unlockedGenres.add(genre));
      }
    }
    
    return Array.from(unlockedGenres);
  };
  
  // Fonction pour obtenir tous les genres du jeu avec leur niveau de déverrouillage
  const getAllGenresWithLevels = () => {
    const genres: { name: string; level: number }[] = [];
    
    // Pour chaque niveau qui a des genres à débloquer
    Object.entries(GENRES_BY_LEVEL).forEach(([levelStr, genreList]) => {
      const levelNum = parseInt(levelStr);
      
      // Pour chaque genre à ce niveau
      genreList.forEach(genre => {
        genres.push({ name: genre, level: levelNum });
      });
    });
    
    return genres;
  };

  const handleFilmCreated = async (film: Omit<Film, "id" | "note" | "date" | "moneyEarned" | "xpEarned">) => {
    // Vérifier si le joueur a assez d'argent pour le budget choisi
    const productionCost = BUDGET_COSTS[film.budget as keyof typeof BUDGET_COSTS];
    
    if (money < productionCost) {
      toast.error(`Vous n'avez pas assez d'argent pour produire ce film ! Coût: $${productionCost.toLocaleString()}`);
      return;
    }
    
    // Déduire immédiatement le coût de production
    setMoney(prevMoney => prevMoney - productionCost);
    
    try {
      const response = await fetch("http://localhost:5001/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: film.name,
          description: film.description,
          genre: film.genre,
          annee: film.annee,
          acteur: film.acteur,
          director: film.director,
          duree: film.duree,
          budget: film.budget,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la prédiction")
      }

      const data = await response.json()
      const note = data.note_totale || Math.random() * 10 // Fallback to random if API fails

      // Calculer les gains et l'XP en fonction de la note et du budget
      const { moneyEarned, xpEarned, isProfit } = calculateRewards(note, film.budget, productionCost);

      // Create new film with results
      const newFilm: Film = {
        id: Date.now().toString(),
        ...film,
        note,
        date: new Date().toISOString(),
        moneyEarned,
        xpEarned,
      }

      // Update state
      setFilms((prevFilms) => [newFilm, ...prevFilms])
      setMoney((prev) => prev + moneyEarned)
      setXp((prev) => prev + xpEarned)
      setCurrentFilm(newFilm)
      setShowResultModal(true)
      
      // Notification de résultat
      if (isProfit) {
        toast.success(`Votre film a rapporté $${moneyEarned.toLocaleString()} !`);
      } else if (moneyEarned > 0) {
        toast.info(`Votre film a rapporté $${moneyEarned.toLocaleString()}, mais vous avez perdu de l'argent sur cet investissement.`);
      } else {
        toast.error(`Votre film est un échec commercial ! Vous avez perdu $${productionCost.toLocaleString()}.`);
      }
      
    } catch (error) {
      console.error("Erreur:", error)
      // Simulate a response for development/demo purposes
      const note = Math.random() * 10

      // Calculer les gains et l'XP en fonction de la note et du budget
      const { moneyEarned, xpEarned, isProfit } = calculateRewards(note, film.budget, productionCost);

      const newFilm: Film = {
        id: Date.now().toString(),
        ...film,
        note,
        date: new Date().toISOString(),
        moneyEarned,
        xpEarned,
      }

      setFilms((prevFilms) => [newFilm, ...prevFilms])
      setMoney((prev) => prev + moneyEarned)
      setXp((prev) => prev + xpEarned)
      setCurrentFilm(newFilm)
      setShowResultModal(true)
      
      // Notification de résultat
      if (isProfit) {
        toast.success(`Votre film a rapporté $${moneyEarned.toLocaleString()} !`);
      } else if (moneyEarned > 0) {
        toast.info(`Votre film a rapporté $${moneyEarned.toLocaleString()}, mais vous avez perdu de l'argent sur cet investissement.`);
      } else {
        toast.error(`Votre film est un échec commercial ! Vous avez perdu $${productionCost.toLocaleString()}.`);
      }
    }
  }
  
  // Fonction pour calculer les récompenses basées sur la note du film et le budget
  const calculateRewards = (note: number, budget: number, productionCost: number) => {
    let xpEarned = 0;
    let moneyEarned = 0;
    let isProfit = false;
    
    // Calculer l'XP gagnée
    if (note >= 9) {
      xpEarned = XP_REWARDS.blockbuster;
    } else if (note >= 8) {
      xpEarned = XP_REWARDS.success;
    } else if (note >= 6) {
      xpEarned = XP_REWARDS.average;
    } else {
      xpEarned = XP_REWARDS.flop;
    }
    
    // Bonus d'XP pour les budgets plus élevés
    xpEarned = Math.floor(xpEarned * (1 + (budget - 1) * 0.2));
    
    // Calculer l'argent gagné
    // Le facteur de succès détermine le pourcentage du retour potentiel maximal
    const successFactor = Math.min(1, note / 10);
    
    // Calcul du gain potentiel basé sur le coût de production et le multiplicateur de ROI
    const potentialReturn = productionCost * ROI_MULTIPLIERS[budget as keyof typeof ROI_MULTIPLIERS];
    
    // Le gain réel est le gain potentiel multiplié par le facteur de succès
    moneyEarned = Math.floor(potentialReturn * successFactor);
    
    // Vérifier si le film a généré un profit par rapport à l'investissement
    isProfit = moneyEarned > productionCost;
    
    return { moneyEarned, xpEarned, isProfit };
  }

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 relative">
      <div className="flex-1 fade-in">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-300 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] py-3 px-8 rounded-full bg-gradient-to-r from-orange-900/80 to-red-800/80 inline-block border-2 border-amber-500 animated-fire-glow">
            MOVIE TYCOON
          </h1>
        </div>

        <MovieForm 
          onSubmit={handleFilmCreated} 
          unlockedGenres={getUnlockedGenres()}
          allGenres={getAllGenresWithLevels()}
          currentLevel={level}
        />
      </div>

      <PlayerSidebar 
        money={money} 
        xp={xp} 
        level={level} 
        onHistoryClick={() => setShowHistoryModal(true)}
        onStatsClick={() => setShowStatsModal(true)}
        nextLevelXp={level < XP_PER_LEVEL.length ? XP_PER_LEVEL[level] : undefined}
        currentLevelXp={level > 1 ? XP_PER_LEVEL[level-1] : 0}
      />

      {showResultModal && currentFilm && (
        <ResultModal 
          film={currentFilm} 
          onClose={() => setShowResultModal(false)} 
          productionCost={BUDGET_COSTS[currentFilm.budget as keyof typeof BUDGET_COSTS]}
        />
      )}

      {showHistoryModal && <HistoryModal films={films} onClose={() => setShowHistoryModal(false)} />}
      
      {showStatsModal && <StatsModal onClose={() => setShowStatsModal(false)} />}
      
      {/* Animation de level up */}
      {isLevelUp && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-6xl font-bold text-amber-300 animate-bounce shadow-lg bg-orange-900/70 px-8 py-4 rounded-2xl border-4 border-amber-400 animated-fire-glow">
            LEVEL UP!
          </div>
        </div>
      )}
    </div>
  )
}
