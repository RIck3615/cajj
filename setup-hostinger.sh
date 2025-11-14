#!/bin/bash

# Script de configuration pour Hostinger
# À exécuter sur le serveur Hostinger après l'upload des fichiers

echo "🚀 Configuration de l'application CAJJ sur Hostinger..."
echo ""

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "api/artisan" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis public_html/"
    exit 1
fi

cd api

# 1. Installer les dépendances Composer (si nécessaire)
if [ ! -d "vendor" ]; then
    echo "📦 Installation des dépendances Composer..."
    composer install --optimize-autoloader --no-dev
fi

# 2. Générer la clé d'application
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    echo "🔑 Génération de la clé d'application..."
    php artisan key:generate --force
fi

# 3. Créer le lien symbolique pour le storage
echo "🔗 Création du lien symbolique storage..."
php artisan storage:link

# 4. Configurer les permissions
echo "🔐 Configuration des permissions..."
chmod -R 755 storage bootstrap/cache
chmod -R 755 ../storage 2>/dev/null || true

# 5. Nettoyer et optimiser les caches
echo "🧹 Nettoyage des caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# 6. Optimiser pour la production
echo "⚡ Optimisation pour la production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Exécuter les migrations
echo "📊 Exécution des migrations..."
read -p "Voulez-vous exécuter les migrations maintenant? (o/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Oo]$ ]]; then
    php artisan migrate --force
    echo "🌱 Exécution des seeders..."
    php artisan db:seed --class=AboutSectionSeeder --force
    php artisan db:seed --class=ActionSeeder --force
fi

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📋 Vérifications à faire :"
echo "1. Vérifiez que le fichier .env est correctement configuré"
echo "2. Testez l'API : https://votre-domaine.com/api"
echo "3. Testez le frontend : https://votre-domaine.com"
echo "4. Vérifiez les logs en cas d'erreur : api/storage/logs/laravel.log"

