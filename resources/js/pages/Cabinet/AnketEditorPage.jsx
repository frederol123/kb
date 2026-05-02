import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';

const emptyInfo = { last_name: '', first_name: '', middle_name: '', birth_date: '', death_date: '', birthplace: '', deathplace: '', photo: '' };
const emptyContent = { biography: '', gallery: [], video: null };

export default function CardEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isNew = !id || id === 'new';

    const [info, setInfo] = useState({ ...emptyInfo });
    const [content, setContent] = useState({ ...emptyContent, gallery: [] });
    const [status, setStatus] = useState('draft');
    const [family, setFamily] = useState({ children: [], spouses: [], parents: [] });
    const [uploading, setUploading] = useState(false);

    const { data: card } = useQuery({
        queryKey: ['card', id],
        queryFn: () => api.get(`/ankets/${id}`).then(r => r.data),
        enabled: !isNew,
    });

    useEffect(() => {
        if (card) {
            setInfo({ ...emptyInfo, ...card.info });
            setContent({ ...emptyContent, ...card.content, gallery: card.content?.gallery || [] });
            setStatus(card.status);
            setFamily(card.family || { children: [], spouses: [], parents: [] });
        }
    }, [card]);

    const saveInfoMut = useMutation({
        mutationFn: () => {
            const payload = { info, content, status, family };
            if (isNew) return api.post('/ankets', payload);
            return api.put(`/ankets/${id}`, payload);
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['my-cards'] });
            if (isNew) navigate(`/lk/cards/${res.data.id}/edit`, { replace: true });
        },
    });

    const saveContentMut = useMutation({
        mutationFn: () => api.put(`/ankets/${id}/content`, { content: { ...content, gallery: content.gallery, video: content.video } }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['card', id] }),
    });

    const updateInfo = (field, value) => setInfo(prev => ({ ...prev, [field]: value }));

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !id || isNew) return alert('Сначала сохраните карточку');
        setUploading(true);
        const form = new FormData();
        form.append('file', file);
        try {
            const { data } = await api.post(`/ankets/${id}/upload`, form);
            updateInfo('photo', data.url);
        } finally { setUploading(false); }
    };

    const handleGalleryUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !id || isNew) return alert('Сначала сохраните карточку');
        setUploading(true);
        const form = new FormData();
        form.append('file', file);
        try {
            const { data } = await api.post(`/ankets/${id}/upload`, form);
            setContent(prev => ({ ...prev, gallery: [...(prev.gallery || []), { url: data.url, text: '' }] }));
        } finally { setUploading(false); }
    };

    const removeGalleryItem = (idx) => {
        setContent(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));
    };

    const addRelative = (type) => {
        const empty = type === 'spouses' ? { name: '', card_id: null, marriage_start: '', marriage_end: '' } : { name: '', card_id: null };
        setFamily(prev => ({ ...prev, [type]: [...prev[type], empty] }));
    };

    const removeRelative = (type, idx) => {
        setFamily(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== idx) }));
    };

    const updateRelative = (type, idx, field, value) => {
        setFamily(prev => {
            const arr = [...prev[type]];
            arr[idx] = { ...arr[idx], [field]: value };
            return { ...prev, [type]: arr };
        });
    };

    const fio = [info.last_name, info.first_name, info.middle_name].filter(Boolean).join(' ');

    return (
        <div className="max-w-[900px]">
            <div className="mb-6">
                <button onClick={() => navigate('/lk')} className="text-[#3476f5] font-bold text-sm hover:underline">
                    ← Мои карточки
                </button>
                <h1 className="font-extrabold text-2xl lg:text-3xl text-[#1c2145] mt-2">
                    {isNew ? 'Новая карточка' : fio || 'Редактирование карточки'}
                </h1>
            </div>

            {!isNew && (
                <div className="flex gap-3 mb-8 flex-wrap">
                    <a href={`/m/${card?.slug}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">Просмотр</a>
                    <a href={`/api/ankets/${id}/qr`} className="btn-outline text-sm" download>Скачать QR-код</a>
                </div>
            )}

            <div className="space-y-6">
                {/* Info */}
                <Section title="Информация о человеке">
                    {info.photo && (
                        <div className="mb-6 flex items-center gap-4">
                            <img src={info.photo} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
                            <button onClick={() => updateInfo('photo', '')} className="text-red-500 text-sm hover:underline">Удалить фото</button>
                        </div>
                    )}
                    {!isNew && (
                        <div className="mb-6">
                            <label className="block text-sm text-[#999] mb-1.5">Фото</label>
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading}
                                   className="text-sm text-[#6c6d7e]" />
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Field label="Фамилия" value={info.last_name} onChange={v => updateInfo('last_name', v)} placeholder="Фамилия" />
                        <Field label="Имя" value={info.first_name} onChange={v => updateInfo('first_name', v)} placeholder="Имя" />
                        <Field label="Отчество" value={info.middle_name} onChange={v => updateInfo('middle_name', v)} placeholder="Отчество" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Field label="Место рождения" value={info.birthplace} onChange={v => updateInfo('birthplace', v)} placeholder="Страна, город" />
                        <Field label="Дата рождения" type="date" value={info.birth_date} onChange={v => updateInfo('birth_date', v)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Field label="Место смерти" value={info.deathplace} onChange={v => updateInfo('deathplace', v)} placeholder="Страна, город" />
                        <Field label="Дата смерти" type="date" value={info.death_date} onChange={v => updateInfo('death_date', v)} />
                    </div>
                    <div>
                        <label className="block text-sm text-[#999] mb-1.5">Статус</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="text-input w-auto">
                            <option value="draft">Черновик</option>
                            <option value="published">Опубликована</option>
                            <option value="private">Приватная</option>
                        </select>
                    </div>
                    <button onClick={() => saveInfoMut.mutate()} disabled={saveInfoMut.isPending}
                            className="btn-filled mt-6">
                        {saveInfoMut.isPending ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </Section>

                {/* Relatives */}
                {!isNew && (
                    <>
                        <Section title="Родственники">
                            {(['children', 'spouses', 'parents']).map(type => (
                                <div key={type} className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-base text-[#1c2145]">
                                            {{ children: 'Дети', spouses: 'Брак', parents: 'Родители' }[type]}
                                        </h3>
                                        <button onClick={() => addRelative(type)} className="text-[#3476f5] text-sm font-bold hover:underline">
                                            + Добавить
                                        </button>
                                    </div>
                                    {(family[type] || []).map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3 mb-2 p-3 bg-[#f8f8f8] rounded-lg">
                                            <div className="flex-1 space-y-2">
                                                <input type="text" value={item.name || ''} placeholder="ФИО"
                                                       onChange={e => updateRelative(type, idx, 'name', e.target.value)}
                                                       className="text-input text-sm" />
                                                {type === 'spouses' && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="block text-xs text-[#999] mb-0.5">Дата брака</label>
                                                            <input type="date" value={item.marriage_start || ''}
                                                                   onChange={e => updateRelative(type, idx, 'marriage_start', e.target.value)}
                                                                   className="text-input text-sm" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-[#999] mb-0.5">Дата окончания</label>
                                                            <input type="date" value={item.marriage_end || ''}
                                                                   onChange={e => updateRelative(type, idx, 'marriage_end', e.target.value)}
                                                                   className="text-input text-sm" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={() => removeRelative(type, idx)} className="text-red-400 hover:text-red-600 mt-2 flex-shrink-0">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <button onClick={() => saveInfoMut.mutate()} disabled={saveInfoMut.isPending}
                                    className="btn-outline text-sm">
                                {saveInfoMut.isPending ? 'Сохранение...' : 'Сохранить родственников'}
                            </button>
                        </Section>

                        {/* Biography */}
                        <Section title="Биография">
                            <textarea value={content.biography || ''} rows={12}
                                      onChange={e => setContent(prev => ({ ...prev, biography: e.target.value }))}
                                      className="text-input resize-y"
                                      placeholder="Напишите биографию..." />
                            <button onClick={() => saveContentMut.mutate()} disabled={saveContentMut.isPending}
                                    className="btn-filled mt-4 text-sm">
                                {saveContentMut.isPending ? 'Сохранение...' : 'Сохранить биографию'}
                            </button>
                        </Section>

                        {/* Gallery */}
                        <Section title="Галерея">
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                                {(content.gallery || []).map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                        <img src={img.url} alt={img.text || ''} className="w-full h-full object-cover" />
                                        <button onClick={() => removeGalleryItem(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            ×
                                        </button>
                                        {img.text && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">{img.text}</div>}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="file" accept="image/*" onChange={handleGalleryUpload} disabled={uploading}
                                       className="text-sm text-[#6c6d7e]" />
                                {uploading && <span className="text-sm text-[#999]">Загрузка...</span>}
                            </div>
                            <button onClick={() => saveContentMut.mutate()} disabled={saveContentMut.isPending}
                                    className="btn-outline text-sm mt-4">
                                {saveContentMut.isPending ? 'Сохранение...' : 'Сохранить галерею'}
                            </button>
                        </Section>

                        {/* Video */}
                        <Section title="Видео">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Ссылка на видео (YouTube/Vimeo)" value={content.video?.link || ''}
                                       onChange={v => setContent(prev => ({ ...prev, video: { ...prev.video, link: v } }))}
                                       placeholder="https://youtube.com/watch?v=..." />
                                <Field label="URL превью" value={content.video?.preview || ''}
                                       onChange={v => setContent(prev => ({ ...prev, video: { ...prev.video, preview: v } }))}
                                       placeholder="https://..." />
                            </div>
                            <div className="mt-3">
                                <label className="block text-sm text-[#999] mb-1.5">Описание видео</label>
                                <textarea value={content.video?.description || ''} rows={2}
                                          onChange={e => setContent(prev => ({ ...prev, video: { ...prev.video, description: e.target.value } }))}
                                          className="text-input resize-none text-sm" />
                            </div>
                            <button onClick={() => saveContentMut.mutate()} disabled={saveContentMut.isPending}
                                    className="btn-outline text-sm mt-4">
                                {saveContentMut.isPending ? 'Сохранение...' : 'Сохранить видео'}
                            </button>
                        </Section>
                    </>
                )}
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
            <h2 className="font-extrabold text-xl text-[#1c2145] mb-6">{title}</h2>
            {children}
        </div>
    );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
    return (
        <div>
            <label className="block text-sm text-[#999] mb-1.5">{label}</label>
            <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
                   className="text-input" placeholder={placeholder} />
        </div>
    );
}
