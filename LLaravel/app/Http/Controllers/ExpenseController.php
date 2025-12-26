<?php
namespace App\Http\Controllers;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    
    public function index()
    {
        $expenses = Expense::orderBy('expense_date', 'desc')->get();
        return view('admin.finance.expenses.index', compact('expenses')); 
    }

    public function create()
    {
        return view('admin.finance.expenses.create'); // Formulaire de création de dépense
    }
    
    
  public function store(Request $request)
{
    $request->validate([
        'description'  => 'required|string',
        'amount'       => 'required|numeric',
        'expense_date' => 'required|date',
    ]);

    
    $expense = Expense::create([ 
        'description'  => $request->description,
        'amount'       => $request->amount,
        'expense_date' => $request->expense_date,
        'user_id'      => 1 
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