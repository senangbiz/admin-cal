<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #18181b;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff;">
                                {{ config('app.name') }}
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #18181b;">
                                Verify your email address
                            </h2>
                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #52525b;">
                                Thank you for registering! Please use the verification code below to complete your registration.
                            </p>
                            
                            <!-- OTP Code Box -->
                            <div style="text-align: center; margin: 32px 0;">
                                <div style="display: inline-block; padding: 20px 40px; background-color: #f4f4f5; border-radius: 8px; border: 2px dashed #d4d4d8;">
                                    <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #18181b; font-family: monospace;">
                                        {{ $otp }}
                                    </span>
                                </div>
                            </div>
                            
                            <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #71717a;">
                                This code will expire in <strong>10 minutes</strong>.
                            </p>
                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #71717a;">
                                If you didn't create an account, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
                            <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #a1a1aa; text-align: center;">
                                &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
