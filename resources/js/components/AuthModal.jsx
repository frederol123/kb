import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const FOREIGN_EMAIL_DOMAINS = [
    'gmail.com', 'googlemail.com',
    'yahoo.com', 'yahoo.co.uk', 'yahoo.co.jp', 'yahoo.fr', 'yahoo.de',
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'aol.com', 'aim.com',
    'protonmail.com', 'proton.me', 'pm.me',
    'tutanota.com', 'tutanota.de',
    'gmx.com', 'gmx.de', 'gmx.net',
    'icloud.com', 'me.com', 'mac.com',
    'mail.com', 'email.com',
    'zoho.com',
    'fastmail.com', 'fastmail.fm',
    'cock.li', 'riseup.net',
    'disroot.org',
    'inbox.com',
    'hushmail.com',
    'qq.com', '163.com', '126.com', 'sina.com',
    'naver.com', 'daum.net',
    'yandex.com',
];

function isForeignEmail(email) {
    const domain = email.split('@')[1]?.toLowerCase().trim();
    if (!domain) return false;
    return FOREIGN_EMAIL_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
}

function formatPhone(value) {
    // Убираем всё кроме цифр
    const digits = value.replace(/\D/g, '');
    // Ограничиваем 11 цифрами (8 XXX XXX XX XX)
    const limited = digits.slice(0, 11);
    if (!limited) return '';
    // Форматируем: +7 (XXX) XXX-XX-XX
    let result = '+7';
    if (limited.length > 1) result += ' (' + limited.slice(1, 4);
    if (limited.length >= 5) result += ') ' + limited.slice(4, 7);
    if (limited.length >= 8) result += '-' + limited.slice(7, 9);
    if (limited.length >= 10) result += '-' + limited.slice(9, 11);
    return result;
}

