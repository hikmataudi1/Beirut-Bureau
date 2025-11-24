<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $fillable = [
        'citizen_id',
        'type',
        'status',
        'submission_date',
        'completion_date',
    ];
    public $timestamps = true;

    //each request belongs to one citizen
    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }
}
