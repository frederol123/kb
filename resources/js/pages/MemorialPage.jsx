import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

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
            <MemorialHero info={info} fio={fio} dates={dates} />
            <MemorialRelatives family={card.family} />
            <MemorialBiography content={card.content} />
            <MemorialGallery gallery={card.content?.gallery} />
            <MemorialVideos videos={card.content?.videos} />
            <MemorialCondolences card={card} />
            <MemorialBurial info={info} />
            <MemorialQR slug={card.slug} />
        </div>
    );
}

function MemorialHero({ info, fio, dates }) {
    const birthplace = info.birthplace || '';
    const deathplace = info.deathplace || '';
    const hasPlaces = birthplace || deathplace;

    return (
        <section className="memorial-hero relative overflow-hidden">
            <div className="memorial-hero__bg" />
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
                    <div className="order-2 lg:order-1 flex flex-col pt-4 lg:pt-24 max-w-[673px]">
                        <h1 className="memorial-hero__name mb-4">{fio}</h1>
                        {dates && (
                            <p className="memorial-hero__dates mb-4">{dates}</p>
                        )}
                        {hasPlaces && (
                            <p className="memorial-hero__places mb-6">
                                Место рождения: <span>{birthplace}</span>
                                {birthplace && deathplace && '— '}
                                Место смерти: <span>{deathplace}</span>
                            </p>
                        )}
                        {info.quote && (
                            <p className="memorial-hero__quote">«{info.quote}»</p>
                        )}
                        <a href="#condolences" className="memorial-hero__condolence-btn mt-8">
                            Оставить соболезнование
                        </a>
                    </div>
                    <div className="order-1 lg:order-2 flex-shrink-0 lg:ml-auto">
                        {info.photo ? (
                            <img src={info.photo} alt={fio} className="memorial-hero__photo" />
                        ) : (
                            <div className="memorial-hero__photo-placeholder">
                                {info.first_name?.[0]}{info.last_name?.[0]}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <svg className="memorial-hero__decor hidden lg:block" style={{ right: 0, top: '50%', width: 585, height: 355 }} viewBox="0 0 585 355" fill="none">
                <path d="M1 354C1 354 86 200 292 200C498 200 584 1 584 1" stroke="#1E79D0" strokeWidth="2" strokeDasharray="8 8" />
            </svg>
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
            <div className="max-w-[1200px] mx-auto px-4">
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
            <div className="max-w-[1200px] mx-auto px-4">
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
                    <div className="flex-1 min-w-0">
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
            <div className="max-w-[1200px] mx-auto px-4">
                <h2 className="memorial-section__title mb-4">Галерея</h2>
                <p className="memorial-section__desc max-w-[552px] mb-8">
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
            <div className="max-w-[1200px] mx-auto px-4">
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
                                <a href={v.link || '#'} target="_blank" rel="noopener noreferrer">
                                    <img src={v.preview} alt={v.description || 'Видео'} />
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
            <div className="max-w-[1200px] mx-auto px-4 relative z-[1]">
                <h2 className="memorial-section__title mb-4">Книга соболезнований</h2>
                <p className="memorial-section__desc max-w-[732px] mb-10">
                    Вы можете оставить свои воспоминания и слова поддержки в «Книге соболезнований»
                </p>

                <div className="memorial-condolences__cta mb-10">
                    <a href="#condolence-form" className="memorial-condolence-submit">
                        Оставить соболезнование
                    </a>
                </div>

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
            <div className="max-w-[1200px] mx-auto px-4">
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

function MemorialQR({ slug }) {
    const qrUrl = `/api/ankets/${slug}/qr`;

    return (
        <section className="memorial-qr">
            <div className="max-w-[1200px] mx-auto px-4">
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
