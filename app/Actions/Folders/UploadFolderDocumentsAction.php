<?php

namespace App\Actions\Folders;

use App\Models\Folder;

class UploadFolderDocumentsAction
{
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
