# ARTI Key Web Application

## 🚀 Guide de Déploiement et Récupération

### Configuration Requise
- Node.js
- npm
- Git
- Firebase CLI

### 📥 Récupération du Projet

```bash
# 1. Cloner le projet
git clone https://github.com/naywayne90/arti-key-web.git
cd arti-key-web

# 2. Installer les dépendances
npm install

# 3. Basculer sur la branche de travail
git checkout feature/employes
```

### 🔥 Configuration Firebase

```bash
# 1. Installer Firebase Tools
sudo npm install -g firebase-tools

# 2. Se connecter à Firebase
firebase login

# 3. Vérifier la connexion au projet
firebase projects:list
```

### 💻 Développement Local

```bash
# Lancer en mode développement
npm run dev
```

### 🏗️ Construction et Déploiement

```bash
# Construire le projet
npm run build

# Déployer sur Firebase
firebase deploy
```

### 📝 Structure des Branches

- `main`: Version stable de production
- `feature/employes`: Développement du module RH et Congés
- `develop`: Branche de développement principale

### 🔄 Historique des Versions

#### v0.1.0 (18/12/2023)
- Module de Gestion des Congés
- Interface moderne avec animations
- Intégration de la palette ARTI
- Workflow de validation des congés

### 📚 Documentation des Composants

#### Module Congés et Absences
- `CongesAbsences.tsx`: Page principale
- `WorkflowDashboard.tsx`: Tableau de bord des workflows
- `LeaveCard.tsx`: Carte de congé
- `PageTransition.tsx`: Animations de transition

### ⚠️ En Cas de Problème

1. Vérifier les logs d'erreur
2. S'assurer que toutes les dépendances sont installées
3. Vérifier la branche Git active
4. Vérifier la connexion Firebase

### 🔐 Fichiers de Configuration Importants

- `.firebaserc`: ID du projet Firebase
- `firebase.json`: Configuration Firebase
- `src/firebase/config.ts`: Configuration de l'application

### 📞 Contact

Pour toute question ou problème, contacter l'équipe de développement.

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
