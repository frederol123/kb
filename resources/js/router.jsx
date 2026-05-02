import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MemorialPage from './pages/MemorialPage';
import TariffsPage from './pages/TariffsPage';
import DashboardLayout from './pages/Cabinet/DashboardLayout';
import MyAnketsPage from './pages/Cabinet/MyAnketsPage';
import AnketEditorPage from './pages/Cabinet/AnketEditorPage';

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } },
});

function EmptyPage({ title }) {
    return (
        <div className="py-20 text-center">
            <h1 className="font-extrabold text-3xl text-[#1c2145] mb-4">{title}</h1>
            <p className="text-[#6c6d7e]">Раздел в разработке</p>
        </div>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/m/:slug" element={<MemorialPage />} />
                            <Route path="/tariffs" element={<TariffsPage />} />
                            <Route path="/faq" element={<EmptyPage title="Частые вопросы" />} />
                            <Route path="/order-steps" element={<EmptyPage title="Как заказать" />} />
                            <Route path="/family_tree" element={<EmptyPage title="Генеалогическое древо" />} />
                            <Route path="/news" element={<EmptyPage title="Новости" />} />
                            <Route path="/lk" element={<DashboardLayout />}>
                                <Route index element={<MyAnketsPage />} />
                                <Route path="drev" element={<EmptyPage title="Генеалогическое дерево" />} />
                                <Route path="history" element={<EmptyPage title="История покупок" />} />
                                <Route path="settings" element={<EmptyPage title="Настройки" />} />
                                <Route path="ankets/:id/edit" element={<AnketEditorPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
