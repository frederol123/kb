import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import CondolenceList from '../components/CondolenceList';

export default function MemorialPage() {
    const { slug } = useParams();
    const { data: anket, isLoading } = useQuery({
        queryKey: ['memorial', slug],
        queryFn: () => api.get(`/m/${slug}`).then(r => r.data),
    });

    if (isLoading) return <div className="text-center py-40 text-[#6c6d7e]">Загрузка...</div>;
    if (!anket) return <div className="text-center py-40 text-[#6c6d7e]">Страница не найдена</div>;

    const info = anket.info || {};
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

                {anket.content?.biography && (
                    <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm">
                        <h2 className="font-extrabold text-xl text-[#1c2145] mb-4">Биография</h2>
                        <div className="text-[#6c6d7e] leading-7 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: anket.content.biography }} />
                    </div>
                )}

                {anket.content?.gallery && anket.content.gallery.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm">
                        <h2 className="font-extrabold text-xl text-[#1c2145] mb-4">Фотографии</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {anket.content.gallery.map((img, i) => (
                                <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden block">
                                    <img src={img.url} alt={img.text || ''} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm">
                    <h2 className="font-extrabold text-xl text-[#1c2145] mb-6">Книга соболезнований</h2>
                    <CondolenceList anketId={anket.id} />
                </div>
            </div>
        </div>
    );
}
