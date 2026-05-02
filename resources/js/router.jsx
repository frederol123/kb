import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MemorialPage from './pages/MemorialPage';
import TariffsPage from './pages/TariffsPage';
import FamilyTreePage from './pages/FamilyTreePage';
import OrderStepsPage from './pages/OrderStepsPage';
import FAQPage from './pages/FAQPage';
import DashboardLayout from './pages/Cabinet/DashboardLayout';
import MyCardsPage from './pages/Cabinet/MyAnketsPage';
import CardEditorPage from './pages/Cabinet/AnketEditorPage';

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
                            <Route path="/faq" element={<FAQPage />} />
                            <Route path="/order-steps" element={<OrderStepsPage />} />
                            <Route path="/family_tree" element={<FamilyTreePage />} />
                            <Route path="/news" element={<EmptyPage title="Новости" />} />
                            <Route path="/lk" element={<DashboardLayout />}>
                                <Route index element={<MyCardsPage />} />
                                <Route path="drev" element={<EmptyPage title="Генеалогическое дерево" />} />
                                <Route path="history" element={<EmptyPage title="История покупок" />} />
                                <Route path="settings" element={<EmptyPage title="Настройки" />} />
                                <Route path="cards/:id/edit" element={<CardEditorPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
