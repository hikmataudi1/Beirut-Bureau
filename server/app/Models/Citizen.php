<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Citizen extends Model
{
    protected $fillable = ['user_id', 'national_id', 'address', 'contact', 'date_of_birth'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
