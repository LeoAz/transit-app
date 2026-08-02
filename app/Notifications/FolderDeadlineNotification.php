<?php

namespace App\Notifications;

use App\Models\Folder;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FolderDeadlineNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Folder $folder,
        public string $title,
        public string $description,
        public string $level,
        public string $type = 'deadlines'
    ) {}

    /**
     * Vérifie les colonnes booléennes de la relation `user_preferences`.
     */
    public function via(User $notifiable): array
    {
        $channels = [];
        $prefs = $notifiable->preferences ?? $notifiable->preferences()->first();

        // 1. Notification Application (In-App)
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
            ->subject("[{$this->title}] — Dossier N° {$this->folder->folder_number}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line($this->description)
            ->line("• N° Dossier : {$this->folder->folder_number}")
            ->line("• Navire : {$this->folder->vessel_name}")
            ->line("• N° BL : {$this->folder->bl_number}")
            ->action('Consulter le dossier', route('folders.show', $this->folder->id))
            ->line('Message automatique transmis par le système de gestion logistique.');
    }

    public function toArray(User $notifiable): array
    {
        return [
            'folder_id' => $this->folder->id,
            'folder_number' => $this->folder->folder_number,
            'title' => $this->title,
            'description' => $this->description,
            'level' => $this->level,
            'url' => route('folders.show', $this->folder->id),
        ];
    }
}
