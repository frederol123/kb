import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ user, onAuthOpen, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);
    const toggleMenu = () => setMenuOpen((v) => !v);

    return (
        <header className="header header--fixed">
            <div className="container header__inner">
                <div className="header__left">
                    <Link to="/" className="logo" onClick={closeMenu}>
                        <img src="/images/logo.svg" alt="" className="logo__image" />
                    </Link>
                </div>
                <div className="header__right">
                    <div
                        className={`header__close-overlay ${menuOpen ? 'header__close-overlay--open' : ''}`}
                        onClick={closeMenu}
                    />
                    <div className={`header__mobile ${menuOpen ? 'header__mobile--open' : ''}`}>
                        <nav className="header__menu">
                            <ul>
                                <li><Link to="/family_tree" onClick={closeMenu}>Генеалогическое древо</Link></li>
                                <li><Link to="/tariffs" onClick={closeMenu}>Цены</Link></li>
                                <li><Link to="/order-steps" onClick={closeMenu}>Как заказать</Link></li>
                                <li><Link to="/faq" onClick={closeMenu}>Частые вопросы</Link></li>
                            </ul>
                        </nav>
                        <a href="tel:+79811269133" className="contact-link header__phone-mobile">+ 7 (981) 126-91-33</a>
                    </div>
                    <a href="tel:+79811269133" className="contact-link header__phone">+ 7 (981) 126-91-33</a>
                    <div className="header__user">
                        {user ? (
                            <Link to="/lk" className="contact-link" style={{ fontWeight: 700, fontSize: 16 }}>
                                {user.name}
                            </Link>
                        ) : (
                            <button onClick={onAuthOpen} className="button header__login">Войти</button>
                        )}
                    </div>
                    <button
                        className={`menu-toggle header__toggle ${menuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Меню"
                    >
                        <span className="menu-toggle__line" />
                        <span className="menu-toggle__line" />
                        <span className="menu-toggle__line" />
                    </button>
                </div>
            </div>
        </header>
    );
}
