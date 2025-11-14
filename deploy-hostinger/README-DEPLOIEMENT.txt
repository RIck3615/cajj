# Fichiers prêts pour le déploiement sur Hostinger

## Structure

- Tous les fichiers du frontend sont à la racine
- Le backend Laravel est dans le dossier api/

## Instructions

1. Connectez-vous à votre compte Hostinger
2. Accédez au File Manager
3. Allez dans public_html/
4. Uploadez TOUS les fichiers de ce dossier
5. Configurez la base de données MySQL
6. Modifiez api/.env avec vos informations de base de données
7. Exécutez les migrations : cd api && php artisan migrate --force
8. Créez le lien symbolique storage :
   - Option 1 : php api/create-storage-link.php
   - Option 2 : Via File Manager (voir CREER_LIEN_STORAGE.md)
   - Option 3 : Via SSH : cd api/public && ln -s ../storage/app/public storage

## Configuration requise

- PHP 8.1 ou supérieur
- MySQL 5.7 ou supérieur
- mod_rewrite activé
- Composer installé (ou utilisez le vendor/ fourni)

## Important : Lien symbolique storage

Sur Hostinger, la commande "php artisan storage:link" peut échouer car exec() est désactivé.
Utilisez le script alternatif : php api/create-storage-link.php
Voir CREER_LIEN_STORAGE.md pour plus de détails.
