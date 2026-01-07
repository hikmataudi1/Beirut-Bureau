<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens,HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
     protected $fillable = [
        'name',
        'email',
        'role',
        'department_id',
        'password',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

     // One-to-one: A user can have one citizen profile
    public function citizen()
    {
        return $this->hasOne(Citizen::class);
    }

    // One-to-one: A user can be an employee
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    // One-to-many: A user can upload many documents
    public function documents()
    {
        return $this->hasMany(Document::class, 'uploaded_by');
    }

    // Optional: Belongs to department
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
