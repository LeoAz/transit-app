<?php

namespace App\Events\Documents;

use App\Models\Document;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DocumentUploaded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Document $document) {}

    public function broadcastOn(): array
    {
        return [
            new Channel("folders.{$this->document->documentable_id}.documents"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'document.uploaded';
    }
}
