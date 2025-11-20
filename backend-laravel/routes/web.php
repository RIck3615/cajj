<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route pour servir les fichiers storage (accessible publiquement)
Route::get('/storage/{path}', function ($path) {
    // Nettoyer le chemin pour éviter les attaques de traversée de répertoire
    $path = str_replace('..', '', $path);
    $path = ltrim($path, '/');

    $filePath = storage_path('app/public/' . $path);

    // Log pour déboguer
    \Log::info('Storage route called (web)', [
        'request_path' => request()->path(),
        'request_url' => request()->url(),
        'path_param' => $path,
        'filePath' => $filePath,
        'exists' => file_exists($filePath),
        'readable' => is_readable($filePath),
        'storage_path' => storage_path('app/public'),
    ]);

    if (!file_exists($filePath)) {
        \Log::warning('File not found (web)', [
            'requested_path' => $path,
            'full_path' => $filePath,
            'storage_base' => storage_path('app/public'),
        ]);
        abort(404, "File not found: {$path}");
    }

    if (!is_readable($filePath)) {
        \Log::error('File exists but is not readable (web)', [
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
            ];
            $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
        }

        $fileContent = file_get_contents($filePath);

        if ($fileContent === false) {
            \Log::error('Failed to read file content (web)', [
                'path' => $path,
                'full_path' => $filePath,
            ]);
            abort(500, 'Error reading file');
        }

        \Log::info('File served successfully (web)', [
            'path' => $path,
            'size' => strlen($fileContent),
            'mime' => $mimeType,
        ]);

        return response($fileContent, 200)
            ->header('Content-Type', $mimeType)
            ->header('Cache-Control', 'public, max-age=31536000')
            ->header('Content-Length', strlen($fileContent));
    } catch (\Exception $e) {
        \Log::error('Error serving file (web)', [
            'path' => $path,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);
        abort(500, 'Error serving file: ' . $e->getMessage());
    }
})->where('path', '.*');
