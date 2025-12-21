<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Annonce extends Model
{
    protected $fillable = [
        'title',
        'description',
        'target',
    ];
     public function user()
    {
        return $this->hasMany(User::class);
    }
}