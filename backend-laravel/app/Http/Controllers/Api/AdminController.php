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
use App\Models\Documentation;

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
                'pdf' => 'nullable|file|mimes:pdf|max:102400', // 100MB
            ]);

            $mediaUrl = null;
            $mediaType = null;
            $pdfUrl = null;

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

            // Gérer l'upload du PDF
            if ($request->hasFile('pdf')) {
                try {
                    $pdfFile = $request->file('pdf');
                    $pdfUrl = $this->uploadFile($pdfFile, 'pdfs');
                } catch (\Exception $e) {
                    \Log::error('Erreur upload PDF news: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du PDF',
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
                'pdf_url' => $pdfUrl,
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
                'pdf' => 'nullable|file|mimes:pdf|max:102400', // 100MB
                'remove_pdf' => 'nullable|boolean',
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

            // Gérer la suppression du PDF
            if ($request->input('remove_pdf', false)) {
                // Supprimer l'ancien fichier PDF s'il existe
                if ($news->pdf_url) {
                    $oldPath = str_replace('/storage/', '', $news->pdf_url);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $updateData['pdf_url'] = null;
            }

            // Gérer l'upload d'un nouveau PDF
            if ($request->hasFile('pdf')) {
                try {
                    // Supprimer l'ancien fichier PDF s'il existe
                    if ($news->pdf_url) {
                        $oldPath = str_replace('/storage/', '', $news->pdf_url);
                        if (Storage::disk('public')->exists($oldPath)) {
                            Storage::disk('public')->delete($oldPath);
                        }
                    }

                    $pdfFile = $request->file('pdf');
                    $updateData['pdf_url'] = $this->uploadFile($pdfFile, 'pdfs');
                } catch (\Exception $e) {
                    \Log::error('Erreur upload PDF news update: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du PDF',
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

    public function deleteNews($id)
    {
        News::findOrFail($id)->delete();
        return response()->json(['message' => 'Actualité supprimée']);
    }

    public function toggleNewsVisibility(Request $request, $id)
    {
        $news = News::findOrFail($id);
        $news->visible = $request->input('visible', true);
        $news->save();

        return response()->json([
            'message' => $news->visible ? 'Actualité publiée' : 'Actualité masquée',
            'news' => $news,
        ]);
    }

    // ========== PHOTOS ==========

    public function getPhotos()
    {
        $photos = Photo::orderBy('created_at', 'desc')->get();
        return response()->json($photos);
    }

    public function uploadPhoto(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|image|max:51200', // 50MB
                'title' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $file = $request->file('file');
            
            // Utiliser la fonction helper pour l'upload
            $mediaUrl = $this->uploadFile($file, 'photos');
            
            // Extraire le filename du chemin
            $filename = basename(str_replace('/storage/photos/', '', $mediaUrl));

            $photo = Photo::create([
                'title' => $request->title ?? $file->getClientOriginalName(),
                'description' => $request->description ?? '',
                'url' => $mediaUrl,
                'filename' => $filename,
                'visible' => true,
            ]);

            return response()->json(['message' => 'Photo ajoutée', 'photo' => $photo]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::warning('Validation error in uploadPhoto', ['errors' => $e->errors()]);
            return response()->json(['error' => 'Erreur de validation', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Error uploading photo', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Erreur lors de l\'upload: ' . $e->getMessage()], 500);
        }
    }

    public function updatePhoto(Request $request, $id)
    {
        $photo = Photo::findOrFail($id);
        $photo->update($request->only(['title', 'description', 'visible']));

        return response()->json(['message' => 'Photo mise à jour', 'photo' => $photo]);
    }

    public function deletePhoto($id)
    {
        $photo = Photo::findOrFail($id);

        if ($photo->filename && Storage::disk('public')->exists('photos/' . $photo->filename)) {
            Storage::disk('public')->delete('photos/' . $photo->filename);
        }

        $photo->delete();
        return response()->json(['message' => 'Photo supprimée']);
    }

    public function togglePhotoVisibility(Request $request, $id)
    {
        $photo = Photo::findOrFail($id);
        $photo->visible = $request->input('visible', true);
        $photo->save();

        return response()->json([
            'message' => $photo->visible ? 'Photo publiée' : 'Photo masquée',
            'photo' => $photo,
        ]);
    }

    // ========== VIDÉOS ==========

    public function getVideos()
    {
        $videos = Video::orderBy('created_at', 'desc')->get();
        return response()->json($videos);
    }

    public function uploadVideo(Request $request)
    {
        try {
            $request->validate([
                'file' => 'nullable|file|mimes:mp4,mov,avi,webm|max:51200', // 50MB
                'url' => 'nullable|url',
                'title' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                
                // Utiliser la fonction helper pour l'upload
                $mediaUrl = $this->uploadFile($file, 'videos');
                
                // Extraire le filename du chemin
                $filename = basename(str_replace('/storage/videos/', '', $mediaUrl));

                $video = Video::create([
                    'title' => $request->title ?? $file->getClientOriginalName(),
                    'description' => $request->description ?? '',
                    'url' => $mediaUrl,
                    'filename' => $filename,
                    'visible' => true,
                ]);
            } else {
                $request->validate(['url' => 'required|url']);

                $video = Video::create([
                    'title' => $request->title ?? 'Vidéo',
                    'description' => $request->description ?? '',
                    'url' => $request->url,
                    'visible' => true,
                ]);
            }

            return response()->json(['message' => 'Vidéo ajoutée', 'video' => $video]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erreur de validation', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Error uploading video', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Erreur lors de l\'upload: ' . $e->getMessage()], 500);
        }
    }

    public function updateVideo(Request $request, $id)
    {
        $video = Video::findOrFail($id);
        $video->update($request->only(['title', 'description', 'url', 'visible']));

        return response()->json(['message' => 'Vidéo mise à jour', 'video' => $video]);
    }

    public function deleteVideo($id)
    {
        $video = Video::findOrFail($id);

        if ($video->filename && Storage::disk('public')->exists('videos/' . $video->filename)) {
            Storage::disk('public')->delete('videos/' . $video->filename);
        }

        $video->delete();
        return response()->json(['message' => 'Vidéo supprimée']);
    }

    public function toggleVideoVisibility(Request $request, $id)
    {
        $video = Video::findOrFail($id);
        $video->visible = $request->input('visible', true);
        $video->save();

        return response()->json([
            'message' => $video->visible ? 'Vidéo publiée' : 'Vidéo masquée',
            'video' => $video,
        ]);
    }

    // ========== PUBLICATIONS ==========

    public function getPublications()
    {
        $cajj = Publication::where('type', 'cajj')->get();
        $partners = Publication::where('type', 'partners')->get();

        return response()->json([
            'cajj' => $cajj,
            'partners' => $partners,
        ]);
    }

    public function createPublication(Request $request, $type)
    {
        try {
            if (!in_array($type, ['cajj', 'partners'])) {
                return response()->json(['error' => 'Type invalide. Utilisez \'cajj\' ou \'partners\''], 400);
            }

            // Validation selon le type
            if ($type === 'cajj') {
                $request->validate([
                    'title' => 'required|string',
                    'description' => 'nullable|string',
                    'url' => 'nullable|url',
                    'media' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,mp4,avi,mov,wmv|max:102400', // 100MB
                    'pdf' => 'nullable|file|mimes:pdf|max:102400', // 100MB
                ]);
            } else {
                $request->validate([
                    'name' => 'required|string',
                    'description' => 'nullable|string',
                    'url' => 'nullable|url',
                    'media' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,mp4,avi,mov,wmv|max:102400', // 100MB
                    'pdf' => 'nullable|file|mimes:pdf|max:102400', // 100MB
                ]);
            }

            $mediaUrl = null;
            $mediaType = null;
            $pdfUrl = null;

            // Gérer l'upload du média (image ou vidéo)
            if ($request->hasFile('media')) {
                try {
                    $file = $request->file('media');
                    $mimeType = $file->getMimeType();

                    // Déterminer le type de média et utiliser la fonction helper
                    if (str_starts_with($mimeType, 'image/')) {
                        $mediaType = 'image';
                        $mediaUrl = $this->uploadFile($file, 'photos');
                    } elseif (str_starts_with($mimeType, 'video/')) {
                        $mediaType = 'video';
                        $mediaUrl = $this->uploadFile($file, 'videos');
                    }
                } catch (\Exception $e) {
                    Log::error('Erreur upload média publication: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du fichier',
                        'message' => $e->getMessage()
                    ], 500);
                }
            }

            // Gérer l'upload du PDF
            if ($request->hasFile('pdf')) {
                try {
                    $pdfFile = $request->file('pdf');
                    $pdfUrl = $this->uploadFile($pdfFile, 'pdfs');
                } catch (\Exception $e) {
                    Log::error('Erreur upload PDF publication: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du PDF',
                        'message' => $e->getMessage()
                    ], 500);
                }
            }

            $publication = Publication::create([
                'type' => $type,
                'title' => $request->title ?? null,
                'name' => $request->name ?? null,
                'description' => $request->description ?? null,
                'url' => $request->url ?? null,
                'visible' => true,
                'media_url' => $mediaUrl,
                'media_type' => $mediaType,
                'pdf_url' => $pdfUrl,
            ]);

            return response()->json(['message' => 'Publication ajoutée', 'publication' => $publication]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erreur validation publication: ' . json_encode($e->errors()));
            return response()->json([
                'error' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur createPublication: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la création de la publication',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function updatePublication(Request $request, $type, $id)
    {
        try {
            if (!in_array($type, ['cajj', 'partners'])) {
                return response()->json(['error' => 'Type invalide'], 400);
            }

            $publication = Publication::where('type', $type)->findOrFail($id);

            // Validation selon le type
            if ($type === 'cajj') {
                $request->validate([
                    'title' => 'sometimes|required|string',
                    'description' => 'nullable|string',
                    'url' => 'nullable|url',
                    'media' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,mp4,avi,mov,wmv|max:102400', // 100MB
                    'remove_media' => 'nullable|boolean',
                    'pdf' => 'nullable|file|mimes:pdf|max:102400', // 100MB
                    'remove_pdf' => 'nullable|boolean',
                ]);
            } else {
                $request->validate([
                    'name' => 'sometimes|required|string',
                    'description' => 'nullable|string',
                    'url' => 'nullable|url',
                    'media' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,mp4,avi,mov,wmv|max:102400', // 100MB
                    'remove_media' => 'nullable|boolean',
                    'pdf' => 'nullable|file|mimes:pdf|max:102400', // 100MB
                    'remove_pdf' => 'nullable|boolean',
                ]);
            }

            $updateData = $request->only(['title', 'name', 'description', 'url', 'visible']);

            // Gérer la suppression du média
            if ($request->input('remove_media', false)) {
                // Supprimer l'ancien fichier s'il existe
                if ($publication->media_url) {
                    $oldPath = str_replace('/storage/', '', $publication->media_url);
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
                    if ($publication->media_url) {
                        $oldPath = str_replace('/storage/', '', $publication->media_url);
                        if (Storage::disk('public')->exists($oldPath)) {
                            Storage::disk('public')->delete($oldPath);
                        }
                    }

                    $file = $request->file('media');
                    $mimeType = $file->getMimeType();

                    // Déterminer le type de média et utiliser la fonction helper
                    if (str_starts_with($mimeType, 'image/')) {
                        $updateData['media_url'] = $this->uploadFile($file, 'photos');
                        $updateData['media_type'] = 'image';
                    } elseif (str_starts_with($mimeType, 'video/')) {
                        $updateData['media_url'] = $this->uploadFile($file, 'videos');
                        $updateData['media_type'] = 'video';
                    }
                } catch (\Exception $e) {
                    \Log::error('Erreur upload média publication update: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du fichier',
                        'message' => $e->getMessage()
                    ], 500);
                }
            }

            // Gérer la suppression du PDF
            if ($request->input('remove_pdf', false)) {
                // Supprimer l'ancien fichier PDF s'il existe
                if ($publication->pdf_url) {
                    $oldPath = str_replace('/storage/', '', $publication->pdf_url);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $updateData['pdf_url'] = null;
            }

            // Gérer l'upload d'un nouveau PDF
            if ($request->hasFile('pdf')) {
                try {
                    // Supprimer l'ancien fichier PDF s'il existe
                    if ($publication->pdf_url) {
                        $oldPath = str_replace('/storage/', '', $publication->pdf_url);
                        if (Storage::disk('public')->exists($oldPath)) {
                            Storage::disk('public')->delete($oldPath);
                        }
                    }

                    $pdfFile = $request->file('pdf');
                    $updateData['pdf_url'] = $this->uploadFile($pdfFile, 'pdfs');
                } catch (\Exception $e) {
                    \Log::error('Erreur upload PDF publication update: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du PDF',
                        'message' => $e->getMessage()
                    ], 500);
                }
            }

            $publication->update($updateData);

            return response()->json(['message' => 'Publication mise à jour', 'publication' => $publication]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erreur validation publication: ' . json_encode($e->errors()));
            return response()->json([
                'error' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur updatePublication: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la mise à jour de la publication',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deletePublication($type, $id)
    {
        if (!in_array($type, ['cajj', 'partners'])) {
            return response()->json(['error' => 'Type invalide'], 400);
        }

        Publication::where('type', $type)->findOrFail($id)->delete();
        return response()->json(['message' => 'Publication supprimée']);
    }

    public function togglePublicationVisibility(Request $request, $type, $id)
    {
        if (!in_array($type, ['cajj', 'partners'])) {
            return response()->json(['error' => 'Type invalide'], 400);
        }

        $publication = Publication::where('type', $type)->findOrFail($id);
        $publication->visible = $request->input('visible', true);
        $publication->save();

        return response()->json([
            'message' => $publication->visible ? 'Publication publiée' : 'Publication masquée',
            'publication' => $publication,
        ]);
    }

    // ========== SECTION "NOUS CONNAÎTRE" ==========

    public function getAbout()
    {
        $sections = AboutSection::all()->map(function ($section) {
            return [
                'id' => $section->section_id,
                'title' => $section->title,
                'content' => $section->content,
            ];
        });

        return response()->json(['sections' => $sections]);
    }

    public function updateAboutSection(Request $request, $id)
    {
        $section = AboutSection::where('section_id', $id)->firstOrFail();

        $request->validate([
            'title' => 'nullable|string',
            'content' => 'nullable|string',
        ]);

        $section->update($request->only(['title', 'content']));

        return response()->json([
            'message' => 'Section mise à jour',
            'section' => [
                'id' => $section->section_id,
                'title' => $section->title,
                'content' => $section->content,
            ],
        ]);
    }

    // ========== ACTIONS ==========

    public function getActions()
    {
        $actions = Action::orderBy('order', 'asc')->get();
        return response()->json($actions);
    }

    public function updateAction(Request $request, $id)
    {
        $action = Action::where('action_id', $id)->firstOrFail();

        $request->validate([
            'title' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'order' => 'sometimes|integer',
        ]);

        $action->update($request->only(['title', 'description', 'order']));

        return response()->json([
            'message' => 'Action mise à jour',
            'action' => $action,
        ]);
    }

    // ========== DOCUMENTATION ==========

    public function getDocumentations()
    {
        $documentations = Documentation::orderBy('created_at', 'desc')->get();
        return response()->json($documentations);
    }

    public function createDocumentation(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string',
                'description' => 'nullable|string',
                'pdf' => 'required|file|mimes:pdf|max:102400', // 100MB
            ]);

            $pdfUrl = null;

            // Gérer l'upload du PDF
            if ($request->hasFile('pdf')) {
                try {
                    $pdfFile = $request->file('pdf');
                    $pdfUrl = $this->uploadFile($pdfFile, 'pdfs');
                } catch (\Exception $e) {
                    \Log::error('Erreur upload PDF documentation: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du PDF',
                        'message' => $e->getMessage()
                    ], 500);
                }
            }

            $documentation = Documentation::create([
                'title' => $request->title,
                'description' => $request->description ?? null,
                'pdf_url' => $pdfUrl,
                'visible' => true,
            ]);

            return response()->json(['message' => 'Documentation ajoutée', 'documentation' => $documentation]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erreur de validation', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur createDocumentation: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la création de la documentation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function updateDocumentation(Request $request, $id)
    {
        try {
            $documentation = Documentation::findOrFail($id);

            $request->validate([
                'title' => 'sometimes|required|string',
                'description' => 'nullable|string',
                'pdf' => 'nullable|file|mimes:pdf|max:102400', // 100MB
                'remove_pdf' => 'nullable|boolean',
            ]);

            $updateData = $request->only(['title', 'description', 'visible']);

            // Gérer la suppression du PDF
            if ($request->input('remove_pdf', false)) {
                // Supprimer l'ancien fichier PDF s'il existe
                if ($documentation->pdf_url) {
                    $oldPath = str_replace('/storage/', '', $documentation->pdf_url);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $updateData['pdf_url'] = null;
            }

            // Gérer l'upload d'un nouveau PDF
            if ($request->hasFile('pdf')) {
                try {
                    // Supprimer l'ancien fichier PDF s'il existe
                    if ($documentation->pdf_url) {
                        $oldPath = str_replace('/storage/', '', $documentation->pdf_url);
                        if (Storage::disk('public')->exists($oldPath)) {
                            Storage::disk('public')->delete($oldPath);
                        }
                    }

                    $pdfFile = $request->file('pdf');
                    $updateData['pdf_url'] = $this->uploadFile($pdfFile, 'pdfs');
                } catch (\Exception $e) {
                    \Log::error('Erreur upload PDF documentation update: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du PDF',
                        'message' => $e->getMessage()
                    ], 500);
                }
            }

            $documentation->update($updateData);

            return response()->json(['message' => 'Documentation mise à jour', 'documentation' => $documentation]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Erreur de validation', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur updateDocumentation: ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de la mise à jour de la documentation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteDocumentation($id)
    {
        $documentation = Documentation::findOrFail($id);

        // Supprimer le fichier PDF s'il existe
        if ($documentation->pdf_url) {
            $oldPath = str_replace('/storage/', '', $documentation->pdf_url);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $documentation->delete();

        return response()->json(['message' => 'Documentation supprimée']);
    }

    public function toggleDocumentationVisibility(Request $request, $id)
    {
        $documentation = Documentation::findOrFail($id);
        $documentation->visible = $request->input('visible', true);
        $documentation->save();

        return response()->json([
            'message' => $documentation->visible ? 'Documentation publiée' : 'Documentation masquée',
            'documentation' => $documentation,
        ]);
    }
}