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
                                <li><Link to="/delivery" onClick={closeMenu}>Доставка</Link></li>
                                <li><Link to="/tariffs" onClick={closeMenu}>Цены</Link></li>
                                <li><Link to="/order-steps" onClick={closeMenu}>Как заказать</Link></li>
                                <li><Link to="/faq" onClick={closeMenu}>Частые вопросы</Link></li>
                            </ul>
                        </nav>
                        <a href="tel:+79513132182" className="contact-link header__phone-mobile">7 951 313-21-82</a>
                    </div>
                    <a href="tel:+79513132182" className="contact-link header__phone">7 951 313-21-82</a>
                    <div className="header__user">
                        {user ? (
                            <Link to="/lk" className="contact-link header__user-link">
                                <svg className="header__user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span className="header__user-name">{user.name}</span>
                            </Link>
                        ) : (
                            <button onClick={onAuthOpen} className="button button--filled header__login">Войти</button>
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
