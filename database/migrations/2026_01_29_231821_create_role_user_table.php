<?php

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
        Schema::create('role_user', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('role_id')->constrained('roles')->onDelete('cascade');
            $table->primary(['user_id', 'role_id']);
            $table->timestamps();
        });

        // Migrate existing role_id from users into role_user
        $rows = DB::table('users')->whereNotNull('role_id')->get(['id', 'role_id']);
        foreach ($rows as $row) {
            DB::table('role_user')->insert([
                'user_id' => $row->id,
                'role_id' => $row->role_id,
            ]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('email')->constrained('roles')->onDelete('set null');
        });

        $pivot = DB::table('role_user')->get()->groupBy('user_id');
        foreach ($pivot as $userId => $rows) {
            DB::table('users')->where('id', $userId)->update(['role_id' => $rows->first()->role_id]);
        }

        Schema::dropIfExists('role_user');
    }
};
