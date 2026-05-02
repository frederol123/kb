export default function HomePage() {
    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Код бессмертия</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
                Сохраните память о близких. Создайте цифровой мемориал с QR-кодом, который останется навсегда.
            </p>
            <div className="flex justify-center gap-4">
                <a href="/lk" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700">
                    Создать анкету
                </a>
                <a href="/news" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200">
                    Новости
                </a>
            </div>
        </div>
    );
}
