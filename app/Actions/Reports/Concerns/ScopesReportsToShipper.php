<?php

namespace App\Actions\Reports\Concerns;

use App\Enums\UserRole;
use App\Models\Folder;
use App\Models\Loading;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

trait ScopesReportsToShipper
{
    /**
     * @param  Builder<Folder>  $query
     * @return Builder<Folder>
     */
    private function scopeToShipper(Builder $query, ?User $user): Builder
    {
        if ($user?->role === UserRole::SHIPPER) {
            $query->where('shipper_id', $user->id);
        }

        return $query;
    }

    /**
     * @param  Builder<Loading>  $query
     * @return Builder<Loading>
     */
    private function scopeLoadingsToShipper(Builder $query, ?User $user): Builder
    {
        if ($user?->role === UserRole::SHIPPER) {
            $query->whereHas('folder', fn (Builder $q) => $q->where('shipper_id', $user->id));
        }

        return $query;
    }
}
