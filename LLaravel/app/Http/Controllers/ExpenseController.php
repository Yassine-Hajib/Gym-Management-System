<?php
namespace App\Http\Controllers;
use App\Models\expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    
    public function index()
    {
        $expenses = expense::orderBy('expense_date', 'desc')->get(); 
        return view('admin.finance.expenses.index', compact('expenses'));
    }
    public function create()
    {
        return view('admin.finance.expenses.create'); 
    }
    
    public function store(Request $request) {
    $request->validate([
        'description' => 'required|string',
        'amount' => 'required|numeric',
        'date' => 'required|date'
    ]);

    $expense = \App\Models\expenses::create([
        'description' => $request->description,
        'amount' => $request->amount,
        'date' => $request->date,
    ]);

    return response()->json($expense, 201);
}

    public function show(Expense $expense)
    {
        return view('admin.finance.expenses.show', compact('expense'));
    }

    public function edit(Expense $expense)
    {
        return view('admin.finance.expenses.edit', compact('expense'));
    }

    public function update(Request $request, Expense $expense)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
           
        ]);
        
        $expense->update($request->all());
        return redirect()->route('expenses.index')->with('success', 'Dépense mise à jour.');
    }
    public function destroy(Expense $expense)
    {
        $expense->delete();
        return redirect()->route('expenses.index')->with('success', 'Dépense supprimée.');
    }
}