<?php

namespace App\Actions\Reports\Scheduling;

use App\Actions\Reports\BuildArrivalPunctualityReportAction;
use App\Actions\Reports\BuildClientSituationReportAction;
use App\Actions\Reports\BuildClosedFoldersReportAction;
use App\Actions\Reports\BuildDailyReportAction;
use App\Actions\Reports\BuildOngoingFoldersReportAction;
use App\Actions\Reports\BuildShipperSituationReportAction;
use App\Data\Reports\ReportFilters;
use App\Data\Reports\ReportPeriod;
use App\Enums\Reports\ReportFormat;
use App\Enums\Reports\ReportType;
use App\Exports\ArrivalPunctualityExport;
use App\Exports\ClientSituationExport;
use App\Exports\ClosedFoldersExport;
use App\Exports\DailyReportExport;
use App\Exports\OngoingFoldersExport;
use App\Exports\ShipperSituationExport;
use App\Models\ReportSchedule;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Excel;
use Maatwebsite\Excel\Facades\Excel as ExcelFacade;

final readonly class GenerateScheduledReportFileAction
{
    public function __construct(
        private BuildClientSituationReportAction $clientSituation,
        private BuildShipperSituationReportAction $shipperSituation,
        private BuildOngoingFoldersReportAction $ongoingFolders,
        private BuildClosedFoldersReportAction $closedFolders,
        private BuildDailyReportAction $daily,
        private BuildArrivalPunctualityReportAction $arrivalPunctuality,
    ) {}

    /**
     * @return array{contents: string, filename: string, mimeType: string}
     */
    public function handle(ReportSchedule $schedule): array
    {
        $period = ReportPeriod::forPreset($schedule->frequency->periodPreset());
        $filters = new ReportFilters(period: $period);
        $actingUser = $schedule->user;

        [$title, $slug, $pdfView, $data] = match ($schedule->report_type) {
            ReportType::CLIENT_SITUATION => [
                'Situation par client', 'situation-clients', 'reports.pdf.partials.client-situation',
                ['rows' => $this->clientSituation->handle($filters, $actingUser)],
            ],
            ReportType::SHIPPER_SITUATION => [
                'Situation par chargeur', 'situation-chargeurs', 'reports.pdf.partials.shipper-situation',
                ['rows' => $this->shipperSituation->handle($filters, $actingUser)],
            ],
            ReportType::ONGOING_FOLDERS => [
                'Dossiers en cours', 'dossiers-en-cours', 'reports.pdf.partials.ongoing-folders',
                ['rows' => $this->ongoingFolders->handle($filters, $actingUser)],
            ],
            ReportType::CLOSED_FOLDERS => [
                'Dossiers clôturés', 'dossiers-clotures', 'reports.pdf.partials.closed-folders',
                ['rows' => $this->closedFolders->handle($filters, $actingUser)],
            ],
            ReportType::DAILY => [
                'Rapport journalier', 'rapport-journalier', 'reports.pdf.partials.daily',
                $this->daily->handle($filters, $actingUser),
            ],
            ReportType::ARRIVAL_PUNCTUALITY => [
                'Ponctualité des arrivées', 'ponctualite-arrivees', 'reports.pdf.partials.arrival-punctuality',
                ['rows' => $this->arrivalPunctuality->handle($filters, $actingUser)],
            ],
        };

        $filename = $slug.'-'.now()->format('Y-m-d');

        if ($schedule->format === ReportFormat::PDF) {
            $contents = Pdf::loadView('reports.pdf._layout', array_merge($data, [
                'title' => $title,
                'contentView' => $pdfView,
                'period' => $period,
                'generatedAt' => now(),
            ]))->output();

            return ['contents' => $contents, 'filename' => $filename.'.pdf', 'mimeType' => 'application/pdf'];
        }

        $export = match ($schedule->report_type) {
            ReportType::CLIENT_SITUATION => new ClientSituationExport($data['rows']),
            ReportType::SHIPPER_SITUATION => new ShipperSituationExport($data['rows']),
            ReportType::ONGOING_FOLDERS => new OngoingFoldersExport($data['rows']),
            ReportType::CLOSED_FOLDERS => new ClosedFoldersExport($data['rows']),
            ReportType::DAILY => new DailyReportExport($data['loadings'], $data['alerts']),
            ReportType::ARRIVAL_PUNCTUALITY => new ArrivalPunctualityExport($data['rows']),
        };

        $contents = ExcelFacade::raw($export, Excel::XLSX);

        return [
            'contents' => $contents,
            'filename' => $filename.'.xlsx',
            'mimeType' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
    }
}
