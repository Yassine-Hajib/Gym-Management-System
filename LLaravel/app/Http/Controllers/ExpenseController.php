<?php

namespace App\Http\Controllers;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    
    public function index()
    {
        
        $expenses = Expense::orderBy('expense_date', 'desc')->get();    
        return response()->json($expenses);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'description'  => 'required|string|max:255',
            'amount'       => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
        ]);

        $expense = Expense::create([ 
            'description'  => $validated['description'],
            'amount'       => $validated['amount'],
            'expense_date' => $validated['expense_date'],
            'user_id'      => Auth::id() ?? 1 
        ]);

        return response()->json([
            'message' => 'Dépense enregistrée avec succès',
            'expense' => $expense
        ], 201);
    }

    
    public function show(Expense $expense) 
    {
        return response()->json($expense);
    }

    
    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'description'  => 'required|string|max:255',
            'amount'       => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
        ]);
        
        $expense->update($validated);

        return response()->json([
            'message' => 'Dépense mise à jour avec succès',
            'expense' => $expense
        ], 200);
    }

    
    public function destroy(Expense $expense)
    {
        $expense->delete();

        return response()->json(['message' => 'Dépense supprimée avec succès'], 200);
    }
}