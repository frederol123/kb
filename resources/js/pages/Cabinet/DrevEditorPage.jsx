import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const emptyFamily = () => ({
    name: '',
    marriage: '',
    husband_anket_id: null,
    wife_anket_id: null,
    kids_anket_ids: [],
});

const emptyGeneration = () => ({
    name: '',
    families: [emptyFamily()],
});

const defaultData = () => ({
    generations: [emptyGeneration()],
});

function getFio(anket) {
    if (!anket) return 'Новая анкета';
    const info = anket.info || {};
    const parts = [info.last_name, info.first_name, info.middle_name].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'Новая анкета';
}

function getPhotoUrl(anket) {
    if (anket?.info?.photo) return anket.info.photo;
    return '/images/no-photo-big.svg';
}

function getBirthYear(anket) {
    const d = anket?.info?.birth_date;
    if (!d) return null;
    const date = new Date(d);
    return isNaN(date.getTime()) ? null : date.getFullYear();
}

function getDeathYear(anket) {
    const d = anket?.info?.death_date;
    if (!d) return null;
    const date = new Date(d);
    return isNaN(date.getTime()) ? null : date.getFullYear();
}

function getAge(birthdate) {
    if (!birthdate) return null;
    const birth = new Date(birthdate);
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
}

function PersonCard({ anket, gender }) {
    if (!anket) return null;
    const fio = getFio(anket);
    const birthYear = getBirthYear(anket);
    const deathYear = getDeathYear(anket);
    const birthdate = anket?.info?.birth_date;
    const age = getAge(birthdate);
    const anketGender = anket?.info?.gender || gender;
    const isWoman = anketGender === 'woman';

    return (
        <div className="tree-card tree-info__item">
            <img src={getPhotoUrl(anket)} alt="" className="tree-card__image" />
            <div className="tree-card__body">
                <span className="tree-card__name"><strong>{fio}</strong></span>
                {birthYear && (
                    <span className="tree-card__desc">
                        {isWoman ? 'Родилась' : 'Родился'} в <strong>{birthYear}г</strong>
                        {age && !deathYear ? ` (${age} лет)` : ''}
                    </span>
                )}
                {deathYear && (
                    <span className="tree-card__desc">
                        {isWoman ? 'Умерла' : 'Умер'} в <strong>{deathYear}г</strong>
                        {(() => {
                            const bd = anket?.info?.birth_date;
                            const dd = anket?.info?.death_date;
                            if (!bd || !dd) return null;
                            const bDate = new Date(bd);
                            const dDate = new Date(dd);
                            if (isNaN(bDate.getTime()) || isNaN(dDate.getTime())) return null;
                            return ` (${dDate.getFullYear() - bDate.getFullYear()} лет)`;
                        })()}
                    </span>
                )}
            </div>
        </div>
    );
}

function TreeToggle({ title, subtitle, subtitles, defaultOpen, children, action }) {
    const [open, setOpen] = useState(defaultOpen);
    const allSubtitles = subtitle ? [subtitle] : (subtitles || []);

    return (
        <div className="tree-toggle" data-tree-toggle={open ? 'expanded' : 'collapsed'}>
            <button className="tree-toggle__button" onClick={() => setOpen(!open)}>
                <span className="tree-toggle__title">{title || 'Без названия'}</span>
                {allSubtitles.map((s, i) => (
                    <span key={i} className="tree-toggle__subtitle">{s}</span>
                ))}
                {action && <span style={{ pointerEvents: 'all', marginTop: 8, display: 'inline-block' }}>{action}</span>}
            </button>
            <div className="tree-toggle__content" data-tree-toggle-content>
                {children}
            </div>
        </div>
    );
}

