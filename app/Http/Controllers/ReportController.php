<?php

namespace App\Http\Controllers;

use App\Actions\Reports\BuildArrivalPunctualityReportAction;
use App\Actions\Reports\BuildClientSituationReportAction;
use App\Actions\Reports\BuildClosedFoldersReportAction;
use App\Actions\Reports\BuildDailyReportAction;
use App\Actions\Reports\BuildOngoingFoldersReportAction;
use App\Actions\Reports\BuildShipperSituationReportAction;
use App\Data\Reports\ReportFilters;
use App\Models\Customer;
use App\Models\User;
use App\Models\Vessel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reports/index');
    }

    public function clientSituation(Request $request, BuildClientSituationReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);

        return Inertia::render('reports/client-situation', [
            'rows' => $build->handle($filters, Auth::user()),
            'filters' => $this->filtersToArray($filters),
            'formData' => [
                'customers' => Customer::query()->select(['id', 'company_name'])->orderBy('company_name')->get(),
            ],
        ]);
    }

    public function shipperSituation(Request $request, BuildShipperSituationReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);

        return Inertia::render('reports/shipper-situation', [
            'rows' => $build->handle($filters, Auth::user()),
            'filters' => $this->filtersToArray($filters),
            'formData' => [
                'shippers' => User::query()->shippers()->select(['id', 'name'])->orderBy('name')->get(),
            ],
        ]);
    }

    public function ongoingFolders(Request $request, BuildOngoingFoldersReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);

        return Inertia::render('reports/ongoing-folders', [
            'rows' => $build->handle($filters, Auth::user()),
            'filters' => $this->filtersToArray($filters),
            'formData' => [
                'customers' => Customer::query()->select(['id', 'company_name'])->orderBy('company_name')->get(),
                'shippers' => User::query()->shippers()->select(['id', 'name'])->orderBy('name')->get(),
                'vessels' => Vessel::query()->select(['id', 'name'])->orderBy('name')->get(),
            ],
        ]);
    }

    public function closedFolders(Request $request, BuildClosedFoldersReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);

        return Inertia::render('reports/closed-folders', [
            'rows' => $build->handle($filters, Auth::user()),
            'filters' => $this->filtersToArray($filters),
            'formData' => [
                'customers' => Customer::query()->select(['id', 'company_name'])->orderBy('company_name')->get(),
                'shippers' => User::query()->shippers()->select(['id', 'name'])->orderBy('name')->get(),
            ],
        ]);
    }

    public function dailyReport(Request $request, BuildDailyReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);
        $data = $build->handle($filters, Auth::user());

        return Inertia::render('reports/daily', [
            'loadings' => $data['loadings'],
            'alerts' => $data['alerts'],
            'filters' => $this->filtersToArray($filters),
        ]);
    }

    public function arrivalPunctuality(Request $request, BuildArrivalPunctualityReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);

        return Inertia::render('reports/arrival-punctuality', [
            'rows' => $build->handle($filters, Auth::user()),
            'filters' => $this->filtersToArray($filters),
            'formData' => [
                'vessels' => Vessel::query()->select(['id', 'name'])->orderBy('name')->get(),
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function filtersToArray(ReportFilters $filters): array
    {
        return $filters->period->toArray() + [
            'customer_id' => $filters->customerId,
            'shipper_id' => $filters->shipperId,
            'vessel_id' => $filters->vesselId,
            'status' => $filters->status,
        ];
    }
}
