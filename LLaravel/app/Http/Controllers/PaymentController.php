<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
   
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'owner') {
                           // Owner voit toutes les transactions 
            $payments = Payment::with('user')->orderBy('payment_date', 'desc')->get();
        } else {
             // Membre et Coach voit uniquement ses propres transactions
            $payments = $user->payments()->orderBy('payment_date', 'desc')->get();
        }

        return view('payments.index', compact('payments'));
    }

    
    public function create()
    {
        $users = User::where('role', '!=', 'owner')->get();
        return view('admin.payments.create', compact('users'));
    }

    
public function store(Request $request)
{
    // 1. On valide tous les champs envoyés par React
    $validated = $request->validate([
        'user_id'      => 'required|exists:users,id',
        'amount'       => 'required|numeric',
        'status'       => 'required|string',
        'payment_date' => 'nullable|date', // Optionnel, sinon on utilise la date du jour
        'description'  => 'nullable|string'
    ]);

    // 2. On crée le paiement avec les données validées
    $payment = Payment::create([
        'user_id'      => $validated['user_id'],
        'amount'       => $validated['amount'],
        'status'       => $validated['status'],
        'payment_date' => $validated['payment_date'] ?? now(), // Date actuelle si vide
        'description'  => $validated['description'] ?? 'Membership Payment',
    ]);

    // 3. On retourne une réponse JSON claire
    return response()->json([
        'message' => 'Paiement enregistré avec succès',
        'payment' => $payment
    ], 201);
}

    

    public function show(Payment $payment)
    {
        
        if (Auth::user()->role !== 'owner' && Auth::id() !== $payment->user_id) {
            abort(403, 'Accès non autorisé à cette transaction.'); 
        }
        return view('payments.show', compact('payment'));
    }
  
    public function edit(Payment $payment)
    {
        //récupuration de la liste ds utilisateurs
        $users = User::where('role', '!=', 'owner')->get();
        return view('admin.payments.edit', compact('payment', 'users'));
    }

    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:membership_fee,coach_salary',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        $payment->update($request->all());

        return redirect()->route('payments.index')->with('success', 'Transaction mise à jour avec succès.');
    }

   
    public function destroy(Payment $payment)
    {
        $payment->delete();

        return redirect()->route('payments.index')->with('success', 'La transaction a été supprimée.');
    }

    

}
