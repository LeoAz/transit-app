<?php

namespace App\Data;

use App\Enums\ContainerType;
use App\Http\Requests\Folders\StoreFolderRequest;
use App\Http\Requests\Folders\UpdateFolderRequest;
use App\Models\Vessel;
use Carbon\CarbonInterface;
use Illuminate\Http\UploadedFile;

final readonly class FolderData
{
    /**
     * @param  array<UploadedFile>  $documents
     */
    public function __construct(
        public CarbonInterface $blReceivedAt,
        public string $blNumber,
        public int $customerId,
        public ContainerType $containerType,
        public int $containerCount,
        public int $productId,
        public ?int $vesselId,
        public string $vesselName,
        public CarbonInterface $eta,
        public ?string $notes,
        public array $documents = [],
    ) {}

    public static function fromRequest(StoreFolderRequest|UpdateFolderRequest $request): self
    {
        $vessel = $request->filled('vessel_id') ? Vessel::find($request->integer('vessel_id')) : null;

        return new self(
            blReceivedAt: $request->date('bl_received_at'),
            blNumber: $request->validated('bl_number'),
            customerId: (int) $request->validated('customer_id'),
            containerType: ContainerType::from((int) $request->validated('container_type')),
            containerCount: (int) $request->validated('container_count'),
            productId: (int) $request->validated('product_id'),
            vesselId: $vessel?->id,
            vesselName: $vessel?->name ?? (string) $request->validated('vessel_name'),
            eta: $request->date('eta'),
            notes: $request->validated('notes'),
            documents: $request->file('files', []),
        );
    }
}
