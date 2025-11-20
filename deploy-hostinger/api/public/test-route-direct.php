<?php
/**
 * Script pour tester si la route storage est accessible
 * Accès : https://cajjrdc.com/api/public/test-route-direct.php
 */

header('Content-Type: text/plain; charset=utf-8');

echo "=== Test Route Directe ===\n\n";

// Charger Laravel
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "1. Test des routes enregistrées:\n";
$routes = \Illuminate\Support\Facades\Route::getRoutes();
$storageRoute = null;

foreach ($routes as $route) {
    $uri = $route->uri();
    $methods = $route->methods();
    
    if (strpos($uri, 'storage') !== false) {
        echo "   Route trouvée: " . implode('|', $methods) . " /{$uri}\n";
        $storageRoute = $route;
    }
}

if (!$storageRoute) {
    echo "   ❌ Aucune route storage trouvée !\n";
} else {
    echo "   ✅ Route storage trouvée\n";
    echo "   URI: /" . $storageRoute->uri() . "\n";
    echo "   Méthodes: " . implode(', ', $storageRoute->methods()) . "\n";
}

echo "\n2. Test de la route directement:\n";
$testPath = 'photos/1763677299-691f94734cdaa.jpg';
$filePath = storage_path('app/public/' . $testPath);

echo "   Chemin testé: {$testPath}\n";
echo "   Fichier: {$filePath}\n";
echo "   Existe: " . (file_exists($filePath) ? 'OUI' : 'NON') . "\n";

if (file_exists($filePath)) {
    try {
        // Les routes API sont automatiquement préfixées avec /api
        // Donc la route /storage/{path} devient /api/storage/{path}
        // Mais Laravel attend juste /storage/{path} dans la requête car le préfixe est géré automatiquement
        
        // Test 1 : Sans le préfixe /api (comme Laravel le voit)
        echo "   Test 1: Sans préfixe /api\n";
        $request1 = \Illuminate\Http\Request::create("/storage/{$testPath}", 'GET');
        echo "   Requête créée: GET /storage/{$testPath}\n";
        
        $response1 = $app->handle($request1);
        $statusCode1 = $response1->getStatusCode();
        echo "   Statut: {$statusCode1}\n";
        
        if ($statusCode1 === 200) {
            echo "   ✅ Route fonctionne sans préfixe !\n";
        } else {
            echo "   ❌ Route renvoie {$statusCode1} sans préfixe\n";
        }
        
        // Test 2 : Avec le préfixe /api (comme Apache le passe)
        echo "\n   Test 2: Avec préfixe /api\n";
        $request2 = \Illuminate\Http\Request::create("/api/storage/{$testPath}", 'GET');
        echo "   Requête créée: GET /api/storage/{$testPath}\n";
        
        $response2 = $app->handle($request2);
        $statusCode2 = $response2->getStatusCode();
        
        echo "   Statut: {$statusCode2}\n";
        
        if ($statusCode2 === 200) {
            echo "   ✅ Route fonctionne avec préfixe !\n";
            echo "   Content-Type: " . $response2->headers->get('Content-Type') . "\n";
            echo "   Taille: " . strlen($response2->getContent()) . " bytes\n";
        } else {
            echo "   ❌ Route renvoie {$statusCode2} avec préfixe\n";
            echo "   Contenu: " . substr($response2->getContent(), 0, 200) . "\n";
        }
    } catch (\Exception $e) {
        echo "   ❌ Erreur: " . $e->getMessage() . "\n";
        echo "   Trace: " . $e->getTraceAsString() . "\n";
    }
}

echo "\n3. Test URL complète:\n";
echo "   URL: https://cajjrdc.com/api/public/api/storage/{$testPath}\n";
echo "   Path Laravel: /api/storage/{$testPath}\n";

echo "\n=== Fin du test ===\n";

