import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const statusLabels = {
    draft: 'Черновик',
    published: 'Опубликовано',
    private: 'Приватная',
};

export default function ManagerPanel() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const roles = user?.roles || [];
    const hasAccess = roles.includes('admin') || roles.includes('manager');

    if (!hasAccess) {
        return <Navigate to="/lk" replace />;
    }

    const { data, isLoading } = useQuery({
        queryKey: ['manager-ankets'],
        queryFn: () => api.get('/manager/ankets').then(r => r.data),
    });

    const toggleMut = useMutation({
        mutationFn: (id) => api.put(`/manager/ankets/${id}/toggle-check`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['manager-ankets'] }),
    });

    const ankets = data?.data || [];

    return (
        <div>
            <h1 className="font-extrabold text-2xl lg:text-3xl text-[#1c2145] mb-6">
                Панель менеджера
            </h1>

            {isLoading ? (
                <p className="text-[#6c6d7e]">Загрузка...</p>
            ) : ankets.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                    <p className="text-[#6c6d7e]">Анкет пока нет</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm" cellSpacing="0">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="px-4 py-3 text-left font-extrabold text-[#1c2145] whitespace-nowrap">Пользователь</th>
                                    <th className="px-4 py-3 text-left font-extrabold text-[#1c2145] whitespace-nowrap">Контакты</th>
                                    <th className="px-4 py-3 text-left font-extrabold text-[#1c2145] whitespace-nowrap">Участок</th>
                                    <th className="px-4 py-3 text-left font-extrabold text-[#1c2145] whitespace-nowrap">Ссылка Яндекс</th>
                                    <th className="px-4 py-3 text-left font-extrabold text-[#1c2145] whitespace-nowrap">Дата создания</th>
                                    <th className="px-4 py-3 text-left font-extrabold text-[#1c2145] whitespace-nowrap">Статус</th>
                                    <th className="px-4 py-3 text-left font-extrabold text-[#1c2145] whitespace-nowrap">Тариф</th>
                                    <th className="px-4 py-3 text-center font-extrabold text-[#1c2145] whitespace-nowrap">Готово</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ankets.map((a) => {
                                    const fio = [a.info?.last_name, a.info?.first_name, a.info?.middle_name].filter(Boolean).join(' ');
                                    return (
                                        <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <Link to={`/lk/cards/${a.id}/edit`} className="font-bold text-[#3476f5] hover:underline">{a.user?.name || '—'}</Link>
                                                {fio && <div className="text-xs text-[#6c6d7e] mt-0.5">{fio}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-[#6c6d7e]">{a.user?.phone || a.info?.contact || '—'}</td>
                                            <td className="px-4 py-3 text-[#6c6d7e]">{a.info?.burial_plot || '—'}</td>
                                            <td className="px-4 py-3 text-[#6c6d7e]">
                                                {a.info?.burial_address ? (
                                                    <a href={`https://yandex.ru/maps/?text=${encodeURIComponent([a.info.burial_address, a.info.burial_plot].filter(Boolean).join(', '))}`}
                                                       target="_blank" rel="noopener noreferrer"
                                                       className="text-[#3476f5] hover:underline">
                                                        {a.info.burial_address}
                                                    </a>
                                                ) : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-[#6c6d7e] whitespace-nowrap">
                                                {new Date(a.created_at).toLocaleDateString('ru-RU')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                    a.status === 'published' ? 'bg-green-100 text-green-700' :
                                                    a.status === 'private' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {statusLabels[a.status] || a.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[#6c6d7e]">
                                                {a.user?.tariff?.title || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={!!a.manager_checked}
                                                    onChange={() => toggleMut.mutate(a.id)}
                                                    className="w-5 h-5 accent-[#1e79d0] cursor-pointer"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {data?.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-gray-100 text-sm text-[#6c6d7e]">
                            Страница {data.current_page} из {data.last_page} · всего {data.total}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
