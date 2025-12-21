<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Get only Members for the GestionMember page
     */
    public function index()
    {
        // Fetch only users who are members
        $members = User::where('role', 'member')->get(); 
        return response()->json($members);
    }

    /**
     * Stats for the Owner Dashboard cards
     */
    public function getDashboardStats()
    {
        return response()->json([
         'memberCount' => User::where('role', 'member')->count(),
         'coachCount'  => User::where('role', 'coach')->count(),
         'totalRevenue' => 120000, 
         'totalExpenses' => 45000, 
]);
    }

    public function store(Request $request)
{
    $request->validate([
        'name'  => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'phone' => 'required',
        'dob'   => 'required|date|before:today', // 1. Ensures it's a real date and not in the future
    ]);

    try {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make('member123'),
            'role'     => 'member',
            'phone'    => $request->phone,
            'dob'      => $request->dob,
        ]);

        return response()->json($user, 201);
        
    } catch (\Exception $e) {
        // 2. This catches the SQL error and returns a clean message instead of a crash
        return response()->json(['message' => 'Invalid data format provided.'], 500);
    }
}

  
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'nullable|string',
            'dob' => 'nullable|date',
        ]);
        
        $user->update($request->only(['name', 'email', 'phone', 'dob']));

        return response()->json([
            'message' => 'Member updated successfully',
            'user' => $user
        ]);
    }

   
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        
        return response()->json(['message' => 'Member deleted successfully']);
    }
}