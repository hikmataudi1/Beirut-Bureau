<!DOCTYPE html>
<html>
<body>
    <h2>Welcome {{ $user->name }} 👋</h2>

    <p>Your account has been successfully created in the Municipality System.</p>

    <p>
        Email: {{ $user->email }} <br>
        Status: Active
    </p>

    <p>Thank you for using our services.</p>

    <br>
    <small>This is an automated email. Do not reply.</small>
</body>
</html>