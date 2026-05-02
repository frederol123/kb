import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function NewsListPage() {
    const { data: novosti, isLoading } = useQuery({
        queryKey: ['news'],
        queryFn: () => api.get('/m/news').then(r => r.data).catch(() => []),
    });

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Новости</h1>
            {isLoading && <p className="text-gray-500">Загрузка...</p>}
            <div className="space-y-4">
                {(Array.isArray(novosti?.data) ? novosti.data : []).map((n) => (
                    <Link key={n.id} to={`/news/${n.slug}`}
                          className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <h2 className="text-lg font-semibold text-gray-800">{n.title}</h2>
                        {n.published_at && (
                            <p className="text-sm text-gray-400 mt-1">{new Date(n.published_at).toLocaleDateString('ru')}</p>
                        )}
                    </Link>
                ))}
                {!isLoading && (!novosti?.data || novosti.data.length === 0) && (
                    <p className="text-gray-500">Новостей пока нет</p>
                )}
            </div>
        </div>
    );
}
