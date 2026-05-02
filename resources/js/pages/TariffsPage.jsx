import { Link } from 'react-router-dom';

const tariffs = [
    {
        title: 'Базовая страница',
        price: '6600',
        features: [
            { icon: 'icon-list-qr.svg', text: 'Табличка с QR-кодом в футляре' },
            { icon: 'icon-list-note.svg', text: 'Добавление биографии' },
            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
        ],
    },
    {
        title: 'Расширенная страница',
        price: '16500',
        highlighted: true,
        desc: '<p>Включает в себя все возможности <strong>базовой страницы,</strong> с учетом генерации 3 QR-кода. Возможность генерации QR-кода со скидкой 20% на следующие 3 анкеты.</p>',
        features: [
            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
            { icon: 'icon-list-mount.svg', text: 'Установка за счёт компании' },
            { icon: 'icon-list-privacy.svg', text: 'Приватность' },
            { icon: 'icon-list-support.svg', text: 'Обслуживание страницы' },
        ],
    },
    {
        title: 'Особая страница',
        price: '27500',
        badge: 'badge-special.svg',
        desc: '<p>Включает в себя все возможности <strong>расширенной страницы,</strong> с учетом генерации 5 QR-кода. Возможность генерации QR-кода со скидкой 20% на все следующие анкеты.</p>',
        features: [
            { icon: 'icon-list-tree.svg', text: 'Создание генеалогического древа в профиле пользователя.' },
        ],
    },
    {
        title: 'Страница питомца',
        price: '4400',
        badge: 'badge-pet.svg',
        features: [
            { icon: 'icon-list-qr.svg', text: 'Табличка с QR-кодом в футляре' },
            { icon: 'icon-list-note.svg', text: 'Добавление биографии' },
            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
        ],
    },
];

export default function TariffsPage() {
    return (
        <>
            <section className="single-content">
                <div className="container">
                    <h2 className="section-title single-content__title">Цены и тарифы</h2>
                    <span className="section-desc single-content__desc">
                        <p>Стоимость услуг может меняться в зависимости от партнёра и региона предоставления услуг.</p>
                    </span>
                    <div className="prices-cards">
                        {tariffs.map((t, i) => (
                            <div key={i} className={`plan-card ${t.highlighted ? 'plan-card--highlighted' : ''}`}>
                                {t.badge && (
                                    <div className="plan-card__badges">
                                        <img src={`/uploads/2024/02/${t.badge}`} alt="" className="plan-card__badge" />
                                    </div>
                                )}
                                {t.highlighted && <span className="plan-card__label">Оптимальный выбор</span>}
                                <span className="plan-card__title">{t.title}</span>
                                {t.desc && <span className="plan-card__desc" dangerouslySetInnerHTML={{ __html: t.desc }} />}
                                <div className="plan-card__body">
                                    <span className="plan-card__heading">Преимущества:</span>
                                    <div className="icon-list plan-card__advantages">
                                        {t.features.map((f, j) => (
                                            <div key={j} className="icon-list__item">
                                                <img src={`/uploads/2024/02/${f.icon}`} alt="" className="icon-list__image" />
                                                <div className="icon-list__content"><p>{f.text}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <span className="plan-card__price">{t.price} ₽</span>
                                <Link to={`/tarif?count=${i}`} className={`button plan-card__btn ${t.highlighted ? 'button--filled' : ''}`}>
                                    Подробнее
                                </Link>
                                <span className="plan-card__under-note">После оплаты анкеты сразу появятся в вашем Личном кабинете</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="callback">
                <div className="container">
                    <div className="callback__form">
                        <div className="form__column">
                            <span className="form__title">Остались вопросы?</span>
                            <span className="form__desc">Оставьте свои контактные данные, заполнив строки справа, либо напишите нам в соц-сетях.</span>
                            <div className="link-buttons">
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
        </>
    );
}
