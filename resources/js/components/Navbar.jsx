import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ onAuthOpen }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link to="/" className="text-xl font-semibold text-gray-800">
                    Код бессмертия
                </Link>
                <div className="flex items-center gap-4 text-sm">
                    <Link to="/news" className="text-gray-600 hover:text-gray-900">Новости</Link>
                    <Link to="/tariffs" className="text-gray-600 hover:text-gray-900">Тарифы</Link>
                    {user ? (
                        <>
                            <Link to="/lk" className="text-gray-600 hover:text-gray-900">Личный кабинет</Link>
                            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
                                Выход
                            </button>
                        </>
                    ) : (
                        <button onClick={onAuthOpen} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">
                            Войти
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
