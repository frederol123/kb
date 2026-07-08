import { useState, useEffect, useRef, useCallback } from 'react';

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

export default function YandexMapWidget({ address, mapImage, onAddressChange, onMapImageChange }) {
    const [loaded, setLoaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState(address || '');
    const [searching, setSearching] = useState(false);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    // Загружаем Leaflet
    useEffect(() => {
        if (document.querySelector('[data-leaflet-css]')) {
            if (window.L) { setLoaded(true); }
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = LEAFLET_CSS;
        link.setAttribute('data-leaflet-css', '');
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = LEAFLET_JS;
        script.async = true;
        script.onload = () => {
            // Даём время CSS загрузиться
            setTimeout(() => {
                // Исправляем проблему с иконками Leaflet
                delete window.L.Icon.Default.prototype._getIconUrl;
                window.L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                });
                setLoaded(true);
            }, 100);
        };
        document.body.appendChild(script);

        return () => {};
    }, []);

    const defaultCoords = [55.751574, 37.573856]; // Москва

    const updateMapImage = useCallback((coords) => {
        onMapImageChange('');
    }, [onMapImageChange]);

    // Инициализация карты
    useEffect(() => {
        if (!loaded || !mapRef.current) return;
        if (mapInstanceRef.current) return; // уже создана

        const L = window.L;
        const map = L.map(mapRef.current).setView(defaultCoords, 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://openstreetmap.org">OSM</a>',
            maxZoom: 19,
        }).addTo(map);

        const marker = L.marker(defaultCoords, { draggable: true }).addTo(map);

        mapInstanceRef.current = map;
        markerRef.current = marker;

        // Если есть адрес — геокодируем
        if (address) {
            geocode(address, map, marker, onAddressChange, updateMapImage);
        }

        // Перетаскивание маркера
        marker.on('dragend', () => {
            const coords = marker.getLatLng();
            reverseGeocode(coords.lat, coords.lng, onAddressChange);
            updateMapImage([coords.lat, coords.lng]);
        });

        // Клик по карте
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            reverseGeocode(lat, lng, onAddressChange);
            updateMapImage([lat, lng]);
        });

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [loaded]);

    // Геокодирование (поиск адреса → координаты)
    const geocode = async (query, map, marker, onAddrChange, onMapImgChange) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=ru`, {
                headers: { 'User-Agent': 'KodBessmertiya/1.0' }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                const displayName = data[0].display_name;
                map.setView([lat, lon], 15);
                marker.setLatLng([lat, lon]);
                setSearchQuery(displayName);
                onAddrChange(displayName);
                onMapImgChange([lat, lon]);
            } else {
                alert('Адрес не найден. Попробуйте уточнить запрос.');
            }
        } catch (err) {
            console.error('Geocode error:', err);
            alert('Ошибка при поиске адреса. Проверьте подключение к интернету.');
        }
    };

    // Обратное геокодирование (координаты → адрес)
    const reverseGeocode = async (lat, lng, onAddrChange) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`, {
                headers: { 'User-Agent': 'KodBessmertiya/1.0' }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.display_name) {
                setSearchQuery(data.display_name);
                onAddrChange(data.display_name);
            }
        } catch (err) {
            console.error('Reverse geocode error:', err);
        }
    };

    // Поиск
    const handleSearch = async () => {
        if (!searchQuery.trim() || !mapInstanceRef.current || !markerRef.current) return;
        setSearching(true);
        await geocode(searchQuery, mapInstanceRef.current, markerRef.current, onAddressChange, updateMapImage);
        setSearching(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Введите адрес захоронения..."
                    className="text-input text-base flex-1"
                />
                <button onClick={handleSearch} disabled={searching} className="btn-filled text-base whitespace-nowrap">
                    {searching ? 'Поиск...' : 'Найти'}
                </button>
            </div>
            <div
                ref={mapRef}
                className="w-full rounded-xl overflow-hidden border border-gray-200"
                style={{ height: '400px', zIndex: 1 }}
            >
                {!loaded && (
                    <div className="flex items-center justify-center h-full bg-gray-50 text-[#6c6d7e]">
                        Загрузка карты...
                    </div>
                )}
            </div>
            {address && (
                <div className="mt-2 text-xs text-[#999]">
                    <span className="font-medium text-[#1c2145]">Адрес:</span> {address}
                </div>
            )}
        </div>
    );
}
