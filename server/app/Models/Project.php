<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'department_id',
        'budget',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'budget'     => 'decimal:2',
    ];
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
