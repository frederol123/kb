import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AuthModal from './AuthModal';
import { useState } from 'react';

export default function Layout() {
    const [authOpen, setAuthOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onAuthOpen={() => setAuthOpen(true)} />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <Outlet />
            </main>
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
    );
}
