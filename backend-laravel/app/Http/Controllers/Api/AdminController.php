<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\News;
use App\Models\Photo;
use App\Models\Video;
use App\Models\Publication;
use App\Models\AboutSection;
use App\Models\Action;

class AdminController extends Controller
{
    /**
     * Helper pour gérer l'upload de fichiers avec vérifications et fallback
     */
    private function uploadFile($file, $subdirectory)
    {
        try {
            // Vérifier que le fichier est valide
            if (!$file || !$file->isValid()) {
                \Log::error('Invalid file uploaded', [
                    'error' => $file ? $file->getError() : 'No file',
                    'error_message' => $file ? $file->getErrorMessage() : 'No file provided',
                ]);
                throw new \Exception('Fichier invalide ou absent');
            }

            // Vérifier que le dossier existe, sinon le créer
            $targetDir = storage_path("app/public/{$subdirectory}");
            if (!file_exists($targetDir)) {
                \Log::info("Creating {$subdirectory} directory", ['path' => $targetDir]);
                if (!mkdir($targetDir, 0755, true)) {
                    \Log::error("Failed to create {$subdirectory} directory", ['path' => $targetDir]);
                    throw new \Exception("Impossible de créer le dossier {$subdirectory}");
                }
            }

            // Vérifier les permissions du dossier
            if (!is_writable($targetDir)) {
                \Log::error("{$subdirectory} directory is not writable", [
                    'path' => $targetDir,
                    'perms' => substr(sprintf('%o', fileperms($targetDir)), -4)
                ]);
                throw new \Exception("Le dossier {$subdirectory} n'est pas accessible en écriture");
            }

            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            \Log::info("Uploading file to {$subdirectory}", [
                'original_name' => $file->getClientOriginalName(),
                'filename' => $filename,
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
            ]);

            // Méthode 1 : storeAs
            $path = null;
            $fullPath = null;
            
            try {
                $path = $file->storeAs($subdirectory, $filename, 'public');
                \Log::info('storeAs returned', ['path' => $path]);
                if ($path) {
                    $fullPath = storage_path('app/public/' . $path);
                }
            } catch (\Exception $e) {
                \Log::warning('storeAs failed, trying Storage facade', [
                    'message' => $e->getMessage(),
                ]);
            }

            // Méthode 2 : Storage facade si storeAs a échoué
            if (!$path || !file_exists($fullPath)) {
                try {
                    $path = Storage::disk('public')->putFileAs($subdirectory, $file, $filename);
                    \Log::info('Storage::disk returned', ['path' => $path]);
                    if ($path) {
                        $fullPath = storage_path('app/public/' . $path);
                    }
                } catch (\Exception $e) {
                    \Log::warning('Storage::disk failed, trying manual save', [
                        'message' => $e->getMessage(),
                    ]);
                }
            }

            // Méthode 3 : Sauvegarde manuelle si les deux autres ont échoué
            if (!$path || !file_exists($fullPath)) {
                try {
                    $manualPath = $targetDir . '/' . $filename;
                    if ($file->move($targetDir, $filename)) {
                        \Log::info('File saved manually', ['path' => $manualPath]);
                        $path = "{$subdirectory}/{$filename}";
                        $fullPath = storage_path('app/public/' . $path);
                    } else {
                        throw new \Exception('Move failed');
                    }
                } catch (\Exception $e) {
                    \Log::error('Manual save failed', ['message' => $e->getMessage()]);
                    throw new \Exception("Le fichier n'a pas pu être sauvegardé: " . $e->getMessage());
                }
            }

            // Vérifier que le fichier a été sauvegardé
            if (!$path || !file_exists($fullPath)) {
                \Log::error('File was not saved after all attempts', [
                    'path' => $path,
                    'full_path' => $fullPath,
                    'target_dir' => $targetDir,
                    'disk_space' => disk_free_space($targetDir),
                ]);
                throw new \Exception("Le fichier n'a pas pu être sauvegardé après toutes les tentatives");
            }

            \Log::info("File saved successfully in {$subdirectory}", [
                'path' => $path,
                'full_path' => $fullPath,
                'file_size' => filesize($fullPath),
            ]);

            return '/storage/' . $path;
        } catch (\Exception $e) {
            \Log::error("Error uploading file to {$subdirectory}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    // ========== ACTUALITÉS ==========

    public function getNews()
    {
        try {
            $news = News::orderBy('date', 'desc')->get();
            return response()->json($news);
        } catch (\Exception $e) {
            Log::error('Erreur getNews: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la récupération des actualités',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function createNews(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string',
                'content' => 'required|string',
                'author' => 'nullable|string',
                'date' => 'nullable|date',
                'media' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,mp4,avi,mov,wmv|max:102400', // 100MB
            ]);

            $mediaUrl = null;
            $mediaType = null;

            // Gérer l'upload du média (image ou vidéo)
            if ($request->hasFile('media')) {
                try {
                    $file = $request->file('media');
                    $mimeType = $file->getMimeType();

                    // Déterminer le type de média et le sous-dossier
                    if (str_starts_with($mimeType, 'image/')) {
                        $mediaType = 'image';
                        $mediaUrl = $this->uploadFile($file, 'photos');
                    } elseif (str_starts_with($mimeType, 'video/')) {
                        $mediaType = 'video';
                        $mediaUrl = $this->uploadFile($file, 'videos');
                    }
                } catch (\Exception $e) {
                    \Log::error('Erreur upload média news: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du fichier',
                        'message' => $e->getMessage()
                    ], 500);
                }
            }

            $news = News::create([
                'title' => $request->title,
                'content' => $request->content,
                'author' => $request->author ?? 'CAJJ',
                'date' => $request->date ?? now(),
                'visible' => true,
                'media_url' => $mediaUrl,
                'media_type' => $mediaType,
            ]);

            return response()->json(['message' => 'Actualité ajoutée', 'news' => $news]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erreur de validation', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur createNews: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la création de l\'actualité',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function updateNews(Request $request, $id)
    {
        try {
            $news = News::findOrFail($id);

            $request->validate([
                'title' => 'sometimes|required|string',
                'content' => 'sometimes|required|string',
                'author' => 'nullable|string',
                'date' => 'nullable|date',
                'media' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,mp4,avi,mov,wmv|max:102400', // 100MB
                'remove_media' => 'nullable|boolean',
            ]);

            $updateData = $request->only(['title', 'content', 'author', 'date', 'visible']);

            // Gérer la suppression du média
            if ($request->input('remove_media', false)) {
                // Supprimer l'ancien fichier s'il existe
                if ($news->media_url) {
                    $oldPath = str_replace('/storage/', '', $news->media_url);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $updateData['media_url'] = null;
                $updateData['media_type'] = null;
            }

            // Gérer l'upload d'un nouveau média
            if ($request->hasFile('media')) {
                try {
                    // Supprimer l'ancien fichier s'il existe
                    if ($news->media_url) {
                        $oldPath = str_replace('/storage/', '', $news->media_url);
                        if (Storage::disk('public')->exists($oldPath)) {
                            Storage::disk('public')->delete($oldPath);
                        }
                    }

                    $file = $request->file('media');
                    $mimeType = $file->getMimeType();

                    // Déterminer le type de média et le sous-dossier
                    if (str_starts_with($mimeType, 'image/')) {
                        $updateData['media_url'] = $this->uploadFile($file, 'photos');
                        $updateData['media_type'] = 'image';
                    } elseif (str_starts_with($mimeType, 'video/')) {
                        $updateData['media_url'] = $this->uploadFile($file, 'videos');
                        $updateData['media_type'] = 'video';
                    }
                } catch (\Exception $e) {
                    \Log::error('Erreur upload média news update: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du fichier',
                        'message' => $e->getMessage()
                    ], 500);
                }
            }

            $news->update($updateData);

            return response()->json(['message' => 'Actualité mise à jour', 'news' => $news]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erreur de validation', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur updateNews: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la mise à jour de l\'actualité',
                'message' => $e->getMessage()
            ], 500);
        }
    }