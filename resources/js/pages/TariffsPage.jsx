import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { useState, useEffect } from 'react';

// Маппинг позиции в массиве → slug тарифа в БД
const tariffSlugs = ['basic', 'extended', 'special', 'pet'];

const tariffs = [
    {
        title: 'Базовая страница',
        price: '3400',
        features: [
            { icon: 'icon-list-qr.svg', text: '1 генерация QR-кода' },
            { icon: 'icon-list-qr.svg', text: 'Табличка с QR-кодом в футляре' },
            { icon: 'icon-list-note.svg', text: 'Добавление биографии' },
            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
        ],
    },
    {
        title: 'Расширенная страница',
        price: '8250',
        highlighted: true,
        desc: '<p>Включает в себя все возможности <strong>базовой страницы,</strong> с учетом генерации <strong>3 QR-кода</strong>. Возможность генерации QR-кода со скидкой 20% на следующие 3 анкеты.</p>',
        features: [
            { icon: 'icon-list-qr.svg', text: '3 генерации QR-кода' },
            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
            { icon: 'icon-list-mount.svg', text: 'Установка за счёт компании' },
            { icon: 'icon-list-privacy.svg', text: 'Приватность' },
        ],
    },
    {
        title: 'Особая страница',
        price: '13750',
        badge: 'badge-special.svg',
        desc: '<p>Включает в себя все возможности <strong>расширенной страницы,</strong> с учетом генерации <strong>5 QR-кода</strong>. Возможность генерации QR-кода со скидкой 20% на все следующие анкеты.</p>',
        features: [
            { icon: 'icon-list-qr.svg', text: '5 генераций QR-кода' },
            { icon: 'icon-list-support.svg', text: 'Приоритетная поддержка 24/7' },
        ],
    },
    {
        title: 'Страница питомца',
        price: '2200',
        badge: 'badge-pet.svg',
        features: [
            { icon: 'icon-list-qr.svg', text: '1 генерация QR-кода' },
            { icon: 'icon-list-qr.svg', text: 'Табличка с QR-кодом в футляре' },
            { icon: 'icon-list-note.svg', text: 'Добавление биографии' },
            { icon: 'icon-list-picture.svg', text: 'Добавление фото, видео и аудио' },
        ],
    },
];

