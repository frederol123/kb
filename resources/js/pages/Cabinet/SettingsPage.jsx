import { useState } from 'react';
import api from '../../lib/api';

export default function SettingsPage() {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', newPasswordConfirmation: '' });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.newPasswordConfirmation) {
            setStatus({ type: 'error', text: 'Новый пароль и подтверждение не совпадают' });
            return;
        }
        setLoading(true);
        setStatus(null);
        try {
            await api.post('/auth/change-password', {
                current_password: form.currentPassword,
                password: form.newPassword,
                password_confirmation: form.newPasswordConfirmation,
            });
            setStatus({ type: 'success', text: 'Пароль успешно изменён' });
            setForm({ currentPassword: '', newPassword: '', newPasswordConfirmation: '' });
        } catch (err) {
            const msg = err.response?.data?.message || 'Ошибка при смене пароля';
            const errors = err.response?.data?.errors;
            const text = errors ? Object.values(errors).flat().join('; ') : msg;
            setStatus({ type: 'error', text });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="section-title">Настройки</h2>
            <p className="section-desc">
                Изменение пароля и настройки аккаунта.
            </p>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e9f0ff] max-w-lg">
                <h3 className="font-bold text-[#1c2145] text-xl mb-6">Сменить пароль</h3>

                {status && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-bold ${
                        status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {status.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <label className="form__field">
                            <input
                                type="password"
                                name="currentPassword"
                                className="text-input"
                                placeholder="Текущий пароль"
                                value={form.currentPassword}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label className="form__field">
                            <input
                                type="password"
                                name="newPassword"
                                className="text-input"
                                placeholder="Новый пароль"
                                value={form.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label className="form__field">
                            <input
                                type="password"
                                name="newPasswordConfirmation"
                                className="text-input"
                                placeholder="Подтвердите новый пароль"
                                value={form.newPasswordConfirmation}
                                onChange={handleChange}
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
