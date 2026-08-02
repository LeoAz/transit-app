<?php

namespace App\Events\Folders;

use App\Models\Folder;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class FolderAssigned
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Folder $folder,
        public readonly ?int $previousShipperId,
        public readonly ?User $actor = null,
    ) {}
}
