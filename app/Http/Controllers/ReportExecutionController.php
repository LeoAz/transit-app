<?php

namespace App\Http\Controllers;

use App\Models\ReportExecution;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class ReportExecutionController extends Controller
{
    public function download(ReportExecution $reportExecution): StreamedResponse
    {
        abort_unless($reportExecution->user_id === Auth::id(), 403);
        abort_unless($reportExecution->status === 'sent' && $reportExecution->file_path, 404);
        abort_unless(Storage::disk('public')->exists($reportExecution->file_path), 404, 'Fichier non trouvé.');

        return Storage::disk('public')->download($reportExecution->file_path, $reportExecution->file_name);
    }
}
