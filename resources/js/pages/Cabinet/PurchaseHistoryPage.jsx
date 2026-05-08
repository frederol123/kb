import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

const statusLabels = {
    succeeded: 'Оплачен',
    pending: 'Ожидает оплаты',
    canceled: 'Отменён',
};

export default function PurchaseHistoryPage() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/transactions')
            .then(({ data }) => setTransactions(data.data || data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-[#6c6d7e] py-10">Загрузка...</p>;

    return (
        <div>
            <h2 className="section-title">История покупок</h2>
            <p className="section-desc">
                Список всех ваших платежей и покупок.
            </p>

            {transactions.length === 0 ? (
                <div className="bg-[#f2f7ff] rounded-3xl p-10 text-center">
                    <p className="text-[#6c6d7e] text-lg mb-2">Покупок пока нет</p>
                    <p className="text-[#999] text-sm">Вы ещё не совершали покупок</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-[#e9f0ff] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#e9f0ff] text-left">
                                <th className="py-4 px-6 font-bold text-[#1c2145] text-sm">№</th>
                                <th className="py-4 px-6 font-bold text-[#1c2145] text-sm">Сумма</th>
                                <th className="py-4 px-6 font-bold text-[#1c2145] text-sm">Статус</th>
                                <th className="py-4 px-6 font-bold text-[#1c2145] text-sm">Дата</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t, i) => (
                                <tr key={t.id} className="border-b border-gray-50 last:border-0">
                                    <td className="py-3 px-6 text-[#6c6d7e] text-sm">{i + 1}</td>
                                    <td className="py-3 px-6 text-[#1c2145] font-bold text-sm">{t.amount} ₽</td>
                                    <td className="py-3 px-6 text-sm">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                            t.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                                            t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {statusLabels[t.status] || t.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-[#6c6d7e] text-sm">
                                        {t.created_at ? new Date(t.created_at).toLocaleDateString('ru-RU') : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
