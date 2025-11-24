<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Citizen extends Model
{
    protected $fillable = [
        'user_id',
        'national_id',
        'address',
        'contact',
        'date_of_birth',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    public function permits()
    {
        return $this->hasMany(Permit::class, 'applicant_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
