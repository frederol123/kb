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
        <div className="flex flex-col min-h-screen" style={{ paddingTop: 80 }}>
            <Header user={user} onAuthOpen={() => setAuthOpen(true)} onLogout={logout} />
            <main className="">
                <Outlet />
            </main>
            <Footer />
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
    );
}
