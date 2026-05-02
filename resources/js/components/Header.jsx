import { Link } from 'react-router-dom';

export default function Header({ user, onAuthOpen, onLogout }) {
    return (
        <header className="header-fixed">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px] h-20 lg:h-[112px] flex items-center justify-between">
                <Link to="/" className="w-[140px] lg:w-[191px] flex-shrink-0">
                    <img src="/images/logo.svg" alt="Код бессмертия" className="w-full" />
                </Link>

                <nav className="hidden lg:flex items-center gap-8">
                    <Link to="/family_tree" className="text-[#6c6d7e] hover:text-[#1c2145] font-medium text-base">Генеалогическое древо</Link>
                    <Link to="/tariffs" className="text-[#6c6d7e] hover:text-[#1c2145] font-medium text-base">Цены</Link>
                    <Link to="/order-steps" className="text-[#6c6d7e] hover:text-[#1c2145] font-medium text-base">Как заказать</Link>
                    <Link to="/faq" className="text-[#6c6d7e] hover:text-[#1c2145] font-medium text-base">Частые вопросы</Link>
                </nav>

                <div className="hidden lg:flex items-center gap-4">
                    {user ? (
                        <Link to="/lk" className="flex items-center gap-2 hover:opacity-80">
                            <img src="/images/no-photo.svg" alt="" className="w-10 h-10 rounded-full" />
                            <span className="text-[#1c2145] font-bold text-sm">{user.name}</span>
                        </Link>
                    ) : (
                        <button onClick={onAuthOpen} className="btn-filled text-sm px-6 py-2.5">Войти</button>
                    )}
                </div>

                <button className="lg:hidden w-8 h-6 flex flex-col justify-between" data-menu-toggle>
                    <span className="block h-0.5 bg-[#1c2145] rounded"></span>
                    <span className="block h-0.5 bg-[#1c2145] rounded"></span>
                    <span className="block h-0.5 bg-[#1c2145] rounded"></span>
                </button>
            </div>
        </header>
    );
}
