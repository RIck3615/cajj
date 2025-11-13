# 🔧 Correction du routage Vercel - Erreur HTML au lieu de JSON

## Problème

L'erreur `Unexpected token '<', "<!doctype "... is not valid JSON` signifie que Vercel renvoie la page HTML du frontend au lieu de l'API JSON.

Cela arrive parce que le rewrite catch-all `/(.*)` capture toutes les requêtes, y compris `/api/*`.

## ✅ Solution appliquée

J'ai modifié `vercel.json` pour :
1. Utiliser les `routes` pour router `/api/*` vers le handler backend
2. Retirer le rewrite `/api/:path*` qui était redondant
3. Garder seulement le rewrite catch-all pour le frontend

## 🚀 Actions à effectuer

### 1. Commiter et pousser les changements

```bash
git add vercel.json
git commit -m "Fix Vercel routing: API routes before catch-all"
git push
```

### 2. Redéployer sur Vercel

1. Allez dans votre projet Vercel
2. **Deployments** > Cliquez sur les **3 points** (⋯) du dernier déploiement
3. **Redeploy**
4. Attendez la fin du déploiement

### 3. Vérifier

Après le redéploiement, testez :

```bash
# Test de l'API
curl https://cajj.vercel.app/api/

# Devrait retourner du JSON :
# {"name":"Centre d'Aide Juridico Judiciaire CAJJ ASBL","message":"API CAJJ opérationnelle"}
```

Dans le navigateur :
1. Ouvrez `https://cajj.vercel.app/admin/login`
2. L'indicateur devrait être **vert** : "Backend connecté"
3. La console ne devrait plus afficher d'erreur

## 🔍 Vérification du routage

### Test 1 : Route racine de l'API
```bash
curl https://cajj.vercel.app/api/
```
**Attendu** : JSON avec `{"name":"...","message":"..."}`

### Test 2 : Route about
```bash
curl https://cajj.vercel.app/api/about
```
**Attendu** : JSON avec les sections "Nous connaître"

### Test 3 : Route auth
```bash
curl -X POST https://cajj.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
**Attendu** : JSON avec un token JWT

## ⚠️ Si ça ne fonctionne toujours pas

### Vérifier les logs Vercel

1. Allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. **Functions** > Cliquez sur `/api/index.js`
4. Vérifiez les logs pour voir si :
   - La fonction est bien déployée
   - Il y a des erreurs au démarrage
   - Les requêtes arrivent bien

### Vérifier la structure des fichiers

Assurez-vous que :
- ✅ `api/index.js` existe à la racine du projet
- ✅ `vercel.json` est à la racine du projet
- ✅ Les dépendances sont dans `backend/package.json` OU à la racine

### Alternative : Utiliser la structure de dossiers Vercel

Si le problème persiste, vous pouvez utiliser la structure native de Vercel :

1. Créez un dossier `api/` à la racine
2. Déplacez `api/index.js` dans ce dossier
3. Vercel détectera automatiquement les fonctions dans `/api/`

Mais la configuration actuelle devrait fonctionner avec le `vercel.json` corrigé.

## 📝 Résumé

- ✅ `vercel.json` corrigé : routes `/api/*` avant le catch-all
- ✅ Rewrite `/api/:path*` retiré (redondant)
- ⏳ **Action requise** : Commiter, pousser et redéployer

Après le redéploiement, l'API devrait retourner du JSON au lieu de HTML.