export default function AuthModal({ open, onClose }) {
    const [mode, setMode] = useState('login');
    const [regType, setRegType] = useState('email'); // 'email' | 'phone'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [agreed, setAgreed] = useState(true);
    const [error, setError] = useState('');

    // Поля для телефона
    const [phone, setPhone] = useState('');
    const [phoneCode, setPhoneCode] = useState('');
    const [phoneCodeSent, setPhoneCodeSent] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [codeTimer, setCodeTimer] = useState(0);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'register' && regType === 'email') {
            if (isForeignEmail(email)) {
                setError('Регистрация с зарубежным email-адресом запрещена. Используйте российский почтовый сервис (mail.ru, yandex.ru, rambler.ru и др.)');
                return;
            }
            if (!agreed) {
                setError('Необходимо принять условия Оферты и согласиться на обработку персональных данных');
                return;
            }
        }

        if (mode === 'register' && regType === 'phone') {
            if (!agreed) {
                setError('Необходимо принять условия Оферты и согласиться на обработку персональных данных');
                return;
            }
            if (!phoneCodeSent) {
                // Отправляем код
                await sendPhoneCode();
                return;
            }
            // Подтверждаем код и регистрируемся
            await verifyPhoneAndRegister();
            return;
        }

        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await register(name, email, password, passwordConfirmation);
            }
            onClose();
            navigate('/lk');
        } catch (err) {
            setError(err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Произошла ошибка');
        }
    };

    const sendPhoneCode = async () => {
        setSendingCode(true);
        setError('');
        try {
            await api.post('/auth/send-code', { phone });
            setPhoneCodeSent(true);
            setError('Код отправлен на указанный номер.');
            // Таймер 60 секунд
            setCodeTimer(60);
            const interval = setInterval(() => {
                setCodeTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.errors?.phone?.[0] || err.response?.data?.message || 'Ошибка при отправке кода');
        } finally {
            setSendingCode(false);
        }
    };

    const verifyPhoneAndRegister = async () => {
        setSendingCode(true);
        setError('');
        try {
            const { data } = await api.post('/auth/verify-phone', {
                phone,
                code: phoneCode,
                name,
                password,
            });
            localStorage.setItem('token', data.token);
            onClose();
            navigate('/lk');
        } catch (err) {
            setError(err.response?.data?.errors?.code?.[0] || err.response?.data?.message || 'Неверный код');
        } finally {
            setSendingCode(false);
        }
    };

    const renderForm = () => {
        switch (mode) {
            case 'register':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="font-extrabold text-2xl text-[#1c2145]">Регистрация</h2>
                        {error && (
                            <p className={`text-sm p-3 rounded-lg ${error.includes('отправлен') ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                                {error}
                            </p>
                        )}

                        {/* Переключатель Email / Телефон */}
                        <div className="flex rounded-lg border border-[#e9f0ff] overflow-hidden text-sm mt-4">
                            <button type="button"
                                onClick={() => { setRegType('email'); setError(''); setPhoneCodeSent(false); }}
                                className={`flex-1 pb-2.5 font-medium transition-colors ptop-imp ${regType === 'email' ? 'bg-[#1e79d0] text-white' : 'bg-white text-[#6c6d7e] hover:bg-[#f7fbff]'}`}>
                                Email
                            </button>
                            <button type="button"
                                onClick={() => { setRegType('phone'); setError(''); }}
                                className={`flex-1 pb-2.5 font-medium transition-colors ptop-imp ${regType === 'phone' ? 'bg-[#1e79d0] text-white' : 'bg-white text-[#6c6d7e] hover:bg-[#f7fbff]'}`}>
                                Телефон
                            </button>
                        </div>

                        {regType === 'email' ? (
                            <>
                                <div>
                                    <label className="block text-sm text-[#999] mb-1">Email</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                           className="text-input" placeholder="mail.ru, yandex.ru, rambler.ru..." />
                                    <p className="text-xs text-[#999] mt-1">Только российские почтовые сервисы</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-[#999] mb-1">Имя</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                           className="text-input" placeholder="Ваше имя" />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#999] mb-1">Пароль</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                                           className="text-input" placeholder="Не менее 8 символов" />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#999] mb-1">Подтверждение пароля</label>
                                    <input type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} required
                                           className="text-input" placeholder="Повторите пароль" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm text-[#999] mb-1">Имя</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                           className="text-input" placeholder="Ваше имя" />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#999] mb-1">Номер телефона</label>
                                    <input type="tel" value={phone} onChange={e => setPhone(formatPhone(e.target.value))}
                                           placeholder="+7 (999) 999-99-99"
                                           className="text-input" required />
                                </div>
                                {phoneCodeSent && (
                                    <div>
                                        <label className="block text-sm text-[#999] mb-1">Код из SMS</label>
                                        <input type="text" value={phoneCode} onChange={e => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                               className="text-input" placeholder="0000" maxLength={4} required />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm text-[#999] mb-1">Пароль</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                                           className="text-input" placeholder="Не менее 8 символов" />
                                </div>
                            </>
                        )}

                        <label className="flex items-start gap-2 text-sm text-[#6c6d7e] cursor-pointer">
                            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                                   className="mt-0.5 w-4 h-4 shrink-0 accent-[#1e79d0]" />
                            <span>Я принимаю условия <a href="/offer" target="_blank" rel="noopener noreferrer" className="text-[#1e79d0] underline hover:no-underline" onClick={e => e.stopPropagation()}>Оферты</a> и согласен с Положением об обработке персональных данных</span>
                        </label>

                        {regType === 'phone' && phoneCodeSent ? (
                            <button type="submit" disabled={sendingCode || phoneCode.length !== 4}
                                    className="button button--filled w-full disabled:opacity-50">
                                {sendingCode ? 'Подтверждение...' : 'Подтвердить и зарегистрироваться'}
                            </button>
                        ) : regType === 'phone' && !phoneCodeSent ? (
                            <button type="submit" disabled={sendingCode || phone.length < 16}
                                    className="button button--filled w-full disabled:opacity-50">
                                {sendingCode ? 'Отправка...' : codeTimer > 0 ? `Отправить повторно (${codeTimer}с)` : 'Получить код'}
                            </button>
                        ) : (
                            <button type="submit" className="button button--filled w-full">Зарегистрироваться</button>
                        )}

                        {regType === 'phone' && phoneCodeSent && (
                            <button type="button" onClick={() => { setPhoneCodeSent(false); setPhoneCode(''); setError(''); }}
                                    className="w-full text-sm text-[#999] hover:text-[#1e79d0] transition-colors">
                                ← Изменить номер
                            </button>
                        )}

                        <p className="text-center text-sm text-[#999]">
                            Уже есть аккаунт?{' '}
                            <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-[#3476f5] font-bold hover:underline">Войти</button>
                        </p>
                    </form>
                );
            case 'forgot':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="font-extrabold text-2xl text-[#1c2145]">Восстановление пароля</h2>
                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                        <div>
                            <label className="block text-sm text-[#999] mb-1">Email при регистрации</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                   className="text-input" placeholder="email@example.com" />
                        </div>
                        <button type="submit" className="button button--filled w-full">Отправить</button>
                        <p className="text-center text-sm text-[#999]">
                            <button type="button" onClick={() => { setMode('login'); setError(''); }} className="text-[#3476f5] font-bold hover:underline">Вернуться ко входу</button>
                        </p>
                    </form>
                );
            default:
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="font-extrabold text-2xl text-[#1c2145]">Авторизация</h2>
                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                        <div>
                            <label className="block text-sm text-[#999] mb-1">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                   className="text-input" placeholder="email@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm text-[#999] mb-1">Пароль</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                   className="text-input" placeholder="Ваш пароль" />
                        </div>
                        <button type="submit" className="button button--filled w-full">Войти</button>
                        <div className="flex justify-between text-sm">
                            <button type="button" onClick={() => { setMode('register'); setError(''); }} className="text-[#3476f5] font-bold hover:underline">Создать аккаунт</button>
                            <button type="button" onClick={() => { setMode('forgot'); setError(''); }} className="text-[#3476f5] font-bold hover:underline">Забыли пароль?</button>
                        </div>
                    </form>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-[440px] shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={onClose}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-[#999] hover:text-[#1c2145] transition-colors rounded-full hover:bg-[#f0f4ff]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
                {renderForm()}
            </div>
        </div>
    );
}
