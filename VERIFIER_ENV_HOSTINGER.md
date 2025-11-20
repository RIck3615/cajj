# Vérifier et corriger les fichiers .env sur Hostinger

## Problème potentiel

Il se peut qu'un fichier `.env.production` ou `.env` sur Hostinger contienne encore l'ancien domaine :
```
VITE_API_URL=https://darkblue-echidna-926825.hostingersite.com/api/public/api
```

Ce fichier aurait priorité sur la détection automatique du domaine.

## Solution : Vérifier et corriger sur Hostinger

### Étape 1 : Connectez-vous à Hostinger File Manager

1. Connectez-vous à votre compte Hostinger
2. Allez dans **File Manager**
3. Allez dans `public_html/`

### Étape 2 : Vérifiez s'il y a un fichier `.env` ou `.env.production`

Cherchez ces fichiers dans `public_html/` :
- `.env`
- `.env.production`
- `.env.local`

**Note :** Les fichiers commençant par `.` sont cachés. Dans File Manager, activez "Afficher les fichiers cachés" ou utilisez Ctrl+H.

### Étape 3 : Si vous trouvez un fichier `.env` ou `.env.production`

1. **Ouvrez le fichier**
2. **Vérifiez la ligne `VITE_API_URL`** :
   - Si elle contient `darkblue-echidna-926825.hostingersite.com` → **PROBLÈME TROUVÉ !**
   - Si elle contient `cajjrdc.com` → Le fichier est correct
   - Si elle n'existe pas → Pas de problème

3. **Modifiez ou supprimez la ligne** :
   ```
   VITE_API_URL=https://cajjrdc.com/api/public/api
   ```
   OU supprimez complètement la ligne si vous préférez utiliser la détection automatique.

### Étape 4 : Si vous ne trouvez pas de fichier `.env`

Le problème vient probablement du fait que :
- Le frontend n'a pas été redéployé avec les dernières modifications
- Le cache du navigateur affiche encore une ancienne version

**Solution :**
1. Redéployez le contenu de `deploy-hostinger/` sur Hostinger
2. Videz le cache de votre navigateur
3. Testez : `https://cajjrdc.com/admin/login`

## Alternative : Supprimer complètement les fichiers .env

Si vous préférez utiliser uniquement la détection automatique (recommandé) :

1. Supprimez tous les fichiers `.env`, `.env.production`, `.env.local` dans `public_html/`
2. Le frontend utilisera la détection automatique basée sur l'URL actuelle
3. Sur `cajjrdc.com`, il utilisera automatiquement `https://cajjrdc.com/api/public/api`

## Vérification après correction

1. Videz le cache de votre navigateur
2. Ouvrez : `https://cajjrdc.com/admin/login`
3. Ouvrez la console du navigateur (F12)
4. Vérifiez les logs :
   - "📍 URL actuelle du frontend:" → devrait être `https://cajjrdc.com`
   - "🔗 URL API détectée:" → devrait être `https://cajjrdc.com/api/public/api`
   - "📝 Variable d'environnement VITE_API_URL:" → devrait être "non définie" OU `https://cajjrdc.com/api/public/api`

## Si le problème persiste

Vérifiez aussi :
1. Que le frontend a bien été redéployé (fichiers dans `public_html/` sont à jour)
2. Que le cache du navigateur est bien vidé
3. Que vous utilisez bien `https://cajjrdc.com` et non l'ancien domaine

