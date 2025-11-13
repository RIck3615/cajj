# ✅ Solution pour "Backend inaccessible" en production Vercel

## 🎯 Solution immédiate

Le code a été mis à jour pour utiliser automatiquement l'API relative si le backend est déployé sur Vercel.

### Action à faire maintenant :

1. **Redéployez votre application sur Vercel**
   - Allez dans votre projet Vercel
   - **Deployments** > Cliquez sur les **3 points** (⋯) du dernier déploiement
   - **Redeploy**
   - Attendez la fin du déploiement

2. **Testez**
   - Ouvrez votre site Vercel
   - Allez sur `/admin/login`
   - L'indicateur devrait être **vert** : "Backend connecté"

## 🔍 Vérification

Après le redéploiement, ouvrez la console du navigateur (F12) :

- ✅ **Si vous voyez** : `🔗 URL API détectée: https://votre-site.vercel.app/api`
  → Le backend devrait fonctionner via Vercel

- ❌ **Si vous voyez toujours** : `Backend inaccessible`
  → Passez à la solution B ci-dessous

## ⚠️ Limitation importante

Si le backend fonctionne sur Vercel, **les fichiers uploadés (photos, vidéos) seront perdus** à chaque redéploiement car Vercel utilise des fonctions serverless sans stockage persistant.

## 🚀 Solution B : Déployer le backend séparément (Recommandé)

Si la solution A ne fonctionne pas, ou si vous voulez un stockage persistant pour les fichiers :

### Option 1 : Railway (Gratuit, simple)

1. **Allez sur [railway.app](https://railway.app)**
2. **New Project** > **Deploy from GitHub repo**
3. Sélectionnez votre repository
4. Railway détectera automatiquement le backend
5. Si ce n'est pas le cas :
   - **Settings** > **Root Directory**: `backend`
   - **Start Command**: `npm start`
6. **Récupérez l'URL** (ex: `https://cajj-backend.up.railway.app`)

### Option 2 : Render (Gratuit, simple)

1. **Allez sur [render.com](https://render.com)**
2. **New** > **Web Service**
3. Connectez votre repository GitHub
4. Configurez :
   - **Name**: `cajj-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Start Command**: `npm start`
5. **Récupérez l'URL** (ex: `https://cajj-backend.onrender.com`)

### Configurer Vercel avec le backend séparé

1. **Dans Vercel** > **Settings** > **Environment Variables**
2. **Add New** :
   - **Key**: `VITE_API_URL`
   - **Value**: L'URL de Railway ou Render (ex: `https://cajj-backend.up.railway.app`)
   - Cochez **Production**, **Preview**, **Development**
3. **Save**
4. **Redéployez** (Deployments > Redeploy)

## ✅ Vérification finale

1. Ouvrez votre site Vercel
2. Console du navigateur (F12)
3. Vous devriez voir : `🔗 URL API détectée: https://votre-backend-url.com`
4. Page de login : Indicateur **vert** "Backend connecté"

## 🆘 Si ça ne fonctionne toujours pas

1. **Vérifiez que le backend répond** :
   ```bash
   curl https://votre-backend-url.com/
   ```
   Devrait retourner : `{"name":"Centre d'Aide Juridico Judiciaire CAJJ ASBL","message":"API CAJJ opérationnelle"}`

2. **Vérifiez les logs** :
   - **Vercel** : Deployments > Voir les logs
   - **Railway/Render** : Dashboard > Voir les logs

3. **Vérifiez CORS** :
   - Le backend doit avoir `app.use(cors())` dans `backend/src/index.js`
   - C'est déjà le cas dans votre code

## 📝 Résumé

- ✅ **Solution A** : Redéployez sur Vercel (le code utilise maintenant l'API relative)
- ✅ **Solution B** : Déployez le backend sur Railway/Render + configurez `VITE_API_URL` dans Vercel

**Recommandation** : Utilisez la Solution B pour un stockage persistant des fichiers.

