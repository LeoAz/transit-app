<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPreference extends Model
{
    /**
     * Get the user that owns the preferences.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function casts(): array
    {
        return [
            'email_notifications_eta' => 'boolean',
            'email_notifications_ata' => 'boolean',
            'email_notifications_overdue' => 'boolean',
            'app_notifications_eta' => 'boolean',
            'app_notifications_ata' => 'boolean',
            'app_notifications_overdue' => 'boolean',
        ];
    }
}
