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

