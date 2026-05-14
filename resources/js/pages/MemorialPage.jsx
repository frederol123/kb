import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import CondolenceList from '../components/CondolenceList';

export default function MemorialPage() {
    const { slug } = useParams();
    const { data: card, isLoading } = useQuery({
        queryKey: ['memorial', slug],
        queryFn: () => api.get(`/m/${slug}`).then(r => r.data),
    });

    if (isLoading) return <div className="text-center py-40 text-[#6c6d7e]">Загрузка...</div>;
    if (!card) return <div className="text-center py-40 text-[#6c6d7e]">Страница не найдена</div>;

    const info = card.info || {};
    const fio = [info.last_name, info.first_name, info.middle_name].filter(Boolean).join(' ');

    return (
        <div className="bg-[#f8f8f8] min-h-screen py-10 lg:py-16">
            <div className="max-w-[800px] mx-auto px-4">

                <div className="text-center mb-8">
                    {info.photo ? (
                        <div className="memorial-photo mx-auto mb-5">
                            <img src={info.photo} alt={fio} />
                        </div>
                    ) : (
                        <div className="memorial-photo mx-auto mb-5 bg-gray-200 flex items-center justify-center">
                            <span className="text-4xl text-gray-400">{info.first_name?.[0]}{info.last_name?.[0]}</span>
                        </div>
                    )}
                    <h1 className="font-extrabold text-[32px] lg:text-4xl text-[#1c2145] mb-3">{fio}</h1>
                    {(info.birth_date || info.death_date) && (
                        <p className="text-base text-[#666]">
                            {info.birth_date || '?'} {info.birth_date && info.death_date ? '—' : ''} {info.death_date || '?'}
                        </p>
                    )}
                </div>

                {(info.birthplace || info.deathplace) && (
                    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                        <div className="flex flex-wrap gap-6">
                            {info.birthplace && (
                                <div>
                                    <span className="block text-sm text-[#999] mb-1">Место рождения</span>
                                    <span className="text-[#1c2145] font-bold">{info.birthplace}</span>
                                </div>
                            )}
                            {info.deathplace && (
                                <div>
                                    <span className="block text-sm text-[#999] mb-1">Место ухода</span>
                                    <span className="text-[#1c2145] font-bold">{info.deathplace}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {renderFamily(card.family)}

                {card.content?.biography && (
                    <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm">
                        <h2 className="font-extrabold text-xl text-[#1c2145] mb-4">Биография</h2>
                        <div className="text-[#6c6d7e] leading-7 whitespace-pre-wrap"
                             dangerouslySetInnerHTML={{ __html: card.content.biography }} />
                    </div>
                )}

                {renderGallery(card.content?.gallery)}
                {renderVideos(card.content?.videos)}

                <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm">
                    <h2 className="font-extrabold text-xl text-[#1c2145] mb-6">Книга соболезнований</h2>
                    <CondolenceList anketId={card.id} />
                </div>
            </div>
        </div>
    );
}

function renderFamily(family) {
    if (!family) return null;
    const groups = [
        { key: 'children', label: 'Дети' },
        { key: 'spouses', label: 'Брак' },
        { key: 'parents', label: 'Родители' },
    ];
    const hasAny = groups.some(g => (family[g.key] || []).length > 0);
    if (!hasAny) return null;

    return (
        <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm">
            <h2 className="font-extrabold text-xl text-[#1c2145] mb-4">Семья</h2>
            {groups.map(g => {
                const items = family[g.key] || [];
                if (items.length === 0) return null;
                return (
                    <div key={g.key} className="mb-4 last:mb-0">
                        <h3 className="font-bold text-sm text-[#999] mb-2 uppercase">{g.label}</h3>
                        <div className="flex flex-wrap gap-2">
                            {items.map((item, i) => (
                                <span key={i} className="inline-block bg-[#f8f8f8] rounded-lg px-3 py-1.5 text-sm text-[#1c2145] font-bold">
                                    {item.name || 'Без имени'}
                                    {g.key === 'spouses' && (item.marriage_start || item.marriage_end) && (
                                        <span className="text-[#999] font-medium ml-1">
                                            ({item.marriage_start || '?'} — {item.marriage_end || '?'})
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function renderGallery(gallery) {
    if (!gallery || gallery.length === 0) return null;
    return (
        <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm">
            <h2 className="font-extrabold text-xl text-[#1c2145] mb-4">Фотографии</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.map((img, i) => (
                    <a key={i} href={img.url} target="_blank" rel="noopener noreferrer"
                       className="aspect-square rounded-lg overflow-hidden block relative group">
                        <img src={img.url} alt={img.text || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        {img.text && <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">{img.text}</div>}
                    </a>
                ))}
            </div>
        </div>
    );
}

function renderVideos(videos) {
    if (!videos || videos.length === 0) return null;
    return (
        <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm">
            <h2 className="font-extrabold text-xl text-[#1c2145] mb-4">Видео</h2>
            <div className="space-y-5">
                {videos.map((v, i) => (
                    <div key={i}>
                        {v.type === 'upload' && v.url ? (
                            <video src={v.url} controls className="w-full max-w-[480px] rounded-xl" preload="metadata">
                                Ваш браузер не поддерживает видео.
                            </video>
                        ) : v.preview ? (
                            <a href={v.link || '#'} target="_blank" rel="noopener noreferrer" className="block">
                                <img src={v.preview} alt="Видео" className="w-full max-w-[480px] rounded-xl" />
                            </a>
                        ) : v.link ? (
                            <a href={v.link} target="_blank" rel="noopener noreferrer"
                               className="btn-outline inline-flex">Смотреть видео</a>
                        ) : null}
                        {v.description && (
                            <p className="text-[#6c6d7e] text-sm mt-2 leading-5">{v.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
