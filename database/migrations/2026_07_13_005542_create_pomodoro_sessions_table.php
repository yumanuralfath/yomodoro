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
        Schema::create('pomodoro_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('api_user_id'); // id user dari API eksternal, tanpa FK
            $table->string('task_name')->nullable();
            $table->enum('type', ['work', 'short_break', 'long_break']);
            $table->unsignedInteger('duration_minutes');
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pomodoro_sessions');
    }
};
