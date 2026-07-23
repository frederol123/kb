import { useState, useEffect, useRef } from 'react';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export default function LocationAutocomplete({ value, onChange, placeholder }) {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);
    const wrapperRef = useRef(null);

    // Синхронизация с внешним value
    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    // Закрытие по клику вне компонента
    useEffect(() => {
        const onDocClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const fetchSuggestions = async (q) => {
        if (!q.trim() || q.trim().length < 2) {
            setSuggestions([]);
            setOpen(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(
                `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(q.trim())}&limit=5&accept-language=ru&addressdetails=1`,
                { headers: { 'User-Agent': 'KodBessmertiya/1.0' } }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setSuggestions(data);
            setOpen(data.length > 0);
        } catch (err) {
            console.error('Autocomplete error:', err);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInput = (val) => {
        setQuery(val);
        onChange(val); // сохраняем как plain text

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => fetchSuggestions(val), 300);
    };

    const selectSuggestion = (item) => {
        const displayName = item.display_name;
        setQuery(displayName);
        onChange(displayName);
        setOpen(false);
        setSuggestions([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-base text-[#999] mb-1.5">{placeholder || 'Место'}</label>
            <input
                type="text"
                value={query}
                onChange={e => handleInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
                placeholder={placeholder || 'Страна, город...'}
                className="text-input text-base"
            />
            {loading && (
                <div className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-[#1E79D0] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            {open && suggestions.length > 0 && (
                <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((item, i) => (
                        <li
                            key={item.osm_id || i}
                            onClick={() => selectSuggestion(item)}
                            className="px-3 py-2.5 text-sm text-[#1c2145] cursor-pointer hover:bg-[#E8F0F8] border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                            <span className="font-medium">{item.display_name}</span>
                            {item.type && (
                                <span className="ml-2 text-xs text-[#999] uppercase">{item.type}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
