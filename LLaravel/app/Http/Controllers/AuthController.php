<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class AuthController 
{
    public function signup(Request $request) {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:3',
            'role' => 'required'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json(['message' => 'User created!', 'user' => $user], 201);
    }

    public function login(Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (\Illuminate\Support\Facades\Auth::attempt($request->only('email', 'password'))){ 
        $user = \Illuminate\Support\Facades\Auth::user();
        $token = $user->createToken('token')->plainTextToken;
        
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    return response()->json(['message' => 'The provided credentials do not match our records.'], 401);
}



}