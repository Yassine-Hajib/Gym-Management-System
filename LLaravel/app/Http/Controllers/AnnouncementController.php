<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Announcement; 
use Illuminate\Support\Facades\Log;
use Exception; //a class

class AnnouncementController extends Controller
{

    public function index()
    {
        try {
            $announcements = Announcement::orderBy('created_at', 'desc')->get();
            return response()->json($announcements, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des annonces'], 500);
        }
    }

 
public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'title'       => 'required|string',
                'description' => 'required|string',
                'target'      => 'required|string',
                'user_id'     => 'nullable' 
            ]);

            $announcement = Announcement::create([
                'title'       => $validatedData['title'],
                'description' => $validatedData['description'],
                'target'      => $validatedData['target'],
                'user_id'     => $request->user_id ?? 1, 
            ]);

            return response()->json($announcement, 201);

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Server Error',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        try {
            $announcement = Announcement::findOrFail($id);

            $validatedData = $request->validate([
                'title'       => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'target'      => 'sometimes|string',
            ]);

            $announcement->update($validatedData);

            return response()->json([
                'message' => 'Annonce mise à jour avec succès',
                'data' => $announcement
            ], 200);

        } catch (Exception $e) {
            return response()->json(['error' => 'Échec de la modification'], 500);
        }
    }


    public function destroy($id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
            $announcement->delete();

            return response()->json(['message' => 'Annonce supprimée'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Échec de la suppression'], 500);
        }
    }
}