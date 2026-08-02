<?php

namespace App\Jobs;

use App\Events\Documents\DocumentsZipGenerated;
use App\Models\Document;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class GenerateDocumentsZip implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public array $documentIds,
        public int $userId,
        public ?string $taskId = null
    ) {}

    public function handle(): void
    {
        $documents = Document::whereIn('id', $this->documentIds)->get();
        if ($documents->isEmpty()) {
            if ($this->taskId) {
                Cache::put("zip_task_{$this->taskId}", ['status' => 'failed', 'error' => 'No documents found'], 3600);
            }

            return;
        }

        $zipFileName = 'documents-'.now()->timestamp.'-'.uniqid('', true).'.zip';
        $zipPath = storage_path('app/public/temp/'.$zipFileName);

        if (! is_dir(storage_path('app/public/temp'))) {
            if (! mkdir(storage_path('app/public/temp'), 0755, true) && ! is_dir(storage_path('app/public/temp'))) {
                // Échec de la création du dossier
                if ($this->taskId) {
                    Cache::put("zip_task_{$this->taskId}", ['status' => 'failed', 'error' => 'Could not create temp directory'], 3600);
                }

                return;
            }
        }

        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            if ($this->taskId) {
                Cache::put("zip_task_{$this->taskId}", ['status' => 'failed', 'error' => 'Could not create ZIP file'], 3600);
            }

            return;
        }

        foreach ($documents as $document) {
            if (Storage::disk('public')->exists($document->file_path)) {
                $zip->addFromString(
                    $document->file_name,
                    Storage::disk('public')->get($document->file_path)
                );
            }
        }

        $zip->close();

        // On utilise une route relative pour éviter les problèmes de domaine/port
        // entre l'application et l'URL de téléchargement.
        $downloadUrl = '/documents/download-temp/'.$zipFileName;

        if ($this->taskId) {
            Cache::put("zip_task_{$this->taskId}", [
                'status' => 'completed',
                'download_url' => $downloadUrl,
                'file_name' => $zipFileName,
            ], 3600);
        }

        event(new DocumentsZipGenerated($this->userId, url($downloadUrl), $zipFileName));
    }
}
