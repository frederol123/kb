import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <TreeIntroduceSection />
            <PricesSection />
            <HaveQuestionsSection />
            <OrderStepsSection />
            <FAQSection />
            <CallbackSection />
        </>
    );
}

function HeroSection() {
    return (
        <section className="hero-section">
            <div className="container hero-inner">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Сохраните свою историю жизни и историю близких на долгие годы
                    </h1>
                    <div className="hero-desc">
                        <p><strong>Код Бессмертия</strong> запомнит все ваши воспоминания и сохранит их для ваших потомков.</p>
                        <p>Мы работаем с людьми всех возрастов и помогаем им запечатлеть важные моменты из жизни, такие как детство, семейные мероприятия, свадьбы и многое другое.</p>
                    </div>
                    <Link to="/tariffs" className="btn-filled hero__btn">Сохранить историю</Link>
                </div>
                <div className="hero-preview">
                    <img src="/uploads/2024/02/hero.svg" alt="" className="hero-image" />
                </div>
            </div>
        </section>
    );
}

function TreeIntroduceSection() {
    return (
        <section className="tree-introduce">
            <div className="container tree-introduce__inner">
                <div className="tree-introduce__preview">
                    <div className="tree-introduce-card">
                        <img src="/uploads/2023/12/tree-introduce.jpg" alt="" className="tree-introduce-card__image" />
                        <div className="tree-introduce-card__content">
                            <span className="tree-introduce-card__title">Пётр Ильич Чайковский</span>
                            <span className="tree-introduce-card__desc">1840–1893</span>
                        </div>
                    </div>
                </div>
                <div className="tree-introduce__content">
                    <h2 className="section-title">Генеалогическое древо</h2>
                    <div className="text-content tree-introduce__desc">
                        <p>Сервис сохранения генеалогического древа — это превосходный способ сохранить историю своей семьи <strong>на долгие годы</strong>.</p>
                        <p>Мы предоставляем услуги по сбору, обработке и сохранению вашей информации о родственниках, помогая найти и сохранить данные о предшественниках и поколениях вашей семьи. Наша команда работает с каждым клиентом индивидуально, учитывая их уникальные запросы и требования.</p>
                        <p>Хранение генеалогического древа в нашей базе данных <strong>гарантирует сохранение информации в безопасности</strong> и доступность её в любое время.</p>
                    </div>
                    <Link to="/tariffs" className="btn-filled">Подробнее</Link>
                </div>
            </div>
        </section>
    );
}

function PricesSection() {
    return (
        <section className="plan-prices" style={{ paddingTop: 104, paddingBottom: 65 }}>
            <div className="container">
                <h2 className="section-title" style={{ textAlign: 'center' }}>Цены и тарифы</h2>
                <span className="section-desc" style={{ textAlign: 'center', margin: '0 auto 50px auto' }}>
                    <p>Стоимость услуг может меняться в зависимости от партнёра и региона предоставления услуг.</p>
                </span>
                <div className="prices-cards">
                    <PlanCard
                        title="Базовая страница"
                        price="6600"
                        features={[
                            { icon: 'icon-list-qr.svg', text: 'Табличка с QR-кодом в футляре' },
                            { icon: 'icon-list-note.svg', text: 'Добавление биографии' },
                            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
                        ]}
                    />
                    <PlanCard
                        title="Расширенная страница"
                        price="16500"
                        highlighted
                        desc="Включает в себя все возможности базовой страницы, с учетом генерации 3 QR-кода. Возможность генерации QR-кода со скидкой 20% на следующие 3 анкеты."
                        features={[
                            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
                            { icon: 'icon-list-mount.svg', text: 'Установка за счёт компании' },
                            { icon: 'icon-list-privacy.svg', text: 'Приватность' },
                            { icon: 'icon-list-support.svg', text: 'Обслуживание страницы' },
                        ]}
                    />
                    <PlanCard
                        title="Особая страница"
                        price="27500"
                        badge="badge-special.svg"
                        desc="Включает в себя все возможности расширенной страницы, с учетом генерации 5 QR-кода. Возможность генерации QR-кода со скидкой 20% на все следующие анкеты."
                        features={[
                            { icon: 'icon-list-tree.svg', text: 'Создание генеалогического древа в профиле пользователя.' },
                        ]}
                    />
                    <PlanCard
                        title="Страница питомца"
                        price="4400"
                        badge="badge-pet.svg"
                        features={[
                            { icon: 'icon-list-qr.svg', text: 'Табличка с QR-кодом в футляре' },
                            { icon: 'icon-list-note.svg', text: 'Добавление биографии' },
                            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
                        ]}
                    />
                </div>
            </div>
        </section>
    );
}

