"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  PieChart, 
  BarChart, 
  Activity,
  BarChart3,
  Globe,
  Calendar,
  Star,
  Filter,
  PieChartIcon
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

// Type pour les données de films
type MovieData = {
  _id: string;
  Film_title: string;
  Release_year: string;
  Director: string;
  Cast: string;
  Average_rating: number;
  Owner_rating: string;
  Genres: string;
  Runtime: number;
  Countries: string;
  Original_language: string;
  Spoken_languages: string;
  Description: string;
  Studios: string;
  Watches: number;
  List_appearances: number;
  Likes: number;
  Fans: number;
  "½": number;
  "★": number;
  "★½": number;
  "★★": number;
  "★★½": number;
  "★★★": number;
  "★★★½": number;
  "★★★★": number;
  "★★★★½": number;
  "★★★★★": number;
  Total_ratings: number;
  Film_URL: string;
}

// Propriétés du composant
type StatsModalProps = {
  onClose: () => void;
}

// Couleurs pour les graphiques
const COLORS = [
  '#FFB347', '#FF8C00', '#FFA500', '#FF7F50', '#FF6347', 
  '#FFD700', '#DAA520', '#B8860B', '#CD853F', '#D2691E',
  '#8B4513', '#A52A2A', '#FF4500', '#FF0000', '#B22222'
];

