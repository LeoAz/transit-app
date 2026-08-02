<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('referential/products/index', [
            'products' => Product::latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:products,code',
            'label' => 'required|string|max:255',
            'category' => 'nullable|string',
        ]);

        Product::create($validated);

        return back()->with('success', 'Produit créé avec succès.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:products,code,'.$product->id,
            'label' => 'required|string|max:255',
            'category' => 'nullable|string',
        ]);

        $product->update($validated);

        return back()->with('success', 'Produit mis à jour avec succès.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Produit supprimé avec succès.');
    }
}
