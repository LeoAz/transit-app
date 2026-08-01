<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait Auditable
{
    /**
     * Boot the trait.
     */
    public static function bootAuditable(): void
    {
        static::created(function ($model) {
            $model->audit('created');
        });

        static::updated(function ($model) {
            $model->audit('updated');
        });

        static::deleted(function ($model) {
            $model->audit('deleted');
        });
    }

    /**
     * Audit the model changes.
     */
    protected function audit(string $event): void
    {
        $oldValues = [];
        $newValues = [];

        if ($event === 'updated') {
            $newValues = $this->getDirty();
            foreach (array_keys($newValues) as $attribute) {
                $oldValues[$attribute] = $this->getOriginal($attribute);
            }
        } elseif ($event === 'created') {
            $newValues = $this->getAttributes();
            // Remove sensitive fields if necessary
            unset($newValues['password']);
        } elseif ($event === 'deleted') {
            $oldValues = $this->getAttributes();
            unset($oldValues['password']);
        }

        AuditLog::create([
            'user_id' => Auth::id(),
            'event' => $event,
            'auditable_type' => get_class($this),
            'auditable_id' => $this->getKey(),
            'old_values' => $oldValues ?: null,
            'new_values' => $newValues ?: null,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
