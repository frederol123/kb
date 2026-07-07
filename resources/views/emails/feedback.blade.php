<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Новая заявка с сайта</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
        <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Имя</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">{{ $senderName }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Телефон</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">{{ $senderPhone }}</td>
        </tr>
    </table>
    <p style="color: #999; font-size: 12px; margin-top: 20px;">Отправлено с сайта immortal-code.ru</p>
</body>
</html>
