<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssignmentHistory extends Model
{
    use HasFactory;
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
     * @return BelongsTo<User, $this>
     */
    public function previousShipper(): BelongsTo
    {
        return $this->belongsTo(User::class, 'previous_shipper_id');
    }

    /**
     * Get the new shipper.
     *
     * @return BelongsTo<User, $this>
     */
    public function newShipper(): BelongsTo
    {
        return $this->belongsTo(User::class, 'new_shipper_id');
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
