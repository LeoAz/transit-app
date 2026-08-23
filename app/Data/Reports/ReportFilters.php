<?php

namespace App\Data\Reports;

use Illuminate\Http\Request;

final readonly class ReportFilters
{
    public function __construct(
        public ReportPeriod $period,
        public ?int $customerId = null,
        public ?int $shipperId = null,
        public ?int $vesselId = null,
        public ?string $status = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            period: ReportPeriod::fromRequest($request),
            customerId: $request->integer('customer_id') ?: null,
            shipperId: $request->integer('shipper_id') ?: null,
            vesselId: $request->integer('vessel_id') ?: null,
            status: $request->string('status')->value() ?: null,
        );
    }
}
