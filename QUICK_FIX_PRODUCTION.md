# 🚀 Solution rapide - Backend inaccessible en production

## Problème

Votre frontend sur Vercel essaie de se connecter à `http://localhost:4000`, ce qui ne fonctionne pas en production.

## ✅ Deux solutions possibles

### Solution A : Utiliser le backend sur Vercel (si configuré)

Si votre `vercel.json` route déjà `/api/*` vers le backend, le code utilisera automatiquement l'API relative. **Redéployez simplement** et ça devrait fonctionner.

**Avantages** : Tout au même endroit  
**Inconvénients** : Les fichiers uploadés ne seront pas persistants (perdus à chaque redéploiement)

### Solution B : Déployer le backend séparément (Recommandé)

Déployez le backend sur Railway ou Render pour une solution plus robuste.

## ✅ Solution B en 3 étapes (Recommandé)

### Étape 1 : Déployer le backend sur Railway (5 minutes)

1. **Allez sur [railway.app](https://railway.app)** et connectez-vous avec GitHub

2. **Nouveau projet**
   - Cliquez sur "New Project"
   - "Deploy from GitHub repo"
   - Sélectionnez votre repository

3. **Configuration**
   - Railway détectera automatiquement le backend
   - Si ce n'est pas le cas :
     - Cliquez sur "Settings"
     - **Root Directory**: `backend`
     - **Start Command**: `npm start`

4. **Récupérer l'URL**
   - Une fois déployé, Railway vous donnera une URL
   - Exemple : `https://cajj-backend-production.up.railway.app`
   - **Copiez cette URL** 📋

### Étape 2 : Configurer Vercel (2 minutes)

1. **Allez dans votre projet Vercel**
   - Ouvrez votre projet sur vercel.com

2. **Ajouter la variable d'environnement**
   - Allez dans **Settings** > **Environment Variables**
   - Cliquez sur **Add New**
   - **Key**: `VITE_API_URL`
   - **Value**: L'URL de Railway que vous avez copiée (ex: `https://cajj-backend-production.up.railway.app`)
   - Cochez **Production**, **Preview**, et **Development**
   - Cliquez sur **Save**

### Étape 3 : Redéployer (1 minute)

1. **Dans Vercel**
   - Allez dans **Deployments**
   - Cliquez sur les **3 points** (⋯) du dernier déploiement
   - Cliquez sur **Redeploy**
   - Attendez la fin du déploiement

2. **Tester**
   - Ouvrez votre site Vercel
   - Allez sur `/admin/login`
   - L'indicateur devrait être **vert** : "Backend connecté"

## ✅ Alternative : Render (si Railway ne fonctionne pas)

1. **Allez sur [render.com](https://render.com)** et connectez-vous

2. **Nouveau Web Service**
   - Cliquez sur "New" > "Web Service"
   - Connectez votre repository GitHub
   - Configurez :
     - **Name**: `cajj-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: (laissez vide)
     - **Start Command**: `npm start`
   - Cliquez sur "Create Web Service"

3. **Récupérer l'URL**
   - Render vous donnera : `https://cajj-backend.onrender.com`
   - Utilisez cette URL dans Vercel (étape 2 ci-dessus)

## 🔍 Vérification

Après le redéploiement :

1. **Ouvrez la console du navigateur** (F12)
2. Vous devriez voir : `🔗 URL API détectée: https://votre-backend-url.com`
3. L'indicateur sur la page de login devrait être **vert**

## ⚠️ Important

- Les fichiers uploadés (photos, vidéos) seront perdus lors d'un redéploiement sur Railway/Render
- Pour une solution permanente, utilisez un service de stockage (AWS S3, Cloudinary, etc.)

## 🆘 Si ça ne fonctionne pas

1. Vérifiez que le backend répond :
   ```bash
   curl https://votre-backend-url.com/
   ```
   Vous devriez recevoir : `{"name":"Centre d'Aide Juridico Judiciaire CAJJ ASBL","message":"API CAJJ opérationnelle"}`

2. Vérifiez dans Vercel que `VITE_API_URL` est bien configuré :
   - Settings > Environment Variables
   - La variable doit être présente

3. Vérifiez que vous avez bien redéployé après avoir ajouté la variable

