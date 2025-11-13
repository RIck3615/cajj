# 🔧 Comment configurer l'API backend sur Vercel

## ✅ Configuration effectuée

J'ai créé les fichiers nécessaires pour que le backend fonctionne sur Vercel :

1. **`api/index.js`** - Handler Vercel qui adapte votre backend Express pour les serverless functions
2. **`vercel.json`** - Configuration mise à jour pour router `/api/*` vers le handler
3. **`backend/src/index.js`** - Modifié pour exporter l'app Express (compatible Vercel)

## 🚀 Étapes pour déployer

### 1. Commiter et pousser les changements

```bash
git add .
git commit -m "Configure backend for Vercel serverless functions"
git push
```

### 2. Redéployer sur Vercel

1. Allez dans votre projet Vercel
2. **Deployments** > Cliquez sur les **3 points** (⋯) du dernier déploiement
3. **Redeploy**
4. Attendez la fin du déploiement

### 3. Tester l'API

Une fois déployé, testez :

```bash
# Test de la route racine
curl https://cajj.vercel.app/api/

# Devrait retourner :
# {"name":"Centre d'Aide Juridico Judiciaire CAJJ ASBL","message":"API CAJJ opérationnelle"}
```

### 4. Vérifier dans le navigateur

1. Ouvrez votre site : `https://cajj.vercel.app`
2. Allez sur `/admin/login`
3. L'indicateur devrait être **vert** : "Backend connecté (https://cajj.vercel.app/api)"

## ⚠️ Limitations importantes

### Fichiers uploadés

Sur Vercel, les fichiers uploadés sont stockés dans `/tmp` qui est **temporaire** :
- Les fichiers seront **perdus** à chaque redéploiement
- Les fichiers seront **perdus** après 10 minutes d'inactivité (serverless)

**Solution recommandée** : Utilisez un service de stockage externe :
- **Cloudinary** (gratuit jusqu'à 25GB)
- **AWS S3** (payant mais très fiable)
- **Uploadcare** (gratuit jusqu'à 5GB)

### Données

Les données sont actuellement stockées dans `backend/src/data/siteContent.js` :
- En production, ces modifications seront **perdues** à chaque redéploiement
- **Solution recommandée** : Utilisez une base de données (MongoDB, PostgreSQL, etc.)

## 🔍 Vérification

### Vérifier que l'API fonctionne

1. **Test direct** :
   ```bash
   curl https://cajj.vercel.app/api/about
   ```

2. **Dans la console du navigateur** (F12) :
   - Ouvrez votre site
   - Regardez les messages : `🔗 URL API détectée: https://cajj.vercel.app/api`
   - L'indicateur sur `/admin/login` devrait être vert

### Vérifier les logs Vercel

1. Allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. **Functions** > Cliquez sur `/api/index.js`
4. Vérifiez les logs pour voir si l'API répond

## 🆘 Problèmes courants

### "Backend inaccessible" après déploiement

1. **Vérifiez les logs Vercel** :
   - Deployments > Dernier déploiement > Functions > `/api/index.js`
   - Cherchez les erreurs

2. **Vérifiez que `api/index.js` existe** :
   - Le fichier doit être à la racine du projet
   - Pas dans `backend/api/` mais bien `api/`

3. **Vérifiez `vercel.json`** :
   - Le build doit pointer vers `api/index.js`
   - Les routes doivent router `/api/*` vers `/api/index.js`

### Erreur "Cannot find module"

Si vous voyez une erreur de module non trouvé :

1. **Vérifiez que les dépendances sont installées** :
   - Vercel installe automatiquement depuis `package.json`
   - Assurez-vous que `backend/package.json` a toutes les dépendances

2. **Vérifiez les chemins d'import** :
   - Dans `api/index.js`, les chemins sont relatifs à la racine
   - `../backend/src/routes/auth` devrait fonctionner

### L'API répond mais les fichiers ne se chargent pas

C'est normal ! Sur Vercel :
- Les fichiers uploadés sont dans `/tmp` (temporaire)
- Ils seront perdus après 10 minutes ou un redéploiement

**Solution** : Utilisez un service de stockage externe (Cloudinary, S3, etc.)

## 📝 Prochaines étapes recommandées

1. **Migrer vers un stockage externe** pour les fichiers uploadés
2. **Migrer vers une base de données** pour les données persistantes
3. **Configurer les variables d'environnement** dans Vercel :
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`

## ✅ Résumé

- ✅ Backend configuré pour Vercel serverless functions
- ✅ Routes `/api/*` routées vers le handler
- ⚠️ Fichiers uploadés temporaires (perdus après 10 min)
- ⚠️ Données dans fichier JS (perdues à chaque redéploiement)

**Action immédiate** : Commitez, poussez et redéployez sur Vercel !

