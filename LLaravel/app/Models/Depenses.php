<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Depenses extends Model
{
    protected $fillable = [
        'description',
        'amount',
        'expense_date',
    ];
    public function user()
    {
        return $this->hasMany(User::class);
    }
}