# SMS Aero — интеграция

## Статус
- ⏸️ Отложено — требуется рабочий домен для настройки подписи (sign)
- На данный момент работает **debug-режим**: код пишется в лог, реальная отправка не происходит

## Провайдер
- **SMS Aero** (https://smsaero.ru)
- API URL: `https://gate.smsaero.ru/v2`
- Документация: https://smsaero.ru/integration/documentation/api/

## Учётные данные (`.env`)
```
SMS_AERO_EMAIL=frederol123@gmail.com
SMS_AERO_API_KEY=jmVJ9WLjtV6xVJ66AA7xGwtkJdgmOQfZ
SMS_AERO_SIGN=KodBessmert
SMS_DEBUG=true
```

## Что нужно сделать для включения

### 1. Получить подпись (sign)
Подпись отправителя обязательна. Способы:
- Зайти в личный кабинет https://gate.smsaero.ru → найти раздел «Подписи» / «Sender names» → создать подпись (макс 11 символов, латиница)
- Или написать в поддержку (чат на сайте / support@smsaero.ru): *«Пополнил баланс, не могу создать подпись для API, помогите создать "KodBessmert"»*

Как только подпись появится — SMS Aero её одобрит (обычно несколько минут).

> ⚠️ Если подписи создаются только при наличии домена — отложить до появления домена.

### 2. Настроить на сайте
После одобрения подписи:
1. В `.env`: `SMS_DEBUG=false`
2. В `app/Services/SmsService.php`: добавить `'sign' => $this->sign,` обратно в POST-запрос (сейчас закомментирован)
3. Перезапустить контейнер: `docker compose restart app`

## API эндпоинты
| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/auth/send-code` | Отправить SMS с кодом подтверждения |
| POST | `/auth/verify-phone` | Подтвердить код и зарегистрировать |

## Debug-режим
Пока `SMS_DEBUG=true`:
- Код НЕ отправляется в SMS Aero
- Генерируется 4-значный код и сохраняется в БД (`phone_verifications`)
- Код пишется в лог: `docker compose exec -T -w /app app grep "verification code" storage/logs/laravel.log`
- Пользователь видит «Код отправлен на указанный номер» (как при реальной отправке)

## Файлы интеграции
- `app/Services/SmsService.php` — сервис отправки SMS
- `app/Http/Controllers/Api/PhoneVerificationController.php` — контроллер
- `app/Models/PhoneVerification.php` — модель для хранения кодов
- `config/services.php` — конфиг (ключи, sign, debug)
- `database/migrations/..._add_phone_to_users_table.php` — поле phone в users
- `database/migrations/..._create_phone_verifications_table.php` — таблица кодов
