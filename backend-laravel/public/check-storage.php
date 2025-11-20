<?php
/**
 * Script de diagnostic pour vérifier le storage
 * Accès : https://cajjrdc.com/api/public/check-storage.php
 */

header('Content-Type: text/plain; charset=utf-8');

echo "=== Diagnostic Storage ===\n\n";

$storagePath = dirname(__DIR__) . '/storage/app/public';
$publicStoragePath = __DIR__ . '/storage';

echo "1. Chemin storage: " . $storagePath . "\n";
echo "   Existe: " . (file_exists($storagePath) ? 'OUI' : 'NON') . "\n";
echo "   Lisible: " . (is_readable($storagePath) ? 'OUI' : 'NON') . "\n\n";

echo "2. Chemin public/storage: " . $publicStoragePath . "\n";
echo "   Existe: " . (file_exists($publicStoragePath) ? 'OUI' : 'NON') . "\n";
echo "   Lien symbolique: " . (is_link($publicStoragePath) ? 'OUI' : 'NON') . "\n";
if (is_link($publicStoragePath)) {
    echo "   Pointe vers: " . readlink($publicStoragePath) . "\n";
}
echo "   Lisible: " . (is_readable($publicStoragePath) ? 'OUI' : 'NON') . "\n\n";

echo "3. Test fichier photo:\n";
$testFile = 'photos/1763665092-691f64c48dff8.jpg';
$fullPath = $storagePath . '/' . $testFile;
echo "   Fichier testé: {$testFile}\n";
echo "   Chemin complet: {$fullPath}\n";
echo "   Existe: " . (file_exists($fullPath) ? 'OUI' : 'NON') . "\n";
echo "   Lisible: " . (is_readable($fullPath) ? 'OUI' : 'NON') . "\n\n";

if (file_exists($storagePath . '/photos')) {
    echo "4. Dossier photos:\n";
    echo "   Existe: OUI\n";
    $files = scandir($storagePath . '/photos');
    $jpgFiles = array_filter($files, function($f) {
        return pathinfo($f, PATHINFO_EXTENSION) === 'jpg';
    });
    echo "   Nombre de fichiers JPG: " . count($jpgFiles) . "\n";
    if (count($jpgFiles) > 0) {
        echo "   Premiers fichiers:\n";
        foreach (array_slice($jpgFiles, 0, 5) as $file) {
            echo "     - {$file}\n";
        }
    }
} else {
    echo "4. Dossier photos: N'EXISTE PAS\n";
}

echo "\n=== Fin du diagnostic ===\n";

