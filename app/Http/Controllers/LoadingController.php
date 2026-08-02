<?php

namespace App\Http\Controllers;

use App\Actions\RecalculateFolderStatus;
use App\Http\Requests\StoreLoadingRequest;
use App\Models\Folder;
use App\Models\Loading;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LoadingController extends Controller
{
    public function __construct(
        protected RecalculateFolderStatus $recalculateFolderStatus
    ) {}

    /**
     * Store a newly created loading.
     */
    public function store(StoreLoadingRequest $request, Folder $folder): RedirectResponse
    {
        DB::transaction(function () use ($request, $folder) {
            $folder->loadings()->create(array_merge(
                $request->validated(),
                ['user_id' => Auth::id()]
            ));

            $this->recalculateFolderStatus->execute($folder);
        });

        return back()->with('success', 'Chargement enregistré avec succès.');
    }

    /**
     * Update the specified loading.
     */
    public function update(StoreLoadingRequest $request, Folder $folder, Loading $loading): RedirectResponse
    {
        DB::transaction(function () use ($request, $folder, $loading) {
            $loading->update($request->validated());
            $this->recalculateFolderStatus->execute($folder);
        });

        return back()->with('success', 'Chargement mis à jour avec succès.');
    }

    /**
     * Remove the specified loading.
     */
    public function destroy(Folder $folder, Loading $loading): RedirectResponse
    {
        DB::transaction(function () use ($folder, $loading) {
            $loading->delete();
            $this->recalculateFolderStatus->execute($folder);
        });

        return back()->with('success', 'Chargement supprimé avec succès.');
    }
}
