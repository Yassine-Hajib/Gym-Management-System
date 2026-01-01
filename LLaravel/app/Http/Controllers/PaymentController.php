<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    // Récupérer la liste des paiements (JSON pour le tableau React)
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'owner') {
            // L'Owner voit tout avec les infos de l'utilisateur relié
            $payments = Payment::with('user')->orderBy('payment_date', 'desc')->get();
        } else {
            // Le Membre/Coach ne voit que ses transactions
            $payments = $user->payments()->orderBy('payment_date', 'desc')->get();
        }

        return response()->json($payments);
    }

    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'      => 'required|exists:users,id',
            'amount'       => 'required|numeric',
            'status'       => 'required|string',
            'payment_date' => 'required|date',
            'description'  => 'nullable|string',
        ]);

        $payment = Payment::create([
            'user_id'      => $validated['user_id'],
            'amount'       => $validated['amount'],
            'status'       => $validated['status'],
            'payment_date' => $validated['payment_date'],
            'description'  => $validated['description'] ?? 'Paiement Mensuel',
        ]);

        return response()->json([
            'message' => 'Paiement créé avec succès','payment' => $payment], 201);
    }

    
    public function show(Payment $payment)
    {
        
        if (Auth::user()->role !== 'owner' && Auth::id() !== $payment->user_id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return response()->json($payment);
    }


    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'user_id'      => 'required|exists:users,id',
            'amount'       => 'required|numeric|min:0.01',
            'status'       => 'required|string',
            'payment_date' => 'required|date',
            'description'  => 'nullable|string|max:255',
        ]);

        $payment->update($validated);

        return response()->json([
            'message' => 'Transaction mise à jour avec succès',
            'payment' => $payment
        ], 200);
    }


    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json([
            'message' => 'La transaction a été supprimée avec succès'], 200);
    }
}