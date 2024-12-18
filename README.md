# Arti-Key Web Application

Une application web de gestion des congés et absences construite avec React, TypeScript, et Firebase.

## Configuration requise

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Un compte Firebase

## Installation

1. Clonez le dépôt :
```bash
git clone <votre-repo-url>
cd arti-key-web
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Configuration de l'environnement :
   - Copiez le fichier `.env.example` en `.env`
   - Remplissez les variables d'environnement avec vos informations Firebase

```bash
cp .env.example .env
```

## Configuration Firebase

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com)
2. Activez Authentication, Firestore et Storage
3. Copiez vos informations de configuration dans le fichier `.env`

## Développement

Pour lancer l'application en mode développement :

```bash
npm run dev
# ou
yarn dev
```

L'application sera disponible sur `http://localhost:5173`

## Structure du projet

```
src/
  ├── components/      # Composants réutilisables
  ├── config/         # Configuration (Firebase, etc.)
  ├── contexts/       # Contextes React
  ├── hooks/          # Hooks personnalisés
  ├── pages/          # Pages de l'application
  ├── theme/          # Configuration du thème
  └── types/          # Types TypeScript
```

## Fonctionnalités

- Authentification utilisateur
- Gestion des demandes de congés
- Workflow d'approbation
- Tableau de bord avec statistiques
- Gestion des documents
- Notifications

## Technologies utilisées

- React + TypeScript
- Vite
- Firebase (Auth, Firestore, Storage)
- Material-UI
- React Router
- React Query
