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
                'shipping_company_id' => $data->shippingCompanyId,
            ]);

            if (! empty($data->documents)) {
                $this->uploadDocuments->handle($folder, $data->documents);
            }

            return $folder;
        });
    }
}
