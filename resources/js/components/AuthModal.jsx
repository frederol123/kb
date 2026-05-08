import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ open, onClose }) {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
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

    const renderForm = () => {
        switch (mode) {
            case 'register':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="font-extrabold text-2xl text-[#1c2145]">Регистрация</h2>
                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                        <div>
                            <label className="block text-sm text-[#999] mb-1">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                   className="text-input" placeholder="email@example.com" />
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
                        <button type="submit" className="button button--filled w-full">Зарегистрироваться</button>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-[440px] shadow-2xl" onClick={e => e.stopPropagation()}>
                {renderForm()}
            </div>
        </div>
    );
}
