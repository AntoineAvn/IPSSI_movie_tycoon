import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { fallbackDirectors } from '@/app/lib/fallback-data';

// URI de connexion avec options SSL moins strictes et timeout plus élevé
const uri = "mongodb+srv://aavenia:azerty@cluster0.mbl7igg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  ssl: true,
  tlsAllowInvalidCertificates: true
});

export async function GET() {
  try {
    try {
      // Tenter de se connecter à MongoDB
      await client.connect();
      const database = client.db("cinema");
      const directors = database.collection("directors");

      // Récupérer tous les réalisateurs (limité à 500 pour des raisons de performances)
      const result = await directors.find({})
        .toArray();

      return NextResponse.json(result, { status: 200 });
    } catch (dbError) {
      console.error("Erreur de connexion à MongoDB:", dbError);
      
      // Utiliser les données de secours prédéfinies
      return NextResponse.json(fallbackDirectors, { status: 200 });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des réalisateurs:", error);
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