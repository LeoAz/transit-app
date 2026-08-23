<?php

namespace App\Actions\Folders;

use App\Models\Folder;

class UploadFolderDocumentsAction
{
    /**
     * @param  array<mixed>  $files
     */
    public function handle(Folder $folder, array $files, string $documentType = 'autre'): void
    {
        foreach ($files as $file) {
            self::run($folder, $file, $documentType);
        }
    }

    public static function run(Folder $folder, mixed $file, string $documentType): void
    {
        $path = $file->store("folders/{$folder->id}", 'public');

        $folder->documents()->create([
            'document_type' => $documentType,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'format' => $file->getClientOriginalExtension(),
            'size' => $file->getSize(),
            'user_id' => auth()->id(),
        ]);
    }
}
