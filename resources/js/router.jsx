import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MemorialPage from './pages/MemorialPage';
import TariffsPage from './pages/TariffsPage';
import QrInstallPage from './pages/QrInstallPage';
import OrderStepsPage from './pages/OrderStepsPage';
import OfferPage from './pages/OfferPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import FAQPage from './pages/FAQPage';
import DashboardLayout from './pages/Cabinet/DashboardLayout';
import MyCardsPage from './pages/Cabinet/MyAnketsPage';
import CardEditorPage from './pages/Cabinet/AnketEditorPage';
import PurchaseHistoryPage from './pages/Cabinet/PurchaseHistoryPage';
import SettingsPage from './pages/Cabinet/SettingsPage';
import ManagerPanel from './pages/Cabinet/ManagerPanel';
import LogsPage from './pages/Cabinet/LogsPage';

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
                        <ToastProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/m/:slug" element={<MemorialPage />} />
                            <Route path="/tariffs" element={<TariffsPage />} />
                            <Route path="/tarif" element={<TariffsPage />} />
                            <Route path="/faq" element={<FAQPage />} />
                            <Route path="/order-steps" element={<OrderStepsPage />} />
                            <Route path="/privacy" element={<PrivacyPolicyPage />} />
                            <Route path="/qr-install" element={<QrInstallPage />} />
                            <Route path="/offer" element={<OfferPage />} />
                            <Route path="/news" element={<EmptyPage title="Новости" />} />
                            <Route path="/lk" element={<DashboardLayout />}>
                                <Route index element={<MyCardsPage />} />
                                <Route path="history" element={<PurchaseHistoryPage />} />
                                <Route path="settings" element={<SettingsPage />} />
                                <Route path="cards/new/edit" element={<CardEditorPage />} />
                                <Route path="cards/:id/edit" element={<CardEditorPage />} />
                                <Route path="manager-panel" element={<ManagerPanel />} />
                                <Route path="logs" element={<LogsPage />} />
                            </Route>
                        </Route>
                    </Routes>
                    </ToastProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
