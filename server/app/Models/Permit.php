<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permit extends Model
{
    protected $fillable = [
        'type',
        'applicant_id',
        'status',
        'issue_date',
        'expiry_date',
        'related_documents',
    ];

    protected $casts = [
        'related_documents' => 'array',
    ];

    public function applicant()
    {
        return $this->belongsTo(Citizen::class, 'applicant_id');
    }
    public function citizen()
    {
        return $this->belongsTo(Citizen::class, 'applicant_id');
    }

}
