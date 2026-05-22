import { useParams, Link } from 'react-router-dom';
import { Shield, MapPin, Briefcase, Share2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
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
            <MemorialRelatives family={card.family} />
            <MemorialBiography content={card.content} />
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
        <section className="memorial-hero relative overflow-hidden bg-gradient-to-b from-[#f8fbff] to-[#eef4ff]">
            {/* Декоративные blur-элементы */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/30 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-300/20 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-[90px] pointer-events-none" aria-hidden="true" />

            <div className="relative container mx-auto px-6 py-8 md:py-12 lg:py-16">
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
                                className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl text-white font-semibold text-base shadow-lg shadow-blue-200/60 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(135deg, #1e79d0, #2563eb)',
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
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-blue-200/60 bg-white/60 backdrop-blur-sm text-gray-700 font-semibold text-base shadow-sm hover:bg-white/90 hover:shadow-md hover:border-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
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
        <section className="memorial-relatives">
            <div className={SECTION}>
                <h2 className="memorial-section__title mb-10 lg:ml-[20px]">Родственники</h2>
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

    return (
        <section className="memorial-bio">
            <div className={SECTION}>
                <div className="memorial-bio__header">
                    <h2 className="memorial-section__title">Биография</h2>
                    <p className="memorial-section__desc max-w-[552px]">
                        «Краткий рассказ о жизненном пути, образовании, профессии и основных достижениях».
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mt-10">
                    <div className="flex-shrink-0">
                        {mainPhoto && (
                            <img src={mainPhoto} alt="" className="memorial-bio__photo" />
                        )}
                        {gallery.length > 1 && (
                            <div className="memorial-bio__thumbs">
                                {gallery.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img.url}
                                        alt=""
                                        className={`memorial-bio__thumb ${i === activeThumb ? 'memorial-bio__thumb--active' : ''}`}
                                        onClick={() => setActiveThumb(i)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        {content.bio_quote && (
                            <p className="memorial-bio__quote mb-6">«{content.bio_quote}»</p>
                        )}
                        <div
                            className="memorial-bio__text"
                            dangerouslySetInnerHTML={{ __html: content.biography }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}


function MemorialGallery({ gallery }) {
    const scrollRef = useRef(null);
    if (!gallery || gallery.length === 0) return null;

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 350, behavior: 'smooth' });
        }
    };

    return (
        <section className="memorial-gallery">
            <div className={SECTION}>
                <h2 className="memorial-section__title mb-8">Галерея</h2>
                <p className="memorial-section__desc max-w-[800px] mb-8">
                    «Эта галерея — визуальная хроника жизни. Здесь собраны редкие архивные снимки из семейных альбомов, кадры ключевых карьерных моментов и знаковые события. Откройте для себя историю, рассказанную через фотографию».
                </p>
                <div className="relative">
                    <div ref={scrollRef} className="memorial-gallery__carousel">
                        {gallery.map((img, i) => (
                            <div key={i} className="memorial-polaroid">
                                <img src={img.url} alt={img.text || `Фото ${i + 1}`} className="memorial-polaroid__image" />
                            </div>
                        ))}
                    </div>
                    {gallery.length > 3 && (
                        <div className="memorial-carousel-arrows justify-center mt-6">
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

function MemorialCondolences({ card }) {
    const { user } = useAuth();
    const addToast = useToast();
    const queryClient = useQueryClient();
    const [authorName, setAuthorName] = useState(user?.name || '');
    const [message, setMessage] = useState('');

    const condolences = card?.condolences || [];
    const displayCondolences = condolences.slice(0, 8);

    const addMutation = useMutation({
        mutationFn: () => api.post('/condolences', {
            anket_id: card.id,
            author_name: authorName,
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
        if (authorName.trim() && message.trim()) {
            addMutation.mutate();
        }
    };

    return (
        <section className="memorial-condolences relative" id="condolences">
            <div
                className="memorial-condolences__bg absolute inset-0 w-full"
                style={{
                    backgroundImage: `url(/images/memorial-condolences-bg.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 0,
                }}
            />
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

                <div className="memorial-condolences__form" id="condolence-form">
                    <h3>Оставить соболезнование</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            value={authorName}
                            onChange={e => setAuthorName(e.target.value)}
                            required
                            className="text-input"
                        />
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
                            className="memorial-condolence-submit"
                        >
                            {addMutation.isPending ? 'Отправка...' : 'Оставить соболезнование'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

function MemorialBurial({ info }) {
    const address = info?.burial_address;
    const mapImage = info?.burial_map_image;

    if (!address && !mapImage) return null;

    return (
        <section className="memorial-burial">
            <div className={SECTION}>
                <h2 className="memorial-section__title mb-6">Место захоронения</h2>
                {address && (
                    <p className="memorial-burial__address">{address}</p>
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
        <section className="memorial-qr">
            <div className={SECTION}>
                <h2 className="memorial-section__title mb-2">QR-код</h2>
                <p className="memorial-section__desc mb-6">
                    Вы можете скачать или распечатать готовый qr-код
                </p>
                <div className="memorial-qr__code">
                    <img src={qrUrl} alt="QR-код" />
                </div>
                <div className="memorial-qr__actions">
                    <a href={qrUrl} download className="memorial-qr__action-btn" title="Скачать">
                        <svg width="21" height="23" viewBox="0 0 21 23"><path d="M10.5 16.5L10.5 1M10.5 16.5L5.5 11.5M10.5 16.5L15.5 11.5M1 18V22H20V18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                    <button onClick={() => window.print()} className="memorial-qr__action-btn" title="Распечатать">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8Z" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
                    </button>
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
