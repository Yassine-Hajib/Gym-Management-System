<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);


// Member Management
Route::get('/members', [UserController::class, 'index']);
Route::post('/members', [UserController::class, 'store']);
Route::put('/members/{id}', [UserController::class, 'update']);
Route::delete('/members/{id}', [UserController::class, 'destroy']);

// Dashboard Stats
Route::get('/dashboard-stats', [UserController::class, 'getDashboardStats']);


// Routes for Finance Management
Route::post('/payments', [PaymentController::class, 'store']);

Route::post('/expenses', [ExpenseController::class, 'store']);