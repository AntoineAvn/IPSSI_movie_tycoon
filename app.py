import os
from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from flask_cors import CORS  # Importation de Flask-CORS
from dotenv import load_dotenv
import joblib
import pandas as pd
import numpy as np
from openai import OpenAI
import logging  # Pour les logs avancés

# Configuration des logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Chargement des variables d'environnement
load_dotenv()

# Configuration d'OpenAI
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY", "")  # Si la clé API n'est pas définie, utiliser une chaîne vide
)

# Création de l'application Flask
app = Flask(__name__)

# Activation de CORS pour toutes les routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration de l'API avec Swagger
api = Api(
    app,
    version='1.0',
    title='API de Prédiction de Notes de Films',
    description='Une API pour prédire les notes de films en utilisant un modèle ML et OpenAI',
    doc='/swagger/'
)

# Création de l'espace de noms pour les routes
ns = api.namespace('api', description='Prédiction de notes de films')

# Chargement du modèle ML
try:
    logger.info("Chargement du modèle...")
    model = joblib.load("movie_rating_model.joblib")
    logger.info("Modèle chargé avec succès!")
except Exception as e:
    logger.error(f"Erreur lors du chargement du modèle: {e}")
    model = None

# Définition du modèle d'entrée pour Swagger
film_model = api.model('Film', {
    'name': fields.String(required=True, description='Nom du film'),
    'description': fields.String(required=True, description='Description du film'),
    'genre': fields.String(required=True, description='Genre du film (format: "Genre1, Genre2, ...")'),
    'annee': fields.Integer(required=True, description='Année de sortie'),
    'acteur': fields.String(required=True, description='Acteurs principaux (format: "Acteur1, Acteur2, ...")'),
    'director': fields.String(required=True, description='Réalisateur'),
    'duree': fields.Integer(required=True, description='Durée du film en minutes'),
    'budget': fields.Integer(required=True, description='Niveau de budget (1-3)')
})

# Modèle de réponse pour Swagger
response_model = api.model('Prediction', {
    'note_openai': fields.Float(description='Note OpenAI basée sur le nom et la description (sur 3)'),
    'note_modele': fields.Float(description='Note du modèle ML (sur 4)'),
    'note_budget': fields.Integer(description='Note basée sur le budget (sur 3)'),
    'note_totale': fields.Float(description='Note totale (sur 10)'),
    'details': fields.String(description='Explications et détails supplémentaires')
})

def analyser_nom_et_description(nom, description):
    """
    Utilise l'API OpenAI pour analyser le nom et la description du film et attribuer une note sur 3.
    """
    if not os.getenv("OPENAI_API_KEY"):
        logger.warning("Attention: Clé API OpenAI non définie. Utilisation d'une note aléatoire à la place.")
        return np.random.uniform(1, 3), "Note générée aléatoirement, clé API OpenAI non définie."
    
    try:
        prompt = f"""
        Voici le titre et la description d'un film. Évalue son attrait potentiel sur une échelle de 1 à 3 où:
        1 = Peu attrayant, 2 = Moyennement attrayant, 3 = Très attrayant.
        
        Titre: {nom}
        Description: {description}
        
        Fournissez uniquement un nombre (1, 2 ou 3) et une explication courte.
        """
        
        logger.info(f"Analyse OpenAI pour le film: '{nom}'")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Vous êtes un critique de cinéma expert qui évalue l'attrait d'un film."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150
        )
        
        result = response.choices[0].message.content.strip()
        logger.info(f"Réponse OpenAI: {result}")
        
        # Extraction de la note (premier chiffre trouvé dans la réponse)
        import re
        note_match = re.search(r'[1-3]', result)
        if note_match:
            note = float(note_match.group(0))
        else:
            note = 2.0  # Valeur par défaut si aucun chiffre n'est trouvé
            
        return note, result
        
    except Exception as e:
        logger.error(f"Erreur lors de l'appel à OpenAI: {e}")
        return 2.0, f"Erreur lors de l'analyse: {str(e)}"