const tariffDetails = [
    // 0 — Базовая страница
    {
        heroSubtitle: 'Вы получаете металлическую табличку с нанесённым высокоточным лазером QR-кодом, по которому при сканировании вы попадаете в профиль пользователя.',
        heroVisualIcon: '/uploads/2024/02/icon-list-qr.svg',
        heroVisualLabel: '<strong>1 генерация QR-кода</strong>',
        sections: [
            {
                icon: '/uploads/2024/02/icon-list-qr.svg',
                title: 'Металлическая табличка с QR-кодом',
                text: 'Вы получаете металлическое изделие — табличку с нанесённым высокоточным лазером QR-кодом. При сканировании (наведении камеры телефона) вы попадаете в профиль человека, цифровую память которого хотите сохранить. Оплата производится на сайте компании, после чего генерируется QR-код. Базовый тариф включает 1 генерацию кода.',
            },
            {
                icon: '/uploads/2024/02/icon-list-picture.svg',
                title: 'Цифровой профиль памяти',
                text: 'В профиле пользователя вы самостоятельно сможете создать анкету, добавить фото и видеоматериалы, аудиофайлы, а также описать памятные и дорогие вашему сердцу моменты. Или мы можем сделать это за вас, создав видеоролик по вашим пожеланиям.',
            },
            {
                icon: null,
                svg: '<rect width="40" height="40" rx="8" fill="#E8F4FD"/><path d="M12 28V16l8-6 8 6v12H12z" stroke="#1e79d0" strokeWidth="2" fill="none"/><path d="M16 28v-8h8v8" stroke="#1e79d0" strokeWidth="2" fill="none"/>',
                title: 'Прочная металлическая конструкция',
                text: 'Табличка выполнена из металла. Ей не страшны погодные условия, а также она весьма стойка к любым механическим повреждениям.',
            },
            {
                icon: null,
                svg: '<rect width="40" height="40" rx="8" fill="#E8F4FD"/><circle cx="20" cy="20" r="8" stroke="#1e79d0" strokeWidth="2" fill="none"/><path d="M20 16v4l3 3" stroke="#1e79d0" strokeWidth="2" strokeLinecap="round"/>',
                title: 'Установка',
                text: 'Установка таблички на памятник производится самостоятельно. В наборе с изделием мы присылаем специальный стикер с промышленным клеем для крепления на памятник или другую поверхность. Мы также можем установить табличку самостоятельно — укажите это менеджеру в заказе. Стоимость установки зависит от города и удалённости места погребения.',
            },
        ],
        extraAdvantages: [
            { iconSvg: '<path d="M16 4L20 12h8l-6 6 2 8-8-4-8 4 2-8-6-6h8L16 4z" fill="#1e79d0" opacity="0.2"/><path d="M16 4L20 12h8l-6 6 2 8-8-4-8 4 2-8-6-6h8L16 4z" stroke="#1e79d0" strokeWidth="1.5" fill="none"/>', text: '<strong>1 генерация QR-кода</strong>' },
            { iconSvg: '<rect x="4" y="8" width="24" height="18" rx="3" stroke="#1e79d0" strokeWidth="1.5" fill="none"/><path d="M12 8V6a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#1e79d0" strokeWidth="1.5" fill="none"/><path d="M10 14h12M10 18h8" stroke="#1e79d0" strokeWidth="1.5" strokeLinecap="round"/>', text: 'Металлическая табличка в футляре' },
        ],
    },
    // 1 — Расширенная страница
    {
        heroSubtitle: 'Всё, что в базовом тарифе, плюс установка за счёт компании, приватность и обслуживание страницы. 3 генерации QR-кода со скидкой 20% на следующие анкеты.',
        heroVisualIcon: '/uploads/2024/02/icon-list-mount.svg',
        heroVisualLabel: '<strong>3 генерации QR-кода</strong> + установка',
        sections: [
            {
                icon: '/uploads/2024/02/icon-list-qr.svg',
                title: 'Металлическая табличка с QR-кодом',
                text: 'Вы получаете металлическое изделие — табличку с нанесённым высокоточным лазером QR-кодом. При сканировании (наведении камеры телефона) вы попадаете в профиль человека, цифровую память которого хотите сохранить. Расширенный тариф включает 3 генерации QR-кода, а также скидку 20% на следующие 3 анкеты.',
            },
            {
                icon: '/uploads/2024/02/icon-list-picture.svg',
                title: 'Цифровой профиль памяти',
                text: 'В профиле пользователя вы самостоятельно сможете создать анкету, добавить фото и видеоматериалы, аудиофайлы, а также описать памятные и дорогие вашему сердцу моменты. Или мы можем сделать это за вас, создав видеоролик по вашим пожеланиям.',
            },
            {
                icon: '/uploads/2024/02/icon-list-mount.svg',
                title: 'Установка за счёт компании',
                text: 'В отличие от базового тарифа, установка металлической таблички на памятник производится за счёт компании. Наши сотрудники приедут и профессионально закрепят табличку, чтобы она служила долгие годы.',
            },
            {
                icon: '/uploads/2024/02/icon-list-privacy.svg',
                title: 'Приватность',
                text: 'Доступ к цифровому профилю памяти будет ограничен — только те, кому вы доверите QR-код, смогут увидеть анкету, фото и видео. Ваши семейные воспоминания останутся под защитой.',
            },
            {
                icon: '/uploads/2024/02/icon-list-support.svg',
                title: 'Обслуживание страницы',
                text: 'Мы берём на себя техническое обслуживание страницы: актуализация информации, поддержка загрузки новых материалов и круглосуточная работа цифрового профиля памяти.',
            },
            {
                icon: null,
                svg: '<rect width="40" height="40" rx="8" fill="#E8F4FD"/><path d="M12 28V16l8-6 8 6v12H12z" stroke="#1e79d0" strokeWidth="2" fill="none"/><path d="M16 28v-8h8v8" stroke="#1e79d0" strokeWidth="2" fill="none"/>',
                title: 'Прочная металлическая конструкция',
                text: 'Табличка выполнена из металла. Ей не страшны погодные условия, а также она весьма стойка к любым механическим повреждениям.',
            },
        ],
        extraAdvantages: [
            { iconSvg: '<path d="M16 4L20 12h8l-6 6 2 8-8-4-8 4 2-8-6-6h8L16 4z" fill="#1e79d0" opacity="0.2"/><path d="M16 4L20 12h8l-6 6 2 8-8-4-8 4 2-8-6-6h8L16 4z" stroke="#1e79d0" strokeWidth="1.5" fill="none"/>', text: '<strong>3 генерации QR-кода</strong>' },
            { iconSvg: '<path d="M8 14h16M8 14v10a2 2 0 002 2h12a2 2 0 002-2V14M12 14V10a4 4 0 018 0v4" stroke="#1e79d0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>', text: 'Металлическая табличка в футляре' },
            { iconSvg: '<path d="M12 22V12l4-3 4 3v10M14 22v-6h4v6" stroke="#1e79d0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>', text: 'Установка за счёт компании' },
            { iconSvg: '<circle cx="16" cy="16" r="8" stroke="#1e79d0" strokeWidth="1.5" fill="none"/><path d="M12 16l3 3 5-5" stroke="#1e79d0" strokeWidth="1.5" strokeLinecap="round"/>', text: 'Приватность профиля' },
            { iconSvg: '<path d="M20 12c0 3-4 5-4 5s-4-2-4-5a4 4 0 118 0z" stroke="#1e79d0" strokeWidth="1.5" fill="none"/><circle cx="16" cy="12" r="1.5" fill="#1e79d0"/>', text: 'Обслуживание страницы' },
        ],
    },
    // 2 — Особая страница
    {
        heroSubtitle: 'Максимальный тариф: всё, что в расширенном, плюс 5 генераций QR-кода со скидкой 20% на все последующие анкеты.',
        heroVisualIcon: '/uploads/2024/02/icon-list-tree.svg',
        heroVisualLabel: '<strong>5 генераций QR-кода</strong> + всё включено',
        sections: [
            {
                icon: '/uploads/2024/02/icon-list-qr.svg',
                title: 'Металлическая табличка с QR-кодом',
                text: 'Вы получаете металлическое изделие — табличку с нанесённым высокоточным лазером QR-кодом. При сканировании (наведении камеры телефона) вы попадаете в профиль человека, цифровую память которого хотите сохранить. Особый тариф включает 5 генераций QR-кода, а также скидку 20% на все последующие анкеты.',
            },
            {
                icon: '/uploads/2024/02/icon-list-picture.svg',
                title: 'Цифровой профиль памяти',
                text: 'В профиле пользователя вы самостоятельно сможете создать анкету, добавить фото и видеоматериалы, аудиофайлы, а также описать памятные и дорогие вашему сердцу моменты. Наши специалисты также могут помочь с наполнением профиля.',
            },
            {
                icon: null,
                svg: '<rect width="40" height="40" rx="8" fill="#E8F4FD"/><path d="M6 12h28M6 12v20a2 2 0 002 2h24a2 2 0 002-2V12M14 12V8a4 4 0 014-4h4a4 4 0 014 4v4" stroke="#1e79d0" strokeWidth="2" fill="none"/><circle cx="20" cy="18" r="3" stroke="#1e79d0" strokeWidth="2" fill="none"/><path d="M14 28h12" stroke="#1e79d0" strokeWidth="2" strokeLinecap="round"/>',
                title: 'Создание видеоролика',
                text: 'Мы создадим видеоролик по вашим пожеланиям, используя предоставленные фото- и видеоматериалы. Профессиональный монтаж, музыкальное сопровождение и трогательное повествование — чтобы сохранить память о близком человеке в самом тёплом и живом формате.',
            },
            {
                icon: '/uploads/2024/02/icon-list-support.svg',
                title: 'Приоритетная поддержка',
                text: 'Круглосуточная поддержка клиентов. Мы всегда на связи, чтобы помочь с любыми вопросами — от создания страницы до установки таблички.',
            },
            {
                icon: null,
                svg: '<rect width="40" height="40" rx="8" fill="#E8F4FD"/><circle cx="20" cy="20" r="8" stroke="#1e79d0" strokeWidth="2" fill="none"/><path d="M20 16v4l3 3" stroke="#1e79d0" strokeWidth="2" strokeLinecap="round"/>',
                title: 'Сохранение истории',
                text: 'Мы поможем вам сохранить важные моменты жизни в цифровом формате. Все материалы хранятся надёжно и доступны вам в любой момент.',
            },
            {
                icon: '/uploads/2024/02/icon-list-mount.svg',
                title: 'Установка за счёт компании',
                text: 'Установка металлической таблички на памятник производится за счёт компании. Наши сотрудники приедут и профессионально закрепят табличку, чтобы она служила долгие годы.',
            },
            {
                icon: '/uploads/2024/02/icon-list-privacy.svg',
                title: 'Приватность',
                text: 'Доступ к цифровому профилю памяти будет ограничен — только те, кому вы доверите QR-код, смогут увидеть анкету, фото и видео. Ваши семейные воспоминания останутся под защитой.',
            },
            {
                icon: '/uploads/2024/02/icon-list-support.svg',
                title: 'Обслуживание страницы',
                text: 'Мы берём на себя техническое обслуживание страницы: актуализация информации, поддержка загрузки новых материалов и круглосуточная работа цифрового профиля памяти.',
            },
            {
                icon: null,
                svg: '<rect width="40" height="40" rx="8" fill="#E8F4FD"/><path d="M12 28V16l8-6 8 6v12H12z" stroke="#1e79d0" strokeWidth="2" fill="none"/><path d="M16 28v-8h8v8" stroke="#1e79d0" strokeWidth="2" fill="none"/>',
                title: 'Прочная металлическая конструкция',
                text: 'Табличка выполнена из металла. Ей не страшны погодные условия, а также она весьма стойка к любым механическим повреждениям.',
            },
        ],
        extraAdvantages: [
            { iconSvg: '<path d="M16 4L20 12h8l-6 6 2 8-8-4-8 4 2-8-6-6h8L16 4z" fill="#1e79d0" opacity="0.2"/><path d="M16 4L20 12h8l-6 6 2 8-8-4-8 4 2-8-6-6h8L16 4z" stroke="#1e79d0" strokeWidth="1.5" fill="none"/>', text: '<strong>5 генераций QR-кода</strong>' },
            { iconSvg: '<path d="M8 14h16M8 14v10a2 2 0 002 2h12a2 2 0 002-2V14M12 14V10a4 4 0 018 0v4" stroke="#1e79d0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>', text: 'Металлическая табличка в футляре' },
            { iconSvg: '<rect width="40" height="40" rx="8" fill="#E8F4FD"/><path d="M6 12h28M6 12v20a2 2 0 002 2h24a2 2 0 002-2V12M14 12V8a4 4 0 014-4h4a4 4 0 014 4v4" stroke="#1e79d0" strokeWidth="2" fill="none"/><circle cx="20" cy="18" r="3" stroke="#1e79d0" strokeWidth="2" fill="none"/><path d="M14 28h12" stroke="#1e79d0" strokeWidth="2" strokeLinecap="round"/>', text: 'Создание видеоролика' },
            { iconSvg: '<path d="M12 22V12l4-3 4 3v10M14 22v-6h4v6" stroke="#1e79d0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>', text: 'Установка за счёт компании' },
            { iconSvg: '<circle cx="16" cy="16" r="8" stroke="#1e79d0" strokeWidth="1.5" fill="none"/><path d="M12 16l3 3 5-5" stroke="#1e79d0" strokeWidth="1.5" strokeLinecap="round"/>', text: 'Приватность профиля' },
            { iconSvg: '<path d="M20 12c0 3-4 5-4 5s-4-2-4-5a4 4 0 118 0z" stroke="#1e79d0" strokeWidth="1.5" fill="none"/><circle cx="16" cy="12" r="1.5" fill="#1e79d0"/>', text: 'Обслуживание страницы' },
        ],
    },
    // 3 — Страница питомца
    {
        heroSubtitle: 'Увековечьте память о вашем любимце: металлическая табличка с QR-кодом, биография, фото, видео и аудио — всё, чтобы сохранить тёплые воспоминания.',
        heroVisualIcon: '/uploads/2024/02/badge-pet.svg',
        heroVisualLabel: '<strong>1 генерация QR-кода</strong>',
        sections: [
            {
                icon: '/uploads/2024/02/icon-list-qr.svg',
                title: 'Металлическая табличка с QR-кодом',
                text: 'Вы получаете металлическое изделие — табличку с нанесённым высокоточным лазером QR-кодом. При сканировании (наведении камеры телефона) вы попадаете в профиль вашего питомца. Тариф включает 1 генерацию QR-кода. Оплата производится на сайте компании, после чего генерируется код.',
            },
            {
                icon: '/uploads/2024/02/icon-list-note.svg',
                title: 'Биография питомца',
                text: 'Создайте трогательную страницу памяти вашего любимца: расскажите его историю, укажите породу, любимые занятия, забавные привычки и памятные моменты. Эта биография навсегда сохранит тёплые воспоминания о вашем друге.',
            },
            {
                icon: '/uploads/2024/02/icon-list-picture.svg',
                title: 'Фото, видео и аудио',
                text: 'Добавляйте фотографии, видеозаписи и аудиофайлы, связанные с вашим питомцем. Загрузите его смешные видео, любимые звуки или просто трогательные фото — всё это будет бережно храниться в цифровом профиле.',
            },
            {
                icon: null,
                svg: '<rect width="40" height="40" rx="8" fill="#E8F4FD"/><path d="M12 28V16l8-6 8 6v12H12z" stroke="#1e79d0" strokeWidth="2" fill="none"/><path d="M16 28v-8h8v8" stroke="#1e79d0" strokeWidth="2" fill="none"/>',
                title: 'Прочная металлическая конструкция',
                text: 'Табличка выполнена из металла. Ей не страшны погодные условия, а также она весьма стойка к любым механическим повреждениям.',
            },
            {
                icon: null,
                svg: '<rect width="40" height="40" rx="8" fill="#E8F4FD"/><circle cx="20" cy="20" r="8" stroke="#1e79d0" strokeWidth="2" fill="none"/><path d="M20 16v4l3 3" stroke="#1e79d0" strokeWidth="2" strokeLinecap="round"/>',
                title: 'Установка',
                text: 'Установка таблички производится самостоятельно. В наборе с изделием мы присылаем специальный стикер с промышленным клеем для крепления на поверхность. Мы также можем установить табличку самостоятельно — укажите это менеджеру в заказе.',
            },
        ],
        extraAdvantages: [
            { iconSvg: '<path d="M16 4L20 12h8l-6 6 2 8-8-4-8 4 2-8-6-6h8L16 4z" fill="#1e79d0" opacity="0.2"/><path d="M16 4L20 12h8l-6 6 2 8-8-4-8 4 2-8-6-6h8L16 4z" stroke="#1e79d0" strokeWidth="1.5" fill="none"/>', text: '<strong>1 генерация QR-кода</strong>' },
            { iconSvg: '<path d="M8 14h16M8 14v10a2 2 0 002 2h12a2 2 0 002-2V14M12 14V10a4 4 0 018 0v4" stroke="#1e79d0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>', text: 'Металлическая табличка в футляре' },
            { iconSvg: '<path d="M18 8C14 8 8 12 8 16c0 4 4 8 10 12 6-4 10-8 10-12 0-4-6-8-10-8z" stroke="#1e79d0" strokeWidth="1.5" fill="none"/><circle cx="18" cy="15" r="1.5" fill="#1e79d0"/>', text: 'Память о любимце' },
        ],
    },
];

