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
       Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
    $table->string('title',150);
    $table->foreignId('assignee_id')->nullable()->constrained('employees');
    $table->enum('status',['pending','in_progress','completed','on_hold'])->default('pending');
    $table->date('start_date')->nullable();
    $table->date('end_date')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
