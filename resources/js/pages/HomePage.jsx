import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <ServicesSection />
            <HowWorksSection />
            <OrderStepsSection />
            <TreeIntroduceSection />
            <PricesSection />
            <FAQSection />
            <HaveQuestionsSection />
            <LatestNewsSection />
            <CallbackSection />
        </>
    );
}

function HeroSection() {
    return (
        <section className="hero-section">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="flex-1">
                        <h1 className="hero-title">
                            Цифровой мемориал для сохранения памяти о близких
                        </h1>
                        <p className="hero-desc mb-8">
                            Создайте страницу памяти с биографией, фотографиями и видео. QR-код на памятнике позволит каждому посетителю узнать историю жизни вашего близкого.
                        </p>
                        <Link to="/tariffs" className="btn-filled text-lg px-10 py-4">Выбрать тариф</Link>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <img src="/images/hero.png" alt="Мемориал" className="max-w-full lg:max-w-[580px] rounded-2xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ServicesSection() {
    const services = [
        { title: 'Страница памяти', desc: 'Индивидуальная страница с биографией, фотографиями и видео', price: '500' },
        { title: 'QR-код', desc: 'Персональный QR-код для размещения на памятнике', price: '500' },
        { title: 'Генеалогическое древо', desc: 'Создание семейного древа с историей вашего рода', price: '1500' },
    ];

    return (
        <section className="py-16 lg:py-24 bg-[#f8f8f8]">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <h2 className="section-title text-center mb-3">Наши услуги</h2>
                <p className="section-desc text-center mb-12 max-w-2xl mx-auto">
                    Мы помогаем сохранить память о близких в цифровом формате
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    {services.map((s, i) => (
                        <div key={i} className="plan-card">
                            <h3 className="plan-card-title">{s.title}</h3>
                            <p className="text-[#6c6d7e] text-base leading-6">{s.desc}</p>
                            <div className="mt-auto">
                                <span className="plan-card-price">от {s.price} ₽</span>
                                <Link to="/tariffs" className="btn-filled w-full mt-4 text-center block">Подробнее</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowWorksSection() {
    const steps = [
        { title: 'Выберите тариф', desc: 'Ознакомьтесь с тарифами и выберите подходящий вариант для вашей семьи' },
        { title: 'Оплатите услугу', desc: 'Произведите оплату удобным способом через платёжную систему' },
        { title: 'Заполните анкету', desc: 'Укажите информацию о человеке: ФИО, даты, биографию, фотографии' },
        { title: 'Получите QR-код', desc: 'После публикации страницы скачайте QR-код для размещения на памятнике' },
    ];

    return (
        <section className="py-16 lg:py-24">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <h2 className="section-title text-center mb-3">Как это работает</h2>
                <p className="section-desc text-center mb-12 max-w-2xl mx-auto">
                    Простой процесс создания цифрового мемориала
                </p>
                <div className="grid md:grid-cols-4 gap-6">
                    {steps.map((s, i) => (
                        <div key={i} className="number-card flex flex-col items-center text-center gap-4">
                            <div className="number-card-num">{i + 1}</div>
                            <h3 className="font-extrabold text-lg text-[#1c2145]">{s.title}</h3>
                            <p className="text-[#6c6d7e] text-sm leading-5">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function OrderStepsSection() {
    const steps = [
        'Создайте аккаунт на сайте и авторизуйтесь в личном кабинете.',
        'Выберите подходящий тариф и оплатите его через систему ЮKassa.',
        'Заполните анкету: укажите ФИО, даты жизни, места рождения и ухода.',
        'Добавьте биографию, фотографии и видео. Настройте отображение контента.',
        'Опубликуйте страницу и скачайте персональный QR-код для размещения.',
    ];

    return (
        <section className="py-16 lg:py-24 bg-[#f8f8f8]">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <h2 className="section-title text-center mb-3">Как заказать</h2>
                <p className="section-desc text-center mb-12 max-w-2xl mx-auto">
                    Пошаговая инструкция по созданию мемориальной страницы
                </p>
                <div className="max-w-[700px] mx-auto">
                    {steps.map((s, i) => (
                        <div key={i} className="step-item">
                            <span className="step-label">Шаг {i + 1}</span>
                            <p className="text-[#6c6d7e] leading-6">{s}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TreeIntroduceSection() {
    return (
        <section className="py-16 lg:py-24">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="lg:w-[40%] flex justify-center">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 w-full max-w-[360px]">
                            <img src="/images/tree-introduce.jpg" alt="Семейное древо" className="w-full h-48 object-cover rounded-xl mb-4" />
                            <h3 className="font-extrabold text-lg text-[#1c2145] mb-1">Семья Ивановых</h3>
                            <p className="text-[#6c6d7e] text-sm">3 поколения, 12 человек</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="section-title mb-4">Генеалогическое древо</h2>
                        <p className="text-[#6c6d7e] text-lg leading-7 mb-8">
                            Создайте генеалогическое древо вашей семьи. Свяжите страницы родственников между собой, чтобы сохранить историю вашего рода для будущих поколений.
                        </p>
                        <Link to="/tariffs" className="btn-filled text-lg px-10 py-4">Выбрать тариф</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PricesSection() {
    const tariffs = [
        {
            name: 'Базовый',
            desc: 'Для сохранения памяти об одном человеке',
            price: '5 000',
            highlighted: false,
            features: ['1 страница памяти', 'QR-код для памятника', 'Хранение 1 год', 'Базовая поддержка'],
        },
        {
            name: 'Стандарт',
            desc: 'Для семейной истории',
            price: '12 000',
            highlighted: true,
            features: ['5 страниц памяти', 'QR-коды для памятников', 'Хранение 5 лет', 'Генеалогическое древо', 'Приоритетная поддержка'],
        },
        {
            name: 'Премиум',
            desc: 'Для сохранения истории рода',
            price: '25 000',
            highlighted: false,
            features: ['∞ страниц памяти', 'QR-коды для памятников', 'Вечное хранение', 'Генеалогическое древо', 'Видео-галерея', 'Персональный менеджер'],
        },
    ];

    return (
        <section className="py-16 lg:py-24 bg-[#f8f8f8]">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <h2 className="section-title text-center mb-3">Тарифы</h2>
                <p className="section-desc text-center mb-12 max-w-2xl mx-auto">
                    Выберите подходящий тариф для сохранения памяти
                </p>
                <div className="grid md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
                    {tariffs.map((t, i) => (
                        <div key={i} className={`plan-card ${t.highlighted ? 'plan-card-highlighted' : ''}`}>
                            {t.highlighted && <span className="plan-card-label">Оптимальный выбор</span>}
                            <h3 className="plan-card-title">{t.name}</h3>
                            <p className="text-[#6c6d7e] text-sm leading-5">{t.desc}</p>
                            <ul className="space-y-3 text-sm text-[#6c6d7e]">
                                {t.features.map((f, j) => (
                                    <li key={j} className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-[#3476f5] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <span className="plan-card-price">{t.price} ₽</span>
                            <Link to={`/tariffs?plan=${i}`} className={`w-full text-center block py-3 rounded-xl font-bold text-base ${t.highlighted ? 'btn-filled' : 'btn-outline'}`}>
                                Выбрать
                            </Link>
                            <p className="plan-card-under-note">Оплата через ЮKassa</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQSection() {
    const [openIdx, setOpenIdx] = useState(null);
    const faqs = [
        { q: 'Как долго хранится страница памяти?', a: 'Срок хранения зависит от выбранного тарифа: от 1 года до вечного хранения. После окончания срока вы можете продлить тариф.' },
        { q: 'Можно ли редактировать страницу после публикации?', a: 'Да, вы можете в любой момент вносить изменения в анкету через личный кабинет. Новые данные отображаются сразу после сохранения.' },
        { q: 'Как получить QR-код для памятника?', a: 'После публикации страницы вы можете скачать QR-код в личном кабинете. Рекомендуем заказать гравировку QR-кода на памятнике у производителя.' },
        { q: 'Что делать, если я забыл пароль?', a: 'Нажмите "Войти" в правом верхнем углу, затем "Восстановить пароль". На ваш email придёт ссылка для сброса пароля.' },
        { q: 'Можно ли перенести данные с другого сайта?', a: 'Да, напишите в службу поддержки. Мы поможем перенести данные с аналогичных сервисов при наличии доступа.' },
    ];

    return (
        <section className="py-16 lg:py-24">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <h2 className="section-title text-center mb-12">Частые вопросы</h2>
                <div className="max-w-[800px] mx-auto space-y-3">
                    {faqs.map((f, i) => (
                        <div key={i} className="expandable-card">
                            <button className="expandable-card-btn" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                                {f.q}
                                <svg className={`w-5 h-5 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIdx === i && (
                                <div className="expandable-card-content">{f.a}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HaveQuestionsSection() {
    return (
        <section className="py-16 lg:py-24 bg-[#f8f8f8]">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    <div className="flex-1">
                        <h2 className="section-title mb-3">Остались вопросы?</h2>
                        <p className="section-desc mb-6">
                            Оставьте свои контактные данные, либо напишите нам в социальных сетях.
                        </p>
                        <div className="flex gap-3 flex-wrap">
                            <a href="#" className="btn-outline text-sm">WhatsApp</a>
                            <a href="#" className="btn-outline text-sm">Telegram</a>
                            <a href="#" className="btn-outline text-sm">VK</a>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-[480px]">
                        <form className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4">
                            <input type="text" placeholder="Ваше имя" className="text-input" />
                            <input type="tel" placeholder="Телефон" className="text-input" />
                            <textarea placeholder="Ваш вопрос" rows={3} className="text-input resize-none" />
                            <button type="submit" className="btn-filled w-full">Отправить</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

function LatestNewsSection() {
    const news = [
        { title: 'Новые возможности личного кабинета', excerpt: 'Мы обновили интерфейс личного кабинета и добавили новые функции для управления анкетами.', img: '/images/news-1.jpg' },
        { title: 'QR-коды нового поколения', excerpt: 'Теперь QR-коды поддерживают динамическое обновление информации без замены таблички.', img: '/images/news-2.jpg' },
        { title: 'Партнёрская программа', excerpt: 'Приглашайте друзей и получайте скидки на продление тарифов.', img: '/images/single-news.jpg' },
    ];

    return (
        <section className="py-16 lg:py-24">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="section-title mb-2">Новости</h2>
                        <p className="section-desc">Последние обновления и события</p>
                    </div>
                    <Link to="/news" className="btn-outline hidden lg:inline-flex">Все новости</Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {news.map((n, i) => (
                        <article key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <img src={n.img} alt="" className="w-full h-48 object-cover" />
                            <div className="p-5">
                                <h3 className="font-extrabold text-lg text-[#1c2145] mb-2">{n.title}</h3>
                                <p className="text-[#6c6d7e] text-sm leading-5">{n.excerpt}</p>
                            </div>
                        </article>
                    ))}
                </div>
                <Link to="/news" className="btn-outline w-full mt-6 lg:hidden text-center block">Все новости</Link>
            </div>
        </section>
    );
}

function CallbackSection() {
    return (
        <section className="py-16 lg:py-24">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    <div className="flex-1">
                        <h2 className="section-title mb-3">Остались вопросы?</h2>
                        <p className="section-desc mb-6">
                            Оставьте свои контактные данные, заполнив строки справа, либо напишите нам в соц-сетях.
                        </p>
                        <div className="flex gap-3 flex-wrap">
                            <a href="#" className="btn-outline text-sm">WhatsApp</a>
                            <a href="#" className="btn-outline text-sm">Telegram</a>
                            <a href="#" className="btn-outline text-sm">VK</a>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-[480px]">
                        <form className="space-y-4">
                            <input type="text" placeholder="Ваше имя" className="text-input" />
                            <input type="tel" placeholder="Телефон" className="text-input" />
                            <textarea placeholder="Ваш вопрос" rows={3} className="text-input resize-none" />
                            <button type="submit" className="btn-filled w-full">Отправить</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
