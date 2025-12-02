<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'citizen_id',
        'amount',
        'payment_type',
        'date',
        'status',
    ];

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }
}
