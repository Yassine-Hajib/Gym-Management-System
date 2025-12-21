<?php
namespace App\Http\Controllers;
use App\Models\depense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    
    public function index()
    {
        $depenses = depense::orderBy('depense_date', 'desc')->get(); 
        return view('admin.finance.depenses.index', compact('depenses'));
    }
    public function create()
    {
        return view('admin.finance.depenses.create'); 
    }
    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
        ]);
        
        Expense::create($request->all());

        return redirect()->route('depenses.index')->with('success', 'Dépense enregistrée.');
    }

    public function show(Expense $expense)
    {
        return view('admin.finance.depenses.show', compact('expense'));
    }

    public function edit(Expense $expense)
    {
        return view('admin.finance.depenses.edit', compact('expense'));
    }

    public function update(Request $request, Expense $expense)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
           
        ]);
        
        $expense->update($request->all());
        return redirect()->route('depenses.index')->with('success', 'Dépense mise à jour.');
    }
    public function destroy(Expense $expense)
    {
        $expense->delete();
        return redirect()->route('depenses.index')->with('success', 'Dépense supprimée.');
    }
}