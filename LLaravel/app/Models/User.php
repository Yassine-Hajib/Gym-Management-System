<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable; 

     protected $fillable = [
    'name', 
    'email', 
    'password', 
    'role', 
    'phone', 
    'dob',
];
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function coach()
    {
        return $this->belongsTo(User::class, 'coach_id');  // member belongs to a coach
    }

    public function members() 
    { 
        return $this->hasMany(User::class, 'coach_id'); 
    }


    public function payments()
    {
        return $this->hasMany(Payment::class);   
    }


    public function announcements()
    {
        return $this->hasMany(Annonce::class, 'user_id');
    }
    
    
    public function Expenses()
    {
        return $this->hasMany(Expenses::class, 'user_id');
    }
}