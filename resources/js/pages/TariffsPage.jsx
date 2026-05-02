import { Link } from 'react-router-dom';

const tariffs = [
    {
        name: 'Базовый',
        desc: 'Для сохранения памяти об одном человеке',
        price: '5 000',
        highlighted: false,
        icon: '/images/icons/badge-pet.svg',
        features: [
            { text: '1 страница памяти' },
            { text: 'QR-код для памятника' },
            { text: 'Хранение данных — 1 год' },
            { text: 'Базовая поддержка' },
        ],
    },
    {
        name: 'Стандарт',
        desc: 'Для семейной истории',
        price: '12 000',
        highlighted: true,
        icon: '/images/icons/badge-special.svg',
        features: [
            { text: '5 страниц памяти' },
            { text: 'QR-коды для памятников' },
            { text: 'Хранение данных — 5 лет' },
            { text: 'Генеалогическое древо' },
            { text: 'Приоритетная поддержка' },
        ],
    },
    {
        name: 'Премиум',
        desc: 'Для сохранения истории рода',
        price: '25 000',
        highlighted: false,
        icon: null,
        features: [
            { text: '∞ страниц памяти' },
            { text: 'QR-коды для памятников' },
            { text: 'Вечное хранение' },
            { text: 'Генеалогическое древо' },
            { text: 'Видео-галерея' },
            { text: 'Персональный менеджер' },
        ],
    },
];

export default function TariffsPage() {
    return (
        <div className="py-10 lg:py-20 bg-[#f8f8f8]">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <h1 className="section-title text-center mb-3">Тарифы</h1>
                <p className="section-desc text-center mb-12 max-w-2xl mx-auto">
                    Выберите тарифный план для создания цифрового мемориала
                </p>
                <div className="grid md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
                    {tariffs.map((t, i) => (
                        <div key={i} className={`plan-card ${t.highlighted ? 'plan-card-highlighted' : ''}`}>
                            {t.icon && (
                                <div className="flex justify-center -mt-2">
                                    <img src={t.icon} alt="" className="w-16 h-16" />
                                </div>
                            )}
                            {t.highlighted && <span className="plan-card-label">Оптимальный выбор</span>}
                            <h3 className="plan-card-title">{t.name}</h3>
                            <p className="text-[#6c6d7e] text-sm leading-5">{t.desc}</p>
                            <div className="space-y-2">
                                {t.features.map((f, j) => (
                                    <div key={j} className="flex items-start gap-2 text-sm text-[#6c6d7e]">
                                        <svg className="w-5 h-5 text-[#3476f5] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {f.text}
                                    </div>
                                ))}
                            </div>
                            <span className="plan-card-price">{t.price} ₽</span>
                            <Link to="/lk" className={`w-full text-center block py-3 rounded-xl font-bold text-base ${t.highlighted ? 'btn-filled' : 'btn-outline'}`}>
                                Выбрать
                            </Link>
                            <p className="plan-card-under-note">Оплата через ЮKassa</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
