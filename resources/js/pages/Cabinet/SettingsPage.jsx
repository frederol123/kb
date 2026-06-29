import { useState } from 'react';
import { Link } from 'react-router-dom';
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

            {/* Текущий тариф */}
            {user?.tariff && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e9f0ff] max-w-lg mb-6">
                    <h3 className="font-bold text-[#1c2145] text-xl mb-6">Мой тариф</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-[#f0fdf4] flex items-center justify-center">
                            <svg className="w-7 h-7 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-[#1c2145] text-lg">{user.tariff.title}</p>
                            <p className="text-sm text-[#6c6d7e]">{Number(user.tariff.price).toLocaleString()} ₽</p>
                        </div>
                    </div>
                    {user.tariff.limits && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <LimitItem label="QR-коды" value={user.tariff.limits.max_qr_codes} />
                            <LimitItem label="Установка" value={user.tariff.limits.has_installation ? 'Включена' : 'Нет'} active={user.tariff.limits.has_installation} />
                            <LimitItem label="Приватность" value={user.tariff.limits.has_privacy ? 'Включена' : 'Нет'} active={user.tariff.limits.has_privacy} />
                            <LimitItem label="Обслуживание" value={user.tariff.limits.has_maintenance ? 'Включено' : 'Нет'} active={user.tariff.limits.has_maintenance} />
                            <LimitItem label="Генеалогическое древо" value={user.tariff.limits.has_family_tree ? 'Включено' : 'Нет'} active={user.tariff.limits.has_family_tree} />
                        </div>
                    )}
                    <Link to="/tariffs" className="btn-filled text-sm inline-flex">Сменить тариф</Link>
                </div>
            )}

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

function LimitItem({ label, value, active = null }) {
    const isActive = active !== null ? active : value > 0;
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-[#22c55e]' : 'bg-gray-300'}`}></span>
            <span className="text-[#6c6d7e]">{label}:</span>
            <span className={`font-bold ${isActive ? 'text-[#1c2145]' : 'text-gray-400'}`}>{value}</span>
        </div>
    );
}
