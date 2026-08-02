<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(): Response
    {
        return Inertia::render('users/index', [
            'users' => User::with('preferences')->latest()->get(),
            'roles' => collect(UserRole::cases())->map(fn (UserRole $role) => [
                'value' => $role->value,
                'label' => $role->label(),
            ]),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::enum(UserRole::class)],
            'code' => ['nullable', 'string', 'max:255', 'unique:'.User::class],
            'phone' => ['nullable', 'string', 'max:255'],
            'zone' => ['nullable', 'string', 'max:255', Rule::requiredIf($request->role === UserRole::SHIPPER->value)],
            'preferences' => ['nullable', 'array'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'code' => $validated['code'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'zone' => $validated['zone'] ?? null,
        ]);

        if ($request->has('preferences')) {
            $user->preferences()->create($validated['preferences']);
        }

        return back()->with('success', 'Utilisateur créé avec succès.');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role' => ['required', Rule::enum(UserRole::class)],
            'code' => ['nullable', 'string', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:255'],
            'zone' => ['nullable', 'string', 'max:255', Rule::requiredIf($request->role === UserRole::SHIPPER->value)],
            'preferences' => ['nullable', 'array'],
        ]);

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'code' => $validated['code'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'zone' => $validated['zone'] ?? null,
        ]);

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        if ($request->has('preferences')) {
            $user->preferences()->updateOrCreate([], $validated['preferences']);
        }

        return back()->with('success', 'Utilisateur mis à jour avec succès.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return back()->with('success', 'Utilisateur supprimé avec succès.');
    }
}
