<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Progression extends Model
{
    protected $fillable = [
    'user_id',
     'weight', 
    'date', 
    'image_path'
];
}