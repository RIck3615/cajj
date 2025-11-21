<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $fillable = ['type', 'title', 'name', 'description', 'url', 'visible', 'media_url', 'media_type', 'pdf_url'];
    
    protected $casts = [
        'visible' => 'boolean',
    ];
}
