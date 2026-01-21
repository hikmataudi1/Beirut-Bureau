<!DOCTYPE html>
<html>
<body>
    <h2>Payment Successful 💳</h2>

    <p>Hello {{ $user->name }},</p>

    <p>Your payment was completed successfully.</p>

    <ul>
        <li><strong>Amount:</strong> {{ $payment->amount }}</li>
        <li><strong>Type:</strong> {{ $payment->payment_type }}</li>
        <li><strong>Date:</strong> {{ $payment->date }}</li>
        <li><strong>Status:</strong> {{ $payment->status }}</li>
    </ul>

    <p>You can now generate your receipt from the system.</p>

    <br>
    <small>Municipality Management System</small>
</body>
</html>