export function StatsModal({ onClose }: StatsModalProps) {
  const [moviesData, setMoviesData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<string>("ratings");

  // Récupérer les données des films
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        const response = await fetch('/api/movies/stats');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setMoviesData(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Une erreur est survenue lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesData();
  }, []);

  // Extraction des données pour le graphique de distribution des notes
  const ratingsDistributionData = useMemo(() => {
    if (!moviesData.length) return [];
    
    return [
      { name: '½☆', value: moviesData.reduce((sum, movie) => sum + (movie['½'] || 0), 0) },
      { name: '★', value: moviesData.reduce((sum, movie) => sum + (movie['★'] || 0), 0) },
      { name: '★½', value: moviesData.reduce((sum, movie) => sum + (movie['★½'] || 0), 0) },
      { name: '★★', value: moviesData.reduce((sum, movie) => sum + (movie['★★'] || 0), 0) },
      { name: '★★½', value: moviesData.reduce((sum, movie) => sum + (movie['★★½'] || 0), 0) },
      { name: '★★★', value: moviesData.reduce((sum, movie) => sum + (movie['★★★'] || 0), 0) },
      { name: '★★★½', value: moviesData.reduce((sum, movie) => sum + (movie['★★★½'] || 0), 0) },
      { name: '★★★★', value: moviesData.reduce((sum, movie) => sum + (movie['★★★★'] || 0), 0) },
      { name: '★★★★½', value: moviesData.reduce((sum, movie) => sum + (movie['★★★★½'] || 0), 0) },
      { name: '★★★★★', value: moviesData.reduce((sum, movie) => sum + (movie['★★★★★'] || 0), 0) }
    ];
  }, [moviesData]);

  // Extraction des données pour le graphique des pays
  const countriesData = useMemo(() => {
    if (!moviesData.length) return [];
    
    const countryCounts: Record<string, number> = {};
    
    moviesData.forEach(movie => {
      try {
        // Conversion de la chaîne en tableau
        const countriesStr = movie.Countries || "[]";
        // Ignorer les valeurs "nan"
        if (countriesStr === "nan") return;
        
        // Parser le tableau avec une fonction personnalisée pour gérer les formats mixtes
        let countriesArr: string[] = [];
        try {
          // Gestion robuste du parsing pour les formats mixtes de guillemets
          if (countriesStr.startsWith('[') && countriesStr.endsWith(']')) {
            // Utiliser une regex pour extraire les éléments entre guillemets ou apostrophes
            const matches = countriesStr.match(/(['"])(.*?)\1/g);
            if (matches) {
              countriesArr = matches.map(m => m.slice(1, -1));
            }
          }
          
          // Si la méthode précédente n'a pas fonctionné, essayer le parsing JSON standard
          if (countriesArr.length === 0) {
            countriesArr = JSON.parse(countriesStr.replace(/'/g, '"'));
          }
        } catch (parseError) {
          console.error('Erreur de parsing pour pays:', countriesStr);
          return;
        }
        
        countriesArr.forEach((country: string) => {
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        });
      } catch (e) {
        console.error('Erreur de traitement pour les pays:', e);
      }
    });
    
    // Convertir en format pour le graphique et trier par fréquence
    return Object.entries(countryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 pays
  }, [moviesData]);

  // Extraction des données pour le graphique des genres de films
  const genresData = useMemo(() => {
    if (!moviesData.length) return [];
    
    const genreCounts: Record<string, number> = {};
    
    moviesData.forEach(movie => {
      try {
        // Conversion de la chaîne en tableau
        const genresStr = movie.Genres || "[]";
        // Ignorer les valeurs "nan"
        if (genresStr === "nan") return;
        
        // Parser le tableau avec une fonction personnalisée pour gérer les formats mixtes
        let genresArr: string[] = [];
        try {
          // Gestion robuste du parsing pour les formats mixtes de guillemets
          if (genresStr.startsWith('[') && genresStr.endsWith(']')) {
            // Utiliser une regex pour extraire les éléments entre guillemets ou apostrophes
            const matches = genresStr.match(/(['"])(.*?)\1/g);
            if (matches) {
              genresArr = matches.map(m => m.slice(1, -1));
            }
          }
          
          // Si la méthode précédente n'a pas fonctionné, essayer le parsing JSON standard
          if (genresArr.length === 0) {
            genresArr = JSON.parse(genresStr.replace(/'/g, '"'));
          }
        } catch (parseError) {
          console.error('Erreur de parsing pour genres:', genresStr);
          return;
        }
        
        genresArr.forEach((genre: string) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      } catch (e) {
        console.error('Erreur de traitement pour les genres:', e);
      }
    });
    
    // Convertir en format pour le graphique et trier par fréquence
    return Object.entries(genreCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 genres
  }, [moviesData]);

  // Extraction des données pour le graphique des langues
  const languagesData = useMemo(() => {
    if (!moviesData.length) return [];
    
    const languageCounts: Record<string, number> = {};
    
    moviesData.forEach(movie => {
      const language = movie.Original_language;
      if (language && language !== "nan") {
        languageCounts[language] = (languageCounts[language] || 0) + 1;
      }
    });
    
    // Convertir en format pour le graphique et trier par fréquence
    return Object.entries(languageCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 langues
  }, [moviesData]);

  // Extraction des données pour le graphique vues vs. likes
  const viewsLikesData = useMemo(() => {
    if (!moviesData.length) return [];
    
    return moviesData
      .filter(movie => movie.Watches > 0 && movie.Likes > 0)
      .map(movie => {
        // S'assurer que Film_title est une chaîne
        const title = typeof movie.Film_title === 'string' ? movie.Film_title : String(movie.Film_title || 'Film sans titre');
        return {
          name: title.length > 15 ? title.substring(0, 15) + '...' : title,
          watches: movie.Watches,
          likes: movie.Likes,
          ratio: Number(((movie.Likes / movie.Watches) * 100).toFixed(2))
        };
      })
      .sort((a, b) => b.watches - a.watches)
      .slice(0, 10); // Top 10 films par vues
  }, [moviesData]);

  // Extraction des données pour distribution des durées de films
  const runtimeDistribution = useMemo(() => {
    if (!moviesData.length) return [];
    
    const ranges = {
      '< 60 min': 0,
      '60-90 min': 0,
      '90-120 min': 0,
      '120-150 min': 0,
      '> 150 min': 0
    };
    
    moviesData.forEach(movie => {
      const runtime = movie.Runtime;
      if (runtime) {
        if (runtime < 60) ranges['< 60 min']++;
        else if (runtime < 90) ranges['60-90 min']++;
        else if (runtime < 120) ranges['90-120 min']++;
        else if (runtime < 150) ranges['120-150 min']++;
        else ranges['> 150 min']++;
      }
    });
    
    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, [moviesData]);

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mb-4"></div>
      <p className="text-amber-200">Chargement des statistiques...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <p className="text-red-400 text-lg">⚠️ {error}</p>
      <p className="text-amber-200 mt-2">Veuillez réessayer plus tard</p>
      <Button 
        className="mt-4 bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-600 hover:to-red-600 text-amber-200"
        onClick={onClose}
      >
        Fermer
      </Button>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="cinema-card border-2 border-amber-500 text-amber-100 max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-300 flex items-center justify-center gap-2">
            <BarChart3 className="h-6 w-6 text-amber-300" />
            <span className="animated-fire-glow">Statistiques des Films</span>
            <PieChart className="h-6 w-6 text-amber-300" />
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : (
          <>
            <Tabs defaultValue="ratings" onValueChange={setChartType} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-amber-900/60 border border-amber-600">
                <TabsTrigger value="ratings" className="text-amber-200 data-[state=active]:bg-amber-700">
                  <Star className="h-4 w-4 mr-1" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="genres" className="text-amber-200 data-[state=active]:bg-amber-700">
                  <PieChartIcon className="h-4 w-4 mr-1" />
                  Genres
                </TabsTrigger>
                <TabsTrigger value="countries" className="text-amber-200 data-[state=active]:bg-amber-700">
                  <Globe className="h-4 w-4 mr-1" />
                  Pays
                </TabsTrigger>
                <TabsTrigger value="languages" className="text-amber-200 data-[state=active]:bg-amber-700">
                  <Activity className="h-4 w-4 mr-1" />
                  Langues
                </TabsTrigger>
                <TabsTrigger value="popularity" className="text-amber-200 data-[state=active]:bg-amber-700">
                  <BarChart className="h-4 w-4 mr-1" />
                  Popularité
                </TabsTrigger>
                <TabsTrigger value="runtime" className="text-amber-200 data-[state=active]:bg-amber-700">
                  <Calendar className="h-4 w-4 mr-1" />
                  Durées
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[65vh] mt-4 pr-4">
                <TabsContent value="ratings" className="space-y-4">
                  <Card className="bg-amber-900/30 border border-amber-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-amber-300 text-xl">Distribution des Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReBarChart data={ratingsDistributionData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#d97706" opacity={0.3} />
                            <XAxis type="number" stroke="#fbbf24" />
                            <YAxis dataKey="name" type="category" stroke="#fbbf24" />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: '#7c2d12', 
                                border: '1px solid #b45309',
                                color: '#fcd34d'
                              }}
                            />
                            <Legend wrapperStyle={{ color: '#fcd34d' }} />
                            <Bar dataKey="value" name="Nombre d'évaluations" fill="#f59e0b">
                              {ratingsDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </ReBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="genres" className="space-y-4">
                  <Card className="bg-amber-900/30 border border-amber-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-amber-300 text-xl">Top 10 des Genres</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={genresData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              outerRadius={130}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {genresData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: '#7c2d12', 
                                border: '1px solid #b45309',
                                color: '#fcd34d'
                              }}
                              formatter={(value, name, props) => [`${value} films`, props.payload.name]}
                            />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="countries" className="space-y-4">
                  <Card className="bg-amber-900/30 border border-amber-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-amber-300 text-xl">Top 10 des Pays</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReBarChart data={countriesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d97706" opacity={0.3} />
                            <XAxis dataKey="name" stroke="#fbbf24" angle={-45} textAnchor="end" height={70} />
                            <YAxis stroke="#fbbf24" />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: '#7c2d12', 
                                border: '1px solid #b45309',
                                color: '#fcd34d'
                              }}
                            />
                            <Bar dataKey="value" name="Nombre de films" fill="#f59e0b">
                              {countriesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </ReBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="languages" className="space-y-4">
                  <Card className="bg-amber-900/30 border border-amber-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-amber-300 text-xl">Top 10 des Langues Originales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={languagesData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              outerRadius={130}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {languagesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: '#7c2d12', 
                                border: '1px solid #b45309',
                                color: '#fcd34d'
                              }}
                              formatter={(value, name, props) => [`${value} films`, props.payload.name]}
                            />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="popularity" className="space-y-4">
                  <Card className="bg-amber-900/30 border border-amber-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-amber-300 text-xl">Popularité des Films (Vues vs Likes)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={viewsLikesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d97706" opacity={0.3} />
                            <XAxis dataKey="name" stroke="#fbbf24" />
                            <YAxis yAxisId="left" stroke="#f59e0b" />
                            <YAxis yAxisId="right" orientation="right" stroke="#ea580c" />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: '#7c2d12', 
                                border: '1px solid #b45309',
                                color: '#fcd34d'
                              }}
                            />
                            <Legend wrapperStyle={{ color: '#fcd34d' }} />
                            <Line yAxisId="left" type="monotone" dataKey="watches" name="Vues" stroke="#f59e0b" activeDot={{ r: 8 }} />
                            <Line yAxisId="right" type="monotone" dataKey="likes" name="Likes" stroke="#ea580c" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="runtime" className="space-y-4">
                  <Card className="bg-amber-900/30 border border-amber-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-amber-300 text-xl">Distribution des Durées de Films</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReBarChart data={runtimeDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#d97706" opacity={0.3} />
                            <XAxis dataKey="name" stroke="#fbbf24" />
                            <YAxis stroke="#fbbf24" />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: '#7c2d12', 
                                border: '1px solid #b45309',
                                color: '#fcd34d'
                              }}
                            />
                            <Legend wrapperStyle={{ color: '#fcd34d' }} />
                            <Bar dataKey="value" name="Nombre de films" fill="#f59e0b">
                              {runtimeDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </ReBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <div className="flex justify-center pt-2 mt-4">
              <Button 
                onClick={onClose} 
                className="bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-600 hover:to-red-600 text-amber-200 font-bold px-6 py-2 game-button border border-amber-500"
              >
                Fermer
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
} 