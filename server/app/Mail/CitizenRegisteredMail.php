<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class CitizenRegisteredMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;

    
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to the Municipality System'
        );
    }

    
    public function content(): Content
    {
        return new Content(
            view: 'emails.citizen_registered',
            with: [
                'user' => $this->user,
            ]
        );
    }

   
    public function attachments(): array
    {
        return [];
    }
}