export default function DrevEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id || id === 'new';

    const [title, setTitle] = useState('');
    const [generations, setGenerations] = useState(defaultData().generations);
    const [ankets, setAnkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const requests = [api.get('/ankets')];
        if (!isNew) requests.push(api.get(`/drevs/${id}`));

        Promise.all(requests)
            .then(([anketsRes, drevRes]) => {
                setAnkets(anketsRes.data.data || anketsRes.data);
                if (drevRes) {
                    const drev = drevRes.data;
                    setTitle(drev.title || '');
                    if (drev.data?.generations) {
                        setGenerations(drev.data.generations);
                    }
                }
            })
            .catch((err) => {
                if (err.response?.status === 403) navigate('/lk/drev', { replace: true });
                else if (err.response?.status === 404) return;
                else setError('Ошибка загрузки данных');
            })
            .finally(() => setLoading(false));
    }, [id, isNew, navigate]);

    const updateGeneration = (gi, field, value) => {
        const next = generations.map((g, i) => i === gi ? { ...g, [field]: value } : g);
        setGenerations(next);
    };

    const updateFamily = (gi, fi, field, value) => {
        const next = generations.map((g, i) => {
            if (i !== gi) return g;
            return {
                ...g,
                families: g.families.map((f, j) => j === fi ? { ...f, [field]: value } : f),
            };
        });
        setGenerations(next);
    };

    const addGeneration = () => {
        setGenerations([...generations, emptyGeneration()]);
    };

    const removeGeneration = (gi) => {
        if (generations.length <= 1) return;
        setGenerations(generations.filter((_, i) => i !== gi));
    };

    const addFamily = (gi) => {
        const next = generations.map((g, i) =>
            i === gi ? { ...g, families: [...g.families, emptyFamily()] } : g
        );
        setGenerations(next);
    };

    const removeFamily = (gi, fi) => {
        const gen = generations[gi];
        if (gen.families.length <= 1) return;
        const next = generations.map((g, i) =>
            i === gi ? { ...g, families: g.families.filter((_, j) => j !== fi) } : g
        );
        setGenerations(next);
    };

    const handleSave = async () => {
        const titleValue = (document.getElementById('drev-title')?.value || title).trim();
        if (!titleValue) {
            setError(`Введите название дерева (value="${document.getElementById('drev-title')?.value}")`);
            return;
        }
        const hasIncompleteFamily = generations.some((gen) =>
            gen.families.some((f) => !f.husband_anket_id && !f.wife_anket_id)
        );
        if (hasIncompleteFamily) {
            setError('Заполните поля «Муж» и/или «Жена» в каждой семье');
            return;
        }

        const hasSamePerson = generations.some((gen) =>
            gen.families.some((f) =>
                f.husband_anket_id && f.wife_anket_id && f.husband_anket_id === f.wife_anket_id
            )
        );
        if (hasSamePerson) {
            setError('Муж и жена не могут быть одним и тем же человеком');
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const payload = { title: titleValue, data: { generations } };
            if (isNew) {
                const { data } = await api.post('/drevs', payload);
                navigate(`/lk/drev/${data.id}/edit`, { replace: true });
            } else {
                await api.put(`/drevs/${id}`, payload);
            }
        } catch (err) {
            const errors = err.response?.data?.errors;
            if (errors) {
                setError(Object.values(errors).flat().join('; '));
            } else {
                setError('Ошибка сохранения');
            }
        } finally {
            setSaving(false);
        }
    };

    const findAnket = (anketId) => ankets.find((a) => a.id === anketId) || null;

    if (loading) return <p className="text-[#6c6d7e] py-10">Загрузка...</p>;

    return (
        <div className="drev-section">
            <div className="profile__header">
                <div className="profile__heading">
                    <input
                        id="drev-title"
                        defaultValue={title}
                        placeholder="Название дерева"
                        style={{
                            fontFamily: "'Vela Sans', sans-serif",
                            fontSize: 32,
                            fontWeight: 700,
                            color: '#1c2145',
                            lineHeight: '36px',
                            letterSpacing: '0.16px',
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            padding: 0,
                            margin: '0 0 51px 0',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-xl text-sm font-bold bg-red-100 text-red-700">
                    {error}
                </div>
            )}

            {generations.map((gen, gi) => (
                <TreeToggle
                    key={gi}
                    title={gen.name || `Поколение ${gi + 1}`}
                    defaultOpen={gi === 0}
                    action={
                        <span style={{ display: 'flex', gap: 8 }}>
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeGeneration(gi); }}
                                className="text-red-500 hover:text-red-700 font-bold text-sm"
                                disabled={generations.length <= 1}>
                                Удалить поколение
                            </button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); addFamily(gi); }}
                                className="text-[#1980DF] hover:underline font-bold text-sm">
                                + Добавить семью
                            </button>
                        </span>
                    }
                >
                    <input
                        className="text-input mb-6"
                        placeholder="Название поколения"
                        value={gen.name}
                        onChange={(e) => updateGeneration(gi, 'name', e.target.value)}
                    />

                    {gen.families.map((family, fi) => {
                        const husband = findAnket(family.husband_anket_id);
                        const wife = findAnket(family.wife_anket_id);
                        const kids = (family.kids_anket_ids || [])
                            .map((kidId) => findAnket(kidId))
                            .filter(Boolean);

                        const subtitleParts = [];
                        if (wife || husband) {
                            if (wife) subtitleParts.push(wife.info?.first_name || 'Имя не указано');
                            if (wife && husband) subtitleParts.push('и');
                            if (husband) subtitleParts.push(husband.info?.first_name || 'Имя не указано');
                        }
                        const subtitle = subtitleParts.length > 0 ? subtitleParts.join(' ') : 'Нет информации';
                        const marriageSubtitle = family.marriage ? `В браке: ${new Date(family.marriage).toLocaleDateString('ru-RU')}` : null;

                        return (
                            <TreeToggle
                                key={fi}
                                title={family.name || `Семья ${fi + 1}`}
                                subtitles={[subtitle, ...(marriageSubtitle ? [marriageSubtitle] : [])]}
                                defaultOpen={fi === 0}
                                action={
                                    <span style={{ display: 'flex', gap: 8 }}>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFamily(gi, fi); }}
                                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                                            disabled={gen.families.length <= 1}>
                                            Удалить семью
                                        </button>
                                    </span>
                                }
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                                    <input
                                        className="text-input"
                                        placeholder="Название семьи"
                                        value={family.name}
                                        onChange={(e) => updateFamily(gi, fi, 'name', e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className="text-input"
                                        value={family.marriage}
                                        onChange={(e) => updateFamily(gi, fi, 'marriage', e.target.value)}
                                        style={{ colorScheme: 'normal' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                                    <div>
                                        <span style={{ display: 'block', marginBottom: 6, color: '#1c2145', fontSize: 14, fontWeight: 700 }}>Муж</span>
                                        <select
                                            className="text-input"
                                            value={family.husband_anket_id || ''}
                                            onChange={(e) => updateFamily(gi, fi, 'husband_anket_id', e.target.value ? Number(e.target.value) : null)}
                                        >
                                            <option value="">— Не выбран —</option>
                                            {ankets.map((a) => (
                                                <option key={a.id} value={a.id}>{getFio(a)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', marginBottom: 6, color: '#1c2145', fontSize: 14, fontWeight: 700 }}>Жена</span>
                                        <select
                                            className="text-input"
                                            value={family.wife_anket_id || ''}
                                            onChange={(e) => updateFamily(gi, fi, 'wife_anket_id', e.target.value ? Number(e.target.value) : null)}
                                        >
                                            <option value="">— Не выбрана —</option>
                                            {ankets.map((a) => (
                                                <option key={a.id} value={a.id}>{getFio(a)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 32 }}>
                                    <span style={{ display: 'block', marginBottom: 6, color: '#1c2145', fontSize: 14, fontWeight: 700 }}>Дети</span>
                                    <KidsSelector
                                        ankets={ankets}
                                        selectedIds={family.kids_anket_ids || []}
                                        onChange={(ids) => updateFamily(gi, fi, 'kids_anket_ids', ids)}
                                    />
                                </div>

                                {(husband || wife) && (
                                    <div className="tree-info">
                                        <span className="tree-info__heading">Родители</span>
                                        <div className="tree-info__items">
                                            {husband && <PersonCard anket={husband} gender="man" />}
                                            {wife && <PersonCard anket={wife} gender="woman" />}
                                        </div>
                                    </div>
                                )}

                                {kids.length > 0 && (
                                    <div className="tree-info" style={{ marginTop: 32 }}>
                                        <span className="tree-info__heading tree-info__heading--smaller">Дети</span>
                                        <div className="tree-info__items">
                                            {kids.map((kid) => (
                                                <PersonCard key={kid.id} anket={kid} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TreeToggle>
                        );
                    })}
                </TreeToggle>
            ))}

            <button type="button" onClick={addGeneration} className="button mt-4 mb-10" style={{ borderColor: '#e9f0ff', borderWidth: 2 }}>
                + Добавить поколение
            </button>

            <div style={{ marginBottom: 40 }}>
                <button className="button button--filled" onClick={handleSave} disabled={saving} style={{ fontSize: 18, padding: '16px 48px' }}>
                    {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
            </div>
        </div>
    );
}

function KidsSelector({ ankets, selectedIds, onChange }) {
    const toggle = (id) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((sid) => sid !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ankets.map((a) => (
                <button
                    key={a.id}
                    type="button"
                    onClick={() => toggle(a.id)}
                    style={{
                        padding: '6px 16px',
                        borderRadius: 12,
                        border: selectedIds.includes(a.id) ? '2px solid #1980DF' : '2px solid #e9f0ff',
                        background: selectedIds.includes(a.id) ? '#e9f0ff' : '#fff',
                        color: selectedIds.includes(a.id) ? '#1980DF' : '#6c6d7e',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: "'Vela Sans', sans-serif",
                    }}
                >
                    {getFio(a)}
                </button>
            ))}
            {ankets.length === 0 && <span className="text-[#6c6d7e] text-sm">Нет доступных карточек</span>}
        </div>
    );
}
