<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Brand;
use App\Models\CarModel;
use App\Models\Role;
use App\Models\User;
use App\Models\Variant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedCars();
        $this->seedAgents();
    }

    protected function seedCars(): void
    {
        $carData = [
            [
                'brand' => 'Toyota',
                'logo' => 'images/logo/Toyota.png',
                'description' => 'Leading automotive manufacturer',
                'models' => [
                    [
                        'name' => 'Vios',
                        'description' => 'Compact sedan',
                        'variants' => [
                            ['name' => '1.5J', 'price' => '89500', 'description' => 'Entry level'],
                            ['name' => '1.5E', 'price' => '98500', 'description' => 'Mid spec'],
                            ['name' => '1.5G', 'price' => '105500', 'description' => 'Full spec'],
                        ],
                    ],
                    [
                        'name' => 'Hilux',
                        'description' => 'Pickup truck',
                        'variants' => [
                            ['name' => '2.4 Single Cab', 'price' => '98500', 'description' => 'Workhorse'],
                            ['name' => '2.4 Double Cab', 'price' => '118500', 'description' => 'Family pickup'],
                            ['name' => 'Rogue', 'price' => '155000', 'description' => 'Top of the line'],
                        ],
                    ],
                ],
            ],
            [
                'brand' => 'Honda',
                'logo' => 'images/logo/Honda.png',
                'description' => 'Japanese automotive excellence',
                'models' => [
                    [
                        'name' => 'City',
                        'description' => 'Compact sedan',
                        'variants' => [
                            ['name' => 'S', 'price' => '84900', 'description' => 'Base model'],
                            ['name' => 'E', 'price' => '91900', 'description' => 'Standard'],
                            ['name' => 'RS', 'price' => '99900', 'description' => 'Sporty variant'],
                        ],
                    ],
                    [
                        'name' => 'CR-V',
                        'description' => 'SUV',
                        'variants' => [
                            ['name' => '2.0 Comfort', 'price' => '168000', 'description' => 'Entry SUV'],
                            ['name' => '2.0 Sport', 'price' => '183000', 'description' => 'Sport trim'],
                            ['name' => '1.5 Turbo Premium', 'price' => '198000', 'description' => 'Top spec'],
                        ],
                    ],
                ],
            ],
            [
                'brand' => 'Proton',
                'logo' => 'images/logo/Proton.png',
                'description' => 'National car manufacturer',
                'models' => [
                    [
                        'name' => 'X50',
                        'description' => 'Compact SUV',
                        'variants' => [
                            ['name' => 'Standard', 'price' => '86400', 'description' => 'Base trim'],
                            ['name' => 'Executive', 'price' => '94900', 'description' => 'Mid spec'],
                            ['name' => 'Flagship', 'price' => '103300', 'description' => 'Full spec with turbo'],
                        ],
                    ],
                    [
                        'name' => 'S70',
                        'description' => 'Executive sedan',
                        'variants' => [
                            ['name' => 'Executive', 'price' => '94800', 'description' => 'Entry executive'],
                            ['name' => 'Premium', 'price' => '108300', 'description' => 'Premium trim'],
                            ['name' => 'Flagship', 'price' => '118300', 'description' => 'Top of range'],
                        ],
                    ],
                ],
            ],
            [
                'brand' => 'Perodua',
                'logo' => 'images/logo/Perodua.png',
                'description' => 'Affordable and reliable',
                'models' => [
                    [
                        'name' => 'Myvi',
                        'description' => 'Best-selling B-segment',
                        'variants' => [
                            ['name' => '1.3G', 'price' => '50800', 'description' => 'Base model'],
                            ['name' => '1.5X', 'price' => '58800', 'description' => 'Mid variant'],
                            ['name' => '1.5AV', 'price' => '65800', 'description' => 'Advanced variant'],
                        ],
                    ],
                    [
                        'name' => 'Axia',
                        'description' => 'Entry-level hatchback',
                        'variants' => [
                            ['name' => 'G', 'price' => '38500', 'description' => 'Standard'],
                            ['name' => 'GXtra', 'price' => '42100', 'description' => 'Extra features'],
                            ['name' => 'AV', 'price' => '49800', 'description' => 'Advanced variant'],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($carData as $brandData) {
            $brand = Brand::updateOrCreate(
                ['name' => $brandData['brand']],
                [
                    'logo' => $brandData['logo'] ?? null,
                    'description' => $brandData['description'],
                    'is_active' => true,
                ]
            );

            foreach ($brandData['models'] as $modelData) {
                $model = CarModel::firstOrCreate(
                    [
                        'brand_id' => $brand->id,
                        'name' => $modelData['name'],
                    ],
                    [
                        'description' => $modelData['description'],
                        'is_active' => true,
                    ]
                );

                foreach ($modelData['variants'] as $variantData) {
                    Variant::firstOrCreate(
                        [
                            'model_id' => $model->id,
                            'name' => $variantData['name'],
                        ],
                        [
                            'description' => $variantData['description'],
                            'price' => $variantData['price'],
                            'is_active' => true,
                        ]
                    );
                }
            }
        }
    }

    protected function seedAgents(): void
    {
        $agentRole = Role::where('slug', 'agent')->first();
        if (! $agentRole) {
            return;
        }

        $agentsData = [
            [
                'name' => 'Ahmad Rahman',
                'email' => 'ahmad.rahman@senangbiz.com',
                'phone' => '+60123456789',
                'showroom_location' => 'Kuala Lumpur Showroom',
                'coverage_areas' => ['Kuala Lumpur', 'Petaling Jaya', 'Shah Alam'],
            ],
            [
                'name' => 'Siti Fatimah',
                'email' => 'siti.fatimah@senangbiz.com',
                'phone' => '+60198765432',
                'showroom_location' => 'Johor Bahru Showroom',
                'coverage_areas' => ['Johor Bahru', 'Pasir Gudang', 'Kulai'],
            ],
            [
                'name' => 'Lim Wei Ming',
                'email' => 'lim.weiming@senangbiz.com',
                'phone' => '+60123459876',
                'showroom_location' => 'Penang Showroom',
                'coverage_areas' => ['George Town', 'Bayan Lepas', 'Butterworth'],
            ],
            [
                'name' => 'Kumar Raj',
                'email' => 'kumar.raj@senangbiz.com',
                'phone' => '+60187654321',
                'showroom_location' => 'Ipoh Showroom',
                'coverage_areas' => ['Ipoh', 'Taiping', 'Kampar'],
            ],
            [
                'name' => 'Nurul Izzati',
                'email' => 'nurul.izzati@senangbiz.com',
                'phone' => '+60134567890',
                'showroom_location' => 'Kota Kinabalu Showroom',
                'coverage_areas' => ['Kota Kinabalu', 'Sandakan', 'Tawau'],
            ],
        ];

        $brands = Brand::all();

        foreach ($agentsData as $agentData) {
            $user = User::firstOrCreate(
                ['email' => $agentData['email']],
                [
                    'name' => $agentData['name'],
                    'password' => Hash::make('password'),
                ]
            );

            if (! $user->hasRole('agent')) {
                $user->roles()->attach($agentRole->id);
            }

            $agent = Agent::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'phone' => $agentData['phone'],
                    'showroom_location' => $agentData['showroom_location'],
                    'coverage_areas' => $agentData['coverage_areas'],
                    'is_active' => true,
                ]
            );

            // Attach 2-3 random brands to each agent
            if ($agent->brands()->count() === 0) {
                $agent->brands()->attach(
                    $brands->random(min(3, $brands->count()))->pluck('id')->toArray(),
                    ['is_active' => true]
                );
            }
        }
    }
}
