# 🔍 Guide de debug - API 404 sur Vercel

## Problème

`GET https://cajj.vercel.app/api/` retourne 404.

## 🔍 Diagnostic

### 1. Vérifier que la fonction est déployée

Dans Vercel :
1. **Deployments** > Dernier déploiement
2. **Functions** > Regardez si `/api/index.js` est listé
3. Si **non listé** → La fonction n'est pas buildée
4. Si **listé** → Cliquez dessus et regardez les **Runtime Logs**

### 2. Tester directement la fonction

Dans Vercel :
1. **Functions** > `/api/index.js`
2. Cliquez sur **"Invoke"** ou **"Test"**
3. Regardez la réponse

### 3. Vérifier les logs de build

Dans les **Build Logs**, cherchez :
- `Building api/index.js`
- `Installing dependencies...`
- Des erreurs éventuelles

### 4. Tester différentes URLs

Testez dans le navigateur :
- `https://cajj.vercel.app/api/index` → Devrait fonctionner (fonction directe)
- `https://cajj.vercel.app/api/` → Devrait fonctionner (via rewrite)
- `https://cajj.vercel.app/api/about` → Devrait fonctionner

## 🔧 Solutions possibles

### Solution 1 : Retirer le rewrite pour l'API

Vercel détecte automatiquement les fonctions dans `api/`. Essayez sans rewrite :

```json
{
  "rewrites": [
    {
      "source": "/((?!api|assets|.*\\.[a-z0-9]+$).*)",
      "destination": "/index.html"
    }
  ]
}
```

Puis testez : `https://cajj.vercel.app/api/index`

### Solution 2 : Utiliser le bon format de destination

Le rewrite devrait pointer vers la fonction sans extension :

```json
{
  "source": "/api/:path*",
  "destination": "/api/index"
}
```

### Solution 3 : Vérifier que la fonction est bien exportée

Dans `api/index.js`, assurez-vous que :
```javascript
module.exports = async (req, res) => {
  // ...
};
```

### Solution 4 : Vérifier les dépendances

Assurez-vous que `package.json` à la racine contient toutes les dépendances :
- express
- cors
- jsonwebtoken
- multer
- bcryptjs

## 🚀 Test rapide

1. **Commiter et pousser** les changements actuels
2. **Redéployer**
3. **Tester** : `https://cajj.vercel.app/api/index` (sans le `/` à la fin)
4. Si ça fonctionne → Le problème vient du rewrite
5. Si ça ne fonctionne pas → Le problème vient du build ou des dépendances

## 📝 Information à partager

Pour mieux diagnostiquer, partagez :
1. Les **Runtime Logs** de `/api/index.js` dans Vercel
2. Le résultat de `https://cajj.vercel.app/api/index` (sans `/`)
3. Les **Build Logs** (partie backend)

Cela m'aidera à identifier précisément le problème.

