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
        Schema::create('permits', function (Blueprint $table) {
    $table->id();
    $table->string('type',50);
    $table->foreignId('applicant_id')->constrained('citizens')->onDelete('cascade');
    $table->enum('status',['pending','approved','rejected'])->default('pending');
    $table->date('issue_date')->nullable();
    $table->date('expiry_date')->nullable();
    $table->json('related_documents')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permits');
    }
};
