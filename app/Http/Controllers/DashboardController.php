<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Loading;
use App\Models\User;
use App\Models\Vessel;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('dashboard', [
            'stats' => Inertia::defer(fn () => $this->getStats($request, $user)),
            'filters' => [
                'from' => $request->query('from'),
                'to' => $request->query('to'),
                'customer_id' => $request->query('customer_id'),
                'shipper_id' => $request->query('shipper_id'),
                'vessel_id' => $request->query('vessel_id'),
                'product_id' => $request->query('product_id'),
                'status' => $request->query('status'),
            ],
        ]);
    }

    private function getStats(Request $request, User $user): array
    {
        $query = Folder::query();

        // Application de la restriction de profil
        if ($user->role === 'shipper') {
            $query->where('shipper_id', $user->id);
        }

        // Filtres dynamiques
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }
        if ($request->filled('shipper_id')) {
            $query->where('shipper_id', $request->shipper_id);
        }
        if ($request->filled('vessel_name')) { // Utilisation du nom du navire comme dans le modèle Folder
            $query->where('vessel_name', $request->vessel_name);
        }
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('from') && $request->filled('to')) {
            $query->whereBetween('created_at', [
                Carbon::parse($request->from)->startOfDay(),
                Carbon::parse($request->to)->endOfDay(),
            ]);
        }

        $baseQuery = clone $query;

        return [
            'kpis' => $this->getKPIs($baseQuery),
            'containers' => $this->getContainerStats($baseQuery),
            'status_distribution' => $this->getStatusDistribution($baseQuery),
            'shipper_performance' => $this->getShipperPerformance($request),
            'upcoming_arrivals' => $this->getUpcomingArrivals($baseQuery),
        ];
    }

    private function getKPIs($query): array
    {
        $q = clone $query;

        return [
            'in_progress' => (clone $q)->whereNotIn('status', ['closed', 'closed_late', 'cancelled'])->count(),
            'closed_this_month' => (clone $q)->whereIn('status', ['closed', 'closed_late'])
                ->whereMonth('updated_at', Carbon::now()->month)
                ->count(),
            'active_alerts' => (clone $q)->whereDate('loading_deadline', '<=', Carbon::now()->addDays(4))
                ->whereNotIn('status', ['closed', 'closed_late', 'cancelled'])
                ->count(),
            'overdue' => (clone $q)->whereDate('loading_deadline', '<', Carbon::now())
                ->whereNotIn('status', ['closed', 'closed_late', 'cancelled'])
                ->count(),
        ];
    }

    private function getContainerStats($query): array
    {
        $folders = (clone $query)->get(['container_type', 'container_count', 'id']);

        $total20 = $folders->where('container_type', 20)->sum('container_count');
        $total40 = $folders->where('container_type', 40)->sum('container_count');
        $total45 = $folders->where('container_type', 45)->sum('container_count');

        $loaded = Loading::whereIn('folder_id', $folders->pluck('id'))
            ->sum('loaded_container_count');

        return [
            'total' => $total20 + $total40 + $total45,
            'by_type' => [
                '20ft' => $total20,
                '40ft' => $total40,
                '45ft' => $total45,
            ],
            'loaded' => (int) $loaded,
            'remaining' => ($total20 + $total40 + $total45) - $loaded,
        ];
    }

    private function getStatusDistribution($query): array
    {
        return (clone $query)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                $status = $item->status instanceof \UnitEnum ? $item->status->value : $item->status;

                return [$status => $item->count];
            })
            ->toArray();
    }

    private function getShipperPerformance(Request $request): array
    {
        return User::where('role', 'shipper')
            ->withCount(['folders as in_progress_count' => function ($q) {
                $q->whereNotIn('status', ['closed', 'closed_late', 'cancelled']);
            }])
            ->withCount(['folders as closed_count' => function ($q) {
                $q->whereIn('status', ['closed', 'closed_late']);
            }])
            ->get()
            ->map(function ($user) {
                // Simulation de performance (en production, calculer à partir des dates réelles)
                $total = $user->in_progress_count + $user->closed_count;
                $punctuality = $total > 0 ? rand(70, 100) : 100; // Mock pour l'instant

                return [
                    'name' => $user->name,
                    'in_progress' => $user->in_progress_count,
                    'closed' => $user->closed_count,
                    'avg_delay' => rand(1, 5).' jours',
                    'punctuality' => $punctuality,
                ];
            })
            ->sortByDesc('closed')
            ->take(5)
            ->values()
            ->toArray();
    }

    private function getUpcomingArrivals($query): array
    {
        return (clone $query)
            ->whereNotNull('eta')
            ->whereDate('eta', '>=', Carbon::now())
            ->whereDate('eta', '<=', Carbon::now()->addDays(7))
            ->orderBy('eta', 'asc')
            ->get(['vessel_name', 'eta', 'folder_number', 'bl_number', 'container_count'])
            ->map(function ($folder) {
                return [
                    'vessel' => $folder->vessel_name,
                    'eta' => $folder->eta,
                    'folder_number' => $folder->folder_number,
                    'bl_number' => $folder->bl_number,
                    'container_count' => $folder->container_count,
                ];
            })
            ->values()
            ->toArray();
    }
}
