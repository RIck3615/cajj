# 🎯 Solution finale - Erreur HTML au lieu de JSON

## Problème

L'erreur `Unexpected token '<', "<!doctype "...` signifie que Vercel renvoie la page HTML du frontend au lieu de l'API JSON.

**Cause** : Le rewrite catch-all `/(.*)` dans `vercel.json` à la racine capture toutes les requêtes, y compris `/api/*`, avant que les routes ne soient évaluées.

## ✅ Solution appliquée

J'ai **retiré le rewrite catch-all** du `vercel.json` à la racine. Le routage du frontend est déjà géré par `frontend/vercel.json`.

### Configuration finale

- **Routes** : `/api/*` → `/api/index.js` (priorité)
- **Routes** : `/*` → `frontend/dist/*` (fallback)
- **Pas de rewrites** à la racine (géré par `frontend/vercel.json`)

## 🚀 Actions à effectuer

### 1. Commiter et pousser

```bash
git add vercel.json
git commit -m "Fix: Remove catch-all rewrite that was blocking API routes"
git push
```

### 2. Redéployer sur Vercel

1. Allez dans votre projet Vercel
2. **Deployments** > Cliquez sur les **3 points** (⋯) du dernier déploiement
3. **Redeploy**
4. ⏳ Attendez la fin du déploiement

### 3. Tester

```bash
# Test direct dans le navigateur
https://cajj.vercel.app/api/
```

**Attendu** : JSON `{"name":"Centre d'Aide Juridico Judiciaire CAJJ ASBL","message":"API CAJJ opérationnelle"}`

**Si vous voyez encore du HTML** :
1. Videz le cache du navigateur (Ctrl+Shift+R)
2. Vérifiez les logs Vercel pour voir si la fonction est bien déployée

### 4. Vérifier dans l'application

1. Ouvrez `https://cajj.vercel.app/admin/login`
2. L'indicateur devrait être **vert** : "Backend connecté"
3. La console ne devrait plus afficher d'erreurs

## 🔍 Vérification des logs Vercel

Si ça ne fonctionne toujours pas :

1. **Deployments** > Dernier déploiement
2. **Functions** > `/api/index.js`
3. **Runtime Logs** > Regardez s'il y a des erreurs
4. Testez en cliquant sur "Invoke" dans l'interface Vercel

## ⚠️ Alternative : Déployer le backend séparément

Si après cette correction le problème persiste, **déployez le backend séparément** :

### Railway (Recommandé - 5 minutes)

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Sélectionnez votre repository
3. Railway détectera automatiquement le backend
4. Récupérez l'URL (ex: `https://cajj-backend.up.railway.app`)

### Configurer Vercel

1. **Settings** > **Environment Variables**
2. Ajoutez : `VITE_API_URL` = `https://cajj-backend.up.railway.app`
3. **Redéployez**

Cette solution est **plus fiable** et vous donne un stockage persistant pour les fichiers uploadés.

## 📝 Résumé

- ✅ Rewrite catch-all retiré du `vercel.json` à la racine
- ✅ Routes API prioritaires
- ✅ Frontend géré par `frontend/vercel.json`
- ⏳ **Action requise** : Commiter, pousser et redéployer

Après le redéploiement, l'API devrait retourner du JSON au lieu de HTML.

