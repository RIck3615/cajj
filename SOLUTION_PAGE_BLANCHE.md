# 🔧 Solution - Page blanche sur /api/

## Problème

La page `https://cajj.vercel.app/api/` reste blanche et rien ne s'affiche.

**Causes possibles** :
1. La fonction serverless ne démarre pas
2. Erreur silencieuse dans le code
3. Format du handler incompatible avec Vercel

## ✅ Solution appliquée

J'ai modifié `api/index.js` pour utiliser le format de handler Vercel standard :
- Export d'une fonction async qui reçoit `(req, res)`
- Gestion d'erreurs améliorée
- Headers CORS explicites
- Gestion des requêtes OPTIONS (preflight)

## 🚀 Actions à effectuer

### 1. Commiter et pousser

```bash
git add api/index.js
git commit -m "Fix: Use standard Vercel serverless function format"
git push
```

### 2. Redéployer sur Vercel

1. Allez dans votre projet Vercel
2. **Deployments** > Cliquez sur les **3 points** (⋯) du dernier déploiement
3. **Redeploy**
4. ⏳ Attendez la fin du déploiement (2-3 minutes)

### 3. Vérifier les logs

1. **Deployments** > Dernier déploiement
2. **Functions** > `/api/index.js`
3. **Runtime Logs** > Regardez s'il y a des erreurs
4. Testez en cliquant sur "Invoke" dans l'interface Vercel

### 4. Tester

```bash
# Test dans le navigateur
https://cajj.vercel.app/api/

# Devrait retourner du JSON :
# {"name":"Centre d'Aide Juridico Judiciaire CAJJ ASBL","message":"API CAJJ opérationnelle",...}
```

## 🔍 Diagnostic si ça ne fonctionne toujours pas

### Vérifier les logs Vercel

1. **Deployments** > Dernier déploiement
2. **Functions** > `/api/index.js`
3. Regardez les **Runtime Logs**

**Erreurs courantes** :

#### "Cannot find module"
- Vérifiez que `package.json` à la racine contient toutes les dépendances
- Vérifiez que les chemins d'import sont corrects

#### "Module not found: ../backend/..."
- Vérifiez que `vercel.json` a `includeFiles: ["backend/**"]`
- Vérifiez que le dossier `backend/` existe bien

#### "Function timeout"
- Les serverless functions ont un timeout de 10 secondes
- Vérifiez que le code ne fait pas d'opérations bloquantes

### Tester manuellement

```bash
# Test 1 : Route racine
curl https://cajj.vercel.app/api/

# Test 2 : Avec verbose pour voir les headers
curl -v https://cajj.vercel.app/api/

# Test 3 : Route about
curl https://cajj.vercel.app/api/about
```

### Vérifier la structure

Assurez-vous que :
- ✅ `api/index.js` existe à la racine
- ✅ `package.json` existe à la racine avec les dépendances
- ✅ `vercel.json` route `/api/*` vers `/api/index.js`
- ✅ Le dossier `backend/` existe avec tous les fichiers nécessaires

## ⚠️ Alternative : Déployer le backend séparément

Si après toutes ces étapes le backend sur Vercel ne fonctionne toujours pas, **déployez le backend séparément** :

### Railway (Recommandé - 5 minutes)

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

Cette solution est **plus fiable** et vous donne :
- ✅ Un stockage persistant pour les fichiers uploadés
- ✅ Pas de timeout de 10 secondes
- ✅ Logs plus faciles à déboguer
- ✅ Déploiement séparé du frontend

## 📝 Résumé

- ✅ Handler converti au format standard Vercel
- ✅ Gestion d'erreurs améliorée
- ✅ Headers CORS explicites
- ⏳ **Action requise** : Commiter, pousser et redéployer

Après le redéploiement, l'API devrait répondre avec du JSON.

## 🆘 Si rien ne fonctionne

1. **Partagez les logs Vercel** :
   - Build logs
   - Runtime logs de `/api/index.js`
   - Screenshot de l'erreur

2. **Déployez sur Railway** :
   - C'est la solution la plus simple et la plus fiable
   - 5 minutes de configuration
   - Fonctionne à tous les coups

