<?php

namespace App\Http\Controllers;

use App\Actions\Folders\AssignShipperAction;
use App\Actions\Folders\DeleteFolderAction;
use App\Actions\Folders\GetFolderFormDataAction;
use App\Actions\Folders\GetFolderStatisticsAction;
use App\Actions\Folders\StoreFolderAction;
use App\Actions\Folders\UpdateFolderAction;
use App\Actions\Folders\ValidateArrivalAction;
use App\Data\AssignShipperData;
use App\Data\DateRange;
use App\Data\FolderData;
use App\Enums\FolderStatus;
use App\Http\Requests\Folders\AssignShipperRequest;
use App\Http\Requests\Folders\StoreFolderRequest;
use App\Http\Requests\Folders\UpdateFolderRequest;
use App\Http\Requests\Folders\ValidateArrivalRequest;
use App\Models\Folder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class FolderController extends Controller
{
    public function index(
        Request $request,
        GetFolderStatisticsAction $getStats,
        GetFolderFormDataAction $getFormData,
    ): Response {
        $dateRange = DateRange::fromRequest($request);

        return Inertia::render('folders/index', [
            'folders' => Folder::query()
                ->with(['customer', 'shipper', 'product'])
                ->latest()
                ->get(),
            'stats' => $getStats->handle($dateRange),
            'formData' => $getFormData->handle(),
            'filters' => [
                'start_date' => $dateRange->startDate->toDateString(),
                'end_date' => $dateRange->endDate->toDateString(),
            ],
            'statuses' => FolderStatus::options(),
        ]);
    }

    public function store(
        StoreFolderRequest $request,
        StoreFolderAction $store,
    ): RedirectResponse {
        $folder = $store->handle(FolderData::fromRequest($request));

        return redirect()
            ->route('folders.show', $folder)
            ->withSuccess(__('folders.created'));
    }

    public function show(Folder $folder, GetFolderFormDataAction $getFormData): Response
    {
        return Inertia::render('folders/show', [
            'folder' => $folder->loadShowRelations(),
            'formData' => $getFormData->handle(),
            'allFolders' => Folder::query()
                ->with('customer:id,company_name')
                ->select(['id', 'folder_number', 'bl_number', 'ata', 'eta', 'customer_id', 'status'])
                ->latest()
                ->get(),
            'statuses' => FolderStatus::options(),
        ]);
    }

    public function update(
        UpdateFolderRequest $request,
        Folder $folder,
        UpdateFolderAction $update,
    ): RedirectResponse {
        $update->handle($folder, FolderData::fromRequest($request));

        return back()->withSuccess(__('folders.updated'));
    }

    public function assign(
        AssignShipperRequest $request,
        Folder $folder,
        AssignShipperAction $assign,
    ): RedirectResponse {
        $assign->handle($folder, AssignShipperData::fromRequest($request));

        return back()->withSuccess(__('folders.shipper_assigned'));
    }

    public function validateArrival(
        ValidateArrivalRequest $request,
        Folder $folder,
        ValidateArrivalAction $validate,
    ): RedirectResponse {
        $validate->handle($folder, $request->validated());

        return back()->withSuccess(__('folders.arrival_validated'));
    }

    public function destroy(
        Folder $folder,
        DeleteFolderAction $delete,
    ): RedirectResponse {
        $delete->handle($folder);

        return back()->withSuccess(__('folders.deleted'));
    }
}
