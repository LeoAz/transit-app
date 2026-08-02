<?php

namespace App\Jobs;

use App\Events\Documents\DocumentUploaded;
use App\Models\Folder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ProcessDocumentUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Folder $folder,
        public string $tempPath,
        public string $originalName,
        public string $documentType,
        public int $userId
    ) {}

    public function handle(): void
    {
        if (! Storage::disk('local')->exists($this->tempPath)) {
            return;
        }

        $extension = pathinfo($this->originalName, PATHINFO_EXTENSION);
        $finalPath = "folders/{$this->folder->id}/".uniqid().".{$extension}";

        // Déplacer du disque local (temp) vers le disque public
        Storage::disk('public')->put(
            $finalPath,
            Storage::disk('local')->get($this->tempPath)
        );

        $document = $this->folder->documents()->create([
            'document_type' => $this->documentType,
            'file_name' => $this->originalName,
            'file_path' => $finalPath,
            'format' => $extension,
            'size' => Storage::disk('local')->size($this->tempPath),
            'user_id' => $this->userId,
        ]);

        Storage::disk('local')->delete($this->tempPath);

        event(new DocumentUploaded($document));
    }
}
