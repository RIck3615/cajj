<?php
/**
 * Script alternatif pour créer le lien symbolique storage
 * À utiliser quand exec() n'est pas disponible sur le serveur
 * 
 * Usage: php create-storage-link.php
 */

$publicPath = __DIR__ . '/public';
$storagePath = __DIR__ . '/storage/app/public';
$linkPath = $publicPath . '/storage';

echo "🔗 Création du lien symbolique storage...\n";

// Vérifier que le dossier storage/app/public existe
if (!is_dir($storagePath)) {
    echo "📁 Création du dossier storage/app/public...\n";
    mkdir($storagePath, 0755, true);
    mkdir($storagePath . '/photos', 0755, true);
    mkdir($storagePath . '/videos', 0755, true);
}

// Supprimer le lien existant s'il existe
if (file_exists($linkPath) || is_link($linkPath)) {
    echo "🗑️  Suppression de l'ancien lien...\n";
    if (is_link($linkPath)) {
        unlink($linkPath);
    } elseif (is_dir($linkPath)) {
        rmdir($linkPath);
    }
}

// Créer le lien symbolique
if (PHP_OS_FAMILY === 'Windows') {
    // Sur Windows, utiliser junction ou copier les fichiers
    echo "⚠️  Windows détecté. Création d'un lien de répertoire...\n";
    if (function_exists('symlink')) {
        if (symlink($storagePath, $linkPath)) {
            echo "✅ Lien symbolique créé avec succès !\n";
        } else {
            echo "❌ Erreur lors de la création du lien symbolique.\n";
            echo "💡 Solution alternative: Créez manuellement un lien de $linkPath vers $storagePath\n";
        }
    } else {
        echo "❌ La fonction symlink() n'est pas disponible.\n";
        echo "💡 Solution: Créez manuellement un lien de $linkPath vers $storagePath\n";
    }
} else {
    // Sur Linux/Unix (Hostinger)
    if (function_exists('symlink')) {
        if (symlink($storagePath, $linkPath)) {
            echo "✅ Lien symbolique créé avec succès !\n";
            echo "📍 Lien: $linkPath -> $storagePath\n";
        } else {
            echo "❌ Erreur lors de la création du lien symbolique.\n";
            echo "💡 Vérifiez les permissions du dossier public/\n";
            exit(1);
        }
    } else {
        echo "❌ La fonction symlink() n'est pas disponible.\n";
        echo "💡 Solution: Créez manuellement le lien via le File Manager ou contactez le support.\n";
        exit(1);
    }
}

echo "\n✅ Configuration terminée !\n";
echo "📋 Vérifications:\n";
echo "   - Le dossier storage/app/public existe: " . (is_dir($storagePath) ? "✅" : "❌") . "\n";
echo "   - Le lien public/storage existe: " . (file_exists($linkPath) ? "✅" : "❌") . "\n";

