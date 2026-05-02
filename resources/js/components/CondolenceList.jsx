import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export default function CondolenceList({ anketId }) {
    const [authorName, setAuthorName] = useState('');
    const [message, setMessage] = useState('');
    const queryClient = useQueryClient();

    const { data: condolences } = useQuery({
        queryKey: ['condolences', anketId],
        queryFn: () => api.get(`/ankets/${anketId}`).then(r => r.data.condolences || []),
    });

    const addMutation = useMutation({
        mutationFn: () => api.post('/condolences', { anket_id: anketId, author_name: authorName, message }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['condolences', anketId] });
            setAuthorName('');
            setMessage('');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (authorName.trim() && message.trim()) addMutation.mutate();
    };

    const items = condolences || [];

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-8 space-y-3">
                <input type="text" placeholder="Ваше имя" value={authorName}
                       onChange={e => setAuthorName(e.target.value)} required
                       className="text-input" />
                <textarea placeholder="Соболезнование..." value={message}
                          onChange={e => setMessage(e.target.value)} required rows={3}
                          className="text-input resize-none" />
                <button type="submit" disabled={addMutation.isPending}
                        className="btn-filled text-sm">
                    {addMutation.isPending ? 'Отправка...' : 'Отправить'}
                </button>
            </form>

            <div className="space-y-3">
                {items.map((c) => (
                    <div key={c.id} className="bg-[#f8f8f8] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-extrabold text-sm text-[#1c2145]">{c.author_name}</span>
                            <span className="text-xs text-[#999]">{new Date(c.created_at).toLocaleDateString('ru')}</span>
                        </div>
                        <p className="text-[#6c6d7e] text-sm leading-5">{c.message}</p>
                    </div>
                ))}
                {items.length === 0 && (
                    <p className="text-[#999] text-sm text-center py-6">Пока нет соболезнований. Будьте первым.</p>
                )}
            </div>
        </div>
    );
}
