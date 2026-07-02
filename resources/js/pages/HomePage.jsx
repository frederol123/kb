import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { useState } from 'react';

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <PricesSection />
            <HowItWorksSection />
            <TimelineSection />
            <TestimonialsSection />
            <HaveQuestionsSection />
            <CallbackSection />
        </>
    );
}

/* ======== HERO ======== */

function HeroSection() {
    return (
        <section className="hero">
            <div className="container hero__inner">
                <div className="hero__content">
                    <h1 className="hero__title">Каждая жизнь — это история, достойная вечности</h1>
                    <div className="hero__desc">
                        <p><strong>Код Бессмертия</strong> — это цифровой мемориал, где память о ваших близких живёт с теплотой и заботой. Мы бережно сохраняем всё самое важное: детство, семью, достижения, увлечения — всё то, что делает каждую жизнь уникальной.</p>
                        <p>Создайте вечную память для детей, внуков и будущих поколений. Разместите QR-код на памятнике — и каждый, кто придёт, сможет узнать историю человека, которого вы любите.</p>
                    </div>
                    <Link to="/tariffs" className="button button--filled hero__btn">Создать мемориал</Link>
                </div>
                <div className="hero__preview">
                    <img src="/uploads/2024/02/logo.jpg" alt="" className="hero__image" />
                </div>
            </div>
        </section>
    );
}

/* ======== ПРЕИМУЩЕСТВА (QR-код как главная фича) ======== */

