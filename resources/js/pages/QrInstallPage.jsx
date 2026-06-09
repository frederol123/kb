import { Link } from 'react-router-dom';

const variants = [
    {
        title: 'Металлический шильдик (пластина)',
        desc: 'Металлическая пластина с нанесённой лазерной гравировкой. Возможна установка пластиковой пластины. Надёжный и долговечный способ размещения QR-кода на памятнике.',
    },
    {
        title: 'Нанесение кода на памятник по типу портрета',
        desc: 'QR-код наносится на памятник по той же технологии, что и портретные изображения. Органично вписывается в дизайн, выглядит как часть памятника.',
    },
    {
        title: 'Гравировка в текстуру памятника',
        desc: 'QR-код выгравировывается непосредственно в поверхность памятника. Самый незаметный и долговечный вариант — код становится частью текстуры камня.',
    },
    {
        title: 'Установка памятной доски',
        desc: 'Отдельная памятная доска с QR-кодом, устанавливаемая рядом с памятником или на стене колумбария. Позволяет разместить больше информации и украсить место захоронения.',
    },
    {
        title: 'Установка таблички с QR-кодом на оградку',
        desc: 'Компактная табличка с QR-кодом, которая крепится на ограду захоронения. Удобный вариант, если на самом памятнике нет места или его материал не подходит для нанесения.',
    },
    {
        title: 'Установка столба с QR-кодом',
        desc: 'Отдельный декоративный столб с нанесённым QR-кодом, устанавливаемый на участке захоронения. Заметный и презентабельный вариант, привлекающий внимание.',
    },
];

export default function QrInstallPage() {
    return (
        <>
            <section className="secondary-hero">
                <div className="container secondary-hero__inner">
                    <div className="secondary-hero__body">
                        <h1 className="secondary-hero__title">Варианты установки QR</h1>
                        <div className="text-content secondary-hero__desc">
                            <p>Увековечьте память ваших близких с помощью современных технологий. Персональный QR-код на памятнике — это мост между прошлым и будущим: один взмах телефона — и открывается страница с фотографиями, биографией, видео, аудиозаписями и соболезнованиями.</p>
                            <p>Мы предлагаем несколько способов нанесения и установки QR-кода — от компактных табличек до отдельно стоящих конструкций. Выберите подходящий вариант.</p>
                        </div>
                        <div className="note secondary-hero__note">
                            <p>QR-код устойчив к атмосферным воздействиям и сохраняет читаемость на протяжении всего срока службы. Замена информации на странице производится бесплатно в любое время.</p>
                        </div>
                        <Link to="/tariffs" className="button button--filled">Выбрать тариф</Link>
                    </div>
                    <div className="secondary-hero__preview">
                        <img src="/uploads/2023/12/secondary-hero.png" alt="Варианты установки QR" className="secondary-hero__image" />
                    </div>
                </div>
            </section>

            <section className="how-works">
                <div className="container">
                    <h2 className="section-title">Способы установки</h2>
                    <span className="section-desc how-works__desc"><p>Все варианты проходят проверку на долговечность и читаемость. Мы гарантируем качество установки.</p></span>
                    <div className="number-cards">
                        {variants.map((v, i) => (
                            <div className="number-cards__item number-card" key={i}>
                                <div className="number-card__header">
                                    <span className="number-card__num">{i + 1}</span>
                                    <span className="number-card__heading">{v.title}</span>
                                </div>
                                <div className="number-card__body">
                                    <p>{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
