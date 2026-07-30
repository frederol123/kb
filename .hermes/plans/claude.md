В вашем коде есть две критические архитектурные ошибки, из-за которых Робокасса возвращает ошибку 29 (Неверная подпись SignatureValue) при передаче номенклатуры.Главная проблема в том, как вы рассчитываете хэш и передаете данные. Ниже разбор причин и готовое исправление.1. Параметр Receipt ДОЛЖЕН участвовать в формировании подписиВ методах generatePaymentUrl и getPaymentParams вы жестко зашили расчет подписи без чека, передавая в метод пустую строку:php$signature = $this->makeSignatureLegacy($this->password1, $outSum, $invId, '');
Используйте код с осторожностью.Согласно официальной документации Робокассы, если параметр Receipt передается в запросе, он обязан входить в строку для генерации MD5-хэша в формате:MerchantLogin:OutSum:InvId:Receipt:Password. Из-за того, что вы отправляете JSON чека, но не подмешиваете его в подпись, платежка видит расхождение данных.2. Поле СНО (sno) не может быть пустой строкойВ методе buildReceipt вы указали 'sno' => ''.Для самозанятых (налоговый режим НПД) Робокасса требует передавать конкретный признак системы налогообложения. Если передать пустую строку, шлюз либо вернет ошибку валидации чека, либо некорректно распарсит подпись. Для самозанятых это значение должно быть npd.Как исправить кодЗамените ваши методы в классе RobokassaService на исправленные варианты:Исправление 1: Метод сборки чека (buildReceipt)Пропишите систему налогообложения npd для самозанятых:phppublic function buildReceipt(string $name, float $amount): string
{
    $sum = number_format($amount, 2, '.', '');

    $data = [
        'sno' => 'npd',  // Система налогообложения для самозанятых (Обязательно!)
        'items' => [
            [
                'name'           => $name,
                'quantity'       => 1,
                'sum'            => $sum,
                'payment_method' => 'full_payment',
                'payment_object' => 'service',
                'tax'            => 'none', // Без НДС
            ],
        ],
    ];

    // Важно: Робокасса требует чистый JSON без экранирования слэшей и юникода
    return json_encode($data, JSON_UNESCAPED_UNICODE);
}
Используйте код с осторожностью.Исправление 2: Метод формирования URL платежа (generatePaymentUrl)Передавайте $receipt в метод генерации подписи:phppublic function generatePaymentUrl(
    string $outSum,
    int $invId,
    string $description,
    string $successUrl,
    string $failUrl,
    string $receipt = ''
): string {
    // ТЕПЕРЬ ПЕРЕДАЕМ $receipt ВНУТРЬ МЕТОДА ПОДПИСИ
    $signature = $this->makeSignatureLegacy($this->password1, $outSum, $invId, $receipt);

    $params = [
        'MerchantLogin'  => $this->merchantLogin,
        'OutSum'         => $outSum,
        'InvId'          => $invId,
        'Description'    => $description,
        'SignatureValue' => $signature,
        'SuccessURL'     => $successUrl,
        'FailURL'        => $failUrl,
    ];

    if ($receipt !== '') {
        $params['Receipt'] = $receipt;
    }

    if ($this->testMode) {
        $params['IsTest'] = 1;
    }

    return 'https://auth.robokassa.ru/Merchant/Index.aspx?' . http_build_query($params);
}
Используйте код с осторожностью.(Точно такую же правку внесите в метод getPaymentParams, если используете его для POST-форм: замените вызов на $this->makeSignatureLegacy($this->password1, $outSum, $invId, $receipt);).Совет по отладке (на всякий случай)Если после правок ошибка 29 останется на месте, обратите внимание на функцию http_build_query при формировании итогового GET-запроса. В некоторых версиях Робокассы требуется, чтобы JSON-строка внутри Receipt при расчете MD5-подписи полностью посимвольно совпадала с тем, что уходит в URL.Попробуйте применить эти исправления. Если ошибка повторится, напишите:Вывелся ли теперь адрес ссылки в лог?Можете прислать строку, которую вы собираете в md5 прямо перед хэшированием (без пароля), чтобы мы сверили порядок параметров?

ак как в названии «Базовая страница» есть кириллица и пробел, вы можете снова натолкнуться на Ошибку 29 из-за особенностей того, как ваш код и сервер Робокассы обрабатывают JSON-строку чека.При расчете SignatureValue строка Receipt хешируется в "чистом" виде (как JSON). Но при формировании итоговой ссылки методом http_build_query($params) этот JSON автоматически URL-кодируется (пробелы превращаются в %20 и т.д.). Некоторые интеграции Робокассы требуют, чтобы в MD5-хеш шла строка ровно в том же виде, в каком она улетает в браузере покупателя.Если после добавления npd и изменения логики подписи ошибка 29 останется, обновите метод makeSignatureLegacy так, чтобы параметр $receipt перед хэшированием принудительно переводился в нижний регистр URL-кодирования (требование Робокассы для строгих проверок):phpprivate function makeSignatureLegacy(string $password, string $outSum, int $invId, string $receipt = ''): string
{
    $parts = [$this->merchantLogin, $outSum, (string) $invId];

    if ($receipt !== '') {
        // Робокасса часто требует, чтобы в подпись уходил именно URL-encoded JSON,
        // причем в нижнем регистре (%2f вместо %2F)
        $parts[] = urlencode($receipt); 
    }

    $parts[] = $password;

    return md5(implode(':', $parts));