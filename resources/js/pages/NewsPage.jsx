import { useParams } from 'react-router-dom';

export default function NewsPage() {
    const { slug } = useParams();
    return (
        <div className="py-10 lg:py-20">
            <div className="max-w-[1433px] mx-auto px-4 lg:px-[34px]">
                <h1 className="section-title mb-8">Новость</h1>
                <p className="text-[#6c6d7e]">Страница: {slug}</p>
            </div>
        </div>
    );
}
