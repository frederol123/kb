import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout() {
    const { user, logout, loading } = useAuth();

    if (loading) return <div className="text-center py-40 text-[#6c6d7e]">Загрузка...</div>;
    if (!user) return <Navigate to="/" replace />;

    const links = [
        { to: '/lk', icon: '/images/icons/profile-anket.svg', label: 'Мои карточки', end: true },
        { to: '/lk/drev', icon: '/images/icons/profile-tree.svg', label: 'Генеалогическое дерево' },
        { to: '/lk/history', icon: '/images/icons/profile-history.svg', label: 'История покупок' },
        { to: '/lk/settings', icon: '/images/icons/profile-settings.svg', label: 'Настройки' },
    ];

    return (
        <div className="bg-[#f8f8f8] min-h-screen">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px] py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="lg:w-60 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-[130px]">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <img src="/images/no-photo.svg" alt="" className="w-10 h-10 rounded-full" />
                                <span className="font-extrabold text-[#1c2145] text-sm">{user.name}</span>
                            </div>
                            <nav className="space-y-1">
                                {links.map((l) => (
                                    <NavLink
                                        key={l.to}
                                        to={l.to}
                                        end={l.end}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                                                isActive ? 'bg-[#edf2ff] text-[#3476f5]' : 'text-[#6c6d7e] hover:bg-gray-50'
                                            }`
                                        }
                                    >
                                        <img src={l.icon} alt="" className="w-5 h-5 opacity-70" />
                                        {l.label}
                                    </NavLink>
                                ))}
                            </nav>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 w-full">
                                    <img src="/images/icons/profile-logout.svg" alt="" className="w-5 h-5" />
                                    Выход
                                </button>
                            </div>
                        </div>
                    </aside>
                    <div className="flex-1 min-w-0">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
