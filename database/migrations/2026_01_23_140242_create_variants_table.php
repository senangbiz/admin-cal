<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('model_id')->constrained('models')->onDelete('cascade');
            $table->string('name');
            $table->string('image')->nullable();
            $table->string('description')->nullable();
            $table->string('price');
            $table->string('discount_price')->nullable();
            $table->string('discount_percentage')->nullable();
            $table->string('discount_start_date')->nullable();
            $table->string('discount_end_date')->nullable();
            $table->string('discount_type')->nullable();
            $table->string('discount_value')->nullable();
            $table->string('discount_code')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variants');
    }
};
