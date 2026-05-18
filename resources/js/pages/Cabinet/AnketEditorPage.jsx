import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import api from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

const emptyInfo = { last_name: '', first_name: '', middle_name: '', birth_date: '', death_date: '', birthplace: '', deathplace: '', photo: '' };
const emptyContent = { biography: '', gallery: [], videos: [] };

export default function CardEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const toast = useToast();
    const { user } = useAuth();
    const maxGallery = user?.max_gallery_images ?? 6;
    const maxVideos = user?.max_videos ?? 6;
    const isNew = !id || id === 'new';

    const [info, setInfo] = useState({ ...emptyInfo });
    const [content, setContent] = useState({ ...emptyContent, gallery: [] });
    const [status, setStatus] = useState('draft');
    const [family, setFamily] = useState({ children: [], spouses: [], parents: [] });
    const [uploading, setUploading] = useState(false);
    const [qrDownloading, setQrDownloading] = useState(false);

    const { data: card } = useQuery({
        queryKey: ['card', id],
        queryFn: () => api.get(`/ankets/${id}`).then(r => r.data),
        enabled: !isNew,
    });

    useEffect(() => {
        if (card) {
            setInfo({ ...emptyInfo, ...card.info });
            setContent({ ...emptyContent, ...card.content, gallery: card.content?.gallery || [], videos: card.content?.videos || [] });
            setStatus(card.status);
            setFamily(card.family || { children: [], spouses: [], parents: [] });
        }
    }, [card]);

    const saveInfoMut = useMutation({
        mutationFn: (payload) => {
            if (isNew) return api.post('/ankets', payload);
            return api.put(`/ankets/${id}`, payload);
        },
        onSuccess: (res) => {
            toast('Изменения сохранены');
            queryClient.invalidateQueries({ queryKey: ['my-cards'] });
            if (isNew) navigate(`/lk/cards/${res.data.id}/edit`, { replace: true });
        },
    });

    const saveInfo = () => {
        saveInfoMut.mutate({ info, content, status, family });
    };

    const saveContentMut = useMutation({
        mutationFn: (payload) => api.put(`/ankets/${id}/content`, payload),
        onSuccess: () => {
            toast('Изменения сохранены');
            queryClient.invalidateQueries({ queryKey: ['card', id] });
        },
    });

    const saveContent = () => {
        const payload = { content: { biography: content.biography, gallery: content.gallery, videos: content.videos } };
        saveContentMut.mutate(payload);
    };

    const updateInfo = (field, value) => setInfo(prev => ({ ...prev, [field]: value }));

    const downloadQr = async () => {
        setQrDownloading(true);
        try {
            const response = await api.get(`/ankets/${id}/qr`, { responseType: 'blob' });
            const blobUrl = URL.createObjectURL(new Blob([response.data], { type: 'image/png' }));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = (card?.slug || id) + '.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch {
            toast('Не удалось скачать QR-код');
        } finally {
            setQrDownloading(false);
        }
    };

    const handlePhotoUpload = async (file) => {
        if (!file || !id || isNew) return alert('Сначала сохраните карточку');
        setUploading(true);
        const form = new FormData();
        form.append('file', file);
        try {
            const { data } = await api.post(`/ankets/${id}/upload`, form);
            updateInfo('photo', data.url);
        } finally { setUploading(false); }
    };

    const handleGalleryUpload = async (file) => {
        if (!file || !id || isNew) return;
        if ((content.gallery || []).length >= maxGallery) return toast(`Достигнут лимит (${maxGallery} изображений)`);
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

    const [videoMode, setVideoMode] = useState('link');
    const [videoForm, setVideoForm] = useState({ link: '', preview: '', description: '', url: '', original_name: '', mime_type: '' });

    const handleVideoUpload = async (file) => {
        if (!file || !id || isNew) return;
        setUploading(true);
        const form = new FormData();
        form.append('file', file);
        try {
            const { data } = await api.post(`/ankets/${id}/upload-video`, form);
            setVideoForm(prev => ({ ...prev, url: data.url, original_name: data.original_name, mime_type: data.mime_type }));
        } finally { setUploading(false); }
    };

    const addVideoItem = () => {
        if ((content.videos || []).length >= maxVideos) return toast(`Достигнут лимит (${maxVideos} видео)`);
        const item = videoMode === 'upload'
            ? { type: 'upload', url: videoForm.url, original_name: videoForm.original_name, mime_type: videoForm.mime_type, description: videoForm.description }
            : { type: 'link', link: videoForm.link, preview: videoForm.preview, description: videoForm.description };

        if (videoMode === 'upload' && !videoForm.url) return toast('Сначала загрузите файл');
        if (videoMode === 'link' && !videoForm.link) return toast('Укажите ссылку на видео');

        const newVideos = [...(content.videos || []), item];
        setContent(prev => ({ ...prev, videos: newVideos }));
        setVideoForm({ link: '', preview: '', description: '', url: '', original_name: '', mime_type: '' });
        saveContentMut.mutate({ content: { biography: content.biography, gallery: content.gallery, videos: newVideos } });
    };

    const removeVideoItem = (idx) => {
        const newVideos = content.videos.filter((_, i) => i !== idx);
        setContent(prev => ({ ...prev, videos: newVideos }));
        saveContentMut.mutate({ content: { biography: content.biography, gallery: content.gallery, videos: newVideos } });
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
                    <a href={`/m/${card?.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm btn-download">Просмотр</a>
                    <button onClick={downloadQr} disabled={qrDownloading} className="text-sm btn-download">
                        {qrDownloading ? 'Загрузка...' : 'Скачать QR-код'}
                    </button>
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
                            <FileUpload onFile={handlePhotoUpload} disabled={uploading} />
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
                    <button onClick={saveInfo} disabled={saveInfoMut.isPending}
                            className="btn-filled text-sm mt-4">
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
                            <button onClick={saveInfo} disabled={saveInfoMut.isPending}
                                    className="btn-filled text-sm mt-4">
                                {saveInfoMut.isPending ? 'Сохранение...' : 'Сохранить родственников'}
                            </button>
                        </Section>

                        {/* Biography */}
                        <Section title="Биография">
                            <textarea value={content.biography || ''} rows={12}
                                      onChange={e => setContent(prev => ({ ...prev, biography: e.target.value }))}
                                      className="text-input resize-y"
                                      placeholder="Напишите биографию..." />
                            <button onClick={saveContent} disabled={saveContentMut.isPending}
                                    className="btn-filled mt-4 text-sm">
                                {saveContentMut.isPending ? 'Сохранение...' : 'Сохранить биографию'}
                            </button>
                        </Section>

                        {/* Gallery */}
                        <Section title={`Галерея (${(content.gallery || []).length}/${maxGallery})`}>
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
                            {(content.gallery || []).length >= maxGallery ? (
                                <p className="text-sm text-red-500 mb-2">Достигнут лимит ({maxGallery} изображений)</p>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <FileUpload onFile={handleGalleryUpload} disabled={uploading} />
                                    {uploading && <span className="text-sm text-[#999]">Загрузка...</span>}
                                </div>
                            )}
                            <button onClick={saveContent} disabled={saveContentMut.isPending}
                                    className="btn-filled text-sm mt-4">
                                {saveContentMut.isPending ? 'Сохранение...' : 'Сохранить галерею'}
                            </button>
                        </Section>

                        {/* Videos */}
                        <Section title={`Видео (${(content.videos || []).length}/${maxVideos})`}>
                            {(content.videos || []).length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                                    {(content.videos || []).map((v, idx) => (
                                        <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200 group bg-gray-900 aspect-video">
                                            {v.type === 'upload' && v.url ? (
                                                <video src={v.url} className="w-full h-full object-contain" preload="metadata" />
                                            ) : v.preview ? (
                                                <img src={v.preview} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-white/60 text-xs truncate px-2">{v.link || v.original_name || 'Видео'}</span>
                                                </div>
                                            )}
                                            <button onClick={() => removeVideoItem(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                ×
                                            </button>
                                            {v.description && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1.5 truncate">{v.description}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {(content.videos || []).length >= maxVideos ? (
                                <p className="text-sm text-red-500 mb-2">Достигнут лимит ({maxVideos} видео)</p>
                            ) : (
                                <div className="border border-dashed border-[#cfd9e8] rounded-xl p-5 bg-[#f8faff]">
                                    <div className="flex gap-2 mb-4">
                                        <button onClick={() => setVideoMode('link')}
                                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${videoMode === 'link' ? 'bg-[#3476f5] text-white' : 'bg-gray-100 text-[#666]'}`}>
                                            Ссылка
                                        </button>
                                        <button onClick={() => setVideoMode('upload')}
                                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${videoMode === 'upload' ? 'bg-[#3476f5] text-white' : 'bg-gray-100 text-[#666]'}`}>
                                            Загрузить файл
                                        </button>
                                    </div>
                                    {videoMode === 'link' ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <Field label="Ссылка на видео (YouTube/Vimeo)" value={videoForm.link}
                                                       onChange={v => setVideoForm(prev => ({ ...prev, link: v }))}
                                                       placeholder="https://youtube.com/watch?v=..." />
                                                <Field label="URL превью" value={videoForm.preview}
                                                       onChange={v => setVideoForm(prev => ({ ...prev, preview: v }))}
                                                       placeholder="https://..." />
                                            </div>
                                            <div className="mb-3">
                                                <label className="block text-sm text-[#999] mb-1.5">Описание видео</label>
                                                <textarea value={videoForm.description} rows={2}
                                                          onChange={e => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                                                          className="text-input resize-none text-sm" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {videoForm.url ? (
                                                <div className="mb-3">
                                                    <video src={videoForm.url} controls className="w-full max-w-[400px] rounded-lg" preload="metadata">
                                                        Ваш браузер не поддерживает видео.
                                                    </video>
                                                    <p className="text-sm text-[#1980DF] mt-1.5 truncate">{videoForm.original_name}</p>
                                                </div>
                                            ) : (
                                                <div className="mb-3">
                                                    <FileUpload onFile={handleVideoUpload} disabled={uploading} accept="video/*" />
                                                    {uploading && <span className="text-sm text-[#999] ml-3">Загрузка...</span>}
                                                </div>
                                            )}
                                            <div className="mb-3">
                                                <label className="block text-sm text-[#999] mb-1.5">Описание видео</label>
                                                <textarea value={videoForm.description} rows={2}
                                                          onChange={e => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                                                          className="text-input resize-none text-sm" />
                                            </div>
                                        </>
                                    )}
                                    <button onClick={addVideoItem}
                                            className="btn-filled text-sm">
                                        Добавить видео
                                    </button>
                                </div>
                            )}
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

function FileUpload({ onFile, disabled, accept = 'image/*' }) {
    const [fileName, setFileName] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef(null);

    const processFile = (file) => {
        if (!file || disabled) return;
        setFileName(file.name);
        onFile(file);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const isActive = dragOver && !disabled;

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl px-5 py-4 text-center cursor-pointer transition-all duration-200 select-none
                ${disabled ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50' :
                  isActive ? 'border-[#1980DF] bg-[#eef5ff] scale-[1.02]' :
                  'border-[#cfd9e8] bg-[#f8faff] hover:border-[#1980DF] hover:bg-[#eef5ff]'}`}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                disabled={disabled}
                className="hidden"
            />
            <svg className="mx-auto mb-2 w-8 h-8 text-[#b0b8d0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            {fileName ? (
                <p className="text-sm font-medium text-[#1980DF] truncate max-w-[200px]">{fileName}</p>
            ) : (
                <>
                    <p className="text-sm font-medium text-[#4a4d6b]">Выберите файл</p>
                    <p className="text-xs text-[#b0b0b0] mt-0.5">или перетащите файл</p>
                </>
            )}
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
