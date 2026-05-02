import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function MyAnketsPage() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['my-ankets'],
        queryFn: () => api.get('/ankets').then(r => r.data),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/ankets/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-ankets'] }),
    });

    if (isLoading) return <p className="text-gray-500">Загрузка...</p>;

    const ankets = data?.data || [];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Мои анкеты</h1>
                <Link to="/lk/ankets/new/edit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    Создать анкету
                </Link>
            </div>
            {ankets.length === 0 ? (
                <p className="text-gray-500">У вас пока нет анкет</p>
            ) : (
                <div className="space-y-3">
                    {ankets.map((a) => (
                        <div key={a.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                            <div>
                                <Link to={`/m/${a.slug}`} target="_blank" className="text-blue-600 hover:underline font-medium">
                                    {a.info?.last_name} {a.info?.first_name} {a.info?.middle_name || ''}
                                </Link>
                                <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${a.status === 'published' ? 'bg-green-100 text-green-700' : a.status === 'private' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {a.status}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Link to={`/lk/ankets/${a.id}/edit`} className="text-sm text-gray-500 hover:text-gray-700">
                                    Редактировать
                                </Link>
                                <button onClick={() => deleteMutation.mutate(a.id)}
                                        className="text-sm text-red-500 hover:text-red-700">
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
