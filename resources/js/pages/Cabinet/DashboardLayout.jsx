import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout() {
    const { user, loading } = useAuth();

    if (loading) return <div className="py-20 text-center text-gray-500">Загрузка...</div>;
    if (!user) return <Navigate to="/" replace />;

    const links = [
        { to: '/lk', label: 'Мои анкеты', end: true },
        { to: '/lk/ankets/new', label: 'Создать анкету' },
    ];

    return (
        <div className="flex gap-6">
            <aside className="w-48 shrink-0">
                <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2 sticky top-20">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.end}
                            className={({ isActive }) => `block px-3 py-2 rounded-lg text-sm ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <div className="flex-1 min-w-0">
                <Outlet />
            </div>
        </div>
    );
}