function TariffCard({ tariff, index, detailed }) {
    const { user } = useAuth();
    const isCurrentTariff = user?.tariff?.slug === tariffSlugs[index];
    const [buyLoading, setBuyLoading] = useState(false);

    // tariff_id в БД: basic=1, extended=2, special=3, pet=4
    const tariffId = index + 1;

    const userPrice = parseFloat(user?.tariff?.price || 0);
    const cardPrice = parseFloat(tariff.price);
    const hasDiscount = !isCurrentTariff && userPrice > 0 && cardPrice > userPrice;
    const discountedPrice = hasDiscount ? cardPrice - userPrice : null;

    const handleBuy = async () => {
        if (!user) {
            window.dispatchEvent(new CustomEvent('auth:open'));
            return;
        }
        if (isCurrentTariff) return;

        setBuyLoading(true);
        try {
            const { data } = await api.post('/robokassa/pay', { 
                tariff_id: tariffId,
                ...(hasDiscount ? { discounted_amount: discountedPrice } : {}),
            });
            if (data.payment_url) {
                // POST-форма вместо GET-редиректа (для передачи Receipt)
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://auth.robokassa.ru/Merchant/Index.aspx';
                form.style.display = 'none';
                for (const [key, value] of Object.entries(data.params || {})) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                }
                document.body.appendChild(form);
                form.submit();
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Ошибка при создании платежа';
            alert(msg);
        } finally {
            setBuyLoading(false);
        }
    };

    return (
        <div className={`plan-card ${tariff.highlighted ? 'plan-card--highlighted' : ''} ${isCurrentTariff ? 'plan-card--current' : ''}`}>
            {isCurrentTariff && <span className="plan-card__current-badge">Текущий тариф</span>}
            {tariff.badge && (
                <div className="plan-card__badges">
                    <img src={`/uploads/2024/02/${tariff.badge}`} alt="" className="plan-card__badge" />
                </div>
            )}
            {tariff.highlighted && <span className="plan-card__label">Оптимальный выбор</span>}
            <span className="plan-card__title">{tariff.title}</span>
            {tariff.desc && <span className="plan-card__desc" dangerouslySetInnerHTML={{ __html: tariff.desc }} />}
            <div className="plan-card__body">
                <span className="plan-card__heading">Преимущества:</span>
                <div className="icon-list plan-card__advantages">
                    {tariff.features.map((f, j) => (
                        <div key={j} className="icon-list__item">
                            <img src={`/uploads/2024/02/${f.icon}`} alt="" className="icon-list__image" />
                            <div className="icon-list__content"><p>{f.text}</p></div>
                        </div>
                    ))}
                </div>
            </div>
            <span className="plan-card__price">
                {hasDiscount ? (
                    <span className="flex flex-col items-center">
                        <span className="line-through text-red-500 text-base">{tariff.price} ₽</span>
                        <span>{discountedPrice} ₽</span>
                    </span>
                ) : (
                    <>{tariff.price} ₽</>
                )}
            </span>
            {detailed ? (
                <Link to="/tariffs" className="button plan-card__btn">← Назад к тарифам</Link>
            ) : (
                <div className="plan-card__actions">
                    <Link to={`/tarif?count=${index}`} className={`button plan-card__btn ${tariff.highlighted ? 'button--filled' : ''}`}>
                        Подробнее
                    </Link>
                    <button onClick={handleBuy} disabled={buyLoading || isCurrentTariff}
                            className="button plan-card__btn plan-card__btn--buy">
                        {buyLoading ? 'Оплата...' : isCurrentTariff ? 'Куплено' : 'Купить'}
                    </button>
                </div>
            )}
            <span className="plan-card__under-note">После оплаты анкеты сразу появятся в вашем Личном кабинете</span>
        </div>
    );
}

