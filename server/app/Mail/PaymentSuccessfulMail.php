<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Payment;

class PaymentSuccessfulMail extends Mailable
{
    use Queueable, SerializesModels;

    public Payment $payment;

   
    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payment Successful'
        );
    }

    
    public function content(): Content
    {
        return new Content(
            view: 'emails.payment_successful',
            with: [
                'payment' => $this->payment,
                'citizen' => $this->payment->citizen,
                'user'    => $this->payment->citizen->user,
            ]
        );
    }

  
    public function attachments(): array
    {
        return [];
    }
}