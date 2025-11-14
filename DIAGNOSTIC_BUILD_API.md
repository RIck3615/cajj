# 🔍 Diagnostic : Pourquoi l'API n'apparaît pas dans Resources

## ✅ Ce qui fonctionne
- Le fichier `api/index.js` existe et est dans Git
- La configuration `vercel.json` contient le build pour `api/index.js`
- Le build du frontend fonctionne

## ❌ Problème
- L'API n'apparaît pas dans l'onglet "Resources"
- Aucune fonction serverless listée

## 🔍 Vérifications à faire dans les Build Logs

### 1. Chercher "Building api/index.js"

Dans les **Build Logs** du dernier déploiement, cherchez :
- `Building api/index.js`
- `Installing dependencies for api/index.js`
- Des erreurs liées à `api/index.js`

**Si vous NE voyez PAS ces lignes** :
- Vercel ne tente même pas de builder la fonction
- Le problème vient de la configuration `vercel.json`

**Si vous VOYEZ ces lignes mais avec des erreurs** :
- Le build échoue
- Notez l'erreur exacte

### 2. Vérifier les erreurs courantes

Cherchez dans les Build Logs :
- `Cannot find module '../backend/src/data/siteContent'`
- `Cannot find module 'express'`
- `ENOENT: no such file or directory`
- `Error building api/index.js`
- `Build failed`

### 3. Vérifier la structure du projet

Vérifiez que dans les Build Logs, vous voyez :
- `Cloning github.com/RIck3615/cajj`
- `Found .vercelignore`
- `Installing dependencies...`
- `Building frontend/package.json` ✅ (celui-ci fonctionne)

## 🔧 Solutions possibles

### Solution 1 : Vérifier que le build est bien déclenché

Si vous ne voyez **AUCUNE** mention de `api/index.js` dans les Build Logs, essayez cette configuration alternative :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index"
    },
    {
      "source": "/((?!api|assets|.*\\.[a-z0-9]+$).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Solution 2 : Vérifier les dépendances

Assurez-vous que `package.json` à la racine contient toutes les dépendances nécessaires :
- express
- cors
- jsonwebtoken
- bcryptjs
- multer

### Solution 3 : Simplifier temporairement

Créez un fichier `api/test.js` simple pour tester :

```javascript
module.exports = (req, res) => {
  res.json({ message: 'API test fonctionne' });
};
```

Puis testez si Vercel le détecte.

## 📋 Checklist

- [ ] Le fichier `api/index.js` est dans Git (vérifié ✅)
- [ ] La configuration `vercel.json` contient le build pour `api/index.js` (vérifié ✅)
- [ ] Les Build Logs montrent "Building api/index.js" ?
- [ ] Les Build Logs montrent des erreurs liées à `api/index.js` ?
- [ ] `package.json` à la racine contient toutes les dépendances ?

## 🚨 Action immédiate

**Partagez les Build Logs complets** du dernier déploiement, en particulier :
1. Toutes les lignes qui mentionnent `api`
2. Toutes les erreurs (même si elles ne mentionnent pas `api`)
3. Les lignes autour de "Building frontend/package.json" pour voir la structure

Cela m'aidera à identifier précisément pourquoi Vercel ne build pas la fonction.

