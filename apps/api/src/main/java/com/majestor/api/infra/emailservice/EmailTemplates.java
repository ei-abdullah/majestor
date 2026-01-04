package com.majestor.api.infra.emailservice;

public class EmailTemplates {

    private EmailTemplates() {
        // Utility class
    }

    public static String getVerificationSuccessPage() {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verified - Majestor</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #F7F9FC 0%, #E6ECF5 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    .container {
                        background: #FFFFFF;
                        border-radius: 24px;
                        box-shadow: 0 8px 40px rgba(58, 111, 248, 0.15);
                        max-width: 480px;
                        width: 100%;
                        overflow: hidden;
                        animation: slideUp 0.6s ease-out;
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .header {
                        background: linear-gradient(135deg, #3A6FF8 0%, #6FD0C5 100%);
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #FFFFFF;
                        font-size: 28px;
                        font-weight: 700;
                        letter-spacing: -0.5px;
                    }
                    .header p {
                        color: rgba(255, 255, 255, 0.9);
                        font-size: 14px;
                        margin-top: 6px;
                    }
                    .content {
                        padding: 48px 40px;
                        text-align: center;
                    }
                    .icon-wrapper {
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #6FD0C5 0%, #4CB8AD 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 24px;
                        animation: bounce 0.6s ease-out 0.3s both;
                    }
                    @keyframes bounce {
                        0% { transform: scale(0); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                    .icon-wrapper svg {
                        width: 40px;
                        height: 40px;
                        stroke: #FFFFFF;
                        stroke-width: 3;
                        fill: none;
                    }
                    .content h2 {
                        color: #121826;
                        font-size: 24px;
                        font-weight: 600;
                        margin-bottom: 12px;
                    }
                    .content p {
                        color: #5A6275;
                        font-size: 16px;
                        line-height: 1.6;
                    }
                    .footer {
                        background: #121826;
                        padding: 20px;
                        text-align: center;
                    }
                    .footer p {
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 12px;
                    }
                    .footer .brand {
                        color: #FFFFFF;
                        font-weight: 600;
                        font-size: 14px;
                        margin-bottom: 4px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Majestor</h1>
                        <p>Your Academic Companion</p>
                    </div>
                    <div class="content">
                        <div class="icon-wrapper">
                            <svg viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h2>Email Verified!</h2>
                        <p>Your email has been successfully verified. You can now close this page and log in to your account.</p>
                    </div>
                    <div class="footer">
                        <p class="brand">Majestor</p>
                        <p>© 2026 Majestor. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """;
    }

    public static String getVerificationErrorPage(String errorMessage) {
        String displayMessage = "The verification link is invalid or has expired. Please request a new verification email from the app.";
        if (errorMessage != null && errorMessage.contains("already verified")) {
            displayMessage = "This email has already been verified. You can close this page and log in to your account.";
        }

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verification Failed - Majestor</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #F7F9FC 0%%, #E6ECF5 100%%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    .container {
                        background: #FFFFFF;
                        border-radius: 24px;
                        box-shadow: 0 8px 40px rgba(233, 79, 55, 0.15);
                        max-width: 480px;
                        width: 100%%;
                        overflow: hidden;
                        animation: slideUp 0.6s ease-out;
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .header {
                        background: linear-gradient(135deg, #3A6FF8 0%%, #6FD0C5 100%%);
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: #FFFFFF;
                        font-size: 28px;
                        font-weight: 700;
                        letter-spacing: -0.5px;
                    }
                    .header p {
                        color: rgba(255, 255, 255, 0.9);
                        font-size: 14px;
                        margin-top: 6px;
                    }
                    .content {
                        padding: 48px 40px;
                        text-align: center;
                    }
                    .icon-wrapper {
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #E94F37 0%%, #D63B2A 100%%);
                        border-radius: 50%%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 24px;
                        animation: shake 0.6s ease-out 0.3s both;
                    }
                    @keyframes shake {
                        0%%, 100%% { transform: translateX(0); }
                        20%%, 60%% { transform: translateX(-5px); }
                        40%%, 80%% { transform: translateX(5px); }
                    }
                    .icon-wrapper svg {
                        width: 40px;
                        height: 40px;
                        stroke: #FFFFFF;
                        stroke-width: 3;
                        fill: none;
                    }
                    .content h2 {
                        color: #121826;
                        font-size: 24px;
                        font-weight: 600;
                        margin-bottom: 12px;
                    }
                    .content p {
                        color: #5A6275;
                        font-size: 16px;
                        line-height: 1.6;
                    }
                    .footer {
                        background: #121826;
                        padding: 20px;
                        text-align: center;
                    }
                    .footer p {
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 12px;
                    }
                    .footer .brand {
                        color: #FFFFFF;
                        font-weight: 600;
                        font-size: 14px;
                        margin-bottom: 4px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Majestor</h1>
                        <p>Your Academic Companion</p>
                    </div>
                    <div class="content">
                        <div class="icon-wrapper">
                            <svg viewBox="0 0 24 24">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                        <h2>Verification Issue</h2>
                        <p>%s</p>
                    </div>
                    <div class="footer">
                        <p class="brand">Majestor</p>
                        <p>© 2026 Majestor. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(displayMessage);
    }
}

