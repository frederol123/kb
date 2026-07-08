import { useParams, Link } from 'react-router-dom';
import { Shield, MapPin, Briefcase, Cross, Share2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const SECTION = 'container mx-auto px-4';

export default function MemorialPage() {
    const { slug } = useParams();
    const { data: card, isLoading } = useQuery({
        queryKey: ['memorial', slug],
        queryFn: () => api.get(`/m/${slug}`).then(r => r.data),
    });

    if (isLoading) return <MemorialSkeleton />;
    if (!card) return <MemorialNotFound />;

    const info = card.info || {};
    const fio = [info.last_name, info.first_name, info.middle_name].filter(Boolean).join(' ');
    const dates = [info.birth_date, info.death_date].filter(Boolean).join(' – ');

    return (
        <div className="memorial-page">
            <MemorialHero info={info} fio={fio} dates={dates} card={card} />
            <MemorialBiography content={card.content} />
            <MemorialTimeline timeline={card.content?.timeline} />
            <MemorialRelatives family={card.family} />
            <MemorialGallery gallery={card.content?.gallery} />
            <MemorialVideos videos={card.content?.videos} />
            <MemorialCondolences card={card} />
            <MemorialBurial info={info} />
            <MemorialQR id={card.id} slug={card.slug} />
        </div>
    );
}

function MemorialHero({ info, fio, dates, card }) {
    const birthplace = info.birthplace || '';
    const deathplace = info.deathplace || '';
    const hasPlaces = birthplace || deathplace;
    const condolenceCount = card?.condolences?.length || 0;
    const initial = [info.first_name?.[0], info.last_name?.[0]].filter(Boolean).join('');

    return (
        <section className="memorial-hero relative overflow-hidden bg-gradient-to-b bg-[#eef4ff]">
            {/* Декоративные blur-элементы */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/30 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-300/20 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-300/20 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-[90px] pointer-events-none" aria-hidden="true" />

            <div className="relative container mx-auto px-6 py-8 md:py-12 lg:py-8">
                {/* Pill badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-blue-100 text-sm text-blue-700 font-medium mb-6 md:mb-8 shadow-sm">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Сохраним память о важном
                </div>

                {/* Две колонки */}
                <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-8 lg:gap-12">
                    {/* Левая колонка ~45% */}
                    <div className="w-full lg:w-[45%] flex-shrink-0 pt-0 flex flex-col">
                        {/* Имя — очень крупное */}
                        <h1 className="font-extrabold text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] tracking-tight text-[#243B53] mb-4">
                            {fio.split(' ').map((part, i) => (
                                <span key={i} className="block">{part}</span>
                            ))}
                        </h1>

                        {/* Даты */}
                        {dates && (
                            <p className="text-blue-600 font-semibold text-lg md:text-xl mb-6">
                                {dates}
                            </p>
                        )}

                        {/* Места */}
                        {hasPlaces && (
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span>Место рождения: <span className="text-gray-700 font-medium">{birthplace}</span></span>
                                </div>
                                {birthplace && deathplace && (
                                    <span className="hidden sm:inline-block w-[3px] h-[3px] rounded-full bg-gray-300" aria-hidden="true" />
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 text-blue-500" />
                                    <span>Место смерти: <span className="text-gray-700 font-medium">{deathplace}</span></span>
                                </div>
                            </div>
                        )}
                        {info.burial_address && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
                                <Cross className="w-4 h-4 text-blue-500" />
                                <span>Место захоронения: <span className="text-gray-700 font-medium">{info.burial_address}{info.burial_plot ? `, уч. ${info.burial_plot}` : ''}</span></span>
                            </div>
                        )}
                        {info.contact && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
                                <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Контакты: <span className="text-gray-700 font-medium">{info.contact}</span></span>
                            </div>
                        )}

                        {/* Описание / цитата */}
                        {info.quote && (
                            <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-[520px]">
                                «{info.quote}»
                            </p>
                        )}

                        {/* Кнопки */}
                        <div className="flex flex-wrap gap-4 mt-auto lg:mt-auto pt-6 lg:pt-0">
                            <a
                                href="#condolences"
                                className="inline-flex items-center justify-center px-7 py-3.5 text-white font-semibold text-base shadow-lg shadow-blue-200/60 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                style={{
                                    background: '#1e79d0',
                                    borderRadius: '5px',
                                }}
                            >
                                Оставить соболезнование
                            </a>
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({ title: fio, url: window.location.href });
                                    } else {
                                        navigator.clipboard?.writeText(window.location.href);
                                    }
                                }}
                                className="inline-flex items-center gap-2 px-7 py-3.5 border border-blue-200/60 bg-white/60 backdrop-blur-sm text-gray-700 font-semibold text-base shadow-sm hover:bg-white/90 hover:shadow-md hover:border-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                style={{ borderRadius: '5px' }}
                            >
                                <Share2 className="w-4 h-4" />
                                Поделиться памятью
                            </button>
                        </div>
                    </div>

                    {/* Правая колонка ~55% */}
                    <div className="w-full lg:w-[55%] flex-shrink-0">
                        <div className="relative rounded-[32px] overflow-hidden shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)] bg-gradient-to-br from-blue-50 to-white">
                            {info.photo ? (
                                <img
                                    src={info.photo}
                                    alt={fio}
                                    className="w-full aspect-[4/3] md:aspect-[16/10] object-cover"
                                />
                            ) : (
                                <div className="w-full aspect-[4/3] md:aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
                                    <span className="text-7xl md:text-8xl font-extrabold text-blue-200 select-none">
                                        {initial}
                                    </span>
                                </div>
                            )}
                            {/* Glassmorphism overlay снизу */}
                            {condolenceCount > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white/90 via-white/60 to-transparent backdrop-blur-[2px]">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">❤</span>
                                            <span className="text-sm font-semibold text-gray-700">
                                                {condolenceCount} {condolenceCount === 1 ? 'воспоминание' : condolenceCount < 5 ? 'воспоминания' : 'воспоминаний'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">👥</span>
                                            <span className="text-sm font-semibold text-gray-700">
                                                {condolenceCount} человек{condolenceCount === 1 ? '' : 'а'} почтили память
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MemorialRelatives({ family }) {
    const scrollRef = useRef(null);
    if (!family) return null;

    const allRelatives = [
        ...(family.children || []).map(r => ({ ...r, relation: r.relation || 'Ребёнок' })),
        ...(family.spouses || []).map(r => ({ ...r, relation: r.relation || 'Супруг(а)' })),
        ...(family.parents || []).map(r => ({ ...r, relation: r.relation || 'Родитель' })),
    ];

    if (allRelatives.length === 0) return null;

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
        }
    };

    return (
        <section className="memorial-relatives bg-white">
            <div className={SECTION}>
<h2 className="memorial-section__title mb-10">Родственники</h2>
                <div className="relative">
                    <div ref={scrollRef} className="memorial-relatives__carousel">
                        {allRelatives.map((r, i) => (
                            <div key={i} className="memorial-relative-card">
                                {r.photo ? (
                                    <img src={r.photo} alt={r.name} className="memorial-relative-card__avatar" />
                                ) : (
                                    <div className="memorial-relative-card__avatar-placeholder">
                                        {r.name?.[0]}
                                    </div>
                                )}
                                <span className="memorial-relative-card__relation">{r.relation}</span>
                                {r.name && <span className="memorial-relative-card__name">{r.name}</span>}
                                {r.message && (
                                    <p className="memorial-relative-card__message">«{r.message}»</p>
                                )}
                            </div>
                        ))}
                    </div>
                    {allRelatives.length > 4 && (
                        <div className="memorial-carousel-arrows justify-center">
                            <button className="memorial-carousel-arrow" onClick={() => scroll(-1)} aria-label="Назад">
                                <svg width="32" height="32" viewBox="0 0 32 32"><path d="M20 6L10 16L20 26" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                            </button>
                            <button className="memorial-carousel-arrow" onClick={() => scroll(1)} aria-label="Вперёд">
                                <svg width="32" height="32" viewBox="0 0 32 32"><path d="M12 6L22 16L12 26" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function MemorialBiography({ content }) {
    if (!content?.biography) return null;
    const gallery = content?.gallery || [];
    const [activeThumb, setActiveThumb] = useState(0);
    const mainPhoto = gallery[activeThumb]?.url;
    const [expanded, setExpanded] = useState(false);

    return (
        <section className="memorial-bio relative overflow-hidden bg-[#eef4ff]">
            {/* Цветок */}
            <div
                className="absolute top-0 left-0 pointer-events-none"
                style={{
                    background: 'url(/images/bio_flower.png) top left / contain no-repeat',
                    width: '50%',
                    maxWidth: '700px',
                    height: '100%',
                    zIndex: 0,
                }}
            />

            <div className={`${SECTION} relative z-[1]`}>
                {/* Заголовок */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-10 lg:mb-14">
                    <div>
                        <h2 className="memorial-section__title">Биография</h2>
                        <p className="memorial-section__desc max-w-[552px] mt-2">
                            «Краткий рассказ о жизненном пути, образовании, профессии и основных достижениях»
                        </p>
                    </div>
                </div>

                {/* Основной контент: карточка с фото + текст */}
                <div className="bg-white rounded-[5px] shadow-[0_8px_32px_-4px_rgba(30,121,208,0.12)] p-6 md:p-10 lg:p-12">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Левая колонка: фото + миниатюры */}
                        <div className="flex-shrink-0 w-full lg:w-[374px]">
                            {mainPhoto && (
                                <img
                                    src={mainPhoto}
                                    alt=""
                                    className="w-full h-[280px] lg:h-[320px] object-cover rounded-2xl"
                                />
                            )}
                            {gallery.length > 1 && (
                                <div className="flex gap-3 mt-4 flex-wrap">
                                    {gallery.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img.url}
                                            alt=""
                                            className={`w-[63px] h-[59px] rounded-lg object-cover cursor-pointer border-2 transition-colors ${
                                                i === activeThumb
                                                    ? 'border-[#1E79D0]'
                                                    : 'border-transparent hover:border-[#1E79D0]/40'
                                            }`}
                                            onClick={() => setActiveThumb(i)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Правая колонка: текст */}
                        <div className="flex-1 min-w-0 !pt-0 overflow-hidden">
                            {content.bio_quote && (
                                <blockquote className="text-[#243B53] font-medium text-lg md:text-xl leading-relaxed mb-6 border-l-4 border-[#1E79D0]/30 pl-5 italic">
                                    «{content.bio_quote}»
                                </blockquote>
                            )}
                            <div
                                className={`memorial-bio__text prose prose-sm max-w-none break-words ${
                                    !expanded ? 'line-clamp-[12] lg:line-clamp-[16]' : ''
                                }`}
                                dangerouslySetInnerHTML={{ __html: content.biography }}
                            />
                            {/* Кнопка «Читать далее» для длинных текстов */}
                            {content.biography && content.biography.length > 800 && (
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-white font-semibold text-sm shadow-lg shadow-blue-200/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                    style={{
                                        background: '#1e79d0',
                                        borderRadius: '5px',
                                    }}
                                >
                                    {expanded ? 'Скрыть' : 'Читать далее'}
                                    <svg
                                        className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


function MemorialGallery({ gallery }) {
    const scrollRef = useRef(null);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    if (!gallery || gallery.length === 0) return null;

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 350, behavior: 'smooth' });
        }
    };

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const prevImage = (e) => { e.stopPropagation(); setLightboxIndex(i => i > 0 ? i - 1 : gallery.length - 1); };
    const nextImage = (e) => { e.stopPropagation(); setLightboxIndex(i => i < gallery.length - 1 ? i + 1 : 0); };

    // Закрытие по Escape
    useEffect(() => {
        if (lightboxIndex === null) return;
        const onKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') setLightboxIndex(i => i > 0 ? i - 1 : gallery.length - 1);
            if (e.key === 'ArrowRight') setLightboxIndex(i => i < gallery.length - 1 ? i + 1 : 0);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [lightboxIndex, gallery.length]);

    return (
        <section className="memorial-gallery relative overflow-hidden bg-[#eef4ff]">
            <div className={`${SECTION} relative z-[1] py-16 md:py-24`}>
                {/* Заголовок секции */}
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-[#1c2145] font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
                        Галерея
                    </h2>
                    <p className="text-[#6c6d7e] text-base md:text-lg max-w-[700px] mx-auto leading-relaxed">
                        «Эта галерея — визуальная хроника жизни. Здесь собраны редкие архивные снимки из семейных альбомов, кадры ключевых карьерных моментов и знаковые события. Откройте для себя историю, рассказанную через фотографию»
                    </p>
                </div>

                {/* Карусель polaroid-фото */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 md:gap-11 overflow-x-auto scroll-smooth px-2 py-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {gallery.map((img, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 snap-start bg-white rounded-[5px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-3 pb-10 w-[215px] md:w-[260px] transition-transform hover:scale-[1.02] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] cursor-pointer"
                                onClick={() => openLightbox(i)}
                            >
                                <img
                                    src={img.url}
                                    alt={img.text || `Фото ${i + 1}`}
                                    className="w-full aspect-square object-cover rounded-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Стрелки навигации */}
                    {gallery.length > 3 && (
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-all border border-gray-300"
                                onClick={() => scroll(-1)}
                                aria-label="Назад"
                            >
                                <svg width="24" height="24" viewBox="0 0 32 32">
                                    <path d="M20 6L10 16L20 26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-all border border-gray-300"
                                onClick={() => scroll(1)}
                                aria-label="Вперёд"
                            >
                                <svg width="24" height="24" viewBox="0 0 32 32">
                                    <path d="M12 6L22 16L12 26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Кнопка закрытия */}
                    <button
                        className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10"
                        onClick={closeLightbox}
                        aria-label="Закрыть"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Счётчик */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 text-white/70 text-sm font-medium z-10">
                        {lightboxIndex + 1} / {gallery.length}
                    </div>

                    {/* Стрелка влево */}
                    {gallery.length > 1 && (
                        <button
                            className="absolute left-2 md:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10"
                            onClick={prevImage}
                            aria-label="Предыдущее"
                        >
                            <svg width="24" height="24" viewBox="0 0 32 32">
                                <path d="M20 6L10 16L20 26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}

                    {/* Изображение */}
                    <img
                        src={gallery[lightboxIndex].url}
                        alt={gallery[lightboxIndex].text || `Фото ${lightboxIndex + 1}`}
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Стрелка вправо */}
                    {gallery.length > 1 && (
                        <button
                            className="absolute right-2 md:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10"
                            onClick={nextImage}
                            aria-label="Следующее"
                        >
                            <svg width="24" height="24" viewBox="0 0 32 32">
                                <path d="M12 6L22 16L12 26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}

function MemorialVideos({ videos }) {
    if (!videos || videos.length === 0) return null;

    return (
        <section className="memorial-video">
            <div className={SECTION}>
                <h2 className="memorial-section__title mb-4">Видео</h2>
                <p className="memorial-section__desc max-w-[552px] mb-8">
                    «Здесь вы можете посмотреть видео из разных временных отрезков жизни».
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {videos.map((v, i) => (
                        <div key={i} className="memorial-video__preview">
                            {v.type === 'upload' && v.url ? (
                                <video src={v.url} controls className="w-full rounded-xl" preload="metadata" />
                            ) : v.preview ? (
                                <a href={v.link || '#'} target="_blank" rel="noopener noreferrer" className="relative block rounded-xl overflow-hidden group">
                                    <img src={v.preview} alt={v.description || 'Видео'} className="w-full" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-black/60 group-hover:bg-[#ff0000] group-hover:scale-110 transition-all">
                                            <svg className="w-6 h-6 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            ) : v.link ? (
                                <iframe
                                    src={v.link}
                                    className="w-full aspect-video rounded-xl"
                                    allowFullScreen
                                    title={v.description || 'Видео'}
                                />
                            ) : null}
                            {v.description && (
                                <p className="memorial-section__desc mt-3">{v.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function MemorialTimeline({ timeline }) {
    if (!timeline || timeline.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className={SECTION}>
                <div className="text-center mb-12">
                    <h2 className="memorial-section__title">Жизненный путь</h2>
                    <p className="memorial-section__desc max-w-[552px] mx-auto mt-2">
                        «Хронология важных событий и ключевых моментов жизни»
                    </p>
                </div>

                <div className="relative max-w-3xl mx-auto">
                    {/* вертикальная линия */}
                    <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#1e79d0] via-[#1e79d0]/40 to-transparent" />

                    <div className="space-y-10">
                        {timeline.map((e, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div key={i} className={`relative flex items-start gap-6 md:gap-0 ${
                                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                                }`}>
                                    {/* точка на линии */}
                                    <div className="relative z-[2] flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                                        <div className="w-[40px] h-[40px] rounded-full bg-white border-2 border-[#1e79d0] flex items-center justify-center shadow-[0_0_0_4px_rgba(30,121,208,0.1)]">
                                            <div className="w-[14px] h-[14px] rounded-full bg-[#1e79d0]" />
                                        </div>
                                    </div>

                                    {/* контент */}
                                    <div className={`flex-1 md:w-[calc(50%-40px)] ${
                                        isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'
                                    }`}>
                                        <div className="bg-[#f7fbff] rounded-[20px] p-6 border border-[#e9f0ff] hover:shadow-[0_4px_20px_-4px_rgba(30,121,208,0.10)] transition-shadow">
                                            {e.year && (
                                                <span className="text-[#1e79d0] font-extrabold text-2xl block mb-1">{e.year}</span>
                                            )}
                                            {e.title && (
                                                <h3 className="text-[#1c2145] font-bold text-lg mb-2">{e.title}</h3>
                                            )}
                                            {e.desc && (
                                                <p className="text-[#6c6d7e] text-sm leading-relaxed">{e.desc}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* пустой блок для выравнивания */}
                                    <div className="hidden md:block md:w-[calc(50%-40px)]" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function MemorialCondolences({ card }) {
    const { user } = useAuth();
    const addToast = useToast();
    const queryClient = useQueryClient();
    const [expanded, setExpanded] = useState(false);
    const [authorName] = useState(user?.name || '');
    const [message, setMessage] = useState('');

    const condolences = card?.condolences || [];
    const displayCondolences = expanded ? condolences : condolences.slice(0, 4);
    const hasMore = condolences.length > 4;

    const addMutation = useMutation({
        mutationFn: () => api.post('/condolences', {
            anket_id: card.id,
            message,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['memorial', card.slug] });
            setMessage('');
            addToast('Соболезнование отправлено');
        },
        onError: (err) => {
            addToast(err.response?.data?.message || 'Ошибка при отправке');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            addMutation.mutate();
        }
    };

    return (
        <section className="memorial-condolences relative overflow-hidden" id="condolences">
            {/* CSS-фон: небо с облаками */}
            <div
                className="absolute inset-0 w-full"
                style={{
                    background: `
                        linear-gradient(180deg, #d4e7fc 0%, #e8f2fd 30%, #f0f6ff 60%, #f8faff 100%)
                    `,
                    zIndex: 0,
                }}
            />
            {/* Облака — мягкие radial-gradient пятна */}
            <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
                {/* Крупное облако слева */}
                <div className="absolute w-[600px] h-[200px] rounded-full bg-white/50 blur-[60px] -left-20 top-[10%]" />
                <div className="absolute w-[400px] h-[150px] rounded-full bg-white/40 blur-[50px] left-[5%] top-[15%]" />
                {/* Среднее облако справа */}
                <div className="absolute w-[500px] h-[180px] rounded-full bg-white/45 blur-[55px] -right-16 top-[25%]" />
                <div className="absolute w-[350px] h-[130px] rounded-full bg-white/35 blur-[45px] right-[5%] top-[20%]" />
                {/* Лёгкие облака в центре сверху */}
                <div className="absolute w-[450px] h-[120px] rounded-full bg-white/30 blur-[50px] left-[25%] top-[5%]" />
                <div className="absolute w-[300px] h-[100px] rounded-full bg-white/25 blur-[40px] left-[40%] top-[8%]" />
                {/* Нижние облака */}
                <div className="absolute w-[550px] h-[160px] rounded-full bg-white/35 blur-[55px] left-[10%] bottom-[10%]" />
                <div className="absolute w-[400px] h-[140px] rounded-full bg-white/30 blur-[50px] right-[10%] bottom-[15%]" />
                {/* Мелкие облачка для объёма */}
                <div className="absolute w-[200px] h-[80px] rounded-full bg-white/20 blur-[35px] left-[35%] top-[30%]" />
                <div className="absolute w-[250px] h-[90px] rounded-full bg-white/20 blur-[40px] right-[30%] top-[35%]" />
                <div className="absolute w-[180px] h-[70px] rounded-full bg-white/15 blur-[30px] left-[55%] bottom-[25%]" />
            </div>
            <div className={`${SECTION} relative z-[1]`}>
                <h2 className="memorial-section__title mb-4">Книга соболезнований</h2>
                <p className="memorial-section__desc max-w-[732px] mb-10">
                    Вы можете оставить свои воспоминания и слова поддержки в «Книге соболезнований»
                </p>


                {displayCondolences.length > 0 && (
                    <div className="memorial-condolences__cards">
                        {displayCondolences.map((c) => (
                            <div key={c.id} className="memorial-condolence-card">
                                {c.user?.avatar ? (
                                    <img src={c.user.avatar} alt="" className="memorial-condolence-card__avatar" />
                                ) : (
                                    <div className="memorial-condolence-card__avatar-placeholder">
                                        {c.author_name?.[0]}
                                    </div>
                                )}
                                <span className="memorial-condolence-card__name">{c.author_name}</span>
                                <p className="memorial-condolence-card__message">
                                    «{c.message}»
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="flex justify-center mb-10">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold text-sm shadow-lg shadow-blue-200/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            style={{
                                background: '#1e79d0',
                                borderRadius: '5px',
                            }}
                        >
                            {expanded ? 'Скрыть' : 'Читать далее'}
                            <svg
                                className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="memorial-condolences__form" id="condolence-form">
                    <h3>Оставить соболезнование</h3>
                    {!user ? (
                        <div className="text-center py-6 px-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100">
                            <p className="text-gray-500 mb-4">Чтобы оставить соболезнование, необходимо войти</p>
                            <button
                                type="button"
                                onClick={() => window.dispatchEvent(new CustomEvent('auth:open'))}
                                className="inline-flex items-center justify-center px-7 py-3 rounded-2xl text-white font-semibold text-base shadow-lg shadow-blue-200/60 hover:shadow-xl transition-all duration-200"
                                style={{ background: '#1e79d0' }}
                            >
                                Войти
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-gray-500 mb-1">{authorName}</p>
                            <textarea
                                placeholder="Ваше соболезнование..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                                rows={3}
                                className="text-input resize-none"
                            />
                            <button
                                type="submit"
                                disabled={addMutation.isPending}
                                className="memorial-condolence-submit hover:shadow-xl hover:shadow-blue-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                style={{
                                    background: '#1e79d0',
                                    borderRadius: '5px',
                                }}
                            >
                                {addMutation.isPending ? 'Отправка...' : 'Оставить соболезнование'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}

function MemorialBurial({ info }) {
    const address = info?.burial_address;
    const plot = info?.burial_plot;
    const mapImage = info?.burial_map_image;

    if (!address && !mapImage) return null;

    return (
        <section className="memorial-burial">
            <div className={SECTION}>
                <h2 className="memorial-section__title mb-6">Место захоронения</h2>
                {address && (
                    <p className="memorial-burial__address">{address}{plot ? `, уч. ${plot}` : ''}</p>
                )}
                {mapImage && (
                    <div className="memorial-burial__map">
                        <img src={mapImage} alt="Место захоронения" />
                    </div>
                )}
            </div>
        </section>
    );
}

function MemorialQR({ id, slug }) {
    const qrUrl = `/api/ankets/${id}/qr`;

    return (
        <section className="memorial-qr relative bg-white border-t border-blue-100/60">
            <div className={SECTION}>
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16">
                    {/* QR-код */}
                    <div className="flex-shrink-0 bg-white rounded-2xl p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)]">
                        <div className="w-[220px] h-[220px]">
                            <img src={qrUrl} alt="QR-код" className="w-full h-full" />
                        </div>
                    </div>
                    {/* Текст + кнопки */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left pt-2">
                        <h2 className="memorial-section__title mb-2">QR-код</h2>
                        <p className="memorial-section__desc mb-6">
                            Вы можете скачать или распечатать готовый qr-код
                        </p>
                        <div className="flex gap-4">
                            <a
                                href={qrUrl}
                                download
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-medium text-sm shadow-sm hover:shadow-xl hover:shadow-blue-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                style={{
                                    background: '#1e79d0',
                                    borderRadius: '5px',
                                }}
                                title="Скачать"
                            >
                                <svg width="18" height="20" viewBox="0 0 21 23">
                                    <path d="M10.5 16.5L10.5 1M10.5 16.5L5.5 11.5M10.5 16.5L15.5 11.5M1 18V22H20V18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Скачать
                            </a>
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-medium text-sm shadow-sm hover:shadow-xl hover:shadow-green-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                style={{
                                    background: '#1e79d0',
                                    borderRadius: '5px',
                                }}
                                title="Распечатать"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8Z" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                                Распечатать
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MemorialSkeleton() {
    return (
        <div className="memorial-page min-h-screen flex items-center justify-center">
            <div className="text-center py-40">
                <div className="w-12 h-12 border-4 border-[#1E79D0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[#6c6d7e] font-mont">Загрузка...</p>
            </div>
        </div>
    );
}

function MemorialNotFound() {
    return (
        <div className="memorial-page min-h-screen flex items-center justify-center">
            <div className="text-center py-40">
                <h2 className="memorial-section__title mb-4">Страница не найдена</h2>
                <Link to="/" className="memorial-bottom__callback">На главную</Link>
            </div>
        </div>
    );
}
