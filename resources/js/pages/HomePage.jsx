import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { useState } from 'react';

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <PricesSection />
            <HaveQuestionsSection />
            <CallbackSection />
        </>
    );
}

function HeroSection() {
    return (
        <section className="hero">
            <div className="container hero__inner">
                <div className="hero__content">
                    <h1 className="hero__title">Сохраните свою историю жизни и историю близких на долгие годы</h1>
                    <div className="hero__desc">
                        <p><strong>Код Бессмертия</strong> запомнит все ваши воспоминания и сохранит их для ваших потомков.</p>
                        <p>Мы работаем с людьми всех возрастов и помогаем им запечатлеть важные моменты из жизни, такие как детство, семейные мероприятия, свадьбы и многое другое.</p>
                    </div>
                    <Link to="/tariffs" className="button button--filled hero__btn">Сохранить историю</Link>
                </div>
                <div className="hero__preview">
                    <img src="/uploads/2024/02/hero.svg" alt="" className="hero__image" />
                </div>
            </div>
        </section>
    );
}

function PricesSection() {
    return (
        <section className="plan-prices">
            <div className="container">
                <h2 className="section-title" style={{ textAlign: 'center' }}>Цены и тарифы</h2>
                <span className="section-desc" style={{ textAlign: 'center', margin: '0 auto 50px auto' }}>
                    <p>Стоимость услуг может меняться в зависимости от партнёра и региона предоставления услуг.</p>
                </span>
                <div className="prices-cards">
                    <PlanCard title="Базовая страница" price="6600" index={0}
                        features={[
                            { icon: 'icon-list-qr.svg', text: 'Табличка с QR-кодом в футляре' },
                            { icon: 'icon-list-note.svg', text: 'Добавление биографии' },
                            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
                        ]} />
                    <PlanCard title="Расширенная страница" price="16500" highlighted index={1}
                        desc='<p>Включает в себя все возможности <strong>базовой страницы,</strong> с учетом генерации 3 QR-кода. Возможность генерации QR-кода со скидкой 20% на следующие 3 анкеты.</p>'
                        features={[
                            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
                            { icon: 'icon-list-mount.svg', text: 'Установка за счёт компании' },
                            { icon: 'icon-list-privacy.svg', text: 'Приватность' },
                            { icon: 'icon-list-support.svg', text: 'Обслуживание страницы' },
                        ]} />
                    <PlanCard title="Особая страница" price="27500" badge="badge-special.svg" index={2}
                        desc='<p>Включает в себя все возможности <strong>расширенной страницы,</strong> с учетом генерации 5 QR-кода. Возможность генерации QR-кода со скидкой 20% на все следующие анкеты.</p>'
                        features={[{ icon: 'icon-list-tree.svg', text: 'Создание генеалогического древа в профиле пользователя.' }]} />
                    <PlanCard title="Страница питомца" price="4400" badge="badge-pet.svg" index={3}
                        features={[
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

function HaveQuestionsSection() {
    return (
        <section className="have-questions">
            <div className="container have-questions__inner">
                <div className="have-questions__content">
                    <span className="form__title">Есть вопросы?</span>
                    <span className="form__desc">Оставьте свои контактные данные и мы вскоре свяжемся с Вами.</span>
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

function CallbackSection() {
    return (
        <section className="callback">
            <div className="container">
                <div className="callback__form">
                    <div className="form__column">
                        <span className="form__title">Остались вопросы?</span>
                        <span className="form__desc">Оставьте свои контактные данные, заполнив строки справа, либо напишите нам в соц-сетях.</span>
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