def predire_note_modele(annee, realisateur, acteurs, genres, duree):
    """
    Utilise le modèle ML pour prédire une note sur 5, puis la convertit en note sur 4.
    """
    if model is None:
        logger.warning("Modèle non chargé, utilisation d'une note aléatoire")
        return np.random.uniform(1, 4), "Note générée aléatoirement, modèle non disponible."
    
    try:
        # Préparation des données pour le modèle
        film_data = {
            'Release_year': [float(annee)],
            'Director': [realisateur],
            'Cast': [acteurs],
            'Genres': [genres],
            'Runtime': [float(duree)]
        }
        
        logger.info(f"Prédiction pour les données: {film_data}")
        df = pd.DataFrame(film_data)
        
        # Prédiction avec le modèle
        note_sur_5 = model.predict(df)[0]
        
        # Conversion en note sur 4
        note_sur_4 = (note_sur_5 / 5) * 4
        
        logger.info(f"Note prédite: {note_sur_5:.2f}/5 → {note_sur_4:.2f}/4")
        return note_sur_4, f"Note prédite par le modèle: {note_sur_5:.2f}/5 → {note_sur_4:.2f}/4"
        
    except Exception as e:
        logger.error(f"Erreur lors de la prédiction: {e}")
        return 2.0, f"Erreur lors de la prédiction: {str(e)}"

@ns.route('/predict')
class MoviePrediction(Resource):
    @ns.expect(film_model)
    @ns.marshal_with(response_model)
    def post(self):
        """
        Prédit la note d'un film en utilisant les informations fournies.
        
        La note finale est composée de:
        - Une note sur 3 basée sur l'analyse du nom et de la description par OpenAI
        - Une note sur 4 basée sur les caractéristiques du film (genre, année, acteurs, réalisateur, durée)
        - Une note sur 3 correspondant directement au niveau de budget fourni
        """
        data = request.json
        logger.info(f"Requête reçue: {data}")
        
        # Formatage des données
        nom = data['name']
        description = data['description']
        genre_str = data['genre']
        genres = "['" + "', '".join([g.strip() for g in genre_str.split(',')]) + "']"
        annee = data['annee']
        acteur_str = data['acteur']
        acteurs = "['" + "', '".join([a.strip() for a in acteur_str.split(',')]) + "']"
        realisateur = data['director']
        duree = data['duree']
        budget = min(max(data['budget'], 1), 3)  # Limiter le budget entre 1 et 3
        
        # Analyse du nom et de la description (note sur 3)
        note_openai, details_openai = analyser_nom_et_description(nom, description)
        
        # Prédiction avec le modèle ML (note sur 4)
        note_modele, details_modele = predire_note_modele(annee, realisateur, acteurs, genres, duree)
        
        # Note du budget (directement sur 3)
        note_budget = budget
        
        # Calcul de la note totale sur 10
        note_totale = note_openai + note_modele + note_budget
        
        # Formatage de la réponse
        details = f"""
        Analyse du nom et de la description (note sur 3) : {note_openai:.2f}
        {details_openai}
        
        Évaluation par le modèle ML (note sur 4) : {note_modele:.2f}
        {details_modele}
        
        Évaluation du budget (note sur 3) : {note_budget}
        
        Note totale : {note_totale:.2f}/10
        """
        
        response = {
            'note_openai': float(note_openai),
            'note_modele': float(note_modele),
            'note_budget': int(note_budget),
            'note_totale': float(note_totale),
            'details': details.strip()
        }
        
        logger.info(f"Réponse envoyée: {response}")
        return response

if __name__ == '__main__':
    # Utilisation du port 5001 au lieu de 5000 pour éviter les conflits avec AirPlay sur macOS
    logger.info("Démarrage du serveur sur le port 5001...")
    app.run(debug=True, host='0.0.0.0', port=5001) 