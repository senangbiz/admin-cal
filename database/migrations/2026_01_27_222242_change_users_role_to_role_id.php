<?php

use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create default roles if they don't exist
        $defaultRoles = [
            ['name' => 'User', 'slug' => 'user', 'description' => 'Regular user account', 'is_active' => true],
            ['name' => 'Agent', 'slug' => 'agent', 'description' => 'Agent account', 'is_active' => true],
            ['name' => 'Admin', 'slug' => 'admin', 'description' => 'Administrator account', 'is_active' => true],
        ];

        foreach ($defaultRoles as $roleData) {
            Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );
        }

        // Get role IDs
        $userRole = Role::where('slug', 'user')->first();
        $agentRole = Role::where('slug', 'agent')->first();
        $adminRole = Role::where('slug', 'admin')->first();

        Schema::table('users', function (Blueprint $table) {
            // Add role_id column
            $table->foreignId('role_id')->nullable()->after('email')->constrained('roles')->onDelete('set null');
        });

        // Migrate existing role data if role column exists
        if (Schema::hasColumn('users', 'role')) {
            DB::table('users')->whereNull('role_id')->update(['role_id' => $userRole->id]);
            
            // Map existing role strings to role_ids
            DB::table('users')
                ->where('role', 'agent')
                ->update(['role_id' => $agentRole->id]);
            
            DB::table('users')
                ->where('role', 'admin')
                ->update(['role_id' => $adminRole->id]);

            // Drop the old role column
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('email');
        });

        // Migrate role_id back to role string
        $roles = Role::all()->keyBy('id');
        DB::table('users')->get()->each(function ($user) use ($roles) {
            if ($user->role_id && isset($roles[$user->role_id])) {
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['role' => $roles[$user->role_id]->slug]);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
    }
};
