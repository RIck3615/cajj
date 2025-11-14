# Guide de déploiement sur Hostinger

Ce guide vous explique comment déployer l'application CAJJ sur Hostinger.

## Structure de déploiement recommandée

```
public_html/
├── index.html (frontend React)
├── assets/ (fichiers statiques du frontend)
├── .htaccess (routing React)
└── api/ (backend Laravel)
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── public/
    │   ├── index.php
    │   └── .htaccess
    ├── routes/
    ├── storage/
    └── vendor/
```

## Étapes de déploiement

### 1. Préparer le frontend

```bash
cd frontend
npm install
npm run build
```

Les fichiers seront générés dans `frontend/dist/`

### 2. Préparer le backend Laravel

```bash
cd backend-laravel
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 3. Configuration de la base de données

1. Créez une base de données MySQL dans le panneau Hostinger
2. Notez les informations de connexion :
   - Nom de la base de données
   - Nom d'utilisateur
   - Mot de passe
   - Serveur (généralement `localhost`)

### 4. Configuration des variables d'environnement

Dans `backend-laravel/.env`, configurez :

```env
APP_NAME="CAJJ ASBL"
APP_ENV=production
APP_KEY=base64:... (générez avec: php artisan key:generate)
APP_DEBUG=false
APP_URL=https://votre-domaine.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=votre_base_de_donnees
DB_USERNAME=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe

JWT_SECRET=votre_secret_jwt_securise
```

### 5. Upload des fichiers

#### Option A : Structure recommandée (sous-dossier api)

1. **Frontend** : Uploadez le contenu de `frontend/dist/` dans `public_html/`
2. **Backend** : Uploadez tout le contenu de `backend-laravel/` dans `public_html/api/`
3. **Fichiers .htaccess** : 
   - Placez `.htaccess` du frontend dans `public_html/`
   - Placez `.htaccess` du backend dans `public_html/api/public/`

#### Option B : Domaines séparés

1. **Frontend** : Sur le domaine principal (ex: `cajj.com`)
2. **Backend** : Sur un sous-domaine (ex: `api.cajj.com`)

### 6. Configuration des permissions

Sur Hostinger, via SSH ou File Manager :

```bash
cd public_html/api
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 7. Migration de la base de données

```bash
cd public_html/api
php artisan migrate --force
php artisan db:seed --class=AboutSectionSeeder
php artisan db:seed --class=ActionSeeder
php artisan storage:link
```

### 8. Configuration du frontend

Créez un fichier `.env.production` dans `frontend/` avant le build :

```env
VITE_API_URL=https://votre-domaine.com/api
```

Ou si le backend est sur un sous-domaine :

```env
VITE_API_URL=https://api.votre-domaine.com/api
```

### 9. Vérification

1. Testez l'API : `https://votre-domaine.com/api`
2. Testez le frontend : `https://votre-domaine.com`
3. Testez l'admin : `https://votre-domaine.com/admin/login`

## Scripts de déploiement

Utilisez les scripts fournis :
- `build-for-hostinger.js` : Prépare les fichiers pour le déploiement
- `deploy-hostinger.sh` : Script de déploiement automatique (si SSH disponible)

## Dépannage

### Erreur 500 sur l'API
- Vérifiez les permissions des dossiers `storage/` et `bootstrap/cache/`
- Vérifiez les logs : `storage/logs/laravel.log`
- Vérifiez la configuration `.env`

### Erreur CORS
- Vérifiez que le middleware CORS est activé dans `bootstrap/app.php`
- Vérifiez que `APP_URL` est correct dans `.env`

### Images non chargées
- Exécutez `php artisan storage:link`
- Vérifiez les permissions du dossier `storage/app/public`

### Routes React non fonctionnelles
- Vérifiez que le fichier `.htaccess` est présent dans `public_html/`
- Vérifiez que `mod_rewrite` est activé sur le serveur

