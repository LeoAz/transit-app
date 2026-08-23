<?php

namespace App\Http\Requests\Reports;

use App\Enums\Reports\ReportFormat;
use App\Enums\Reports\ReportFrequency;
use App\Enums\Reports\ReportType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReportScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'report_type' => ['required', Rule::enum(ReportType::class)],
            'format' => ['required', Rule::enum(ReportFormat::class)],
            'frequency' => ['required', Rule::enum(ReportFrequency::class)],
            'day_of_week' => ['required_if:frequency,weekly', 'nullable', 'integer', 'between:1,7'],
            'day_of_month' => ['required_if:frequency,monthly', 'nullable', 'integer', 'between:1,31'],
            'send_time' => ['required', 'date_format:H:i'],
            'additional_recipients' => ['nullable', 'array'],
            'additional_recipients.*' => ['email'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
