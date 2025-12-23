<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement; // Assurez-vous que ce modèle existe
use Illuminate\Support\Facades\Log;
use Exception;

class AnnouncementController extends Controller
{
    /**
     * Afficher la liste des annonces
     */
    public function index()
    {
        try {
            $announcements = Announcement::orderBy('created_at', 'desc')->get();
            return response()->json($announcements, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Erreur lors de la récupération des annonces'], 500);
        }
    }

    /**
     * Enregistrer une nouvelle annonce
     */
    public function store(Request $request)
    {
        try {
            // 1. Validation des données
            $validatedData = $request->validate([
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
                'target'      => 'required|string', // 'Member', 'Coach', ou 'All'
                'user_id'     => 'nullable|integer' 
            ]);

            // 2. Création de l'annonce
            // Si user_id n'est pas fourni, on peut mettre 1 par défaut (ID de l'admin)
            $announcement = Announcement::create([
                'title'       => $validatedData['title'],
                'description' => $validatedData['description'],
                'target'      => $validatedData['target'],
                'user_id'     => $validatedData['user_id'] ?? 1, 
            ]);

            return response()->json([
                'message' => 'Annonce créée avec succès',
                'data' => $announcement
            ], 201);

        } catch (Exception $e) {
            // Log de l'erreur pour le développeur (storage/logs/laravel.log)
            Log::error("Erreur Store Announcement: " . $e->getMessage());

            return response()->json([
                'error' => 'Échec de la création',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modifier une annonce existante
     */
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

    /**
     * Supprimer une annonce
     */
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