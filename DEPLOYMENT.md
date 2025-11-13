# Guide de déploiement - Production Vercel

## 🚨 Problème actuel

En production sur Vercel, le frontend essaie de se connecter à `http://localhost:4000`, ce qui ne fonctionne pas car le backend n'est pas sur la même machine.

## ✅ Solution : Déployer le backend

Vous avez deux options :

### Option 1 : Déployer le backend sur Railway (Recommandé - Gratuit)

Railway est gratuit pour commencer et très simple à utiliser.

#### Étapes :

1. **Créer un compte Railway**
   - Allez sur [railway.app](https://railway.app)
   - Connectez-vous avec GitHub

2. **Déployer le backend**
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository
   - Railway détectera automatiquement le backend
   - Si ce n'est pas le cas, configurez :
     - **Root Directory**: `backend`
     - **Start Command**: `npm start`
     - **Build Command**: (laissez vide)

3. **Récupérer l'URL du backend**
   - Une fois déployé, Railway vous donnera une URL comme : `https://votre-projet.up.railway.app`
   - Copiez cette URL

4. **Configurer Vercel**
   - Allez dans votre projet Vercel
   - Settings > Environment Variables
   - Ajoutez :
     - **Key**: `VITE_API_URL`
     - **Value**: `https://votre-projet.up.railway.app`
   - **Environments**: Production, Preview, Development
   - Cliquez sur "Save"

5. **Redéployer le frontend**
   - Allez dans Deployments
   - Cliquez sur "Redeploy" sur le dernier déploiement

### Option 2 : Déployer le backend sur Render (Gratuit)

1. **Créer un compte Render**
   - Allez sur [render.com](https://render.com)
   - Connectez-vous avec GitHub

2. **Créer un nouveau Web Service**
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
   - Render vous donnera une URL comme : `https://cajj-backend.onrender.com`
   - Copiez cette URL

4. **Configurer Vercel** (même processus que Railway)
   - Settings > Environment Variables
   - Ajoutez `VITE_API_URL` = `https://cajj-backend.onrender.com`
   - Redéployez

### Option 3 : Utiliser Vercel Serverless Functions (Avancé)

Si vous préférez tout garder sur Vercel, vous pouvez convertir le backend en serverless functions. C'est plus complexe mais tout reste au même endroit.

## 📝 Configuration des variables d'environnement

### Dans Vercel (Frontend)

1. Allez dans votre projet Vercel
2. Settings > Environment Variables
3. Ajoutez :

| Key | Value | Environments |
|-----|-------|--------------|
| `VITE_API_URL` | `https://votre-backend-url.com` | Production, Preview, Development |

4. **Important** : Redéployez après avoir ajouté la variable

### Dans Railway/Render (Backend)

Si vous utilisez des variables d'environnement dans le backend (comme `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`), configurez-les aussi :

**Railway :**
- Variables > Add Variable

**Render :**
- Environment > Add Environment Variable

## 🔍 Vérification

Après le déploiement :

1. **Vérifiez que le backend répond**
   ```bash
   curl https://votre-backend-url.com/
   ```
   Vous devriez recevoir : `{"name":"Centre d'Aide Juridico Judiciaire CAJJ ASBL","message":"API CAJJ opérationnelle"}`

2. **Vérifiez dans la console du navigateur**
   - Ouvrez votre site Vercel
   - Console (F12)
   - Vous devriez voir : `🔗 URL API détectée: https://votre-backend-url.com`

3. **Testez le login**
   - Allez sur `/admin/login`
   - L'indicateur devrait être vert : "Backend connecté"

## ⚠️ Notes importantes

### Fichiers uploadés

Les fichiers uploadés (photos, vidéos) sont stockés localement dans `backend/uploads/`. En production :

- **Railway/Render** : Les fichiers sont temporaires et seront perdus lors d'un redéploiement
- **Solution** : Utilisez un service de stockage (AWS S3, Cloudinary, etc.) ou un volume persistant

### Base de données

Actuellement, les données sont stockées dans `backend/src/data/siteContent.js`. En production, vous devriez utiliser une vraie base de données (MongoDB, PostgreSQL, etc.).

### CORS

Le backend a déjà `app.use(cors())` configuré, donc il devrait accepter les requêtes depuis Vercel.

## 🆘 Problèmes courants

### "Backend inaccessible" en production

1. Vérifiez que `VITE_API_URL` est bien configuré dans Vercel
2. Vérifiez que vous avez redéployé après avoir ajouté la variable
3. Vérifiez que le backend est bien démarré et accessible
4. Testez l'URL du backend directement dans le navigateur

### Erreur CORS

Si vous voyez une erreur CORS, vérifiez que le backend a :
```javascript
app.use(cors());
```

Et que l'URL du frontend est autorisée (ou utilisez `cors()` sans restriction pour accepter toutes les origines).

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du backend (Railway/Render dashboard)
2. Vérifiez les logs du frontend (Vercel dashboard)
3. Vérifiez la console du navigateur (F12)

