<?php

namespace App\Data\Reports;

use Carbon\CarbonInterface;
use Illuminate\Http\Request;

final readonly class ReportPeriod
{
    public function __construct(
        public CarbonInterface $startDate,
        public CarbonInterface $endDate,
        public string $preset,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $preset = $request->string('period')->value() ?: 'month';

        if ($preset === 'custom') {
            return new self(
                $request->date('start_date')?->startOfDay() ?? now()->startOfMonth(),
                $request->date('end_date')?->endOfDay() ?? now()->endOfMonth(),
                'custom',
            );
        }

        return self::forPreset($preset);
    }

    /**
     * Résout un préréglage ('day'|'week'|'year'|'month') vers la plage de dates correspondante.
     */
    public static function forPreset(string $preset): self
    {
        return match ($preset) {
            'day' => new self(now()->startOfDay(), now()->endOfDay(), 'day'),
            'week' => new self(now()->startOfWeek(), now()->endOfWeek(), 'week'),
            'year' => new self(now()->startOfYear(), now()->endOfYear(), 'year'),
            default => new self(now()->startOfMonth(), now()->endOfMonth(), 'month'),
        };
    }

    /**
     * @return array{preset: string, start_date: string, end_date: string}
     */
    public function toArray(): array
    {
        return [
            'preset' => $this->preset,
            'start_date' => $this->startDate->toDateString(),
            'end_date' => $this->endDate->toDateString(),
        ];
    }
}
