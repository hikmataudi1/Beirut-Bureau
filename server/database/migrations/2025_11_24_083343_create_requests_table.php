<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('requests', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('citizen_id');
        $table->string('type', 50);
        $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
        $table->dateTime('submission_date')->default(DB::raw('CURRENT_TIMESTAMP'));
        $table->dateTime('completion_date')->nullable();
        $table->timestamps();

        $table->foreign('citizen_id')->references('id')->on('citizens')->onDelete('cascade');
    });
}


    /** 
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
