<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssignmentHistory extends Model
{
    /**
     * Get the folder for this history entry.
     *
     * @return BelongsTo<Folder, $this>
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    /**
     * Get the previous shipper.
     *
     * @return BelongsTo<Shipper, $this>
     */
    public function previousShipper(): BelongsTo
    {
        return $this->belongsTo(Shipper::class, 'previous_shipper_id');
    }

    /**
     * Get the new shipper.
     *
     * @return BelongsTo<Shipper, $this>
     */
    public function newShipper(): BelongsTo
    {
        return $this->belongsTo(Shipper::class, 'new_shipper_id');
    }

    /**
     * Get the user who performed the change.
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
            'changed_at' => 'datetime',
        ];
    }
}
