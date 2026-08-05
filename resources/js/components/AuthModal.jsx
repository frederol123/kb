import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

// ВНИМАНИЕ: ограничение на зарубежные email-домены временно отключено.
// Чтобы вернуть — раскомментируйте FOREIGN_EMAIL_DOMAINS, isForeignEmail и блок проверки в handleSubmit.
// const FOREIGN_EMAIL_DOMAINS = [
//     'gmail.com', 'googlemail.com',
//     'yahoo.com', 'yahoo.co.uk', 'yahoo.co.jp', 'yahoo.fr', 'yahoo.de',
//     'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
//     'aol.com', 'aim.com',
//     'protonmail.com', 'proton.me', 'pm.me',
//     'tutanota.com', 'tutanota.de',
//     'gmx.com', 'gmx.de', 'gmx.net',
//     'icloud.com', 'me.com', 'mac.com',
//     'mail.com', 'email.com',
//     'zoho.com',
//     'fastmail.com', 'fastmail.fm',
//     'cock.li', 'riseup.net',
//     'disroot.org',
//     'inbox.com',
//     'hushmail.com',
//     'qq.com', '163.com', '126.com', 'sina.com',
//     'naver.com', 'daum.net',
//     'yandex.com',
// ];

// function isForeignEmail(email) {
//     const domain = email.split('@')[1]?.toLowerCase().trim();
//     if (!domain) return false;
//     return FOREIGN_EMAIL_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
// }

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
    const [loginValue, setLoginValue] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [agreed, setAgreed] = useState(true);
    const [error, setError] = useState('');

    // Поля для телефона
    const [phone, setPhone] = useState('');
    const [phoneCode, setPhoneCode] = useState('');
    const [phoneCodeSent, setPhoneCodeSent] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [codeTimer, setCodeTimer] = useState(0);
    const [captchaToken, setCaptchaToken] = useState('');
    const [showDebugCode, setShowDebugCode] = useState(false);
    const [debugCode, setDebugCode] = useState('');
    const debugTimerRef = useRef(null);

    const { login, register, fetchUser } = useAuth();
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const mouseDownInside = useRef(false);
    const captchaContainerRef = useRef(null);
    const captchaWidgetRef = useRef(null);
    const captchaTokenRef = useRef('');

    // Инициализация Yandex SmartCaptcha
    useEffect(() => {
        if (mode !== 'register') return;

        const timer = setTimeout(() => {
            if (window.smartCaptcha && captchaContainerRef.current) {
                const widgetId = window.smartCaptcha.render(captchaContainerRef.current, {
                    sitekey: 'ysc1_UNKkYAoe8225FmLJznELyjVQf7nxz22EYSgG0vT594a6310b',
                    callback: (token) => {
                        captchaTokenRef.current = token;
                    },
                });
                captchaWidgetRef.current = widgetId;
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            captchaTokenRef.current = '';
            captchaWidgetRef.current = null;
        };
    }, [mode]);

    // Ошибка соц-авторизации (Google/VK) — показываем в модалке
    useEffect(() => {
        const handler = (e) => {
            setMode('login');
            setError(e.detail || 'Не удалось войти через соцсеть. Попробуйте ещё раз.');
        };
        window.addEventListener('auth:social-error', handler);
        return () => window.removeEventListener('auth:social-error', handler);
    }, []);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'register' && regType === 'email') {
            // if (isForeignEmail(email)) {
            //     setError('Регистрация с зарубежным email-адресом запрещена. Используйте российский почтовый сервис (mail.ru, yandex.ru, rambler.ru и др.)');
            //     return;
            // }
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
            } else if (mode === 'register' && regType === 'email') {
                if (!captchaTokenRef.current) {
                    setError('Пожалуйста, пройдите проверку «Я не робот».');
                    return;
                }
                await register(loginValue || name, name, email, password, passwordConfirmation, captchaTokenRef.current);
            } else {
                await register(loginValue || name, name, email, password, passwordConfirmation, captchaToken);
            }
            await fetchUser();
            onClose();
            navigate('/lk');
        } catch (err) {
            const errData = err.response?.data;
            const firstErr = errData?.errors
                ? Object.values(errData.errors).flat()[0]
                : null;
            setError(firstErr || errData?.message || 'Произошла ошибка');
        }
    };

    const sendPhoneCode = async () => {
        setSendingCode(true);
        setError('');
        setDebugCode('');
        setShowDebugCode(false);
        if (debugTimerRef.current) clearTimeout(debugTimerRef.current);
        try {
            const { data } = await api.post('/auth/send-code', { phone });
            setPhoneCodeSent(true);
            setDebugCode(data.code || '');
            if (data.sms_status === 'debug' && data.code) {
                setError('Код отправлен. Если SMS не пришло в течение 30 секунд — появится код ниже.');
                // Показываем fallback код через 30 секунд
                debugTimerRef.current = setTimeout(() => setShowDebugCode(true), 30000);
            } else {
                setError('Код отправлен на указанный номер.');
            }
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
                login: loginValue || name,
                name,
                password,
            });
            localStorage.setItem('token', data.token);
            await fetchUser();
            onClose();
            navigate('/lk');
        } catch (err) {
            setError(err.response?.data?.errors?.code?.[0] || err.response?.data?.message || 'Неверный код');
        } finally {
            setSendingCode(false);
        }
    };

    const handleSocialLogin = (provider) => {
        window.location.href = `/api/auth/${provider}/redirect`;
    };

    // ── VK ID SDK ─────────────────────────────────────────────
    const vkWidgetRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;

        const loadVkSdk = () => {
            if (window.VKIDSDK) return Promise.resolve(window.VKIDSDK);
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
                script.onload = () => {
                    const VKID = window.VKIDSDK;
                    VKID.Config.init({
                        app: Number(import.meta.env.VITE_VK_APP_ID || 54707973),
                        redirectUrl: import.meta.env.VITE_VK_REDIRECT_URL || 'https://immortal-code.ru/',
                        responseMode: VKID.ConfigResponseMode.Callback,
                        source: VKID.ConfigSource.LOWCODE,
                        scope: 'email',
                    });
                    resolve(VKID);
                };
                script.onerror = () => reject(new Error('VK SDK load failed'));
                document.head.appendChild(script);
            });
        };

        const handleVkSuccess = async (payload) => {
            try {
                const VKID = window.VKIDSDK;
                const data = await VKID.Auth.exchangeCode(payload.code, payload.device_id);
                const { data: res } = await api.post('/auth/vk/exchange', { token: data.token });
                localStorage.setItem('token', res.token);
                await fetchUser();
                onClose();
                navigate('/lk');
            } catch (err) {
                setError(err.response?.data?.message || 'Не удалось войти через ВКонтакте. Попробуйте ещё раз.');
            }
        };

        loadVkSdk()
            .then((VKID) => {
                if (cancelled) return;
                const container = document.getElementById('vk-id-widget');
                if (!container) return;

                // Убираем старый виджет при переключении формы
                if (vkWidgetRef.current?.destroy) {
                    try { vkWidgetRef.current.destroy(); } catch { /* noop */ }
                }

                const widget = new VKID.OAuthList();
                widget.render({ container, oauthList: ['vkid'] })
                    .on(VKID.WidgetEvents.ERROR, () => {
                        setError('Не удалось открыть VK ID. Попробуйте ещё раз.');
                    })
                    .on(VKID.OAuthListInternalEvents.LOGIN_SUCCESS, handleVkSuccess);
                vkWidgetRef.current = widget;
            })
            .catch(() => {
                if (!cancelled) setError('Не удалось загрузить VK ID.');
            });

        return () => { cancelled = true; };
    }, [open, mode]);

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

                        {/* Регистрация через соцсети */}
                        <div className="space-y-2">
                            <button type="button" onClick={() => handleSocialLogin('google')}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#e9f0ff] bg-white text-[#1c2145] font-medium hover:bg-[#f7fbff] transition-colors">
                                <svg width="18" height="18" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                                </svg>
                                Регистрация через Google
                            </button>
                            <div id="vk-id-widget" className="vk-id-widget"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-[#e9f0ff]"></div>
                            <span className="text-xs text-[#999]">или</span>
                            <div className="flex-1 h-px bg-[#e9f0ff]"></div>
                        </div>

                        {/* Переключатель Email / Телефон */}
                        <div className="flex rounded-lg border border-[#e9f0ff] overflow-hidden text-sm mt-4">
                            <button type="button"
                                onClick={() => { setRegType('email'); setError(''); setPhoneCodeSent(false); }}
                                className={`flex-1 pb-2.5 font-medium transition-colors ptop-imp ${regType === 'email' ? 'bg-[#1e79d0] text-white' : 'bg-white text-[#6c6d7e] hover:bg-[#f7fbff]'}`}>
                                Email
                            </button>
                            <button type="button"
                                onClick={() => { setRegType('phone'); setError(''); }}
                                className={`flex-1 pb-2.5 font-medium transition-colors ptop-imp ${regType === 'phone' ? 'bg-[#74d41d] text-white' : 'bg-white text-[#6c6d7e] hover:bg-[#f7fbff]'}`}>
                                Телефон
                            </button>
                        </div>

                        {regType === 'email' ? (
                            <>
                                <div>
                                    <label className="block text-sm text-[#999] mb-1">Email</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                           className="text-input" placeholder="mail.ru, yandex.ru, rambler.ru..." />
                                    {/* <p className="text-xs text-[#999] mt-1">Только российские почтовые сервисы</p> */}
                                </div>
                                <div>
                                    <label className="block text-sm text-[#999] mb-1">Логин</label>
                                    <input type="text" value={loginValue} onChange={e => setLoginValue(e.target.value)} required
                                           className="text-input" placeholder="Ваш логин для входа" />
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
                                    <label className="block text-sm text-[#999] mb-1">Логин</label>
                                    <input type="text" value={loginValue} onChange={e => setLoginValue(e.target.value)} required
                                           className="text-input" placeholder="Ваш логин" />
                                </div>
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
                                        <input type="text" value={phoneCode} onChange={e => setPhoneCode(e.target.value.replace(/\\D/g, '').slice(0, 4))}
                                               className="text-input" placeholder="0000" maxLength={4} required />
                                        {showDebugCode && debugCode && (
                                            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg mt-1">
                                                ⚠️ Если SMS не пришло — используйте код: <strong>{debugCode}</strong>
                                            </p>
                                        )}
                                    </div>
                                )}
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
                            <>
                                <div ref={captchaContainerRef} id="captcha-container" className="smart-captcha" style={{ height: 100 }}></div>
                                <button type="submit" className="button button--filled w-full">Зарегистрироваться</button>
                            </>
                        )}

                        {regType === 'phone' && phoneCodeSent && (
                            <button type="button" onClick={() => { setPhoneCodeSent(false); setPhoneCode(''); setError(''); if (debugTimerRef.current) clearTimeout(debugTimerRef.current); }}
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

                        {/* Вход через соцсети */}
                        <div className="space-y-2">
                            <button type="button" onClick={() => handleSocialLogin('google')}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#e9f0ff] bg-white text-[#1c2145] font-medium hover:bg-[#f7fbff] transition-colors">
                                <svg width="18" height="18" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                                </svg>
                                Войти через Google
                            </button>
                            <div id="vk-id-widget" className="vk-id-widget"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-[#e9f0ff]"></div>
                            <span className="text-xs text-[#999]">или</span>
                            <div className="flex-1 h-px bg-[#e9f0ff]"></div>
                        </div>

                        <div>
                            <label className="block text-sm text-[#999] mb-1">Логин или Email</label>
                            <input type="text" value={email} onChange={e => setEmail(e.target.value)} required
                                   className="text-input" placeholder="Ваш логин или email" />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
             onMouseDown={e => { if (e.target === e.currentTarget) mouseDownInside.current = false; }}
             onClick={e => { if (e.target === e.currentTarget && !mouseDownInside.current) onClose(); }}>
            <div ref={modalRef} className="bg-white rounded-2xl p-6 lg:p-8 w-full max-w-[440px] shadow-2xl relative"
                 onClick={e => e.stopPropagation()}
                 onMouseDown={() => { mouseDownInside.current = true; }}>
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
