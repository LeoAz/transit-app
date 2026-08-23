<?php

namespace App\Mail;

use App\Models\ReportSchedule;
use Illuminate\Mail\Attachment;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class ScheduledReportMail extends Mailable
{
    use SerializesModels;

    public function __construct(
        public ReportSchedule $schedule,
        public string $filePath,
        public string $fileName,
        public string $mimeType,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre rapport programmé : '.$this->schedule->report_type->label(),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.scheduled-report',
            with: ['schedule' => $this->schedule],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [
            Attachment::fromStorageDisk('public', $this->filePath)
                ->as($this->fileName)
                ->withMime($this->mimeType),
        ];
    }
}
