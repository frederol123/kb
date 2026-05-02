import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from '../../lib/api';

export default function AnketEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = !id || id === 'new';

    const [info, setInfo] = useState({ last_name: '', first_name: '', middle_name: '', birth_date: '', death_date: '', birthplace: '', deathplace: '' });
    const [content, setContent] = useState({ biography: '' });
    const [status, setStatus] = useState('draft');

    const { data: anket } = useQuery({
        queryKey: ['anket', id],
        queryFn: () => api.get(`/ankets/${id}`).then(r => r.data),
        enabled: !isNew,
    });

    useEffect(() => {
        if (anket) {
            setInfo({ ...info, ...anket.info });
            setContent({ ...content, ...anket.content });
            setStatus(anket.status);
        }
    }, [anket]);

    const saveInfoMut = useMutation({
        mutationFn: () => {
            if (isNew) return api.post('/ankets', { info, content, status });
            return api.put(`/ankets/${id}`, { info, status });
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['my-ankets'] });
            if (isNew) navigate(`/lk/ankets/${res.data.id}/edit`, { replace: true });
        },
    });

    const saveContentMut = useMutation({
        mutationFn: () => api.put(`/ankets/${id}/content`, { content }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anket', id] }),
    });

    const updateInfo = (field, value) => setInfo(prev => ({ ...prev, [field]: value }));

    return (
        <div className="max-w-[900px]">
            <div className="mb-6">
                <button onClick={() => navigate('/lk')} className="text-[#3476f5] font-bold text-sm hover:underline">
                    ← Мои анкеты
                </button>
                <h1 className="font-extrabold text-2xl lg:text-3xl text-[#1c2145] mt-2">
                    {isNew ? 'Новая анкета' : [info.last_name, info.first_name, info.middle_name].filter(Boolean).join(' ')}
                </h1>
            </div>

            {!isNew && (
                <div className="flex gap-3 mb-8 flex-wrap">
                    <a href={`/m/${anket?.slug}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">Просмотр страницы</a>
                    <button onClick={() => saveContentMut.mutate()} disabled={saveContentMut.isPending} className="btn-outline text-sm">
                        {saveContentMut.isPending ? 'Сохранение...' : 'Скачать QR-код'}
                    </button>
                </div>
            )}

            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
                    <h2 className="font-extrabold text-xl text-[#1c2145] mb-6">Информация о человеке</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm text-[#999] mb-1.5">Фамилия</label>
                            <input type="text" value={info.last_name || ''} onChange={e => updateInfo('last_name', e.target.value)}
                                   className="text-input" placeholder="Фамилия" />
                        </div>
                        <div>
                            <label className="block text-sm text-[#999] mb-1.5">Имя</label>
                            <input type="text" value={info.first_name || ''} onChange={e => updateInfo('first_name', e.target.value)}
                                   className="text-input" placeholder="Имя" />
                        </div>
                        <div>
                            <label className="block text-sm text-[#999] mb-1.5">Отчество</label>
                            <input type="text" value={info.middle_name || ''} onChange={e => updateInfo('middle_name', e.target.value)}
                                   className="text-input" placeholder="Отчество" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm text-[#999] mb-1.5">Место рождения</label>
                            <input type="text" value={info.birthplace || ''} onChange={e => updateInfo('birthplace', e.target.value)}
                                   className="text-input" placeholder="Страна, город" />
                        </div>
                        <div>
                            <label className="block text-sm text-[#999] mb-1.5">Дата рождения</label>
                            <input type="date" value={info.birth_date || ''} onChange={e => updateInfo('birth_date', e.target.value)}
                                   className="text-input" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm text-[#999] mb-1.5">Место смерти</label>
                            <input type="text" value={info.deathplace || ''} onChange={e => updateInfo('deathplace', e.target.value)}
                                   className="text-input" placeholder="Страна, город" />
                        </div>
                        <div>
                            <label className="block text-sm text-[#999] mb-1.5">Дата смерти</label>
                            <input type="date" value={info.death_date || ''} onChange={e => updateInfo('death_date', e.target.value)}
                                   className="text-input" />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm text-[#999] mb-1.5">Статус</label>
                        <select value={status} onChange={e => setStatus(e.target.value)}
                                className="text-input w-auto">
                            <option value="draft">Черновик</option>
                            <option value="published">Опубликован</option>
                            <option value="private">Приватный</option>
                        </select>
                    </div>

                    <button onClick={() => saveInfoMut.mutate()} disabled={saveInfoMut.isPending}
                            className="btn-filled">
                        {saveInfoMut.isPending ? 'Сохранение...' : 'Сохранить информацию'}
                    </button>
                </div>

                {!isNew && (
                    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
                        <h2 className="font-extrabold text-xl text-[#1c2145] mb-6">Биография</h2>
                        <textarea value={content.biography || ''} rows={12}
                                  onChange={e => setContent({ ...content, biography: e.target.value })}
                                  className="text-input resize-y"
                                  placeholder="Напишите биографию..." />
                        <button onClick={() => saveContentMut.mutate()} disabled={saveContentMut.isPending}
                                className="btn-filled mt-4">
                            {saveContentMut.isPending ? 'Сохранение...' : 'Сохранить контент'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
