# 🔍 Diagnostic - Backend toujours inaccessible sur Vercel

## ✅ Vérifications à faire

### 1. Vérifier que les fichiers sont bien commités

```bash
# Vérifier que package.json existe à la racine
ls -la package.json

# Vérifier que api/index.js existe
ls -la api/index.js

# Vérifier que vercel.json existe
ls -la vercel.json
```

### 2. Vérifier les logs de build Vercel

1. Allez dans votre projet Vercel
2. **Deployments** > Cliquez sur le dernier déploiement
3. Regardez les **Build Logs**
4. Cherchez des erreurs comme :
   - "Cannot find module"
   - "Module not found"
   - "Error: Cannot read property"

### 3. Vérifier les logs de runtime

1. **Deployments** > Dernier déploiement
2. **Functions** > Cliquez sur `/api/index.js`
3. Regardez les **Runtime Logs**
4. Testez en faisant une requête : Cliquez sur "Invoke" ou testez depuis le navigateur

### 4. Tester directement l'API

Ouvrez dans votre navigateur :
- `https://cajj.vercel.app/api/`
- `https://cajj.vercel.app/api/about`

**Si vous voyez du HTML** → Le routage ne fonctionne pas
**Si vous voyez une erreur JSON** → L'API fonctionne mais il y a une erreur dans le code
**Si vous voyez "Function not found"** → La fonction n'est pas déployée

## 🚨 Solutions selon le problème

### Problème 1 : "Function not found" ou 404

**Cause** : Vercel ne détecte pas la fonction serverless

**Solution** :
1. Vérifiez que `api/index.js` existe bien
2. Vérifiez que `vercel.json` route bien `/api/*` vers `/api/index.js`
3. **Supprimez le cache Vercel** :
   - Settings > General > Clear Build Cache
   - Redéployez

### Problème 2 : "Cannot find module" dans les logs

**Cause** : Les dépendances ne sont pas installées

**Solution** :
1. Vérifiez que `package.json` existe à la racine
2. Vérifiez que toutes les dépendances sont listées
3. Dans Vercel, allez dans **Settings** > **General**
4. Vérifiez que "Install Command" est bien `npm install` (ou vide pour auto-détection)

### Problème 3 : L'API retourne du HTML

**Cause** : Le routage ne fonctionne pas, le catch-all capture tout

**Solution** :
1. Vérifiez que dans `vercel.json`, les `routes` sont AVANT les `rewrites`
2. Le route `/api/(.*)` doit être en premier
3. Redéployez

### Problème 4 : Erreur 500 dans les logs

**Cause** : Erreur dans le code de l'API

**Solution** :
1. Regardez les logs de runtime dans Vercel
2. Cherchez l'erreur exacte
3. Le nouveau code dans `api/index.js` a une meilleure gestion d'erreurs
4. Les erreurs devraient maintenant être visibles dans les logs

## 🔧 Solution alternative : Déployer le backend séparément

Si après toutes ces vérifications ça ne fonctionne toujours pas, **déployez le backend séparément** :

### Option 1 : Railway (5 minutes)

1. Allez sur [railway.app](https://railway.app)
2. **New Project** > **Deploy from GitHub**
3. Sélectionnez votre repository
4. Railway détectera automatiquement le backend
5. Si ce n'est pas le cas :
   - **Settings** > **Root Directory**: `backend`
   - **Start Command**: `npm start`
6. Récupérez l'URL (ex: `https://cajj-backend.up.railway.app`)

### Configurer Vercel

1. **Settings** > **Environment Variables**
2. Ajoutez : `VITE_API_URL` = `https://cajj-backend.up.railway.app`
3. **Redéployez**

### Option 2 : Render (5 minutes)

1. Allez sur [render.com](https://render.com)
2. **New** > **Web Service**
3. Connectez votre repository GitHub
4. Configurez :
   - **Name**: `cajj-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Start Command**: `npm start`
5. Récupérez l'URL et configurez Vercel comme ci-dessus

## 📋 Checklist complète

Avant de dire que ça ne fonctionne pas, vérifiez :

- [ ] `package.json` existe à la racine avec toutes les dépendances
- [ ] `api/index.js` existe et exporte l'app Express
- [ ] `vercel.json` route `/api/*` vers `/api/index.js`
- [ ] Les changements ont été commités et poussés
- [ ] Vercel a été redéployé après les changements
- [ ] Les logs de build ne montrent pas d'erreurs
- [ ] Les logs de runtime ne montrent pas d'erreurs
- [ ] Test direct de `https://cajj.vercel.app/api/` dans le navigateur
- [ ] Le cache Vercel a été vidé

## 🆘 Si rien ne fonctionne

1. **Partagez les logs Vercel** :
   - Build logs
   - Runtime logs de `/api/index.js`
   - Screenshot de l'erreur dans le navigateur

2. **Testez en local** :
   ```bash
   cd backend
   npm install
   npm start
   # Testez http://localhost:4000/api/
   ```

3. **Vérifiez la structure** :
   - Tous les fichiers sont-ils au bon endroit ?
   - Les chemins d'import sont-ils corrects ?

## 💡 Recommandation finale

Si après toutes ces étapes le backend sur Vercel ne fonctionne toujours pas, **déployez le backend séparément sur Railway ou Render**. C'est plus simple, plus fiable, et vous aurez un stockage persistant pour les fichiers uploadés.

