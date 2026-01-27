<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create admin role
        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Administrator account',
                'is_active' => true,
            ]
        );

        // Create admin user if it doesn't exist
        $user = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id,
            ]
        );

        // Update role_id if user exists but doesn't have the admin role
        if ($user->role_id !== $adminRole->id) {
            $user->update(['role_id' => $adminRole->id]);
        }
    }
}
