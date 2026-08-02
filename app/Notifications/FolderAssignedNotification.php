<?php

namespace App\Notifications;

use App\Models\Folder;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FolderAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Folder $folder,
        public readonly ?string $reason = null,
        public readonly string $type = 'assignments',
    ) {}

    /**
     * Vérifie les colonnes booléennes de la relation `user_preferences`.
     */
    public function via(User $notifiable): array
    {
        $channels = [];
        $prefs = $notifiable->preferences ?? $notifiable->preferences()->first();

        // 1. Notification Application (In-App / Database)
        $appColumn = "app_notifications_{$this->type}";
        if (! $prefs || ($prefs->{$appColumn} ?? true)) {
            $channels[] = 'database';
        }

        // 2. Notification Email
        $emailColumn = "email_notifications_{$this->type}";
        if (! $prefs || ($prefs->{$emailColumn} ?? true)) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail(User $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("[Affectation] — Dossier N° {$this->folder->folder_number}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("Le dossier N° {$this->folder->folder_number} vous a été attribué.")
            ->line("• N° Dossier : {$this->folder->folder_number}")
            ->line("• Client : {$this->folder->customer?->company_name}")
            ->lineIf((bool) $this->reason, "• Motif : {$this->reason}")
            ->action('Consulter le dossier', route('folders.show', $this->folder->id))
            ->line('Message automatique transmis par le système de gestion logistique.');
    }

    public function toArray(User $notifiable): array
    {
        return [
            'folder_id' => $this->folder->id,
            'folder_number' => $this->folder->folder_number,
            'title' => 'Nouveau dossier affecté',
            'description' => "Le dossier {$this->folder->folder_number} vous a été attribué.",
            'url' => route('folders.show', $this->folder->id),
        ];
    }
}
