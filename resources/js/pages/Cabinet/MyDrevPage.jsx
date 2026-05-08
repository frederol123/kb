import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

export default function MyDrevPage() {
    const { user } = useAuth();
    const [drevs, setDrevs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/drevs')
            .then(({ data }) => setDrevs(data.data || data))
            .catch(() => setError(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-[#6c6d7e] py-10">Загрузка...</p>;

    return (
        <div>
            <h2 className="section-title">Генеалогическое дерево</h2>
            <p className="section-desc">
                Здесь вы можете создать и редактировать генеалогическое древо вашей семьи.
            </p>

            <Link
                to="/lk/drev/new"
                className="button button--filled mb-8"
                style={{ paddingLeft: 24, paddingRight: 24, fontSize: 16 }}
            >
                + Создать древо
            </Link>

            {drevs.length === 0 ? (
                <div className="bg-[#f2f7ff] rounded-3xl p-10 text-center">
                    <p className="text-[#6c6d7e] text-lg mb-2">У вас пока нет генеалогических древ</p>
                    <p className="text-[#999] text-sm">Создайте первое древо, чтобы начать</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {drevs.map((drev) => (
                        <div key={drev.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#e9f0ff]">
                            <h3 className="font-bold text-[#1c2145] text-lg mb-2">{drev.title}</h3>
                            {drev.description && <p className="text-[#6c6d7e] text-sm mb-4">{drev.description}</p>}
                            <Link to={`/lk/drev/${drev.id}/edit`} className="text-[#1980DF] text-sm font-bold hover:underline">
                                Редактировать
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