function SvgIcon({ svg }) {
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

function TariffDetailPage({ tariff, index }) {
    const detail = tariffDetails[index] || tariffDetails[0];
    const { user, fetchUser } = useAuth();
    const isCurrentTariff = user?.tariff?.slug === tariffSlugs[index];

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const userPrice = parseFloat(user?.tariff?.price || 0);
    const cardPrice = parseFloat(tariff.price);
    const hasDiscount = !isCurrentTariff && userPrice > 0 && cardPrice > userPrice;
    const discountedPrice = hasDiscount ? cardPrice - userPrice : null;

    return (
        <>
            {/* Hero секция */}
            <section className="tariff-hero">
                <div className="container">
                    <div className="tariff-hero__inner">
                        <div className="tariff-hero__info">
                            <h1 className="tariff-hero__title">{tariff.title}</h1>
                            {isCurrentTariff && <span className="tariff-hero__current-badge">Ваш текущий тариф</span>}
                            <p className="tariff-hero__subtitle">{detail.heroSubtitle}</p>
                            <div className="tariff-hero__price">
                                {hasDiscount ? (
                                    <span className="flex flex-col items-center">
                                        <span className="line-through text-red-500 text-base">{tariff.price} ₽</span>
                                        <span>{discountedPrice} ₽</span>
                                    </span>
                                ) : (
                                    <>{tariff.price} ₽</>
                                )}
                            </div>
                            <Link to="/tariffs" className="button tariff-hero__back">
                                <span className="tariff-hero__back-arrow">←</span> Все тарифы
                            </Link>
                        </div>
                        <div className="tariff-hero__visual">
                            <div className="tariff-hero__card-icon">
                                <img src={detail.heroVisualIcon} alt="" />
                            </div>
                            <span className="tariff-hero__card-label" dangerouslySetInnerHTML={{ __html: detail.heroVisualLabel }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Что вы получаете */}
            <section className="tariff-section">
                <div className="container">
                    <h2 className="tariff-section__title">Что вы получаете</h2>
                    <div className="tariff-section__content">
                        {detail.sections.map((s, i) => (
                            <div key={i} className="tariff-content-block">
                                <div className="tariff-content-block__icon">
                                    {s.icon ? (
                                        <img src={s.icon} alt="" />
                                    ) : (
                                        <SvgIcon svg={s.svg} />
                                    )}
                                </div>
                                <div className="tariff-content-block__text">
                                    <h3>{s.title}</h3>
                                    <p>{s.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Преимущества */}
            <section className="tariff-section tariff-section--gray">
                <div className="container">
                    <h2 className="tariff-section__title">Преимущества тарифа</h2>
                    <div className="tariff-advantages-grid">
                        {tariff.features.map((f, j) => (
                            <div key={j} className="tariff-advantage-item">
                                <div className="tariff-advantage-item__icon">
                                    <img src={`/uploads/2024/02/${f.icon}`} alt="" />
                                </div>
                                <span className="tariff-advantage-item__text">{f.text}</span>
                            </div>
                        ))}
                        {detail.extraAdvantages.map((a, j) => (
                            <div key={`extra-${j}`} className="tariff-advantage-item">
                                <div className="tariff-advantage-item__icon">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        dangerouslySetInnerHTML={{ __html: a.iconSvg }}
                                    />
                                </div>
                                <span className="tariff-advantage-item__text" dangerouslySetInnerHTML={{ __html: a.text }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Цена и CTA */}
            <section className="tariff-cta">
                <div className="container">
                    <div className="tariff-cta__inner">
                        <div className="tariff-cta__price-block">
                            <span className="tariff-cta__label">Стоимость тарифа</span>
                            <span className="tariff-cta__price">
                                {hasDiscount ? (
                                    <span className="flex flex-col items-center">
                                        <span className="line-through text-red-500 text-base">{tariff.price} ₽</span>
                                        <span>{discountedPrice} ₽</span>
                                    </span>
                                ) : (
                                    <>{tariff.price} ₽</>
                                )}
                            </span>
                        </div>
                        <div className="tariff-cta__actions">
                            <a href="https://t.me/Kod_bessmertiya" className="button button--filled tariff-cta__btn">Связаться с нами</a>
                            <Link to="/tariffs" className="button tariff-cta__btn tariff-cta__btn--outline">← Назад к тарифам</Link>
                        </div>
                    </div>
                    <p className="tariff-cta__note">После оплаты анкеты сразу появятся в вашем Личном кабинете</p>
                </div>
            </section>

            {/* Форма обратной связи */}
            <section className="callback callback--blue">
                <div className="container">
                    <div className="callback__form">
                        <div className="form__column">
                            <span className="form__title">Остались вопросы?</span>
                            <span className="form__desc">Оставьте свои контактные данные, заполнив строки справа, либо напишите нам в соц-сетях.</span>
                            <div className="link-buttons link-buttons--white">
                                <a className="link-buttons__item" href="https://t.me/Kod_bessmertiya" style={{ color: '#29A0DC' }}>Telegram</a>
                                <a className="link-buttons__item" href="https://wa.me/79811269133" style={{ color: '#1A9F49' }}>WhatsApp</a>
                                <a className="link-buttons__item" href="viber://chat?number=%2B79811269133" style={{ color: '#735FF1' }}>Viber</a>
                            </div>
                        </div>
                        <div className="form__column">
                            <div className="form__fields" style={{ gridTemplateColumns: '1fr' }}>
                                <label className="form__field"><input type="text" className="text-input" placeholder="Ваше имя" /></label>
                                <label className="form__field"><input type="text" className="text-input" placeholder="Телефон" /></label>
                            </div>
                            <div className="form__footer">
                                <button type="submit" className="form__submit">Отправить</button>
                                <div className="form__terms" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Нажимая кнопку «Отправить» Вы соглашаетесь с условиями <Link to="/privacy">политики конфиденциальности</Link>.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function TariffsPage() {
    const { fetchUser } = useAuth();
    const [searchParams] = useSearchParams();
    const countParam = searchParams.get('count');
    const selectedIndex = countParam !== null ? parseInt(countParam, 10) : null;
    const tariff = selectedIndex !== null ? tariffs[selectedIndex] : null;

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    if (tariff) {
        return <TariffDetailPage tariff={tariff} index={selectedIndex} />;
    }

    return (
        <>
            <section className="single-content">
                <div className="container">
                    <h2 className="section-title single-content__title">Цены и тарифы</h2>
                    <span className="section-desc single-content__desc">
                        <p>Стоимость услуг может меняться в зависимости от партнёра и региона предоставления услуг.</p>
                    </span>
                    <div className="prices-cards">
                        {tariffs.map((t, i) => (
                            <TariffCard key={i} tariff={t} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="callback callback--blue">
                <div className="container">
                    <div className="callback__form">
                        <div className="form__column">
                            <span className="form__title">Остались вопросы?</span>
                            <span className="form__desc">Оставьте свои контактные данные, заполнив строки справа, либо напишите нам в соц-сетях.</span>
                            <div className="link-buttons link-buttons--white">
                                <a className="link-buttons__item" href="https://t.me/Kod_bessmertiya" style={{ color: '#29A0DC' }}>Telegram</a>
                                <a className="link-buttons__item" href="https://wa.me/79811269133" style={{ color: '#1A9F49' }}>WhatsApp</a>
                                <a className="link-buttons__item" href="viber://chat?number=%2B79811269133" style={{ color: '#735FF1' }}>Viber</a>
                            </div>
                        </div>
                        <div className="form__column">
                            <div className="form__fields" style={{ gridTemplateColumns: '1fr' }}>
                                <label className="form__field"><input type="text" className="text-input" placeholder="Ваше имя" /></label>
                                <label className="form__field"><input type="text" className="text-input" placeholder="Телефон" /></label>
                            </div>
                            <div className="form__footer">
                                <button type="submit" className="form__submit">Отправить</button>
                                <div className="form__terms" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    Нажимая кнопку «Отправить» Вы соглашаетесь с условиями <Link to="/privacy">политики конфиденциальности</Link>.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
