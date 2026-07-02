import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!accepted) {
            setVisible(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-consent">
            <div className="cookie-consent__inner">
                <p className="cookie-consent__text">
                    Мы используем cookie-файлы для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
                    <a href="/offer" className="cookie-consent__link">публичной офертой</a>.
                </p>
                <button onClick={accept} className="button button--filled cookie-consent__btn">
                    Принять
                </button>
            </div>
        </div>
    );
}
