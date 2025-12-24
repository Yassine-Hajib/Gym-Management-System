<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    // Assurez-vous que ces 4 champs sont exactement comme ceci
    protected $fillable = ['title', 
    'description',
     'target', 
     'user_id'
    ];
}