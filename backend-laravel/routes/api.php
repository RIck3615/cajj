<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\AdminController;

// Route de santé (accessible sur /api)
Route::get('/', [PublicController::class, 'health']);

// Route pour servir les fichiers storage
Route::get('/storage/{path}', function ($path) {
    // Nettoyer le chemin pour éviter les attaques de traversée de répertoire
    $path = str_replace('..', '', $path);
    $path = ltrim($path, '/');

    $filePath = storage_path('app/public/' . $path);

    // Log pour déboguer
    \Log::info('Storage route called', [
        'request_path' => request()->path(),
        'request_url' => request()->url(),
        'path_param' => $path,
        'filePath' => $filePath,
        'exists' => file_exists($filePath),
        'readable' => is_readable($filePath),
        'storage_path' => storage_path('app/public'),
        'current_dir' => getcwd(),
    ]);

    if (!file_exists($filePath)) {
        // Essayer quelques chemins alternatifs
        $alternatePaths = [
            storage_path('app/public/' . $path),
            base_path('storage/app/public/' . $path),
            dirname(storage_path('app/public')) . '/' . $path,
        ];

        \Log::warning('File not found at primary path', [
            'requested_path' => $path,
            'full_path' => $filePath,
            'storage_base' => storage_path('app/public'),
            'alternate_paths' => $alternatePaths,
            'storage_app_exists' => file_exists(storage_path('app')),
            'storage_public_exists' => file_exists(storage_path('app/public')),
            'photos_dir_exists' => file_exists(storage_path('app/public/photos')),
        ]);

        abort(404, "File not found: {$path}");
    }

    if (!is_readable($filePath)) {
        \Log::error('File exists but is not readable', [
            'path' => $path,
            'full_path' => $filePath,
            'perms' => substr(sprintf('%o', fileperms($filePath)), -4),
        ]);
        abort(403, "File not accessible: {$path}");
    }

    try {
        $mimeType = mime_content_type($filePath);
        if (!$mimeType) {
            // Déterminer le MIME type depuis l'extension
            $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'mp4' => 'video/mp4',
                'mov' => 'video/quicktime',
                'avi' => 'video/x-msvideo',
                'webm' => 'video/webm',
                'pdf' => 'application/pdf',
            ];
            $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
        }

        $fileContent = file_get_contents($filePath);

        if ($fileContent === false) {
            \Log::error('Failed to read file content', [
                'path' => $path,
                'full_path' => $filePath,
            ]);
            abort(500, 'Error reading file');
        }

        \Log::info('File served successfully', [
            'path' => $path,
            'size' => strlen($fileContent),
            'mime' => $mimeType,
        ]);

        return response($fileContent, 200)
            ->header('Content-Type', $mimeType)
            ->header('Cache-Control', 'public, max-age=31536000')
            ->header('Content-Length', strlen($fileContent));
    } catch (\Exception $e) {
        \Log::error('Error serving file', [
            'path' => $path,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);
        abort(500, 'Error serving file: ' . $e->getMessage());
    }
})->where('path', '.*');

// Routes publiques
Route::get('/about', [PublicController::class, 'about']);
Route::get('/actions', [PublicController::class, 'actions']);
Route::get('/publications', [PublicController::class, 'publications']);
Route::get('/news', [PublicController::class, 'news']);
Route::get('/gallery', [PublicController::class, 'gallery']);
Route::get('/documentations', [PublicController::class, 'documentations']);
Route::post('/contact', [PublicController::class, 'contact']);

// Routes d'authentification
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    // Gérer les requêtes GET sur /auth/login (erreur courante)
    Route::get('/login', function () {
        return response()->json([
            'error' => 'Méthode non autorisée',
            'message' => 'La route /auth/login n\'accepte que les requêtes POST. Utilisez POST avec username et password.',
        ], 405);
    });
});

// Routes admin (protégées)
Route::prefix('admin')->middleware('jwt.auth')->group(function () {
    // Actualités
    Route::get('/news', [AdminController::class, 'getNews']);
    Route::post('/news', [AdminController::class, 'createNews']);
    Route::match(['put', 'post'], '/news/{id}', [AdminController::class, 'updateNews']); // POST pour FormData avec _method=PUT
    Route::delete('/news/{id}', [AdminController::class, 'deleteNews']);
    Route::patch('/news/{id}/visibility', [AdminController::class, 'toggleNewsVisibility']);

    // Photos
    Route::get('/gallery/photos', [AdminController::class, 'getPhotos']);
    Route::post('/gallery/photos', [AdminController::class, 'uploadPhoto']);
    Route::put('/gallery/photos/{id}', [AdminController::class, 'updatePhoto']);
    Route::delete('/gallery/photos/{id}', [AdminController::class, 'deletePhoto']);
    Route::patch('/gallery/photos/{id}/visibility', [AdminController::class, 'togglePhotoVisibility']);

    // Vidéos
    Route::get('/gallery/videos', [AdminController::class, 'getVideos']);
    Route::post('/gallery/videos', [AdminController::class, 'uploadVideo']);
    Route::put('/gallery/videos/{id}', [AdminController::class, 'updateVideo']);
    Route::delete('/gallery/videos/{id}', [AdminController::class, 'deleteVideo']);
    Route::patch('/gallery/videos/{id}/visibility', [AdminController::class, 'toggleVideoVisibility']);

    // Publications
    Route::get('/publications', [AdminController::class, 'getPublications']);
    Route::post('/publications/{type}', [AdminController::class, 'createPublication']);
    Route::match(['put', 'post'], '/publications/{type}/{id}', [AdminController::class, 'updatePublication']); // POST pour FormData avec _method=PUT
    Route::delete('/publications/{type}/{id}', [AdminController::class, 'deletePublication']);
    Route::patch('/publications/{type}/{id}/visibility', [AdminController::class, 'togglePublicationVisibility']);

    // Section "Nous connaître"
    Route::get('/about', [AdminController::class, 'getAbout']);
    Route::put('/about/sections/{id}', [AdminController::class, 'updateAboutSection']);

    // Actions
    Route::get('/actions', [AdminController::class, 'getActions']);
    Route::put('/actions/{id}', [AdminController::class, 'updateAction']);

    // Documentation
    Route::get('/documentations', [AdminController::class, 'getDocumentations']);
    Route::post('/documentations', [AdminController::class, 'createDocumentation']);
    Route::match(['put', 'post'], '/documentations/{id}', [AdminController::class, 'updateDocumentation']); // POST pour FormData avec _method=PUT
    Route::delete('/documentations/{id}', [AdminController::class, 'deleteDocumentation']);
    Route::patch('/documentations/{id}/visibility', [AdminController::class, 'toggleDocumentationVisibility']);
});
