# 🚀 Déployer le backend sur Railway (Solution recommandée)

## Pourquoi Railway ?

Après plusieurs tentatives, le backend sur Vercel serverless functions ne fonctionne pas correctement. **Déployer le backend séparément sur Railway est la solution la plus simple et la plus fiable**.

**Avantages** :
- ✅ Fonctionne à tous les coups
- ✅ Stockage persistant pour les fichiers uploadés
- ✅ Pas de timeout de 10 secondes
- ✅ Logs faciles à consulter
- ✅ Configuration simple
- ✅ Gratuit pour commencer

## 📋 Étapes de déploiement

### Étape 1 : Créer un compte Railway

1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur **"Start a New Project"**
3. Connectez-vous avec **GitHub**
4. Autorisez Railway à accéder à vos repositories

### Étape 2 : Déployer le backend

1. Dans Railway, cliquez sur **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Choisissez votre repository (CAJJ)
4. Railway va détecter automatiquement le backend

**Si Railway ne détecte pas automatiquement** :
1. Cliquez sur le service créé
2. Allez dans **Settings**
3. Configurez :
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Build Command**: (laissez vide)

### Étape 3 : Récupérer l'URL

1. Une fois déployé, Railway vous donnera une URL
2. Exemple : `https://cajj-backend-production.up.railway.app`
3. **Copiez cette URL** 📋

### Étape 4 : Configurer Vercel

1. Allez dans votre projet Vercel
2. **Settings** > **Environment Variables**
3. Cliquez sur **"Add New"**
4. Configurez :
   - **Key**: `VITE_API_URL`
   - **Value**: L'URL de Railway que vous avez copiée (ex: `https://cajj-backend-production.up.railway.app`)
   - Cochez **Production**, **Preview**, et **Development**
5. Cliquez sur **"Save"**

### Étape 5 : Redéployer le frontend

1. Dans Vercel, allez dans **Deployments**
2. Cliquez sur les **3 points** (⋯) du dernier déploiement
3. **Redeploy**
4. ⏳ Attendez la fin du déploiement

### Étape 6 : Tester

1. Ouvrez `https://cajj.vercel.app/admin/login`
2. L'indicateur devrait être **vert** : "Backend connecté"
3. Testez le login avec :
   - Username: `admin`
   - Password: `admin123`

## 🔧 Configuration optionnelle

### Variables d'environnement sur Railway

Si vous voulez changer les identifiants admin :

1. Dans Railway, allez dans votre service
2. **Variables** > **Add Variable**
3. Ajoutez :
   - `ADMIN_USERNAME` = `votre-username`
   - `ADMIN_PASSWORD` = `votre-password`
   - `JWT_SECRET` = `votre-secret-jwt`

### Domaine personnalisé (optionnel)

1. Dans Railway, allez dans votre service
2. **Settings** > **Networking**
3. Cliquez sur **"Generate Domain"** ou ajoutez votre propre domaine

## ✅ Vérification

### Test 1 : Route racine
```bash
curl https://votre-backend-url.railway.app/
```
**Attendu** : `{"name":"Centre d'Aide Juridico Judiciaire CAJJ ASBL","message":"API CAJJ opérationnelle"}`

### Test 2 : Route about
```bash
curl https://votre-backend-url.railway.app/api/about
```
**Attendu** : JSON avec les sections "Nous connaître"

### Test 3 : Dans l'application
1. Ouvrez `https://cajj.vercel.app/admin/login`
2. L'indicateur devrait être **vert**
3. Testez le login

## 📝 Notes importantes

### Fichiers uploadés

Sur Railway, les fichiers uploadés sont stockés dans le système de fichiers du conteneur. Ils seront **persistants** tant que le service est actif.

**Pour une solution encore plus robuste**, vous pouvez :
- Utiliser un volume persistant Railway (payant)
- Migrer vers un service de stockage externe (Cloudinary, S3, etc.)

### Base de données

Actuellement, les données sont dans `backend/src/data/siteContent.js`. Pour la production, vous devriez utiliser une vraie base de données (MongoDB, PostgreSQL, etc.).

## 🆘 Problèmes courants

### Le backend ne démarre pas

1. Vérifiez les logs Railway
2. Vérifiez que `backend/package.json` a bien le script `start`
3. Vérifiez que toutes les dépendances sont listées

### Erreur CORS

Le backend a déjà `app.use(cors())` configuré, donc ça devrait fonctionner. Si vous avez des problèmes :
- Vérifiez que l'URL dans Vercel est correcte
- Vérifiez que le backend est bien démarré

### L'API ne répond pas

1. Vérifiez les logs Railway
2. Testez directement l'URL dans le navigateur
3. Vérifiez que le port est bien configuré (Railway le gère automatiquement)

## 🎉 Résultat

Après ces étapes :
- ✅ Backend déployé et accessible
- ✅ Frontend connecté au backend
- ✅ Login fonctionnel
- ✅ Stockage persistant pour les fichiers

**Temps total** : ~10 minutes

**C'est la solution la plus simple et la plus fiable !**

