import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__inner">
                    <nav className="footer__menu">
                        <ul>
                            <li><Link to="/delivery">Доставка</Link></li>
                            <li><Link to="/tariffs">Цены</Link></li>
                            <li><Link to="/order-steps">Как заказать</Link></li>
                            <li><Link to="/offer">Публичная оферта</Link></li>
                            <li><Link to="/faq">Частые вопросы</Link></li>
                        </ul>
                    </nav>
                    <div className="footer__links">
                        <a href="tel:+795****2182" className="footer__link">7 951 313-21-82</a>
                        <a href="https://t.me/Kod_bessmertiya" className="footer__link">Telegram</a>
                        <a href="https://vk.com/" className="footer__link">VK</a>
                    </div>
                </div>
                <div className="footer__copyright">
                    <span className="footer__copyright-wide">Код бессмертия — цифровая память для будущих поколений</span>
                </div>
            </div>
        </footer>
    );
}
