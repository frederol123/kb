import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from '../../lib/api';

export default function AnketEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = !id || id === 'new';

    const [info, setInfo] = useState({ first_name: '', last_name: '', middle_name: '', birth_date: '', death_date: '' });
    const [content, setContent] = useState({ biography: '' });
    const [status, setStatus] = useState('draft');

    const { data: anket } = useQuery({
        queryKey: ['anket', id],
        queryFn: () => api.get(`/ankets/${id}`).then(r => r.data),
        enabled: !isNew,
    });

    useEffect(() => {
        if (anket) {
            setInfo(anket.info || {});
            setContent(anket.content || {});
            setStatus(anket.status);
        }
    }, [anket]);

    const saveMutation = useMutation({
        mutationFn: () => {
            const payload = { info, status };
            if (isNew) {
                payload.content = content;
                return api.post('/ankets', payload);
            }
            return api.put(`/ankets/${id}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-ankets'] });
            navigate('/lk');
        },
    });

    const saveContentMutation = useMutation({
        mutationFn: () => api.put(`/ankets/${id}/content`, { content }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anket', id] }),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {isNew ? 'Новая анкета' : 'Редактирование анкеты'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Основная информация</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {['last_name', 'first_name', 'middle_name'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm text-gray-500 mb-1">
                                    {{ last_name: 'Фамилия', first_name: 'Имя', middle_name: 'Отчество' }[field]}
                                </label>
                                <input
                                    type="text" value={info[field] || ''}
                                    onChange={(e) => setInfo({ ...info, [field]: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Дата рождения</label>
                            <input type="date" value={info.birth_date || ''}
                                   onChange={(e) => setInfo({ ...info, birth_date: e.target.value })}
                                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Дата смерти</label>
                            <input type="date" value={info.death_date || ''}
                                   onChange={(e) => setInfo({ ...info, death_date: e.target.value })}
                                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm text-gray-500 mb-1">Статус</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
                            <option value="draft">Черновик</option>
                            <option value="published">Опубликован</option>
                            <option value="private">Приватный</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Биография</h2>
                    <textarea value={content.biography || ''} rows={8}
                              onChange={(e) => setContent({ ...content, biography: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
                              placeholder="Напишите биографию..." />
                    {!isNew && (
                        <button type="button" onClick={() => saveContentMutation.mutate()}
                                disabled={saveContentMutation.isPending}
                                className="mt-3 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50">
                            {saveContentMutation.isPending ? 'Сохранение...' : 'Сохранить контент'}
                        </button>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/lk')}
                            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200">
                        Отмена
                    </button>
                    <button type="submit" disabled={saveMutation.isPending}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {saveMutation.isPending ? 'Сохранение...' : isNew ? 'Создать' : 'Обновить'}
                    </button>
                </div>
            </form>
        </div>
    );
}
