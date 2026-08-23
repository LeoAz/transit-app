<?php

namespace App\Http\Controllers;

use App\Actions\Reports\BuildArrivalPunctualityReportAction;
use App\Actions\Reports\BuildClientSituationReportAction;
use App\Actions\Reports\BuildClosedFoldersReportAction;
use App\Actions\Reports\BuildDailyReportAction;
use App\Actions\Reports\BuildOngoingFoldersReportAction;
use App\Actions\Reports\BuildShipperSituationReportAction;
use App\Data\Reports\ReportFilters;
use App\Exports\ArrivalPunctualityExport;
use App\Exports\ClientSituationExport;
use App\Exports\ClosedFoldersExport;
use App\Exports\DailyReportExport;
use App\Exports\OngoingFoldersExport;
use App\Exports\ShipperSituationExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

final class ReportExportController extends Controller
{
    public function clientSituationPdf(Request $request, BuildClientSituationReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);
        $rows = $build->handle($filters, Auth::user());

        return Pdf::loadView('reports.pdf._layout', [
            'title' => 'Situation par client',
            'contentView' => 'reports.pdf.partials.client-situation',
            'rows' => $rows,
            'period' => $filters->period,
            'generatedAt' => now(),
        ])->download('situation-clients-'.now()->format('Y-m-d').'.pdf');
    }

    public function clientSituationExcel(Request $request, BuildClientSituationReportAction $build): BinaryFileResponse
    {
        $filters = ReportFilters::fromRequest($request);
        $rows = $build->handle($filters, Auth::user());

        return Excel::download(new ClientSituationExport($rows), 'situation-clients-'.now()->format('Y-m-d').'.xlsx');
    }

    public function shipperSituationPdf(Request $request, BuildShipperSituationReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);
        $rows = $build->handle($filters, Auth::user());

        return Pdf::loadView('reports.pdf._layout', [
            'title' => 'Situation par chargeur',
            'contentView' => 'reports.pdf.partials.shipper-situation',
            'rows' => $rows,
            'period' => $filters->period,
            'generatedAt' => now(),
        ])->setPaper('a4', 'landscape')->download('situation-chargeurs-'.now()->format('Y-m-d').'.pdf');
    }

    public function shipperSituationExcel(Request $request, BuildShipperSituationReportAction $build): BinaryFileResponse
    {
        $filters = ReportFilters::fromRequest($request);
        $rows = $build->handle($filters, Auth::user());

        return Excel::download(new ShipperSituationExport($rows), 'situation-chargeurs-'.now()->format('Y-m-d').'.xlsx');
    }

    public function ongoingFoldersPdf(Request $request, BuildOngoingFoldersReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);
        $rows = $build->handle($filters, Auth::user());

        return Pdf::loadView('reports.pdf._layout', [
            'title' => 'Dossiers en cours',
            'contentView' => 'reports.pdf.partials.ongoing-folders',
            'rows' => $rows,
            'period' => $filters->period,
            'generatedAt' => now(),
        ])->setPaper('a4', 'landscape')->download('dossiers-en-cours-'.now()->format('Y-m-d').'.pdf');
    }

    public function ongoingFoldersExcel(Request $request, BuildOngoingFoldersReportAction $build): BinaryFileResponse
    {
        $filters = ReportFilters::fromRequest($request);
        $rows = $build->handle($filters, Auth::user());

        return Excel::download(new OngoingFoldersExport($rows), 'dossiers-en-cours-'.now()->format('Y-m-d').'.xlsx');
    }

    public function closedFoldersPdf(Request $request, BuildClosedFoldersReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);
        $rows = $build->handle($filters, Auth::user());

        return Pdf::loadView('reports.pdf._layout', [
            'title' => 'Dossiers clôturés',
            'contentView' => 'reports.pdf.partials.closed-folders',
            'rows' => $rows,
            'period' => $filters->period,
            'generatedAt' => now(),
        ])->setPaper('a4', 'landscape')->download('dossiers-clotures-'.now()->format('Y-m-d').'.pdf');
    }

    public function closedFoldersExcel(Request $request, BuildClosedFoldersReportAction $build): BinaryFileResponse
    {
        $filters = ReportFilters::fromRequest($request);
        $rows = $build->handle($filters, Auth::user());

        return Excel::download(new ClosedFoldersExport($rows), 'dossiers-clotures-'.now()->format('Y-m-d').'.xlsx');
    }

    public function dailyPdf(Request $request, BuildDailyReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);
        $data = $build->handle($filters, Auth::user());

        return Pdf::loadView('reports.pdf._layout', [
            'title' => 'Rapport journalier',
            'contentView' => 'reports.pdf.partials.daily',
            'loadings' => $data['loadings'],
            'alerts' => $data['alerts'],
            'period' => $filters->period,
            'generatedAt' => now(),
        ])->download('rapport-journalier-'.now()->format('Y-m-d').'.pdf');
    }

    public function dailyExcel(Request $request, BuildDailyReportAction $build): BinaryFileResponse
    {
        $filters = ReportFilters::fromRequest($request);
        $data = $build->handle($filters, Auth::user());

        return Excel::download(
            new DailyReportExport($data['loadings'], $data['alerts']),
            'rapport-journalier-'.now()->format('Y-m-d').'.xlsx'
        );
    }

    public function arrivalPunctualityPdf(Request $request, BuildArrivalPunctualityReportAction $build): Response
    {
        $filters = ReportFilters::fromRequest($request);
        $rows = $build->handle($filters, Auth::user());

        return Pdf::loadView('reports.pdf._layout', [
            'title' => 'Ponctualité des arrivées',
            'contentView' => 'reports.pdf.partials.arrival-punctuality',
            'rows' => $rows,
            'period' => $filters->period,
            'generatedAt' => now(),
        ])->setPaper('a4', 'landscape')->download('ponctualite-arrivees-'.now()->format('Y-m-d').'.pdf');
    }

    public function arrivalPunctualityExcel(Request $request, BuildArrivalPunctualityReportAction $build): BinaryFileResponse
    {
        $filters = ReportFilters::fromRequest($request);
        $rows = $build->handle($filters, Auth::user());

        return Excel::download(new ArrivalPunctualityExport($rows), 'ponctualite-arrivees-'.now()->format('Y-m-d').'.xlsx');
    }
}
