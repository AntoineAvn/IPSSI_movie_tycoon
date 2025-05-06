import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error
from sklearn.impute import SimpleImputer
import joblib

# Chargement des données
df = pd.read_csv("dataset.csv")
print(f"Nombre de lignes dans le dataset initial: {df.shape[0]}")
print(f"Colonnes dans le dataset: {df.columns.tolist()}")

# Sélectionnons uniquement les colonnes essentielles pour notre modèle
essential_columns = ['Release_year', 'Director', 'Cast', 'Average_rating', 'Genres', 'Runtime']
df_model = df[essential_columns].copy()
print(f"Nombre de lignes dans df_model: {df_model.shape[0]}")

# Affichons le nombre de valeurs manquantes pour chaque colonne
print("Nombre de valeurs manquantes par colonne:")
for col in df_model.columns:
    print(f"{col}: {df_model[col].isna().sum()}")

# Filtrons le dataset pour conserver uniquement les lignes où Average_rating n'est pas NaN
df_model = df_model[~df_model['Average_rating'].isna()].copy()
print(f"Nombre de lignes après avoir filtré les Average_rating manquantes: {df_model.shape[0]}")

# Vérifions à nouveau le nombre de valeurs manquantes
print("Nombre de valeurs manquantes par colonne après filtrage:")
for col in df_model.columns:
    print(f"{col}: {df_model[col].isna().sum()}")

# Vérifier si Release_year a toutes ses valeurs manquantes
if df_model['Release_year'].isna().all():
    print("Toutes les valeurs de Release_year sont manquantes, nous allons ajouter une valeur constante")
    df_model['Release_year'] = 2000  # Valeur constante par défaut

# Vérifier si Runtime a toutes ses valeurs manquantes
if df_model['Runtime'].isna().all():
    print("Toutes les valeurs de Runtime sont manquantes, nous allons ajouter une valeur constante")
    df_model['Runtime'] = 90  # Valeur constante par défaut (90 minutes)

# Remplacement des valeurs manquantes pour les colonnes catégorielles
df_model['Director'] = df_model['Director'].fillna('Unknown')
df_model['Cast'] = df_model['Cast'].fillna('Unknown')
df_model['Genres'] = df_model['Genres'].fillna('Unknown')

# Pour les valeurs numériques, remplaçons par la médiane ou 0 si toutes les valeurs sont NaN
if not df_model['Release_year'].isna().all():
    df_model['Release_year'] = df_model['Release_year'].fillna(df_model['Release_year'].median())
if not df_model['Runtime'].isna().all():
    df_model['Runtime'] = df_model['Runtime'].fillna(df_model['Runtime'].median())

print(f"Nombre de lignes après traitement des valeurs manquantes: {df_model.shape[0]}")

# Affichons quelques informations sur le dataset après prétraitement
print("\nAperçu des données après prétraitement:")
print(df_model.head())
print("\nRésumé statistique des colonnes numériques:")
print(df_model.describe())

# Séparation features et target
X = df_model.drop('Average_rating', axis=1)
y = df_model['Average_rating']

# Définition des colonnes numériques et catégorielles
categorical_features = ['Genres', 'Cast', 'Director']
numeric_features = ['Release_year', 'Runtime']

# Préparation des transformateurs pour le pipeline
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='Unknown')),
    ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value=0)),
    ('scaler', StandardScaler())
])

# Combinaison des transformateurs
preprocessor = ColumnTransformer(transformers=[
    ('cat', categorical_transformer, categorical_features),
    ('num', numeric_transformer, numeric_features)
])

# Définition du pipeline complet
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

# Division en ensembles d'entraînement et de test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Dimensions de X_train: {X_train.shape}")
print(f"Dimensions de X_test: {X_test.shape}")

# Entraînement du modèle
model.fit(X_train, y_train)

# Évaluation
y_pred = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"RMSE: {rmse:.2f}")

# Sauvegarde du modèle
joblib.dump(model, "movie_rating_model.joblib")
print("Modèle sauvegardé sous 'movie_rating_model.joblib'")