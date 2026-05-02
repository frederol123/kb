import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer-section">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <div className="flex flex-col lg:flex-row justify-between gap-8 py-10">
                    <nav className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                        <Link to="/family_tree" className="text-white/70 hover:text-white text-base">Генеалогическое древо</Link>
                        <Link to="/tariffs" className="text-white/70 hover:text-white text-base">Цены</Link>
                        <Link to="/order-steps" className="text-white/70 hover:text-white text-base">Как заказать</Link>
                        <Link to="/faq" className="text-white/70 hover:text-white text-base">Частые вопросы</Link>
                    </nav>
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                        <a href="tel:+79123456789" className="text-white/70 hover:text-white text-base">+7 (123) 456-78-90</a>
                        <a href="#" className="text-white/70 hover:text-white text-base">WhatsApp</a>
                        <a href="#" className="text-white/70 hover:text-white text-base">Telegram</a>
                        <a href="#" className="text-white/70 hover:text-white text-base">VK</a>
                    </div>
                </div>
                <div className="border-t border-white/10 py-6 text-sm text-white/50 flex flex-col lg:flex-row gap-2 lg:gap-8">
                    <span>help@кодбессмертия.рф</span>
                    <span>г. Ижевск, ул 50 лет пионерии, 20. ТЦ Бета</span>
                    <span>ИП Столбов Н.С. ИНН 183116121807</span>
                    <span>ОГРНИП 321183200020509</span>
                </div>
            </div>
        </footer>
    );
}
