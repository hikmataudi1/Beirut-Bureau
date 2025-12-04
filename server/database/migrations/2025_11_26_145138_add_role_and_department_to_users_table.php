<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            
            $table->enum('role', [
                            'Admin',
                            'Mayor',
                            'Municipal Director',
                            'Finance Officer',
                            'Urban Planner',
                            'Project Manager',
                            'HR Manager',
                            'Clerk',
                            'Staff',
                            'Citizen',
                            'Resident'
                        ])->nullable()->after('id');

            $table->foreignId('role_id')->nullable();
            $table->foreignId('department_id')->nullable();
            $table->enum('status', ['active','inactive','suspended'])->default('active');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role_id', 'department_id', 'status']);
        });
    }
};
