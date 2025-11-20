<?php

/**
 * Script de test pour la route storage
 * Accès : https://cajjrdc.com/api/public/test-storage-route.php
 */

header('Content-Type: text/plain; charset=utf-8');

echo "=== Test Route Storage ===\n\n";

// Simuler ce que fait la route
$testPath = 'photos/1763677299-691f94734cdaa.jpg';

echo "1. Test du chemin relatif:\n";
echo "   Path testé: {$testPath}\n\n";

$basePath = __DIR__ . '/../storage/app/public';
echo "2. Chemin de base (relatif):\n";
echo "   Base: {$basePath}\n";
echo "   Réel: " . realpath($basePath) . "\n";
echo "   Existe: " . (file_exists($basePath) ? 'OUI' : 'NON') . "\n\n";

$filePath = $basePath . '/' . $testPath;
echo "3. Chemin complet du fichier (relatif):\n";
echo "   Fichier: {$filePath}\n";
echo "   Réel: " . realpath($filePath) . "\n";
echo "   Existe: " . (file_exists($filePath) ? 'OUI' : 'NON') . "\n";
if (file_exists($filePath)) {
    echo "   Lisible: " . (is_readable($filePath) ? 'OUI' : 'NON') . "\n";
    echo "   Taille: " . filesize($filePath) . " bytes\n";
    echo "   Permissions: " . substr(sprintf('%o', fileperms($filePath)), -4) . "\n";
}

echo "\n4. Test avec Laravel storage_path():\n";
try {
    // Charger Laravel
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    // Bootstrap l'application
    $kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();

    echo "   Laravel chargé avec succès\n\n";

    $storagePath = storage_path('app/public');
    echo "5. storage_path('app/public'):\n";
    echo "   Chemin: {$storagePath}\n";
    echo "   Réel: " . realpath($storagePath) . "\n";
    echo "   Existe: " . (file_exists($storagePath) ? 'OUI' : 'NON') . "\n";

    $filePath2 = storage_path('app/public/' . $testPath);
    echo "\n6. Chemin avec storage_path():\n";
    echo "   Fichier: {$filePath2}\n";
    echo "   Réel: " . (file_exists($filePath2) ? realpath($filePath2) : 'N/A') . "\n";
    echo "   Existe: " . (file_exists($filePath2) ? 'OUI' : 'NON') . "\n";

    if (file_exists($filePath2)) {
        echo "   Lisible: " . (is_readable($filePath2) ? 'OUI' : 'NON') . "\n";
        echo "   MIME type: " . (function_exists('mime_content_type') ? mime_content_type($filePath2) : 'N/A') . "\n";

        // Tester la lecture
        $content = file_get_contents($filePath2);
        if ($content !== false) {
            echo "   Lecture: OUI (" . strlen($content) . " bytes)\n";
        } else {
            echo "   Lecture: NON\n";
        }
    }

    // Vérifier si les chemins correspondent
    echo "\n7. Comparaison des chemins:\n";
    $realPath1 = realpath($filePath);
    $realPath2 = file_exists($filePath2) ? realpath($filePath2) : null;
    echo "   Chemin relatif: {$realPath1}\n";
    echo "   Chemin Laravel: " . ($realPath2 ?? 'N/A') . "\n";
    echo "   Correspondent: " . ($realPath1 === $realPath2 ? 'OUI' : 'NON') . "\n";
} catch (\Exception $e) {
    echo "   ERREUR lors du chargement de Laravel:\n";
    echo "   Message: " . $e->getMessage() . "\n";
    echo "   Fichier: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "   Trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n8. Test URL de la route:\n";
echo "   URL complète: https://cajjrdc.com/api/public/api/storage/{$testPath}\n";
echo "   Path dans Laravel: /storage/{$testPath}\n";
echo "   Path param attendu: {$testPath}\n";

echo "\n9. Test simulation route:\n";
if (function_exists('storage_path')) {
    $simulatedPath = storage_path('app/public/' . $testPath);
    echo "   Chemin simulé: {$simulatedPath}\n";
    echo "   Existe: " . (file_exists($simulatedPath) ? 'OUI' : 'NON') . "\n";
    if (file_exists($simulatedPath)) {
        echo "   Lisible: " . (is_readable($simulatedPath) ? 'OUI' : 'NON') . "\n";

        // Simuler ce que fait la route
        try {
            $mimeType = mime_content_type($simulatedPath);
            if (!$mimeType) {
                $extension = strtolower(pathinfo($simulatedPath, PATHINFO_EXTENSION));
                $mimeTypes = [
                    'jpg' => 'image/jpeg',
                    'jpeg' => 'image/jpeg',
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                ];
                $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
            }
            $fileContent = file_get_contents($simulatedPath);

            echo "   MIME type: {$mimeType}\n";
            echo "   Contenu lu: " . strlen($fileContent) . " bytes\n";
            echo "   ✅ Route devrait fonctionner !\n";
        } catch (\Exception $e) {
            echo "   ❌ Erreur lors de la simulation: " . $e->getMessage() . "\n";
        }
    } else {
        echo "   ❌ Fichier non trouvé - la route renverra 404\n";
    }
}

echo "\n=== Fin du test ===\n";
