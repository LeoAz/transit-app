<?php

namespace App\Http\Controllers;

use App\Enums\Reports\ReportFormat;
use App\Enums\Reports\ReportFrequency;
use App\Enums\Reports\ReportType;
use App\Http\Requests\Reports\StoreReportScheduleRequest;
use App\Http\Requests\Reports\UpdateReportScheduleRequest;
use App\Models\ReportExecution;
use App\Models\ReportSchedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class ReportScheduleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('reports/scheduled/index', [
            'schedules' => ReportSchedule::query()
                ->where('user_id', Auth::id())
                ->latest()
                ->get(),
            'executions' => ReportExecution::query()
                ->where('user_id', Auth::id())
                ->latest('sent_at')
                ->get(),
            'formData' => [
                'reportTypes' => ReportType::options(),
                'formats' => ReportFormat::options(),
                'frequencies' => ReportFrequency::options(),
            ],
        ]);
    }

    public function store(StoreReportScheduleRequest $request): RedirectResponse
    {
        ReportSchedule::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
        ]);

        return back()->withSuccess('La programmation a été créée avec succès.');
    }

    public function update(UpdateReportScheduleRequest $request, ReportSchedule $reportSchedule): RedirectResponse
    {
        abort_unless($reportSchedule->user_id === Auth::id(), 403);

        $reportSchedule->update($request->validated());

        return back()->withSuccess('La programmation a été mise à jour.');
    }

    public function destroy(ReportSchedule $reportSchedule): RedirectResponse
    {
        abort_unless($reportSchedule->user_id === Auth::id(), 403);

        $reportSchedule->delete();

        return back()->withSuccess('La programmation a été supprimée.');
    }
}
