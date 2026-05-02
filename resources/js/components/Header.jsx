import { Link } from 'react-router-dom';

export default function Header({ user, onAuthOpen, onLogout }) {
    return (
        <header className="header header--fixed">
            <div className="container header__inner">
                <div className="header__left">
                    <Link to="/" className="logo">
                        <img src="/images/logo.svg" alt="" className="logo__image" />
                    </Link>
                </div>
                <div className="header__right">
                    <div className="header__mobile">
                        <nav className="header__menu">
                            <ul>
                                <li><Link to="/family_tree">Генеалогическое древо</Link></li>
                                <li><Link to="/tariffs">Цены</Link></li>
                                <li><Link to="/order-steps">Как заказать</Link></li>
                                <li><Link to="/faq">Частые вопросы</Link></li>
                            </ul>
                        </nav>
                        <a href="tel:+79811269133" className="contact-link header__phone-mobile" style={{ display: 'none' }}>+ 7 (981) 126-91-33</a>
                    </div>
                    <a href="tel:+79811269133" className="contact-link header__phone">+ 7 (981) 126-91-33</a>
                    <div className="header__user">
                        {user ? (
                            <Link to="/lk" className="contact-link" style={{ fontWeight: 700, fontSize: 16 }}>
                                {user.name}
                            </Link>
                        ) : (
                            <button onClick={onAuthOpen} className="btn-filled header__login">Войти</button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
