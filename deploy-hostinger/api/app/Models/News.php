<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = ['title', 'content', 'author', 'date', 'visible', 'media_url', 'media_type'];
    
    protected $casts = [
        'date' => 'datetime',
        'visible' => 'boolean',
    ];
}
