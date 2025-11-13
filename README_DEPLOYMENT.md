# 🚀 Guide de déploiement sur Vercel

## Structure du projet

```
/
├── frontend/          # Application React (Vite)
│   ├── package.json  # Détecté automatiquement par Vercel
│   └── dist/         # Dossier de build (généré)
├── api/              # Serverless functions Vercel
│   └── index.js      # Handler backend Express
├── backend/          # Code source du backend
│   └── src/          # Routes, middleware, données
├── package.json      # Dépendances backend pour Vercel
└── vercel.json       # Configuration Vercel
```

## ✅ Configuration actuelle

Le projet est configuré pour que Vercel détecte automatiquement :

### Frontend
- **Source** : `frontend/package.json`
- **Type** : Build statique (React/Vite)
- **Build Command** : `npm run build` (dans `frontend/`)
- **Output** : `frontend/dist/`

### Backend
- **Source** : `api/index.js`
- **Type** : Serverless function (Node.js/Express)
- **Routes** : `/api/*` → `api/index.js`

## 📋 Étapes de déploiement

### 1. Préparer le projet

```bash
# S'assurer que tout est commité
git add .
git commit -m "Configure for Vercel deployment"
git push
```

### 2. Connecter à Vercel

#### Option A : Via le site web (Recommandé)

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec **GitHub**
3. Cliquez sur **"Add New Project"**
4. Importez votre repository
5. Vercel détectera automatiquement :
   - ✅ Frontend depuis `frontend/package.json`
   - ✅ Backend depuis `api/index.js`

#### Option B : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel
```

### 3. Configuration automatique

Vercel devrait détecter automatiquement :
- **Root Directory** : Racine du projet
- **Framework Preset** : Other (détection automatique)
- **Build Command** : `cd frontend && npm run build` (depuis vercel.json)
- **Output Directory** : `frontend/dist` (depuis vercel.json)

### 4. Variables d'environnement (Optionnel)

Si vous voulez changer les identifiants admin :

1. **Settings** > **Environment Variables**
2. Ajoutez :
   - `ADMIN_USERNAME` = `admin` (ou votre username)
   - `ADMIN_PASSWORD` = `votre-mot-de-passe`
   - `JWT_SECRET` = `votre-secret-jwt`
3. Cochez **Production**, **Preview**, **Development**
4. **Save**

### 5. Déployer

1. Cliquez sur **"Deploy"**
2. ⏳ Attendez la fin du build (2-3 minutes)
3. Vercel vous donnera une URL : `https://votre-projet.vercel.app`

## 🔍 Vérification

### Frontend
- Ouvrez `https://votre-projet.vercel.app`
- Le site devrait s'afficher correctement

### Backend
- Testez `https://votre-projet.vercel.app/api/`
- Devrait retourner : `{"name":"Centre d'Aide Juridico Judiciaire CAJJ ASBL","message":"API CAJJ opérationnelle"}`

### Admin
- Ouvrez `https://votre-projet.vercel.app/admin/login`
- L'indicateur devrait être **vert** : "Backend connecté"
- Testez le login

## 📝 Configuration détaillée

### vercel.json

Le fichier `vercel.json` configure :

1. **Builds** :
   - Frontend : Build statique depuis `frontend/package.json`
   - Backend : Serverless function depuis `api/index.js`

2. **Routes** :
   - `/api/*` → Backend (serverless function)
   - `/*` → Frontend (fichiers statiques)

3. **Rewrites** :
   - Toutes les routes non-API → `index.html` (pour React Router)

### api/index.js

Handler serverless qui :
- Importe Express et les routes du backend
- Gère CORS automatiquement
- Route les requêtes `/api/*` vers les bonnes routes

### package.json (racine)

Contient les dépendances nécessaires pour le backend :
- express, cors, jsonwebtoken, multer, etc.

## ⚠️ Limitations Vercel

### Fichiers uploadés
- Stockés dans `/tmp` (temporaire)
- **Perdus** après 10 minutes d'inactivité ou redéploiement
- **Solution** : Utiliser un service externe (Cloudinary, S3)

### Données
- Stockées dans `backend/src/data/siteContent.js`
- **Perdues** à chaque redéploiement
- **Solution** : Utiliser une base de données (MongoDB, PostgreSQL)

### Timeout
- 10 secondes par requête
- **Solution** : Déployer le backend séparément (Railway, Render)

## 🆘 Dépannage

### Le frontend ne se build pas

1. Vérifiez les **Build Logs** dans Vercel
2. Vérifiez que `frontend/package.json` a un script `build`
3. Vérifiez que toutes les dépendances sont installées

### Le backend ne répond pas

1. Vérifiez les **Runtime Logs** de `/api/index.js`
2. Vérifiez que `package.json` à la racine contient les dépendances
3. Testez directement : `curl https://votre-projet.vercel.app/api/`

### Erreur "Cannot find module"

1. Vérifiez que `package.json` à la racine contient toutes les dépendances
2. Vérifiez que `vercel.json` a `includeFiles: ["backend/**"]`

## 🎉 Résultat

Après le déploiement :
- ✅ Frontend : `https://votre-projet.vercel.app`
- ✅ Backend API : `https://votre-projet.vercel.app/api/`
- ✅ Admin : `https://votre-projet.vercel.app/admin/login`

**Le projet est maintenant prêt pour un déploiement facile sur Vercel !**

