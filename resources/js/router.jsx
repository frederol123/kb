import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MemorialPage from './pages/MemorialPage';
import NewsListPage from './pages/NewsListPage';
import NewsPage from './pages/NewsPage';
import TariffsPage from './pages/TariffsPage';
import DashboardLayout from './pages/Cabinet/DashboardLayout';
import MyAnketsPage from './pages/Cabinet/MyAnketsPage';
import AnketEditorPage from './pages/Cabinet/AnketEditorPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 1000 * 60, retry: 1 },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/m/:slug" element={<MemorialPage />} />
                            <Route path="/news" element={<NewsListPage />} />
                            <Route path="/news/:slug" element={<NewsPage />} />
                            <Route path="/tariffs" element={<TariffsPage />} />
                            <Route path="/lk" element={<DashboardLayout />}>
                                <Route index element={<MyAnketsPage />} />
                                <Route path="ankets/:id/edit" element={<AnketEditorPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
