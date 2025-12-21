<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    
    public function index()
    {
        $users = User::where('role', '!=', 'owner')->get(); 
        return view('admin.users.index', compact('users'));
    }

    public function create()
    {
        // Nécessaire pour l'assignation d'un coach à un membre
        $coaches = User::where('role', 'coach')->get();
        return view('admin.users.create', compact('coaches'));
    }

    
    public function store(Request $request)
    {
        $request->validate([     
            'name' => 'required|string|max:255', 
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:member,coach',
            'coach_id' => 'nullable|exists:users,id',
        ]);

        User::create([  
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'coach_id' => $request->coach_id,
        ]);

        return redirect()->route('users.index')->with('success', 'Utilisateur créé avec succès.');
    }

   
    public function show(User $user) {
        // Charger les relations (paiements, membres coachés, progression)
        $user->load(['payments', 'members', 'progressEntries']); 
        return view('admin.users.show', compact('user'));
    }

    public function edit(User $user) {
        $coaches = User::where('role', 'coach')->get();
        return view('admin.users.edit', compact('user', 'coaches'));
    }

  
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:member,coach',
            'coach_id' => 'nullable|exists:users,id',
        ]);
        
        $user->update($request->except('password'));

        return redirect()->route('users.show', $user)->with('success', 'Informations mises à jour.');
    }

   
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'Utilisateur supprimé.');
    }
}