<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Documentation extends Model
{
    protected $fillable = ['title', 'description', 'pdf_url', 'visible'];
    
    protected $casts = [
        'visible' => 'boolean',
    ];
}
