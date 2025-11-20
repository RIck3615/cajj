<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use App\Models\Photo;
use App\Models\Video;
use App\Models\Publication;
use App\Models\AboutSection;
use App\Models\Action;

class PublicController extends Controller
{
    public function health()
    {
        return response()->json([
            'name' => 'Centre d\'Aide Juridico Judiciaire CAJJ ASBL',
            'message' => 'API CAJJ opérationnelle',
        ]);
    }

    public function about()
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

    public function actions()
    {
        $actions = Action::orderBy('order', 'asc')->get()->map(function ($action) {
            return [
                'id' => $action->action_id,
                'title' => $action->title,
                'description' => $action->description,
            ];
        });

        return response()->json($actions);
    }

    public function publications()
    {
        $cajj = Publication::where('type', 'cajj')
            ->where('visible', true)
            ->get()
            ->map(function ($pub) {
                return [
                    'id' => (string) $pub->id,
                    'title' => $pub->title,
                    'description' => $pub->description,
                    'url' => $pub->url,
                    'media_url' => $pub->media_url,
                    'media_type' => $pub->media_type,
                ];
            });

        $partners = Publication::where('type', 'partners')
            ->where('visible', true)
            ->get()
            ->map(function ($pub) {
                return [
                    'id' => (string) $pub->id,
                    'name' => $pub->name,
                    'description' => $pub->description,
                    'url' => $pub->url,
                    'media_url' => $pub->media_url,
                    'media_type' => $pub->media_type,
                ];
            });

        return response()->json([
            'cajj' => $cajj,
            'partners' => $partners,
        ]);
    }

    public function news()
    {
        $news = News::where('visible', true)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => (string) $item->id,
                    'title' => $item->title,
                    'content' => $item->content,
                    'date' => $item->date->toISOString(),
                    'author' => $item->author,
                    'media_url' => $item->media_url,
                    'media_type' => $item->media_type,
                ];
            });

        return response()->json($news);
    }

    public function gallery()
    {
        $photos = Photo::where('visible', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($photo) {
                return [
                    'id' => (string) $photo->id,
                    'title' => $photo->title,
                    'description' => $photo->description,
                    'url' => $photo->url,
                ];
            });

        $videos = Video::where('visible', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($video) {
                return [
                    'id' => (string) $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'url' => $video->url,
                ];
            });

        return response()->json([
            'photos' => $photos,
            'videos' => $videos,
        ]);
    }

    public function contact(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        // Ici, vous pouvez ajouter l'envoi d'email ou la sauvegarde en base
        return response()->json([
            'status' => 'received',
            'data' => $request->only(['name', 'email', 'message']),
        ], 202);
    }
}
