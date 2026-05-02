import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function MyAnketsPage() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['my-ankets'],
        queryFn: () => api.get('/ankets').then(r => r.data),
    });

    const deleteMut = useMutation({
        mutationFn: (id) => api.delete(`/ankets/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-ankets'] }),
    });

    const ankets = data?.data || [];

    const statusText = {
        published: 'Опубликовано',
        draft: 'Черновик',
        private: 'Приватный',
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-extrabold text-2xl lg:text-3xl text-[#1c2145]">
                    Мои анкеты ({ankets.length})
                </h1>
                <div className="flex gap-3">
                    <Link to="/tariffs" className="btn-outline text-sm">Добавить анкеты</Link>
                    <Link to="/lk/ankets/new/edit" className="btn-filled text-sm">Создать анкету</Link>
                </div>
            </div>

            {isLoading ? (
                <p className="text-[#6c6d7e]">Загрузка...</p>
            ) : ankets.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                    <p className="text-[#6c6d7e] mb-4">У вас пока нет анкет</p>
                    <Link to="/tariffs" className="btn-filled text-sm inline-flex">Выбрать тариф</Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full" cellSpacing="0">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-sm font-extrabold text-[#1c2145]">№</th>
                                <th className="px-6 py-4 text-left text-sm font-extrabold text-[#1c2145]">ФИО</th>
                                <th className="px-6 py-4 text-left text-sm font-extrabold text-[#1c2145] hidden md:table-cell">Дата рождения</th>
                                <th className="px-6 py-4 text-left text-sm font-extrabold text-[#1c2145]">Статус</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ankets.map((a, i) => {
                                const info = a.info || {};
                                return (
                                    <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-[#6c6d7e]">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <Link to={`/lk/ankets/${a.id}/edit`} className="text-[#3476f5] font-bold text-sm hover:underline">
                                                {[info.last_name, info.first_name, info.middle_name].filter(Boolean).join(' ') || 'Без имени'}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#6c6d7e] hidden md:table-cell">
                                            {info.birth_date || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                a.status === 'published' ? 'memorial-status-published' :
                                                a.status === 'private' ? 'bg-gray-100 text-gray-600' :
                                                'memorial-status-draft'
                                            }`}>
                                                {statusText[a.status] || a.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => deleteMut.mutate(a.id)}
                                                    className="text-red-500 text-sm hover:underline">
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
