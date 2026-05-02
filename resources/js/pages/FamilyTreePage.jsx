import { Link } from 'react-router-dom';

export default function FamilyTreePage() {
    return (
        <>
            <section className="secondary-hero">
                <div className="container secondary-hero__inner">
                    <div className="secondary-hero__body">
                        <h1 className="secondary-hero__title">Генеалогическое древо</h1>
                        <div className="text-content secondary-hero__desc">
                            <p>Наш сервис предоставляет уникальную возможность создать персональное генеалогическое древо для вашей семьи. Запечатлеть все важные моменты с помощью фото, видео и текстовых материалов. Также предоставляется уникальный QR-код, который позволит получать быстрый доступ к странице вашей семьи.</p>
                        </div>
                        <div className="note secondary-hero__note">
                            <p>Наша задача — сохранить историю каждой семьи и дать возможность передать её своим потомкам. Мы поможем вам создать Код Бессмертия.</p>
                        </div>
                        <Link to="/tariffs" className="button button--filled">Сохранить историю</Link>
                    </div>
                    <div className="secondary-hero__preview">
                        <img src="/uploads/2023/12/secondary-hero.png" alt="" className="secondary-hero__image" />
                    </div>
                </div>
            </section>

            <section className="how-works">
                <div className="container">
                    <h2 className="section-title">Как это работает?</h2>
                    <span className="section-desc how-works__desc"><p>Немного текста о наших замечательных дополнительных услугах.</p></span>
                    <div className="number-cards">
                        <div className="number-cards__item number-card">
                            <div className="number-card__header">
                                <span className="number-card__num">1</span>
                                <span className="number-card__heading">Регистрация</span>
                            </div>
                            <div className="number-card__body">
                                <p>Зарегистрируйтесь на сайте, чтобы создавать страницы-истории, составлять генеалогическое древо и прочее.</p>
                            </div>
                        </div>
                        <div className="number-cards__item number-card">
                            <div className="number-card__header">
                                <span className="number-card__num">2</span>
                                <span className="number-card__heading">Оплата тарифного плана</span>
                            </div>
                            <div className="number-card__body">
                                <p>Внимательно ознакомьтесь со всеми преимуществами тарифов, чтобы выбрать тот, который подходит именно Вам.</p>
                            </div>
                        </div>
                        <div className="number-cards__item number-card">
                            <div className="number-card__header">
                                <span className="number-card__num">3</span>
                                <span className="number-card__heading">Создание страницы</span>
                            </div>
                            <div className="number-card__body">
                                <p>Создайте страницу-профиль для человека, напишите биографию и добавьте фотографии, видео или аудио. После заполнения Ваша страница пройдёт модерацию.</p>
                            </div>
                        </div>
                        <div className="number-cards__item number-card">
                            <div className="number-card__header">
                                <span className="number-card__num">4</span>
                                <span className="number-card__heading">QR-код</span>
                            </div>
                            <div className="number-card__body">
                                <p>Получите персональный QR-код для размещения на памятнике. Каждый посетитель сможет узнать историю жизни вашего близкого.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
