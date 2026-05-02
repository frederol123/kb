import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export default function CondolenceList({ anketId }) {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['condolences', anketId],
        queryFn: () => api.get(`/ankets/${anketId}`).then(r => r.data.condolences || []),
    });

    const addMutation = useMutation({
        mutationFn: () => api.post('/condolences', { anket_id: anketId, author_name: name, message }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['condolences', anketId] });
            setName('');
            setMessage('');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && message) addMutation.mutate();
    };

    const condolences = data || [];

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-6 space-y-3">
                <input type="text" placeholder="Ваше имя" value={name}
                       onChange={(e) => setName(e.target.value)} required
                       className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                <textarea placeholder="Соболезнование..." value={message}
                          onChange={(e) => setMessage(e.target.value)} required rows={3}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
                <button type="submit" disabled={addMutation.isPending}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                    {addMutation.isPending ? 'Отправка...' : 'Отправить'}
                </button>
            </form>

            {isLoading && <p className="text-gray-500">Загрузка...</p>}

            <div className="space-y-3">
                {condolences.map((c) => (
                    <div key={c.id} className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium text-gray-800 text-sm">{c.author_name}</p>
                        <p className="text-gray-600 text-sm mt-1">{c.message}</p>
                        <p className="text-gray-400 text-xs mt-2">{new Date(c.created_at).toLocaleDateString('ru')}</p>
                    </div>
                ))}
                {!isLoading && condolences.length === 0 && (
                    <p className="text-gray-500 text-sm">Пока нет соболезнований. Будьте первым.</p>
                )}
            </div>
        </div>
    );
}
