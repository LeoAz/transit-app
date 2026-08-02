<?php

namespace App\Models;

use App\Enums\ContainerType;
use App\Enums\FolderStatus;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

class Folder extends Model
{
    use Auditable, HasFactory;

    /**
     * Structure des relations à eager-loader pour la vue Détails.
     */
    public const SHOW_RELATIONS = [
        'customer',
        'shipper',
        'product',
        'vessel',
        'loadings.user',
        'documents.user',
        'assignmentHistories.previousShipper',
        'assignmentHistories.newShipper',
        'assignmentHistories.user',
    ];

    /**
     * Initialisation du modèle (Génération automatique du numéro de dossier).
     */
    protected static function booted(): void
    {
        static::creating(function (Folder $folder) {
            if (! $folder->folder_number) {
                $year = now()->year;
                $lastFolder = static::query()
                    ->whereYear('created_at', $year)
                    ->orderByDesc('id')
                    ->first();

                $nextNumber = 1;
                if ($lastFolder && preg_match('/DOS-\d{4}-(\d+)/', $lastFolder->folder_number, $matches)) {
                    $nextNumber = (int) $matches[1] + 1;
                }

                $folder->folder_number = sprintf('DOS-%d-%04d', $year, $nextNumber);
            }
        });
    }

    /**
     * Charge explicitement les relations de la vue Show pour garantir
     * leur sérialisation dans la réponse Inertia.
     */
    public function loadShowRelations(): static
    {
        return $this->load(self::SHOW_RELATIONS);
    }

    /**
     * Scope pour filtrer sur une plage de dates de création.
     */
    public function scopeBetweenDates(Builder $query, Carbon $start, Carbon $end): void
    {
        $query->whereBetween('created_at', [$start, $end]);
    }

    /**
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function shipper(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shipper_id');
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return BelongsTo<Vessel, $this>
     */
    public function vessel(): BelongsTo
    {
        return $this->belongsTo(Vessel::class);
    }

    /**
     * @return HasMany<Loading, $this>
     */
    public function loadings(): HasMany
    {
        return $this->hasMany(Loading::class);
    }

    /**
     * @return HasMany<Document, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /**
     * @return HasMany<AssignmentHistory, $this>
     */
    public function assignmentHistories(): HasMany
    {
        return $this->hasMany(AssignmentHistory::class);
    }

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