function FeaturesSection() {
    const features = [
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e79d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <rect x="7" y="7" width="3" height="3" />
                    <rect x="14" y="7" width="3" height="3" />
                    <rect x="7" y="14" width="3" height="3" />
                    <rect x="14" y="14" width="3" height="3" />
                </svg>
            ),
            title: 'QR-код на памятнике',
            desc: 'Разместите QR-код на памятнике или табличке — любой, кто придёт, сможет мгновенно открыть историю жизни, увидеть фотографии и оставить соболезнование. Современный способ сохранить связь поколений.',
            accent: true,
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6c6d7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                </svg>
            ),
            title: 'Фото и видео',
            desc: 'Создайте галерею самых дорогих моментов: семейные фотографии, памятные видео, значимые события. Каждый снимок хранит частичку души и тепло воспоминаний.',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6c6d7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                </svg>
            ),
            title: 'История жизни',
            desc: 'Расскажите полную историю: детство, учёба, карьера, семья, увлечения. Добавьте таймлайн важных событий — от рождения до самых ярких моментов.',
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6c6d7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            title: 'Соболезнования',
            desc: 'Близкие, друзья и знакомые могут оставить тёплые слова памяти. Книга соболезнований навсегда сохранит каждое сказанное от сердца слово.',
        },
    ];

    return (
        <section className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-[40px] md:text-[48px] font-extrabold text-[#1c2145] leading-tight mb-4">
                        Всё, чтобы сохранить память
                    </h2>
                    <p className="text-[#6c6d7e] text-lg max-w-2xl mx-auto">
                        Цифровой мемориал объединяет технологии и душевную теплоту, чтобы история жизни осталась навсегда
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className={`rounded-[24px] p-8 transition-all duration-300 hover:-translate-y-1 ${
                                f.accent
                                    ? 'bg-gradient-to-br from-[#eef4ff] to-[#e6f0ff] border border-[#1e79d0]/20 shadow-[0_4px_24px_-4px_rgba(30,121,208,0.15)]'
                                    : 'bg-white border border-[#e9f0ff] shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_-8px_rgba(30,121,208,0.10)]'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                                f.accent ? 'bg-[#1e79d0]/10' : 'bg-[#f0f4ff]'
                            }`}>
                                {f.icon}
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${f.accent ? 'text-[#1e79d0]' : 'text-[#1c2145]'}`}>
                                {f.title}
                            </h3>
                            <p className="text-[#6c6d7e] text-base leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ======== ЦЕНЫ И ТАРИФЫ ======== */

function PricesSection() {
    return (
        <section className="plan-prices">
            <div className="container">
                <h2 className="section-title" style={{ textAlign: 'center' }}>Выберите формат памяти</h2>
                <span className="section-desc" style={{ textAlign: 'center', margin: '0 auto 50px auto' }}>
                    <p>Каждая история заслуживает достойного обрамления. Мы предлагаем несколько форматов цифрового мемориала — от базовой страницы до полноценного семейного древа с фотографиями и видео.</p>
                </span>
                <div className="prices-cards">
                    <PlanCard title="Базовая страница" price="6600" index={0}
                        features={[
                            { icon: 'icon-list-qr.svg', text: '1 генерация QR-кода' },
                            { icon: 'icon-list-qr.svg', text: 'Табличка с QR-кодом в футляре' },
                            { icon: 'icon-list-note.svg', text: 'Добавление биографии' },
                            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
                        ]} />
                    <PlanCard title="Расширенная страница" price="16500" highlighted index={1}
                        desc='<p>Включает в себя все возможности <strong>базовой страницы,</strong> с учетом генерации <strong>3 QR-кода</strong>. Возможность генерации QR-кода со скидкой 20% на следующие 3 анкеты.</p>'
                        features={[
                            { icon: 'icon-list-qr.svg', text: '3 генерации QR-кода' },
                            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
                            { icon: 'icon-list-mount.svg', text: 'Установка за счёт компании' },
                            { icon: 'icon-list-privacy.svg', text: 'Приватность' },
                        ]} />
                    <PlanCard title="Особая страница" price="27500" badge="badge-special.svg" index={2}
                        desc='<p>Включает в себя все возможности <strong>расширенной страницы,</strong> с учетом генерации <strong>5 QR-кода</strong>. Возможность генерации QR-кода со скидкой 20% на все следующие анкеты.</p>'
                        features={[
                            { icon: 'icon-list-qr.svg', text: '5 генераций QR-кода' },
                            { icon: 'icon-list-support.svg', text: 'Приоритетная поддержка 24/7' },
                        ]} />
                    <PlanCard title="Страница питомца" price="4400" badge="badge-pet.svg" index={3}
                        features={[
                            { icon: 'icon-list-qr.svg', text: '1 генерация QR-кода' },
                            { icon: 'icon-list-qr.svg', text: 'Табличка с QR-кодом в футляре' },
                            { icon: 'icon-list-note.svg', text: 'Добавление биографии' },
                            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
                        ]} />
                </div>
            </div>
        </section>
    );
}

function PlanCard({ title, price, desc, features, highlighted, badge, index }) {
    const { user } = useAuth();
    const [buyLoading, setBuyLoading] = useState(false);

    // tariff_id в БД: basic=1, extended=2, special=3, pet=4
    const tariffId = index + 1;

    const userPrice = parseFloat(user?.tariff?.price || 0);
    const cardPrice = parseFloat(price);
    const hasDiscount = userPrice > 0 && cardPrice > userPrice;
    const discountedPrice = hasDiscount ? cardPrice - userPrice : null;

    const handleBuy = async () => {
        if (!user) {
            window.dispatchEvent(new CustomEvent('auth:open'));
            return;
        }

        setBuyLoading(true);
        try {
            const { data } = await api.post('/robokassa/pay', { 
                tariff_id: tariffId,
                ...(hasDiscount ? { discounted_amount: discountedPrice } : {}),
            });
            if (data.payment_url) {
                window.location.href = data.payment_url;
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Ошибка при создании платежа';
            alert(msg);
        } finally {
            setBuyLoading(false);
        }
    };

    return (
        <div className={`plan-card ${highlighted ? 'plan-card--highlighted' : ''}`}>
            {badge && <div className="plan-card__badges"><img src={`/uploads/2024/02/${badge}`} alt="" className="plan-card__badge" /></div>}
            {highlighted && <span className="plan-card__label">Оптимальный выбор</span>}
            <span className="plan-card__title">{title}</span>
            {desc && <span className="plan-card__desc" dangerouslySetInnerHTML={{ __html: desc }} />}
            <div className="plan-card__body">
                <span className="plan-card__heading">Преимущества:</span>
                <div className="icon-list plan-card__advantages">
                    {features.map((f, i) => (
                        <div key={i} className="icon-list__item">
                            <img src={`/uploads/2024/02/${f.icon}`} alt="" className="icon-list__image" />
                            <div className="icon-list__content"><p>{f.text}</p></div>
                        </div>
                    ))}
                </div>
            </div>
            <span className="plan-card__price">
                {hasDiscount ? (
                    <span className="flex flex-col items-center">
                        <span className="line-through text-red-500 text-base">{price} ₽</span>
                        <span>{discountedPrice} ₽</span>
                    </span>
                ) : (
                    <>{price} ₽</>
                )}
            </span>
            <div className="plan-card__actions">
                <Link to="/tariffs" className={`button plan-card__btn ${highlighted ? 'button--filled' : ''}`}>Подробнее</Link>
                <button onClick={handleBuy} disabled={buyLoading}
                        className="button plan-card__btn plan-card__btn--buy">
                    {buyLoading ? 'Оплата...' : 'Купить'}
                </button>
            </div>
            <span className="plan-card__under-note">После оплаты анкеты сразу появятся в вашем Личном кабинете</span>
        </div>
    );
}

/* ======== КАК ЭТО РАБОТАЕТ (3 шага) ======== */

function HowItWorksSection() {
    const steps = [
        {
            num: 1,
            label: 'Шаг 1',
            heading: 'Выберите формат памяти',
            body: 'Ознакомьтесь с нашими тарифами и выберите подходящий формат цифрового мемориала. Каждый тариф включает всё необходимое, чтобы сохранить историю жизни с теплотой и достоинством.',
        },
        {
            num: 2,
            label: 'Шаг 2',
            heading: 'Создайте страницу памяти',
            body: 'Добавьте фотографии, напишите биографию, загрузите видео. Наполните мемориал самыми тёплыми воспоминаниями — всем тем, что делает жизнь человека уникальной.',
        },
        {
            num: 3,
            label: 'Шаг 3',
            heading: 'Установите QR-код',
            body: 'Получите готовый QR-код и разместите его на памятнике или табличке. Теперь каждый, кто придёт почтить память, сможет открыть цифровой мемориал и узнать историю близкого человека.',
        },
    ];

    return (
        <section className="py-20 md:py-28 bg-[#eef4ff] relative overflow-hidden">
            {/* декоративные элементы */}
            <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-[#1e79d0]/5 blur-[80px]" />
            <div className="absolute bottom-[-80px] left-[-80px] w-[250px] h-[250px] rounded-full bg-[#74d41d]/5 blur-[80px]" />

            <div className="container mx-auto px-6 max-w-7xl relative z-[1]">
                <div className="text-center mb-16">
                    <h2 className="text-[40px] md:text-[48px] font-extrabold text-[#1c2145] leading-tight mb-4">
                        Как это работает
                    </h2>
                    <p className="text-[#6c6d7e] text-lg max-w-2xl mx-auto">
                        Всего три простых шага, чтобы память о близком человеке жила вечно
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((s, i) => (
                        <div key={i} className="relative bg-white rounded-[24px] p-8 pt-12 shadow-[0_4px_20px_-4px_rgba(30,121,208,0.06)] border border-[#e9f0ff]">
                            {/* номер шага */}
                            <div className="absolute -top-4 left-8 w-10 h-10 rounded-full bg-[#74d41d] text-white font-extrabold text-lg flex items-center justify-center shadow-[0_4px_12px_rgba(116,212,29,0.3)]" style={{ transform: 'rotate(-3deg)' }}>
                                {s.num}
                            </div>

                            <span className="text-[#74d41d] text-[13px] font-bold uppercase tracking-[1.5px] block mb-1">
                                {s.label}
                            </span>
                            <h3 className="text-[#1c2145] text-xl font-extrabold mb-4">
                                {s.heading}
                            </h3>
                            <p className="text-[#6c6d7e] text-base leading-relaxed">
                                {s.body}
                            </p>

                            {/* соединительная линия между шагами */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-[#1e79d0]/20" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/order-steps" className="inline-flex items-center gap-2 text-[#1e79d0] font-bold hover:underline text-lg">
                        Подробнее о процессе оформления
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* ======== ТАЙМЛАЙН ======== */

function TimelineSection() {
    const events = [
        { year: '1939', title: 'Рождение', desc: 'Появился на свет в небольшом городе, в семье, где ценили труд и знания.' },
        { year: '1957', title: 'Окончание школы', desc: 'С отличием окончил школу и поступил в университет, выбрав путь инженера.' },
        { year: '1963', title: 'Свадьба', desc: 'Встретил свою вторую половинку. Вместе они построили дом и воспитали двоих детей.' },
        { year: '1985', title: 'Высшая награда', desc: 'Получил звание «Заслуженный работник». Весь трудовой путь — пример самоотдачи.' },
        { year: '2005', title: 'На заслуженном отдыхе', desc: 'Вышел на пенсию, но продолжал помогать детям и внукам, делиться мудростью и теплом.' },
        { year: '2023', title: 'Светлая память', desc: 'Ушёл из жизни, оставив после себя богатое наследие — любящую семью и добрую память.' },
    ];

    return (
        <section className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-[40px] md:text-[48px] font-extrabold text-[#1c2145] leading-tight mb-4">
                        Жизненный путь
                    </h2>
                    <p className="text-[#6c6d7e] text-lg max-w-2xl mx-auto">
                        Каждая жизнь — это череда событий, моментов и встреч. Вот как может выглядеть хронология на странице памяти
                    </p>
                </div>

                <div className="relative">
                    {/* вертикальная линия */}
                    <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#1e79d0] via-[#1e79d0]/40 to-transparent" />

                    <div className="space-y-12">
                        {events.map((e, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div key={i} className={`relative flex items-start gap-6 md:gap-0 ${
                                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                                }`}>
                                    {/* точка на линии */}
                                    <div className="relative z-[2] flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                                        <div className="w-[40px] h-[40px] rounded-full bg-white border-2 border-[#1e79d0] flex items-center justify-center shadow-[0_0_0_4px_rgba(30,121,208,0.1)]">
                                            <div className="w-[14px] h-[14px] rounded-full bg-[#1e79d0]" />
                                        </div>
                                    </div>

                                    {/* контент */}
                                    <div className={`flex-1 md:w-[calc(50%-40px)] ${
                                        isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'
                                    }`}>
                                        <div className="bg-[#f7fbff] rounded-[20px] p-6 border border-[#e9f0ff] hover:shadow-[0_4px_20px_-4px_rgba(30,121,208,0.10)] transition-shadow">
                                            <span className="text-[#1e79d0] font-extrabold text-2xl block mb-1">{e.year}</span>
                                            <h3 className="text-[#1c2145] font-bold text-lg mb-2">{e.title}</h3>
                                            <p className="text-[#6c6d7e] text-sm leading-relaxed">{e.desc}</p>
                                        </div>
                                    </div>

                                    {/* пустой блок для выравнивания на десктопе */}
                                    <div className="hidden md:block md:w-[calc(50%-40px)]" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ======== ОТЗЫВЫ ======== */

function TestimonialsSection() {
    const testimonials = [
        {
            name: 'Елена',
            role: 'внучка',
            text: 'Когда мы потеряли дедушку, очень хотелось сохранить память о нём для наших детей. Цифровой мемориал стал настоящим спасением — теперь внуки могут увидеть его фото, прочитать историю жизни. А QR-код на памятнике — это удивительно трогательно: каждый, кто приходит, может узнать, каким замечательным человеком он был.',
            rating: 5,
        },
        {
            name: 'Андрей',
            role: 'сын',
            text: 'Заказал расширенную страницу для мамы. Очень понравилось, что можно добавить не только фото, но и видео. Родственники из других городов оставляют соболезнования онлайн — для нас это очень важно. Спасибо за ваш труд и чуткое отношение.',
            rating: 5,
        },
        {
            name: 'Светлана',
            role: 'дочь',
            text: 'Создали мемориал для папы. Весь процесс — от выбора тарифа до установки QR-кода — прошёл очень бережно и профессионально. Особенно тронула книга соболезнований: столько тёплых слов от людей, которых папа когда-то коснулся своим сердцем.',
            rating: 5,
        },
    ];

    return (
        <section className="py-20 md:py-28 bg-[#f7fbff]">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-[40px] md:text-[48px] font-extrabold text-[#1c2145] leading-tight mb-4">
                        С благодарностью вспоминают
                    </h2>
                    <p className="text-[#6c6d7e] text-lg max-w-2xl mx-auto">
                        Историями делятся те, кто уже сохранил память о своих близких с помощью цифрового мемориала
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white rounded-[20px] p-8 border border-[#e9f0ff] shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_-8px_rgba(30,121,208,0.10)] transition-all duration-300 hover:-translate-y-1">
                            {/* звёзды */}
                            <div className="flex gap-1 mb-5">
                                {Array.from({ length: t.rating }).map((_, si) => (
                                    <svg key={si} width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ))}
                            </div>

                            <p className="text-[#6c6d7e] text-[15px] leading-relaxed mb-6 italic">
                                «{t.text}»
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#1e79d0]/10 flex items-center justify-center text-[#1e79d0] font-bold text-sm">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="text-[#1c2145] font-bold text-sm">{t.name}</div>
                                    <div className="text-[#6c6d7e] text-xs">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ======== ЕСТЬ ВОПРОСЫ ======== */

function HaveQuestionsSection() {
    return (
        <section className="have-questions">
            <div className="container have-questions__inner">
                <div className="have-questions__content">
                    <span className="form__title">Мы рядом, чтобы помочь</span>
                    <span className="form__desc">Создание цифрового мемориала — дело бережное. Оставьте контактные данные, и мы с теплотой ответим на все вопросы.</span>
                    <div className="form__fields">
                        <label className="form__field"><input type="text" className="text-input" placeholder="Ваше имя" /></label>
                        <label className="form__field"><input type="text" className="text-input" placeholder="Телефон" /></label>
                    </div>
                    <div className="form__footer">
                        <button type="submit" className="form__submit">Отправить</button>
                        <div className="form__terms">Нажимая кнопку «Отправить» Вы соглашаетесь с условиями <a href="#">политики конфиденциальности</a>.</div>
                    </div>
                </div>
                <div className="have-questions__preview">
                    <img src="/uploads/2024/02/have-questions.svg" alt="" className="have-questions__image" />
                </div>
            </div>
        </section>
    );
}

/* ======== ПОМОЖЕМ СОХРАНИТЬ ПАМЯТЬ ======== */

function CallbackSection() {
    return (
        <section className="callback">
            <div className="container">
                <div className="callback__form">
                    <div className="form__column">
                        <span className="form__title">Поможем сохранить память</span>
                        <span className="form__desc">Расскажите, какую историю вы хотите увековечить, — и мы подскажем лучший формат. Или просто напишите нам в удобном мессенджере:</span>
                        <div className="link-buttons link-buttons--white">
                            <a className="link-buttons__item" href="https://t.me/Kod_bessmertiya" style={{ color: '#29A0DC' }}>Telegram</a>
                            <a className="link-buttons__item" href="https://wa.me/79811269133" style={{ color: '#1A9F49' }}>WhatsApp</a>
                            <a className="link-buttons__item" href="viber://chat?number=%2B79811269133" style={{ color: '#735FF1' }}>Viber</a>
                        </div>
                    </div>
                    <div className="form__column">
                        <div className="form__fields" style={{ gridTemplateColumns: '1fr' }}>
                            <label className="form__field"><input type="text" className="text-input" placeholder="Ваше имя" /></label>
                            <label className="form__field"><input type="text" className="text-input" placeholder="Телефон" /></label>
                        </div>
                        <div className="form__footer">
                            <button type="submit" className="form__submit">Отправить</button>
                            <div className="form__terms" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                Нажимая кнопку «Отправить» Вы соглашаетесь с условиями <a href="#">политики конфиденциальности</a>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