function PlanCard({ title, price, desc, features, highlighted, badge }) {
    return (
        <div className={`plan-card${highlighted ? ' plan-card--highlighted' : ''}`}>
            {badge && (
                <div className="plan-card__badges">
                    <img src={`/uploads/2024/02/${badge}`} alt="" className="plan-card__badge" />
                </div>
            )}
            {highlighted && <span className="plan-card__label">Оптимальный выбор</span>}
            <span className="plan-card__title">{title}</span>
            {desc && <span className="plan-card__desc" dangerouslySetInnerHTML={{ __html: desc }} />}
            <div className="plan-card__body">
                <span className="plan-card__heading">Преимущества:</span>
                <div className="icon-list plan-card__advantages">
                    {features.map((f, i) => (
                        <div key={i} className="icon-list__item">
                            <img src={`/uploads/2024/02/${f.icon}`} alt="" className="icon-list__image" />
                            <div className="icon-list__content">
                                <p>{f.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <span className="plan-card__price">{price} ₽</span>
            <Link to={`/tariffs`} className={`button plan-card__btn ${highlighted ? 'btn-filled' : 'btn-outline'}`}>
                Подробнее
            </Link>
            <span className="plan-card__under-note">После оплаты анкеты сразу появятся в вашем Личном кабинете</span>
        </div>
    );
}

function HaveQuestionsSection() {
    return (
        <section className="have-questions">
            <div className="container have-questions__inner">
                <div className="have-questions__content">
                    <span className="form__title--light">Есть вопросы?</span>
                    <span className="form__desc--light">Оставьте свои контактные данные и мы вскоре свяжемся с Вами.</span>
                    <div className="form__fields">
                        <label className="form__field">
                            <input type="text" className="text-input" placeholder="Ваше имя" />
                        </label>
                        <label className="form__field">
                            <input type="text" className="text-input" placeholder="Телефон" />
                        </label>
                    </div>
                    <div className="form__footer">
                        <button type="submit" className="form__submit">Отправить</button>
                        <div className="form__terms">
                            Нажимая кнопку «Отправить» Вы соглашаетесь с условиями <a href="#">политики конфиденциальности</a>.
                        </div>
                    </div>
                </div>
                <div className="have-questions__preview">
                    <img src="/uploads/2024/02/have-questions.svg" alt="" className="have-questions__image" />
                </div>
            </div>
        </section>
    );
}

function OrderStepsSection() {
    return (
        <section className="order-steps">
            <div className="container">
                <h2 className="section-title" style={{ textAlign: 'center' }}>Как оформить заказ</h2>
                <span className="section-desc" style={{ textAlign: 'center', margin: '0 auto 50px auto' }}>
                    <p>Чтобы оформить заказ Вам необходимо:</p>
                </span>
                <div className="steps">
                    <div className="steps__item">
                        <span className="steps__label">Шаг 1</span>
                        <div className="steps__body">
                            <p>Перейти на страницу <a href="/tariffs">Тарифов</a> и внимательно ознакомиться с тарифами услуг, которые мы предоставляем.</p>
                        </div>
                    </div>
                    <div className="steps__item">
                        <span className="steps__label">Шаг 2</span>
                        <div className="steps__body">
                            <p>Зарегистрироваться на сайте и единоразового оплатить тариф, который Вы выбрали.</p>
                        </div>
                    </div>
                    <div className="steps__item">
                        <span className="steps__label">Шаг 3</span>
                        <div className="steps__body">
                            <p>После оплаты Вам будут предоставлены все функции в рамках Вашего тарифа в личном кабинете.</p>
                        </div>
                    </div>
                </div>
                <div className="order-steps__note">
                    <p>Либо Вы можете оставить <a href="#">заявку на сайте</a>. Наши специалисты свяжутся с Вами для уточнения всех данных и помогут вам в оформлении вашего заказа.</p>
                </div>
            </div>
        </section>
    );
}

function FAQSection() {
    const [openIdx, setOpenIdx] = useState(null);

    const faqs = [
        { q: '«Код бессмертия» – что это?', a: '<p>Код бессмертия это всем нам известный по мировой пандемии QR-код, на металле. Металл выбран из-за своей долговечности, устойчивости к непогоде и сохранению формы даже при попытке деформации, что позволит не беспокоиться о сроке службы и качеству считывания кода.</p><p>Установка памятной таблички производится посредством крепления на двухсторонний скотч, со специальным клейким составом для фиксации на камне и металле, устойчивым к погодным условиям и низким температурам</p>' },
        { q: 'Как мне создать страницу?', a: '<p>Код бессмертия это всем нам известный по мировой пандемии QR-код, на металле. Металл выбран из-за своей долговечности, устойчивости к непогоде и сохранению формы даже при попытке деформации, что позволит не беспокоится о сроке службы и качеству считывания кода.</p><p>Установка памятной таблички производится посредством крепления на двухсторонний скотч, со специальным клейким составом для фиксации на камне и металле, устойчивым к погодным условиям и низким температурам</p>' },
        { q: 'Я могу нанести QR код непосредственно на памятник?', a: '<p>Код бессмертия это всем нам известный по мировой пандемии QR-код, на металле. Металл выбран из-за своей долговечности, устойчивости к непогоде и сохранению формы даже при попытке деформации, что позволит не беспокоится о сроке службы и качеству считывания кода.</p><p>Установка памятной таблички производится посредством крепления на двухсторонний скотч, со специальным клейким составом для фиксации на камне и металле, устойчивым к погодным условиям и низким температурам</p>' },
        { q: 'Сколько будет хранится страница памяти?', a: '<p>Код бессмертия это всем нам известный по мировой пандемии QR-код, на металле. Металл выбран из-за своей долговечности, устойчивости к непогоде и сохранению формы даже при попытке деформации, что позволит не беспокоится о сроке службы и качеству считывания кода.</p><p>Установка памятной таблички производится посредством крепления на двухсторонний скотч, со специальным клейким составом для фиксации на камне и металле, устойчивым к погодным условиям и низким температурам</p>' },
    ];

    return (
        <section className="faq-section">
            <div className="container">
                <h2 className="section-title" style={{ textAlign: 'center' }}>Частые вопросы</h2>
                <div className="faq__items">
                    {faqs.map((f, i) => (
                        <div key={i} className="faq__item">
                            <button className="faq__btn" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                                {f.q}
                                <svg className={`faq__btn-arrow ${openIdx === i ? 'faq__btn-arrow--open' : ''}`} viewBox="0 0 28 28" fill="none">
                                    <path d="M7 10l7 7 7-7" stroke="#1c2145" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            {openIdx === i && (
                                <div className="faq__content" dangerouslySetInnerHTML={{ __html: f.a }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CallbackSection() {
    return (
        <section className="callback">
            <div className="container">
                <div className="callback__form">
                    <div className="form__column">
                        <span className="form__title--dark">Остались вопросы?</span>
                        <span className="form__desc--dark">Оставьте свои контактные данные, заполнив строки справа, либо напишите нам в соц-сетях.</span>
                        <div className="link-buttons">
                            <a className="link-buttons__item" href="https://t.me/Kod_bessmertiya" style={{ color: '#29A0DC' }}>Telegram</a>
                            <a className="link-buttons__item" href="https://wa.me/79811269133" style={{ color: '#1A9F49' }}>WhatsApp</a>
                            <a className="link-buttons__item" href="viber://chat?number=%2B79811269133" style={{ color: '#735FF1' }}>Viber</a>
                        </div>
                    </div>
                    <div className="form__column">
                        <div className="form__fields" style={{ flexDirection: 'column' }}>
                            <label className="form__field">
                                <input type="text" className="text-input" placeholder="Ваше имя" />
                            </label>
                            <label className="form__field">
                                <input type="text" className="text-input" placeholder="Телефон" />
                            </label>
                        </div>
                        <div className="form__footer">
                            <button type="submit" className="form__submit" style={{ background: '#fff', color: '#1c2145' }}>Отправить</button>
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
