<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();
        $agent = $user->agent;

        $agentBrands = [];
        $carTypesByBrand = [];

        if ($agent) {
            $brands = $agent->brands()
                ->wherePivot('is_active', true)
                ->where('brands.is_active', true)
                ->with(['models' => fn ($q) => $q->where('is_active', true)->with(['variants' => fn ($q) => $q->where('is_active', true)])])
                ->get();

            foreach ($brands as $brand) {
                $agentBrands[] = [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'logo_url' => $brand->logo ? $this->logoUrl($brand->logo) : null,
                ];

                $carTypes = [];
                foreach ($brand->models as $model) {
                    $variants = $model->variants->map(fn ($v) => [
                        'id' => (string) $v->id,
                        'name' => $v->name,
                        'otrPrice' => (float) (preg_replace('/[^0-9.]/', '', $v->price) ?: 0),
                        'price' => $v->price,
                    ])->values()->all();

                    if (count($variants) === 0) {
                        continue;
                    }

                    $carTypes[] = [
                        'id' => (string) $model->id,
                        'name' => strtoupper($model->name),
                        'image' => $model->image ? $this->imageUrl($model->image) : null,
                        'apr' => 2.3,
                        'variants' => $variants,
                    ];
                }

                $carTypesByBrand[(string) $brand->id] = $carTypes;
            }
        }

        $profileData = [
            'name' => $user->name,
            'phone' => $agent?->phone ?? null,
        ];

        return Inertia::render('Agent/Dashboard', [
            'agentBrands' => $agentBrands,
            'carTypesByBrand' => $carTypesByBrand,
            'profileData' => $profileData,
        ]);
    }

    private function logoUrl(string $path): string
    {
        if (str_starts_with($path, 'http')) {
            return $path;
        }

        return asset('storage/'.$path);
    }

    private function imageUrl(string $path): string
    {
        if (str_starts_with($path, 'http')) {
            return $path;
        }

        return asset('storage/'.$path);
    }
}
