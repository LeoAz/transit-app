<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HolidayController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('referential/holidays/index', [
            'holidays' => Holiday::latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => 'required|date|unique:holidays,date',
            'label' => 'required|string|max:255',
        ]);

        Holiday::create($validated);

        return back()->with('success', 'Jour férié créé avec succès.');
    }

    public function update(Request $request, Holiday $holiday): RedirectResponse
    {
        $validated = $request->validate([
            'date' => 'required|date|unique:holidays,date,'.$holiday->id,
            'label' => 'required|string|max:255',
        ]);

        $holiday->update($validated);

        return back()->with('success', 'Jour férié mis à jour avec succès.');
    }

    public function destroy(Holiday $holiday): RedirectResponse
    {
        $holiday->delete();

        return back()->with('success', 'Jour férié supprimé avec succès.');
    }
}
