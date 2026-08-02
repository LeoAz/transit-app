<?php

namespace App\Http\Controllers;

use App\Http\Requests\Folders\UploadDocumentRequest;
use App\Jobs\GenerateDocumentsZip;
use App\Jobs\ProcessDocumentUpload;
use App\Models\Document;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function store(UploadDocumentRequest $request, Folder $folder)
    {
        $file = $request->file('file');
        $tempPath = $file->store('temp', 'local');

        ProcessDocumentUpload::dispatch(
            $folder,
            $tempPath,
            $file->getClientOriginalName(),
            $request->input('document_type'),
            auth()->id()
        );

        return back()->withSuccess('Téléchargement lancé en arrière-plan.');
    }

    public function show(Document $document)
    {
        if (! Storage::disk('public')->exists($document->file_path)) {
            abort(404, 'Fichier non trouvé.');
        }

        return response()->file(Storage::disk('public')->path($document->file_path), [
            'Content-Disposition' => 'inline; filename="'.$document->file_name.'"',
        ]);
    }

    public function download(Document $document)
    {
        if (! Storage::disk('public')->exists($document->file_path)) {
            abort(404, 'Fichier non trouvé sur le serveur.');
        }

        return Storage::disk('public')->download($document->file_path, $document->file_name);
    }

    public function downloadBulk(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:documents,id'],
        ]);

        $taskId = Str::uuid()->toString();

        GenerateDocumentsZip::dispatch($request->ids, auth()->id(), $taskId);

        return response()->json([
            'task_id' => $taskId,
            'message' => 'La génération du ZIP a commencé.',
        ]);
    }

    public function checkZipStatus(string $taskId)
    {
        $status = Cache::get("zip_task_{$taskId}");

        if (! $status) {
            return response()->json(['status' => 'pending']);
        }

        if ($status['status'] === 'completed') {
            Cache::forget("zip_task_{$taskId}");
        }

        return response()->json($status);
    }

    public function downloadTemp(Request $request, string $filename)
    {
        $path = 'temp/'.$filename;
        if (! Storage::disk('public')->exists($path)) {
            abort(404, 'Fichier temporaire non trouvé.');
        }

        return Storage::disk('public')->download($path);
    }

    public function destroy(Document $document)
    {
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return back()->withSuccess('Document supprimé avec succès.');
    }
}
