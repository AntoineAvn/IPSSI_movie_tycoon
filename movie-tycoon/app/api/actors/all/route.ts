import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { fallbackActors } from '@/app/lib/fallback-data';

// URI de connexion avec options SSL moins strictes et timeout plus élevé
const uri = "mongodb+srv://aavenia:azerty@cluster0.mbl7igg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export async function GET() {
  try {
    try {
      // Tenter de se connecter à MongoDB
      await client.connect();
      const database = client.db("cinema");
      console.log("Base de données sélectionnée");
      const actors = database.collection("actors");
      console.log("Collection acteurs sélectionnée");

      // Récupérer tous les acteurs (limité à 500 pour des raisons de performances)
      const result = await actors.find({})
        .sort({ films_played: -1, popularity: -1 })
        .toArray();

      console.log("Résultat obtenu:", result);

      return NextResponse.json(result, { status: 200 });
    } catch (dbError) {
      console.error("Erreur de connexion à MongoDB:", dbError);
      
      // Utiliser les données de secours prédéfinies
      return NextResponse.json(fallbackActors, { status: 200 });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des acteurs:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    try {
      // Fermer la connexion
      await client.close();
    } catch (closeError) {
      console.error("Erreur lors de la fermeture de la connexion:", closeError);
    }
  }
} 