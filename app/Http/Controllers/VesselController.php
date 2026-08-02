<?php

namespace App\Http\Controllers;

use App\Models\Vessel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VesselController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('referential/vessels/index', [
            'vessels' => Vessel::latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'flag' => 'nullable|string|max:255',
        ]);

        Vessel::create($validated);

        return back()->with('success', 'Navire créé avec succès.');
    }

    public function update(Request $request, Vessel $vessel): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'flag' => 'nullable|string|max:255',
        ]);

        $vessel->update($validated);

        return back()->with('success', 'Navire mis à jour avec succès.');
    }

    public function destroy(Vessel $vessel): RedirectResponse
    {
        $vessel->delete();

        return back()->with('success', 'Navire supprimé avec succès.');
    }
}
