<?php

namespace App\Actions\Folders;

use App\Data\AssignShipperData;
use App\Models\Folder;

final readonly class AssignShipperAction
{
    public function handle(Folder $folder, AssignShipperData $data): Folder
    {
        AssignFolderAction::run($folder, $data->shipperId, $data->reason);

        return $folder->fresh();
    }
}
