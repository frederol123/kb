import { Link } from 'react-router-dom';

export default function Header({ user, onAuthOpen, onLogout }) {
    return (
        <header className="header header--fixed">
            <div className="container header__inner" style={{ height: 80 }}>
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
                    </div>
                    <div className="header__mobile">
                        <a href="tel:+79811269133" className="header__phone">+ 7 (981) 126-91-33</a>
                    </div>
                    <div className="header__user">
                        {user ? (
                            <Link to="/lk" className="header__phone">{user.name}</Link>
                        ) : (
                            <button onClick={onAuthOpen} className="btn-filled header__login">Войти</button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
