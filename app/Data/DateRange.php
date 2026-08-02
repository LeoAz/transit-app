<?php

namespace App\Data;

use Carbon\CarbonInterface;
use Illuminate\Http\Request;

final readonly class DateRange
{
    public function __construct(
        public CarbonInterface $startDate,
        public CarbonInterface $endDate,
    ) {}

    public static function fromRequest(Request $request): self
    {
        /** @var CarbonInterface $startDate */
        $startDate = $request->date('start_date')?->startOfDay()
            ?? now()->startOfMonth();

        /** @var CarbonInterface $endDate */
        $endDate = $request->date('end_date')?->endOfDay()
            ?? now()->endOfMonth();

        return new self($startDate, $endDate);
    }
}
