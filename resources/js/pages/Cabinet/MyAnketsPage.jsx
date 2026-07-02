import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function MyCardsPage() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { data, isLoading } = useQuery({
        queryKey: ['my-cards'],
        queryFn: () => api.get('/ankets').then(r => r.data),
    });

    const deleteMut = useMutation({
        mutationFn: (id) => api.delete(`/ankets/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-cards'] }),
    });

    const cards = data?.data || [];

    const statusText = { published: 'Опубликовано', draft: 'Черновик', private: 'Приватная' };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-extrabold text-2xl lg:text-3xl text-[#1c2145]">
                    Мои карточки ({cards.length})
                </h1>
                <div className="flex gap-3">
                    <Link to="/tariffs" className="btn-outline text-base">Добавить карточки</Link>
                    <Link to="/lk/cards/new/edit" className="btn-filled text-base">Создать карточку</Link>
                </div>
            </div>

            {/* Информация о тарифе */}
            {user?.tariff && (
                <div className="bg-[#f0fdf4] border border-[#22c55e]/30 rounded-xl p-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-base mb-6">
                    <span className="font-bold text-[#16a34a]">{user.tariff.title}</span>
                    <span className="text-[#4b5563]">
                        Карточек: <strong>{cards.length}</strong> / <strong>{user.tariff.limits?.max_qr_codes ?? 1}</strong>
                    </span>
                    {(user.tariff.limits?.max_qr_codes ?? 1) <= cards.length && (
                        <Link to="/tariffs" className="text-[#3476f5] font-bold hover:underline ml-auto">
                            🚀 Улучшить тариф
                        </Link>
                    )}
                </div>
            )}

            {isLoading ? (
                <p className="text-[#6c6d7e]">Загрузка...</p>
            ) : cards.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                    <p className="text-[#6c6d7e] mb-4">У вас пока нет карточек</p>
                    <Link to="/tariffs" className="btn-filled text-base inline-flex">Выбрать тариф</Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full" cellSpacing="0">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-base font-extrabold text-[#1c2145]">№</th>
                                <th className="px-6 py-4 text-left text-base font-extrabold text-[#1c2145]">ФИО</th>
                                <th className="px-6 py-4 text-left text-base font-extrabold text-[#1c2145] hidden md:table-cell">Дата рождения</th>
                                <th className="px-6 py-4 text-left text-base font-extrabold text-[#1c2145]">Статус</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map((a, i) => {
                                const info = a.info || {};
                                return (
                                    <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-6 py-4 text-base text-[#6c6d7e]">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/lk/cards/${a.id}/edit`} className="text-[#3476f5] font-bold text-base hover:underline">
                                                {[info.last_name, info.first_name, info.middle_name].filter(Boolean).join(' ') || 'Без имени'}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-base text-[#6c6d7e] hidden md:table-cell">
                                            {info.birth_date || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold ${
                                                a.status === 'published' ? 'memorial-status-published' :
                                                a.status === 'private' ? 'bg-gray-100 text-gray-600' :
                                                'memorial-status-draft'
                                            }`}>
                                                {statusText[a.status] || a.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => deleteMut.mutate(a.id)}
                                                    className="text-red-500 text-base hover:underline">
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
