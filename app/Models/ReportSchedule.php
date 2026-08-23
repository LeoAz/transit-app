<?php

namespace App\Models;

use App\Enums\Reports\ReportFormat;
use App\Enums\Reports\ReportFrequency;
use App\Enums\Reports\ReportType;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportSchedule extends Model
{
    use Auditable, HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<ReportExecution, $this>
     */
    public function executions(): HasMany
    {
        return $this->hasMany(ReportExecution::class);
    }

    protected function casts(): array
    {
        return [
            'report_type' => ReportType::class,
            'format' => ReportFormat::class,
            'frequency' => ReportFrequency::class,
            'additional_recipients' => 'array',
            'is_active' => 'boolean',
            'last_sent_at' => 'datetime',
        ];
    }
}
