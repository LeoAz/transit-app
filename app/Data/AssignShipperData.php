<?php

namespace App\Data;

use App\Http\Requests\Folders\AssignShipperRequest;

final readonly class AssignShipperData
{
    public function __construct(
        public int $shipperId,
        public ?string $reason = null,
    ) {}

    public static function fromRequest(AssignShipperRequest $request): self
    {
        return new self(
            shipperId: (int) $request->validated('shipper_id'),
            reason: $request->validated('reason'),
        );
    }
}
