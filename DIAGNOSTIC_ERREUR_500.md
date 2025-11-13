# 🔍 Diagnostic - Erreur 500 sur l'API

## ✅ Bonne nouvelle

Le build a **réussi** ! Le frontend est déployé correctement.

## ❌ Problème actuel

L'API retourne une erreur 500 : `https://cajj.vercel.app/api/`

## 🔧 Améliorations apportées

J'ai amélioré le handler `api/index.js` pour :
- ✅ Afficher plus de détails sur les erreurs
- ✅ Inclure le stack trace dans les logs
- ✅ Inclure `package.json` dans les fichiers inclus

## 📋 Étapes de diagnostic

### 1. Vérifier les logs Vercel

1. Allez dans votre projet Vercel
2. **Deployments** > Cliquez sur le dernier déploiement
3. **Functions** > Cliquez sur `/api/index.js`
4. **Runtime Logs** > Regardez les erreurs

**Cherchez** :
- `❌ Erreur fatale:`
- `Cannot find module`
- `Module not found`
- `Error: Cannot read property`

### 2. Tester l'API avec plus de détails

Après le prochain redéploiement, l'API retournera plus de détails sur l'erreur :

```bash
curl https://cajj.vercel.app/api/
```

Vous devriez voir quelque chose comme :
```json
{
  "error": "Erreur de chargement",
  "message": "...",
  "details": "...",
  "code": "MODULE_NOT_FOUND"
}
```

### 3. Vérifier les dépendances

Le problème pourrait être que Vercel n'installe pas les dépendances du `package.json` à la racine pour les serverless functions.

**Solution** : Vérifiez que dans les logs de build, vous voyez :
```
Installing dependencies...
added 102 packages in 6s
```

Si ce n'est pas le cas, Vercel n'installe peut-être pas les dépendances pour le backend.

## 🔧 Solutions possibles

### Solution 1 : Vérifier que package.json est inclus

J'ai déjà ajouté `package.json` dans `includeFiles`. Redéployez et vérifiez.

### Solution 2 : Créer un package.json dans api/

Si les dépendances ne sont pas installées, créez `api/package.json` :

```json
{
  "name": "api",
  "version": "1.0.0",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^2.0.2"
  }
}
```

### Solution 3 : Vérifier les chemins d'import

Les chemins dans `api/index.js` sont relatifs :
- `../backend/src/data/siteContent`
- `../backend/src/routes/auth`
- `../backend/src/routes/admin`

Assurez-vous que ces fichiers existent bien.

## 🚀 Actions à effectuer maintenant

1. **Commiter les changements** :
   ```bash
   git add api/index.js vercel.json
   git commit -m "Improve error handling and include package.json"
   git push
   ```

2. **Redéployer sur Vercel**

3. **Vérifier les logs** :
   - Allez dans **Functions** > `/api/index.js` > **Runtime Logs**
   - Regardez l'erreur exacte

4. **Tester l'API** :
   ```bash
   curl https://cajj.vercel.app/api/
   ```
   - Vous devriez voir plus de détails sur l'erreur

## 📝 Prochaines étapes selon l'erreur

### Si "Cannot find module 'express'"
→ Les dépendances ne sont pas installées
→ Solution : Créer `api/package.json` avec les dépendances

### Si "Cannot find module '../backend/...'"
→ Les fichiers ne sont pas inclus
→ Solution : Vérifier que `backend/**` est dans `includeFiles`

### Si "Error: Cannot read property 'info' of undefined"
→ `siteContent` n'est pas chargé
→ Solution : Vérifier le chemin d'import

## 🆘 Si rien ne fonctionne

Après avoir vérifié les logs, si le problème persiste, **déployez le backend séparément sur Railway** :

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Sélectionnez votre repository
3. Railway détectera le backend
4. Récupérez l'URL
5. Dans Vercel : **Settings** > **Environment Variables**
6. Ajoutez : `VITE_API_URL` = `https://votre-backend.railway.app`
7. Redéployez

C'est la solution la plus fiable et la plus simple.

