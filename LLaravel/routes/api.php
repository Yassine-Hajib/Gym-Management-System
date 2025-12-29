<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ProgressionController;


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users', [UserController::class, 'index']); 


Route::get('/members', [UserController::class, 'index']);
Route::post('/members', [UserController::class, 'store']);


Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);


Route::get('/dashboard-stats', [UserController::class, 'getDashboardStats']);
Route::post('/payments', [PaymentController::class, 'store']); 
Route::get('/payments/{userId}', [PaymentController::class, 'getUserPayments']); 
Route::post('/expenses', [ExpenseController::class, 'store']); 


Route::get('/users-coaches', [UserController::class, 'getCoaches']);
Route::post('/users-coaches', [UserController::class, 'storeCoach']);


Route::middleware('auth:sanctum')->get('/dashboard-stats', [UserController::class, 'getDashboardStats']);

Route::get('/progressions/{userId}', [ProgressionController::class, 'index']);
Route::post('/progressions', [ProgressionController::class, 'store']);

Route::put('/members/{id}', [UserController::class, 'update']);
Route::delete('/members/{id}', [UserController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});