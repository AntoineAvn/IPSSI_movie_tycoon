import joblib
import pandas as pd
import numpy as np

# Chargement du modèle
print("Chargement du modèle...")
model = joblib.load("movie_rating_model.joblib")
print("Modèle chargé avec succès!")

def predire_note(annee_sortie, realisateur, acteurs, genres, duree):
    """
    Prédit la note moyenne d'un film basé sur ses caractéristiques.
    
    Parameters:
    -----------
    annee_sortie : int
        Année de sortie du film
    realisateur : str
        Nom du réalisateur
    acteurs : str
        Liste des acteurs principaux (format: "['Acteur1', 'Acteur2', ...]")
    genres : str
        Liste des genres du film (format: "['Genre1', 'Genre2', ...]")
    duree : int ou float
        Durée du film en minutes
    
    Returns:
    --------
    float
        Note prédite pour le film
    """
    # Créer un dataframe avec les données d'entrée
    film_data = {
        'Release_year': [float(annee_sortie)],  # Convertir en float
        'Director': [realisateur],
        'Cast': [acteurs],
        'Genres': [genres],
        'Runtime': [float(duree)]  # Convertir en float
    }
    
    df = pd.DataFrame(film_data)
    
    # Vérifier les types de données et faire un résumé
    print("\nDonnées du film à prédire:")
    print(df)
    print("\nTypes de données:")
    print(df.dtypes)
    
    # Prédire la note
    note_predite = model.predict(df)[0]
    
    return note_predite

def test_interactif():
    """
    Interface interactive pour tester le modèle avec les entrées de l'utilisateur.
    """
    print("\n=== PRÉDICTION DE NOTE DE FILM ===")
    print("Veuillez entrer les informations suivantes sur le film:")
    
    annee = input("Année de sortie (par exemple, 2022): ")
    try:
        annee = float(annee)
    except ValueError:
        annee = 2000.0  # Valeur par défaut
    
    realisateur = input("Réalisateur: ")
    
    acteurs_input = input("Acteurs principaux (séparés par des virgules): ")
    acteurs = "['" + "', '".join([a.strip() for a in acteurs_input.split(',')]) + "']"
    
    genres_input = input("Genres (séparés par des virgules): ")
    genres = "['" + "', '".join([g.strip() for g in genres_input.split(',')]) + "']"
    
    duree = input("Durée (en minutes): ")
    try:
        duree = float(duree)
    except ValueError:
        duree = 90.0  # Valeur par défaut
    
    # Prédire la note
    note = predire_note(annee, realisateur, acteurs, genres, duree)
    
    # Afficher le résultat
    print("\nRésultat de la prédiction:")
    print(f"Note prédite pour le film: {note:.2f}/5")
    print(f"Pourcentage: {(note/5)*100:.1f}%")

def test_films_exemple():
    """
    Teste le modèle sur quelques exemples prédéfinis.
    """
    films_exemple = [
        {
            'nom': 'Film d\'action moderne',
            'annee_sortie': 2022.0,
            'realisateur': 'Christopher Nolan',
            'acteurs': "['Leonardo DiCaprio', 'Tom Hardy']",
            'genres': "['Action', 'Thriller']",
            'duree': 150.0
        },
        {
            'nom': 'Comédie romantique',
            'annee_sortie': 2019.0,
            'realisateur': 'Greta Gerwig',
            'acteurs': "['Emma Stone', 'Ryan Gosling']",
            'genres': "['Comedy', 'Romance']",
            'duree': 105.0
        },
        {
            'nom': 'Film d\'horreur',
            'annee_sortie': 2020.0,
            'realisateur': 'Jordan Peele',
            'acteurs': "['Lupita Nyong\'o', 'Elisabeth Moss']",
            'genres': "['Horror', 'Thriller']",
            'duree': 95.0
        }
    ]
    
    print("\n=== TESTS SUR DES EXEMPLES PRÉDÉFINIS ===")
    for film in films_exemple:
        note = predire_note(
            film['annee_sortie'],
            film['realisateur'],
            film['acteurs'],
            film['genres'],
            film['duree']
        )
        print(f"Film: {film['nom']}")
        print(f"Note prédite: {note:.2f}/5 ({(note/5)*100:.1f}%)")
        print("-" * 40)

if __name__ == "__main__":
    # Tester sur des exemples prédéfinis
    test_films_exemple()
    
    # Mode interactif
    test_interactif() 