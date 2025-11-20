<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\AdminController;

// Route de santé (accessible sur /api)
Route::get('/', [PublicController::class, 'health']);

// Route pour servir les fichiers storage
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    
    if (!file_exists($filePath)) {
        abort(404);
    }
    
    $mimeType = mime_content_type($filePath);
    $fileContent = file_get_contents($filePath);
    
    return response($fileContent, 200)
        ->header('Content-Type', $mimeType)
        ->header('Cache-Control', 'public, max-age=31536000');
})->where('path', '.*');

// Routes publiques
Route::get('/about', [PublicController::class, 'about']);
Route::get('/actions', [PublicController::class, 'actions']);
Route::get('/publications', [PublicController::class, 'publications']);
Route::get('/news', [PublicController::class, 'news']);
Route::get('/gallery', [PublicController::class, 'gallery']);
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
    Route::put('/publications/{type}/{id}', [AdminController::class, 'updatePublication']);
    Route::delete('/publications/{type}/{id}', [AdminController::class, 'deletePublication']);
    Route::patch('/publications/{type}/{id}/visibility', [AdminController::class, 'togglePublicationVisibility']);

    // Section "Nous connaître"
    Route::get('/about', [AdminController::class, 'getAbout']);
    Route::put('/about/sections/{id}', [AdminController::class, 'updateAboutSection']);

    // Actions
    Route::get('/actions', [AdminController::class, 'getActions']);
    Route::put('/actions/{id}', [AdminController::class, 'updateAction']);
});

