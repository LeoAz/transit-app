<?php

namespace App\Actions\Folders;

use App\Enums\ContainerType;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use App\Models\Vessel;

final readonly class GetFolderFormDataAction
{
    public function handle(): array
    {
        return [
            'customers' => Customer::query()
                ->select(['id', 'company_name'])
                ->orderBy('company_name')
                ->get(),

            'shippers' => User::query()
                ->shippers()
                ->select(['id', 'name', 'email'])
                ->orderBy('name')
                ->get(),

            'products' => Product::query()
                ->select(['id', 'label'])
                ->orderBy('label')
                ->get(),

            'vessels' => Vessel::query()
                ->select(['id', 'name', 'company', 'flag'])
                ->orderBy('name')
                ->get(),

            'containerTypes' => ContainerType::options(),
        ];
    }
}
