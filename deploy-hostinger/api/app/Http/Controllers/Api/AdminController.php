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
            $file = $request->file('media');
            $mimeType = $file->getMimeType();
            
            // Déterminer le type de média
            if (str_starts_with($mimeType, 'image/')) {
                $mediaType = 'image';
                $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('photos', $filename, 'public');
                $mediaUrl = '/storage/' . $path;
            } elseif (str_starts_with($mimeType, 'video/')) {
                $mediaType = 'video';
                $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('videos', $filename, 'public');
                $mediaUrl = '/storage/' . $path;
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
    }
    
    public function updateNews(Request $request, $id)
    {
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
            // Supprimer l'ancien fichier s'il existe
            if ($news->media_url) {
                $oldPath = str_replace('/storage/', '', $news->media_url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            
            $file = $request->file('media');
            $mimeType = $file->getMimeType();
            
            // Déterminer le type de média
            if (str_starts_with($mimeType, 'image/')) {
                $mediaType = 'image';
                $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('photos', $filename, 'public');
                $updateData['media_url'] = '/storage/' . $path;
                $updateData['media_type'] = 'image';
            } elseif (str_starts_with($mimeType, 'video/')) {
                $mediaType = 'video';
                $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('videos', $filename, 'public');
                $updateData['media_url'] = '/storage/' . $path;
                $updateData['media_type'] = 'video';
            }
        }
        
        $news->update($updateData);
        
        return response()->json(['message' => 'Actualité mise à jour', 'news' => $news]);
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
        $request->validate([
            'file' => 'required|image|max:51200', // 50MB
            'title' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        
        $file = $request->file('file');
        $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('photos', $filename, 'public');
        
        $photo = Photo::create([
            'title' => $request->title ?? $file->getClientOriginalName(),
            'description' => $request->description ?? '',
            'url' => '/storage/' . $path,
            'filename' => $filename,
            'visible' => true,
        ]);
        
        return response()->json(['message' => 'Photo ajoutée', 'photo' => $photo]);
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
        $request->validate([
            'file' => 'nullable|file|mimes:mp4,mov,avi,webm|max:51200', // 50MB
            'url' => 'nullable|url',
            'title' => 'nullable|string',
            'description' => 'nullable|string',
        ]);
        
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('videos', $filename, 'public');
            
            $video = Video::create([
                'title' => $request->title ?? $file->getClientOriginalName(),
                'description' => $request->description ?? '',
                'url' => '/storage/' . $path,
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
                ]);
            } else {
                $request->validate([
                    'name' => 'required|string',
                    'description' => 'nullable|string',
                    'url' => 'nullable|url',
                    'media' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,mp4,avi,mov,wmv|max:102400', // 100MB
                ]);
            }
            
            $mediaUrl = null;
            $mediaType = null;
            
            // Gérer l'upload du média (image ou vidéo)
            if ($request->hasFile('media')) {
                try {
                    $file = $request->file('media');
                    $mimeType = $file->getMimeType();
                    
                    // Déterminer le type de média
                    if (str_starts_with($mimeType, 'image/')) {
                        $mediaType = 'image';
                        $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                        $path = $file->storeAs('photos', $filename, 'public');
                        $mediaUrl = '/storage/' . $path;
                    } elseif (str_starts_with($mimeType, 'video/')) {
                        $mediaType = 'video';
                        $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                        $path = $file->storeAs('videos', $filename, 'public');
                        $mediaUrl = '/storage/' . $path;
                    }
                } catch (\Exception $e) {
                    Log::error('Erreur upload média publication: ' . $e->getMessage());
                    return response()->json([
                        'error' => 'Erreur lors de l\'upload du fichier',
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
                ]);
            } else {
                $request->validate([
                    'name' => 'sometimes|required|string',
                    'description' => 'nullable|string',
                    'url' => 'nullable|url',
                    'media' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp,mp4,avi,mov,wmv|max:102400', // 100MB
                    'remove_media' => 'nullable|boolean',
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
                // Supprimer l'ancien fichier s'il existe
                if ($publication->media_url) {
                    $oldPath = str_replace('/storage/', '', $publication->media_url);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                
                $file = $request->file('media');
                $mimeType = $file->getMimeType();
                
                // Déterminer le type de média
                if (str_starts_with($mimeType, 'image/')) {
                    $mediaType = 'image';
                    $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('photos', $filename, 'public');
                    $updateData['media_url'] = '/storage/' . $path;
                    $updateData['media_type'] = 'image';
                } elseif (str_starts_with($mimeType, 'video/')) {
                    $mediaType = 'video';
                    $filename = time() . '-' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('videos', $filename, 'public');
                    $updateData['media_url'] = '/storage/' . $path;
                    $updateData['media_type'] = 'video';
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
}
