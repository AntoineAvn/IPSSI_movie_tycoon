# 🎬 Movie Tycoon IA – Prédisez le succès de votre film

## 🎯 Objectif du projet

Dans un monde saturé de contenus, ce projet propose une application capable de **prédire le succès potentiel d’un film fictif** en se basant sur un ensemble de données réelles de 10 000 films Letterboxd. L’objectif est de comprendre les **facteurs clés de réussite d’un film** (genre, durée, résumé, casting...) et de proposer un outil interactif de prédiction pour les créateurs ou les curieux.

- **Gestion de projet** : [Lien Notion](https://www.notion.so/1ebff21e6f4480938ff6d4996d662b94?v=1ebff21e6f4481abae3a000c3431c604&pvs=4)

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
| Base de données | MongoDB                                 |
| Modélisation    | Scikit-learn, XGBoost, éventuellement BERT (NLP) |
| Data Viz        | matplotlib, seaborn, ou Power BI        |

---

## 🔮 Modèle de prédiction

Deux approches possibles :

- Prédire si un film est un "succès" (ex : `note > 3.5`) grâce au réalisateur, acteurs, genre, année, durée du film

---

## 🖥️ Fonctionnalités de la Web App

- 🎥 **Formulaire interactif** de création de film :  
  - Titre  
  - Genre(s)  
  - Langue, pays  
  - Réalisateur(s)
  - Acteur(s)
  - Durée  
  - Résumé libre
- 🔍 **Prédiction du succès** avec un scoring "homemade" (3 points générés par chatGPT pour le titre et la description, 4 points pour notre modél de prédiction et 3 points pour le budget attribué) et un affichage visuel (note estimée, probabilité de "hit")
- 📊 **Filtres** : genre, pays, année, durée…
- 📈 **Visualisations** :  
  - Répartition des notes + explications

---

## 💡 Bonus possibles

- 🎲 Générateur de pitch automatique
- 🎥 Générateur de pochette de film

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

---

> Projet réalisé dans le cadre du module Open Data – IPSSI

