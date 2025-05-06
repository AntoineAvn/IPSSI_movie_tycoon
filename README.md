# 🎬 HitMovie Predictor – Prédisez le succès de votre film

## 🎯 Objectif du projet

Dans un monde saturé de contenus, ce projet propose une application capable de **prédire le succès potentiel d’un film fictif** en se basant sur un ensemble de données réelles de 10 000 films Letterboxd. L’objectif est de comprendre les **facteurs clés de réussite d’un film** (genre, durée, résumé, casting...) et de proposer un outil interactif de prédiction pour les créateurs ou les curieux.

---

## 📌 Objectifs pédagogiques

1. **Analyser les facteurs de succès** (notes, votes, genres, durée, pays...)
2. **Modéliser le succès potentiel** d’un film (score, votes ou classification binaire)
3. **Créer un modèle de prédiction supervisé**
4. **Développer une Web App interactive** avec formulaire de création de film
5. **Visualiser les résultats et corrélations** via data viz (matplotlib, seaborn ou Power BI)

---

## 🧠 Données utilisées

- **Dataset** : [Letterboxd 10,000 Movies](https://www.kaggle.com/datasets/ky1338/10000-movies-letterboxd-data)
- **Colonnes clés** :  
  - `title`, `year`, `genre`, `director`, `actors`, `runtime`  
  - `language`, `country`, `rating`, `averageRating`, `numVotes`, `description`, `tags`

---

## ⚙️ Stack technique recommandée

| Composant       | Techno(s) proposées                     |
|----------------|------------------------------------------|
| Backend         | Python (Flask / FastAPI)                |
| Frontend        | React / Streamlit / HTML+JS             |
| Base de données | PostgreSQL ou MongoDB                   |
| Modélisation    | Scikit-learn, XGBoost, éventuellement BERT (NLP) |
| Data Viz        | matplotlib, seaborn, ou Power BI        |

---

## 🔮 Modèle de prédiction

Deux approches possibles :

- **Régression** : prédire la note moyenne (`averageRating`) ou le nombre de votes (`numVotes`)
- **Classification binaire** : prédire si un film est un "succès" (ex : `note > 3.5` et `votes > 10 000`)

---

## 🖥️ Fonctionnalités de la Web App

- 🎥 **Formulaire interactif** de création de film :  
  - Titre  
  - Genre(s)  
  - Langue, pays  
  - Durée  
  - Résumé libre ou généré automatiquement
- 🔍 **Prédiction du succès** avec affichage visuel (note estimée, probabilité de "hit")
- 📊 **Filtres** : genre, pays, année, durée…
- 📈 **Visualisations** :  
  - Répartition des notes  
  - Corrélation entre durée et succès  
  - Carte des films les plus populaires par pays  
  - Nuage de mots des synopsis les plus fréquents

---

## 💡 Bonus possibles

- 🎲 Générateur de pitch automatique avec GPT
- 🎭 Comparateur de pitchs avec films existants (via TMDB API)
- 🏆 Classement du film dans des catégories fictives : Arty / Blockbuster / Nanar

---

## 📦 Livrables attendus

- ✅ Web App fonctionnelle avec formulaire et prédiction
- ✅ Base de données structurée (PostgreSQL ou MongoDB)
- ✅ Modèle de prédiction entraîné et testé
- ✅ Data visualisation claire et interactive
- ✅ Présentation orale de 15-20 min + support (PowerPoint, Canva...)
- ✅ Lien vers le repo GitHub

---

## 🧩 Liens utiles

- 🔗 [Dataset Kaggle – 10,000 Movies Letterboxd](https://www.kaggle.com/datasets/ky1338/10000-movies-letterboxd-data)  
- 🔗 [The Movie Database API](https://developer.themoviedb.org/)  
- 🔗 [OMDb API](https://www.omdbapi.com/)  

---

> Projet réalisé dans le cadre du module Open Data – IPSSI

# API de Prédiction de Notes de Films

Cette API permet de prédire la note d'un film en utilisant un modèle d'apprentissage automatique, une analyse OpenAI et des informations sur le budget du film.

## Fonctionnalités

- Prédiction de note de film sur une échelle de 10 points
- Analyse du titre et de la description via OpenAI (3 points)
- Analyse des caractéristiques techniques via modèle ML (4 points)
- Prise en compte du budget (3 points)
- Interface Swagger pour tester facilement l'API

## Installation

1. Clonez ce dépôt
2. Installez les dépendances :
   ```
   pip install flask flask-restx python-dotenv openai pandas numpy scikit-learn joblib
   ```
3. Créez un fichier `.env` à la racine du projet avec votre clé API OpenAI :
   ```
   OPENAI_API_KEY=votre_cle_api_ici
   ```

## Utilisation

1. Lancez l'application :
   ```
   python app.py
   ```

2. Accédez à l'interface Swagger pour tester l'API :
   ```
   http://localhost:5001/swagger/
   ```

3. Utilisez l'endpoint `POST /api/predict` avec un payload JSON comme celui-ci :
   ```json
   {
     "name": "Inception",
     "description": "Un voleur qui s'infiltre dans les rêves des gens pour voler leurs secrets se voit offrir une chance de retrouver sa vie normale.",
     "genre": "Science Fiction, Action, Thriller",
     "annee": 2010,
     "acteur": "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page",
     "director": "Christopher Nolan",
     "duree": 148,
     "budget": 3
   }
   ```

4. L'API renverra une réponse avec :
   - Note OpenAI (sur 3) basée sur le titre et la description
   - Note du modèle ML (sur 4) basée sur les caractéristiques techniques
   - Note du budget (sur 3)
   - Note totale (sur 10)
   - Détails explicatifs

## Notes importantes

- Sans clé API OpenAI valide, l'API utilisera des notes aléatoires pour la partie analyse du titre et de la description
- Le modèle ML doit être présent et accessible via le fichier `movie_rating_model.joblib`
- L'application utilise le port 5001 pour éviter les conflits avec AirPlay sur macOS

