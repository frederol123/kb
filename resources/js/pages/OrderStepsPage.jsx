import { Link } from 'react-router-dom';

export default function OrderStepsPage() {
    return (
        <section className="order-steps">
            <div className="container">
                <h2 className="section-title order-steps__title">Как оформить заказ</h2>
                <span className="section-desc order-steps__desc"><p>Чтобы оформить заказ Вам необходимо:</p></span>
                <div className="order-steps__items">
                    <div className="steps">
                        <div className="steps__item">
                            <span className="steps__num">1</span>
                            <div className="steps__header">
                                <span className="steps__label">Шаг 1</span>
                                <span className="steps__heading">Выберите тариф</span>
                            </div>
                            <div className="steps__body">
                                <p>Перейти на страницу <Link to="/tariffs">Тарифов</Link> и внимательно ознакомиться с тарифами услуг, которые мы предоставляем.</p>
                            </div>
                        </div>
                        <div className="steps__item">
                            <span className="steps__num">2</span>
                            <div className="steps__header">
                                <span className="steps__label">Шаг 2</span>
                                <span className="steps__heading">Оплатите тариф</span>
                            </div>
                            <div className="steps__body">
                                <p>Зарегистрироваться на сайте и единоразового оплатить тариф, который Вы выбрали.</p>
                            </div>
                        </div>
                        <div className="steps__item">
                            <span className="steps__num">3</span>
                            <div className="steps__header">
                                <span className="steps__label">Шаг 3</span>
                                <span className="steps__heading">Пользуйтесь сервисом</span>
                            </div>
                            <div className="steps__body">
                                <p>После оплаты Вам будут предоставлены все функции в рамках Вашего тарифа в личном кабинете.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="order-steps__action">
                    <div className="order-steps__action-body">
                        <span className="order-steps__action-icon">💬</span>
                        <div>
                            <p className="order-steps__action-text">Либо Вы можете оставить <Link to="#">заявку на сайте</Link>. Наши специалисты свяжутся с Вами для уточнения всех данных и помогут вам в оформлении вашего заказа.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
