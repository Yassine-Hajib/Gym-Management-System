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
    /**
     * Get only Members for the GestionMember page
     */
    public function index()
    {
        // Fetch only users who are members
        $members = User::where('role', 'member')->get(); 
        return response()->json($members);
    }


public function getDashboardStats()
{
    // Sum from Payments table (Member payments = Revenue)
    $totalRevenue = \App\Models\Payment::sum('amount') ?: 0;
    
    // Sum from Expenses table (General expenses + Coach salaries = Expenses)
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
        'dob'   => 'required|date|before:today', // 1. Ensures it's a real date and not in the future
    ]);

    try {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password ? Hash::make($request->password) : Hash::make('gym9'),
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