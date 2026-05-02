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
            setError(err.response?.data?.message || 'Ошибка');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">
                    {mode === 'login' ? 'Вход' : 'Регистрация'}
                </h2>
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-3">
                    {mode === 'register' && (
                        <input
                            type="text" placeholder="Имя" value={name}
                            onChange={(e) => setName(e.target.value)} required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                    )}
                    <input
                        type="email" placeholder="Email" value={email}
                        onChange={(e) => setEmail(e.target.value)} required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    />
                    <input
                        type="password" placeholder="Пароль" value={password}
                        onChange={(e) => setPassword(e.target.value)} required minLength={8}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    />
                    {mode === 'register' && (
                        <input
                            type="password" placeholder="Подтверждение пароля" value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)} required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                    )}
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                        {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-4">
                    {mode === 'login' ? 'Нет аккаунта? ' : 'Есть аккаунт? '}
                    <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                            className="text-blue-600 hover:underline">
                        {mode === 'login' ? 'Регистрация' : 'Войти'}
                    </button>
                </p>
            </div>
        </div>
    );
}
