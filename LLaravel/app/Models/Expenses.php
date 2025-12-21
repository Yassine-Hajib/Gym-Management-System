<?php

namespace App\Http\Controllers;

use App\Models\expenses;
use Illuminate\Http\Request;

class expenseController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'description'  => 'required|string',
                'amount'       => 'required|numeric',
                'expense_date' => 'required|date',
            ]);

            $expense = expenses::create([
                'description'  => $request->description,
                'amount'       => $request->amount,
                'expense_date' => $request->expense_date,
            ]);

            return response()->json($expense, 201);

        } catch (\Exception $e) {

            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}