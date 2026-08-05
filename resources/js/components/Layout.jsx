import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthModal from './AuthModal';
import CookieConsent from './CookieConsent';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
    const { user, logout, login, register } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);

    useEffect(() => {
        const handler = () => setAuthOpen(true);
        window.addEventListener('auth:open', handler);
        const socialErrorHandler = () => setAuthOpen(true);
        window.addEventListener('auth:social-error', socialErrorHandler);
        return () => {
            window.removeEventListener('auth:open', handler);
            window.removeEventListener('auth:social-error', socialErrorHandler);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen" style={{ paddingTop: 80 }}>
            <Header user={user} onAuthOpen={() => setAuthOpen(true)} onLogout={logout} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <CookieConsent />
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
    );
}
