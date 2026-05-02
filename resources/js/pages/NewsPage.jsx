import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export default function NewsPage() {
    const { slug } = useParams();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Новость</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <p className="text-gray-600">Страница новости: {slug}</p>
            </div>
        </div>
    );
}
