import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// URI de connexion avec options
const uri = "mongodb+srv://aavenia:azerty@cluster0.mbl7igg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db("cinema");
    const collection = database.collection("data");
    
    // Récupérer tous les films pour les statistiques
    const result = await collection.find({}).toArray();
    
    console.log(`Statistiques: ${result.length} films récupérés`);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    try {
      await client.close();
    } catch (closeError) {
      console.error("Erreur lors de la fermeture de la connexion:", closeError);
    }
  }
} 