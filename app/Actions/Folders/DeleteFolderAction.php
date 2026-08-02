<?php

namespace App\Actions\Folders;

use App\Models\Folder;
use Illuminate\Support\Facades\DB;

final readonly class DeleteFolderAction
{
    public function handle(Folder $folder): bool
    {
        return DB::transaction(function () use ($folder) {
            // Logique éventuelle de nettoyage (ex: suppression des fichiers S3 / documents associés)
            $folder->documents->each->delete();

            return $folder->delete();
        });
    }
}
