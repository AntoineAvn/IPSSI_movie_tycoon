import { MovieTycoonApp } from "./components/movie-tycoon-app"
import { GameBackground } from "./components/game-background"

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Fond principal avec l'image de cinéma */}
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-20]" style={{ backgroundImage: "url('/background.png')" }}></div>
      
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="fixed inset-0 bg-black/30 z-[-15]"></div>
      
      {/* Particules animées */}
      <GameBackground />
      
      {/* Vignette effect */}
      <div className="fixed inset-0 bg-radial-gradient-vignette z-[-10]"></div>
      
      <MovieTycoonApp />
    </div>
  )
}

// Ajouter cette classe dans globals.css
// .bg-radial-gradient-vignette {
//   background: radial-gradient(circle, transparent 50%, rgba(0, 0, 0, 0.8) 150%);
// }