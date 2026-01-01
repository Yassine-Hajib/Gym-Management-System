<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Progression;
use Illuminate\Support\Facades\Storage;

class ProgressionController extends Controller
{
   
    public function index($userId) 
    {
        return response()->json(
            Progression::where('user_id', $userId)->orderBy('date', 'desc')->get()
        );
    }
  
    public function store(Request $request)
    {
        $request->validate([
            'weight'  => 'required|numeric',
            'date'    => 'required|date',
            'user_id' => 'required|exists:users,id',
            'image'   => 'nullable|image|mimes:jpeg,png,jpg|max:2048' // Max 2MB
        ]);

        $imagePath = null; 
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('progressions', 'public');
        }

        $progression = Progression::create([
            'user_id'    => $request->user_id,
            'weight'     => $request->weight,
            'date'       => $request->date,
            'image_path' => $imagePath,
        ]);

        return response()->json($progression, 201);
    }
}