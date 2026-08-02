<?php

namespace App\Data;

use App\Http\Requests\StoreFolderRequest;
use App\Http\Requests\UpdateFolderRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;

final readonly class FolderData
{
    /**
     * @param  array<UploadedFile>  $documents
     */
    public function __construct(
        public Carbon $blReceivedAt,
        public string $blNumber,
        public int $customerId,
        public int $shippingCompanyId,
        public array $documents = [],
    ) {}

    public static function fromRequest(StoreFolderRequest|UpdateFolderRequest $request): self
    {
        return new self(
            blReceivedAt: $request->date('bl_received_at'),
            blNumber: $request->validated('bl_number'),
            customerId: (int) $request->validated('customer_id'),
            shippingCompanyId: (int) $request->validated('shipping_company_id'),
            documents: $request->file('documents', []),
        );
    }
}
