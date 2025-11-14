<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $fillable = ['type', 'title', 'name', 'description', 'url', 'visible'];
    
    protected $casts = [
        'visible' => 'boolean',
    ];
}
