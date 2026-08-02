<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('referential/customers/index', [
            'customers' => Customer::latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:customers,code',
            'company_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'contact' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'tax_id' => 'nullable|string',
        ]);

        Customer::create($validated);

        return back()->with('success', 'Client créé avec succès.');
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:customers,code,'.$customer->id,
            'company_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'contact' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'tax_id' => 'nullable|string',
        ]);

        $customer->update($validated);

        return back()->with('success', 'Client mis à jour avec succès.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();

        return back()->with('success', 'Client supprimé avec succès.');
    }
}
