import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthModal from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
    const { user, logout, login, register } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen pt-[82px] lg:pt-[112px]">
            <Header user={user} onAuthOpen={() => setAuthOpen(true)} onLogout={logout} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
    );
}
