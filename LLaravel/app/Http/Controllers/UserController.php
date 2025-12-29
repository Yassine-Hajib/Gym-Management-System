<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Expense;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function index()
    {
        $members = User::where('role', 'member')->get(); 
        return response()->json($members);
    }




public function getDashboardStats()  
{
    $totalRevenue = \App\Models\Payment::sum('amount') ?: 0; 
    $totalExpenses = \App\Models\Expense::sum('amount') ?: 0;

    $profit = $totalRevenue - $totalExpenses;

    return response()->json([ 
        'totalRevenue'  => (float) $totalRevenue,
        'totalExpenses' => (float) $totalExpenses,
        'profit'        => (float) $profit,
        'memberCount'   => \App\Models\User::where('role', 'member')->count(),
        'coachCount'    => \App\Models\User::where('role', 'coach')->count(),
        'paidThisMonth' => \App\Models\Payment::whereMonth('payment_date', now()->month)->count(),
    ]);
}





    public function store(Request $request)
{
    $request->validate([
        'name'  => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'phone' => 'required',
        'dob'   => 'required|date|before:today',
    ]);

    $user = User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'phone'    => $request->phone,
        'dob'      => $request->dob,
        'role'     => 'member',              // ✅ OBLIGATOIRE
        'password' => Hash::make('gym9'),    // ✅ OBLIGATOIRE
    ]);

    return response()->json($user, 201);
}

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id); // Trouver l'utilisateur par ID

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



    public function getCoaches() 
{
    $coaches = User::where('role', 'coach')->get(); 
    return response()->json($coaches); 
}

public function storeCoach(Request $request)
{
    $request->validate([
        'name'  => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'phone' => 'required',
    ]);

    $user = User::create([  //creation d'un coach
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => Hash::make('coach123'), 
        'role'     => 'coach',
        'phone'    => $request->phone,
    ]);

    return response()->json($user, 201);
}
   
public function destroy($id)
    {
        $user = User::findOrFail($id); 
        $user->delete();
        
        return response()->json(['message' => 'Member deleted successfully']);
    }
}