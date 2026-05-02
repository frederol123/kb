export default function OrderStepsPage() {
    return (
        <section className="order-steps">
            <div className="container">
                <h2 className="section-title order-steps__title">Как оформить заказ</h2>
                <span className="section-desc order-steps__desc"><p>Чтобы оформить заказ Вам необходимо:</p></span>
                <div className="order-steps__items">
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
                        <div className="steps__item steps__item--mobile">
                            <div className="steps__body">
                                <p>Либо Вы можете оставить <a href="#">заявку на сайте</a>. Наши специалисты свяжутся с Вами для уточнения всех данных и помогут вам в оформлении вашего заказа.</p>
                            </div>
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
