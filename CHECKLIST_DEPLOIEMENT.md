# Checklist de déploiement sur Hostinger

## Avant le déploiement

- [ ] Avoir un compte Hostinger actif
- [ ] Avoir accès au panneau de contrôle Hostinger
- [ ] Avoir les identifiants de la base de données MySQL
- [ ] Avoir Node.js installé localement (pour le build)
- [ ] Avoir Composer installé (ou utiliser le vendor/ fourni)

## Préparation locale

- [ ] Exécuter `npm run build:hostinger` à la racine du projet
- [ ] Vérifier que le dossier `deploy-hostinger/` a été créé
- [ ] Vérifier que tous les fichiers sont présents

## Configuration sur Hostinger

### Base de données

- [ ] Créer une base de données MySQL dans le panneau Hostinger
- [ ] Noter le nom de la base de données
- [ ] Noter le nom d'utilisateur
- [ ] Noter le mot de passe
- [ ] Noter le serveur (généralement `localhost`)

### Upload des fichiers

- [ ] Se connecter au File Manager de Hostinger
- [ ] Aller dans `public_html/`
- [ ] Compresser le dossier `deploy-hostinger/` en ZIP
- [ ] Uploader le ZIP dans `public_html/`
- [ ] Extraire le ZIP
- [ ] Vérifier que tous les fichiers sont présents

### Configuration du backend

- [ ] Aller dans `public_html/api/`
- [ ] Copier `.env.production.example` vers `.env` (ou créer un nouveau `.env`)
- [ ] Configurer les variables dans `.env` :
  - [ ] `APP_NAME`
  - [ ] `APP_ENV=production`
  - [ ] `APP_DEBUG=false`
  - [ ] `APP_URL=https://votre-domaine.com`
  - [ ] `DB_DATABASE`
  - [ ] `DB_USERNAME`
  - [ ] `DB_PASSWORD`
  - [ ] `JWT_SECRET` (générer une clé sécurisée)

### Exécution des commandes (via SSH ou Terminal Hostinger)

- [ ] Se connecter via SSH (ou utiliser le Terminal du panneau Hostinger)
- [ ] Aller dans `public_html/api/`
- [ ] Exécuter `php artisan key:generate` (si APP_KEY est vide)
- [ ] Exécuter `php artisan storage:link`
- [ ] Exécuter `php artisan migrate --force`
- [ ] Exécuter `php artisan db:seed --class=AboutSectionSeeder --force`
- [ ] Exécuter `php artisan db:seed --class=ActionSeeder --force`
- [ ] Exécuter `php artisan config:cache`
- [ ] Exécuter `php artisan route:cache`
- [ ] Exécuter `php artisan view:cache`

### Configuration des permissions

- [ ] `chmod -R 755 storage`
- [ ] `chmod -R 755 bootstrap/cache`
- [ ] Vérifier que les dossiers `storage/app/public/photos` et `storage/app/public/videos` existent

### Configuration du frontend

- [ ] Vérifier que le fichier `.htaccess` est présent dans `public_html/`
- [ ] Si le backend est sur un sous-domaine, créer un fichier `.env.production` dans `frontend/` avec `VITE_API_URL`
- [ ] Rebuild le frontend si nécessaire avec la bonne URL API

## Tests

- [ ] Tester l'API : `https://votre-domaine.com/api` (doit retourner un JSON)
- [ ] Tester le frontend : `https://votre-domaine.com` (doit afficher la page d'accueil)
- [ ] Tester la page admin : `https://votre-domaine.com/admin/login`
- [ ] Tester la connexion admin
- [ ] Tester l'upload d'une photo
- [ ] Tester l'upload d'une vidéo
- [ ] Tester la création d'une actualité
- [ ] Vérifier que les images s'affichent correctement

## Dépannage

### Si l'API retourne une erreur 500

- [ ] Vérifier les logs : `api/storage/logs/laravel.log`
- [ ] Vérifier que `.env` est correctement configuré
- [ ] Vérifier les permissions des dossiers `storage/` et `bootstrap/cache/`
- [ ] Vérifier que la base de données est accessible
- [ ] Vérifier que `APP_KEY` est défini

### Si le frontend ne charge pas

- [ ] Vérifier que le fichier `.htaccess` est présent
- [ ] Vérifier que `mod_rewrite` est activé
- [ ] Vérifier la console du navigateur pour les erreurs
- [ ] Vérifier que l'URL de l'API est correcte

### Si les images ne s'affichent pas

- [ ] Vérifier que `php artisan storage:link` a été exécuté
- [ ] Vérifier que le dossier `storage/app/public` existe
- [ ] Vérifier les permissions du dossier `storage/app/public`
- [ ] Vérifier que les fichiers sont bien uploadés dans `storage/app/public/photos` ou `videos`

### Si CORS bloque les requêtes

- [ ] Vérifier que le middleware CORS est activé dans `bootstrap/app.php`
- [ ] Vérifier que `APP_URL` est correct dans `.env`
- [ ] Vérifier les headers CORS dans les réponses de l'API

## Sécurité

- [ ] Vérifier que `APP_DEBUG=false` en production
- [ ] Vérifier que `APP_ENV=production`
- [ ] Vérifier que les fichiers sensibles (`.env`, `storage/`) ne sont pas accessibles publiquement
- [ ] Vérifier que `JWT_SECRET` est une clé sécurisée et unique
- [ ] Changer les identifiants par défaut si nécessaire

