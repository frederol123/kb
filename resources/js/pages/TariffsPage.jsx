export default function TariffsPage() {
    const tariffs = [
        { name: 'Базовый', price: 500, features: ['1 анкета', 'QR-код', 'Хранение 1 год'] },
        { name: 'Стандарт', price: 1500, features: ['5 анкет', 'QR-код', 'Галерея', 'Хранение 5 лет'] },
        { name: 'Вечный', price: 5000, features: ['Безлимит', 'QR-код', 'Галерея', 'Видео', 'Вечное хранение'] },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Тарифы</h1>
            <div className="grid md:grid-cols-3 gap-6">
                {tariffs.map((t) => (
                    <div key={t.name} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.name}</h2>
                        <p className="text-3xl font-bold text-blue-600 mb-4">{t.price} ₽</p>
                        <ul className="text-sm text-gray-500 space-y-2 mb-6">
                            {t.features.map((f) => <li key={f}>{f}</li>)}
                        </ul>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Выбрать</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
