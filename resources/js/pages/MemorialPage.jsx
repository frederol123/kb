import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import CondolenceList from '../components/CondolenceList';

export default function MemorialPage() {
    const { slug } = useParams();
    const { data: anket, isLoading } = useQuery({
        queryKey: ['memorial', slug],
        queryFn: () => api.get(`/m/${slug}`).then((r) => r.data),
    });

    if (isLoading) {
        return <div className="text-center py-20 text-gray-500">Загрузка...</div>;
    }

    if (!anket) {
        return <div className="text-center py-20 text-gray-500">Страница не найдена</div>;
    }

    const info = anket.info || {};

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {info.last_name} {info.first_name} {info.middle_name || ''}
                </h1>
                {(info.birth_date || info.death_date) && (
                    <p className="text-gray-500 text-lg">
                        {info.birth_date || '?'} — {info.death_date || '?'}
                    </p>
                )}
            </div>

            {anket.content?.biography && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Биография</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{anket.content.biography}</p>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Книга соболезнований</h2>
                <CondolenceList anketId={anket.id} />
            </div>
        </div>
    );
}
