<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = ['title', 'description', 'url', 'filename', 'visible'];
    
    protected $casts = [
        'visible' => 'boolean',
    ];
}
