import { useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function SettingsPage() {
    const { user } = useAuth();
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', newPasswordConfirmation: '' });
    const [nameForm, setNameForm] = useState({ name: user?.name || '' });
    const [status, setStatus] = useState(null);
    const [nameStatus, setNameStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nameLoading, setNameLoading] = useState(false);

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.newPasswordConfirmation) {
            setStatus({ type: 'error', text: 'Новый пароль и подтверждение не совпадают' });
            return;
        }
        setLoading(true);
        setStatus(null);
        try {
            await api.post('/auth/change-password', {
                current_password: passwordForm.currentPassword,
                password: passwordForm.newPassword,
                password_confirmation: passwordForm.newPasswordConfirmation,
            });
            setStatus({ type: 'success', text: 'Пароль успешно изменён' });
            setPasswordForm({ currentPassword: '', newPassword: '', newPasswordConfirmation: '' });
        } catch (err) {
            const msg = err.response?.data?.message || 'Ошибка при смене пароля';
            const errors = err.response?.data?.errors;
            const text = errors ? Object.values(errors).flat().join('; ') : msg;
            setStatus({ type: 'error', text });
        } finally {
            setLoading(false);
        }
    };

    const handleNameSubmit = async (e) => {
        e.preventDefault();
        setNameLoading(true);
        setNameStatus(null);
        try {
            await api.post('/auth/change-name', { name: nameForm.name });
            setNameStatus({ type: 'success', text: 'Имя успешно изменено' });
            window.dispatchEvent(new CustomEvent('auth:name-changed', { detail: nameForm.name }));
        } catch (err) {
            const msg = err.response?.data?.message || 'Ошибка при смене имени';
            setNameStatus({ type: 'error', text: msg });
        } finally {
            setNameLoading(false);
        }
    };

    return (
        <div>
            <h2 className="section-title">Настройки</h2>
            <p className="section-desc">
                Изменение пароля и настройки аккаунта.
            </p>

            {/* Смена имени */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e9f0ff] max-w-lg mb-6">
                <h3 className="font-bold text-[#1c2145] text-xl mb-6">Сменить имя</h3>

                {nameStatus && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-bold ${
                        nameStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {nameStatus.text}
                    </div>
                )}

                <form onSubmit={handleNameSubmit}>
                    <div className="flex flex-col gap-4">
                        <label className="form__field">
                            <input
                                type="text"
                                className="text-input"
                                placeholder="Ваше имя"
                                value={nameForm.name}
                                onChange={e => setNameForm({ name: e.target.value })}
                                required
                            />
                        </label>
                        <p className="text-xs text-gray-400">
                            Имя можно менять не чаще одного раза в час.
                        </p>
                    </div>
                    <button type="submit" className="form__submit mt-4" disabled={nameLoading}>
                        {nameLoading ? 'Сохранение...' : 'Сохранить имя'}
                    </button>
                </form>
            </div>

            {/* Смена пароля */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e9f0ff] max-w-lg">
                <h3 className="font-bold text-[#1c2145] text-xl mb-6">Сменить пароль</h3>

                {status && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-bold ${
                        status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {status.text}
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                    <div className="flex flex-col gap-4">
                        <label className="form__field">
                            <input
                                type="password"
                                name="currentPassword"
                                className="text-input"
                                placeholder="Текущий пароль"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </label>
                        <label className="form__field">
                            <input
                                type="password"
                                name="newPassword"
                                className="text-input"
                                placeholder="Новый пароль"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </label>
                        <label className="form__field">
                            <input
                                type="password"
                                name="newPasswordConfirmation"
                                className="text-input"
                                placeholder="Подтвердите новый пароль"
                                value={passwordForm.newPasswordConfirmation}
                                onChange={handlePasswordChange}
                                required
                            />
                        </label>
                    </div>
                    <button type="submit" className="form__submit mt-6" disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </form>
            </div>
        </div>
    );
}
