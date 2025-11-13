# 🔍 Diagnostic 404 sur /api/

## Problème

L'API retourne 404 : `/api/` n'est pas accessible.

## ✅ Vérifications à faire dans Vercel

### 1. Vérifier que la fonction est déployée

1. Allez dans **Vercel Dashboard** > Votre projet
2. Cliquez sur **Deployments** > Dernier déploiement
3. Cliquez sur **Functions** dans l'onglet
4. Vérifiez que `/api/index.js` est listé

**Si `/api/index.js` n'est PAS listé** :
- Le build de la fonction a échoué
- Vérifiez les **Build Logs** (onglet "Build Logs")
- Cherchez les erreurs liées à `api/index.js`

### 2. Vérifier les Build Logs

1. Dans **Deployments** > Dernier déploiement
2. Cliquez sur **Build Logs**
3. Cherchez :
   - `Building api/index.js`
   - `Installing dependencies...`
   - Des erreurs comme "Module not found", "Cannot find module"

**Erreurs courantes** :
- `Cannot find module '../backend/src/data/siteContent'` → Les fichiers ne sont pas inclus
- `Cannot find module 'express'` → Les dépendances ne sont pas installées
- `ENOENT: no such file or directory` → Les chemins sont incorrects

### 3. Vérifier les Runtime Logs

1. Dans **Functions** > `/api/index.js`
2. Cliquez sur **Runtime Logs**
3. Testez `/api/` dans le navigateur
4. Vérifiez si des logs apparaissent

**Si AUCUN log n'apparaît** :
- La fonction n'est pas appelée (404 = fonction non trouvée)
- Le problème vient du routing/rewrite

**Si des logs apparaissent** :
- La fonction est appelée mais il y a une erreur
- Vérifiez les erreurs dans les logs

### 4. Tester directement la fonction

Dans le navigateur, testez :
- `https://cajj.vercel.app/api/index` (sans `/` à la fin)
- `https://cajj.vercel.app/api/index/` (avec `/`)

**Si `/api/index` fonctionne mais pas `/api/`** :
- Le rewrite ne fonctionne pas
- Vérifiez la configuration dans `vercel.json`

**Si `/api/index` ne fonctionne pas non plus** :
- La fonction n'est pas déployée correctement
- Vérifiez les Build Logs

## 🔧 Solutions possibles

### Solution 1 : Vérifier que les fichiers sont inclus

Dans `vercel.json`, vérifiez que `includeFiles` inclut bien tous les fichiers nécessaires :

```json
{
  "src": "api/index.js",
  "use": "@vercel/node",
  "config": {
    "includeFiles": [
      "backend/**",
      "package.json"
    ]
  }
}
```

### Solution 2 : Vérifier que package.json est à la racine

Le `package.json` à la racine doit contenir toutes les dépendances nécessaires :

```json
{
  "dependencies": {
    "express": "^5.1.0",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^3.0.3",
    "multer": "^2.0.2"
  }
}
```

### Solution 3 : Simplifier la configuration

Si la fonction n'est pas détectée, essayez de retirer le build explicite et laissez Vercel détecter automatiquement :

**Option A** : Retirer le build explicite pour l'API (laisser la détection automatique)

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
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index"
    },
    {
      "source": "/((?!api|_next|assets|.*\\.[a-z0-9]+$).*)",
      "destination": "/index.html"
    }
  ]
}
```

### Solution 4 : Ajouter plus de logs

Dans `api/index.js`, ajoutez des logs au début de la fonction :

```javascript
module.exports = async (req, res) => {
  console.log('🚀 Fonction serverless appelée:', {
    url: req.url,
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString()
  });
  
  // ... reste du code
};
```

Cela permet de vérifier si la fonction est appelée.

## 📋 Checklist de diagnostic

- [ ] La fonction `/api/index.js` est listée dans **Functions** ?
- [ ] Les **Build Logs** ne montrent pas d'erreurs ?
- [ ] Les **Runtime Logs** montrent des requêtes quand vous testez `/api/` ?
- [ ] `package.json` à la racine contient toutes les dépendances ?
- [ ] Le test direct `/api/index` fonctionne ?
- [ ] Le rewrite dans `vercel.json` est correct ?

## 🚨 Informations à partager

Pour un diagnostic précis, partagez :
1. Capture d'écran de **Functions** (est-ce que `/api/index.js` est listé ?)
2. Les **Build Logs** (y a-t-il des erreurs ?)
3. Le résultat de `https://cajj.vercel.app/api/index` dans le navigateur
4. Les **Runtime Logs** quand vous testez `/api/`

Cela m'aidera à identifier précisément le problème.

