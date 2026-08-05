import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const statusLabels = {
    succeeded: 'Оплачен',
    completed: 'Оплачен',
    pending: 'Ожидает оплаты',
    canceled: 'Отменён',
};

const statusColors = {
    succeeded: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    canceled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
    const { user } = useAuth();
    const [page, setPage] = useState(1);

    const roles = user?.roles || [];
    const hasAccess = roles.includes('admin') || roles.includes('manager');

    if (!hasAccess) {
        return <Navigate to="/lk" replace />;
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ['manager-orders', page],
        queryFn: () => api.get(`/manager/orders?page=${page}&per_page=50`).then(r => r.data),
        placeholderData: (prev) => prev,
    });

    return (
        <div>
            <h1 className="font-extrabold text-2xl lg:text-3xl text-[#1c2145] mb-6">
                Заказы
            </h1>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <p className="text-[#6c6d7e] p-6">Загрузка...</p>
                ) : isError ? (
                    <p className="text-red-500 p-6">Ошибка загрузки заказов</p>
                ) : data?.data?.length === 0 ? (
                    <div className="p-10 text-center">
                        <p className="text-[#6c6d7e]">Заказов пока нет</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Логин</th>
                                        <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Дата и время</th>
                                        <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">ФИО</th>
                                        <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Телефон</th>
                                        <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Сумма</th>
                                        <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Тариф</th>
                                        <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Статус оплаты</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {data.data.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-2.5 text-[#1c2145] font-medium">{t.login}</td>
                                            <td className="px-4 py-2.5 text-xs text-[#6c6d7e] whitespace-nowrap">
                                                {t.created_at ? new Date(t.created_at).toLocaleString('ru-RU') : '—'}
                                            </td>
                                            <td className="px-4 py-2.5 text-[#1c2145]">{t.name || '—'}</td>
                                            <td className="px-4 py-2.5 text-xs text-[#6c6d7e]">{t.phone || '—'}</td>
                                            <td className="px-4 py-2.5 text-[#1c2145] font-bold whitespace-nowrap">{t.amount} ₽</td>
                                            <td className="px-4 py-2.5 text-xs text-[#6c6d7e]">{t.tariff_title || '—'}</td>
                                            <td className="px-4 py-2.5 text-xs">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {statusLabels[t.status] || t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {data.last_page > 1 && (
                            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="px-4 py-1.5 rounded-lg font-bold text-[#3476f5] disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    ← Назад
                                </button>
                                <span className="text-[#6c6d7e]">
                                    {data.current_page} из {data.last_page}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                                    disabled={page >= data.last_page}
                                    className="px-4 py-1.5 rounded-lg font-bold text-[#3476f5] disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                >
                                    Вперед →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
