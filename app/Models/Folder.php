<?php

namespace App\Models;

use App\Enums\ContainerType;
use App\Enums\FolderStatus;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Folder extends Model
{
    use Auditable;

    /**
     * Get the customer associated with the folder.
     *
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the shipper assigned to the folder.
     *
     * @return BelongsTo<Shipper, $this>
     */
    public function shipper(): BelongsTo
    {
        return $this->belongsTo(Shipper::class);
    }

    /**
     * Get the product for the folder.
     *
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the loadings for the folder.
     *
     * @return HasMany<Loading, $this>
     */
    public function loadings(): HasMany
    {
        return $this->hasMany(Loading::class);
    }

    /**
     * Get the documents for the folder.
     *
     * @return HasMany<Document, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Get the assignment history for the folder.
     *
     * @return HasMany<AssignmentHistory, $this>
     */
    public function assignmentHistories(): HasMany
    {
        return $this->hasMany(AssignmentHistory::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'bl_received_at' => 'date',
            'eta' => 'date',
            'ata' => 'date',
            'loading_deadline' => 'date',
            'status' => FolderStatus::class,
            'container_type' => ContainerType::class,
        ];
    }
}
