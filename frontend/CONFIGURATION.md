# Configuration de l'URL de l'API

## Problème : Le login ne fonctionne pas sur différents ordinateurs

Si vous rencontrez des problèmes de connexion en changeant d'ordinateur, c'est probablement dû à la configuration de l'URL de l'API.

## Solution automatique

L'application détecte automatiquement l'URL de l'API en fonction de votre environnement :

1. **Variable d'environnement** (priorité) : Si `VITE_API_URL` est définie, elle sera utilisée
2. **Détection automatique** : Si vous accédez au site via une IP locale (ex: `192.168.1.100:5173`), l'API utilisera automatiquement `http://192.168.1.100:4000`
3. **Localhost par défaut** : Sinon, utilise `http://localhost:4000`

## Configuration manuelle

### Option 1 : Créer un fichier `.env` dans le dossier `frontend/`

Créez un fichier `frontend/.env` avec :

```env
VITE_API_URL=http://localhost:4000
```

Pour accéder depuis un autre appareil sur le même réseau :

```env
VITE_API_URL=http://192.168.1.100:4000
```

(Remplacez `192.168.1.100` par l'adresse IP de la machine qui héberge le backend)

### Option 2 : Configurer dans Vercel (production)

1. Allez dans les paramètres de votre projet Vercel
2. Section "Environment Variables"
3. Ajoutez : `VITE_API_URL` = `https://votre-backend-url.com`

## Vérification

1. Ouvrez la console du navigateur (F12)
2. Regardez le message : `🔗 URL API détectée: ...`
3. Si vous voyez une erreur, vérifiez que :
   - Le backend est démarré (`cd backend && npm run dev`)
   - Le port 4000 n'est pas utilisé par un autre programme
   - L'URL dans la console correspond à l'endroit où votre backend écoute

## Identifiants par défaut

- **Username** : `admin`
- **Password** : `admin123`

⚠️ **Important** : Changez ces identifiants en production en configurant les variables d'environnement `ADMIN_USERNAME` et `ADMIN_PASSWORD` dans le backend.

