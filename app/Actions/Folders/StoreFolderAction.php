<?php

namespace App\Actions\Folders;

use App\Data\FolderData;
use App\Models\Folder;
use Illuminate\Support\Facades\DB;

final readonly class StoreFolderAction
{
    public function __construct(
        private UploadFolderDocumentsAction $uploadDocuments,
    ) {}

    public function handle(FolderData $data): Folder
    {
        return DB::transaction(function () use ($data) {
            $folder = Folder::create([
                'bl_received_at' => $data->blReceivedAt,
                'bl_number' => $data->blNumber,
                'customer_id' => $data->customerId,
                'container_type' => $data->containerType,
                'container_count' => $data->containerCount,
                'product_id' => $data->productId,
                'vessel_id' => $data->vesselId,
                'vessel_name' => $data->vesselName,
                'eta' => $data->eta,
                'notes' => $data->notes,
            ]);

            if (! empty($data->documents)) {
                $this->uploadDocuments->handle($folder, $data->documents);
            }

            return $folder;
        });
    }
}
