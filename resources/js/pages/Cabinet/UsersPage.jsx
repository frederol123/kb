import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function UsersPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const roles = user?.roles || [];
  const hasAccess = roles.includes('admin') || roles.includes('manager');

  if (!hasAccess) {
    return <Navigate to="/lk" replace />;
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['manager-users', page],
    queryFn: () => api.get(`/manager/users?page=${page}&per_page=50`).then(r => r.data),
    placeholderData: (prev) => prev,
  });

  const loginAsMutation = useMutation({
    mutationFn: (userId) => api.post(`/manager/users/${userId}/login-as`),
    onSuccess: (res) => {
      const { token } = res.data;
      const newUrl = `${window.location.origin}/lk?login_as_token=${token}`;
      window.open(newUrl, '_blank');
      showToast('Сессия пользователя открыта в новой вкладке');
    },
    onError: (err) => {
      showToast(err?.response?.data?.message || 'Ошибка входа', 'error');
    },
  });

  return (
    <div>
      <h1 className="font-extrabold text-2xl lg:text-3xl text-[#1c2145] mb-6">
        Пользователи
      </h1>

      {toast && (
        <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-medium ${
          toast.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-[#6c6d7e] p-6">Загрузка...</p>
        ) : isError ? (
          <p className="text-red-500 p-6">Ошибка загрузки пользователей</p>
        ) : data?.data?.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[#6c6d7e]">Пользователей пока нет</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">ID</th>
                    <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Логин</th>
                    <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Имя</th>
                    <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Телефон</th>
                    <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Тариф</th>
                    <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Роль</th>
                    <th className="text-center px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Анкет</th>
                    <th className="text-left px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Дата</th>
                    <th className="text-right px-4 py-3 text-[#6c6d7e] font-semibold text-xs uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.data.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 text-[#6c6d7e] font-mono text-xs">{u.id}</td>
                      <td className="px-4 py-2.5 text-[#1c2145] font-medium">{u.login}</td>
                      <td className="px-4 py-2.5 text-[#1c2145]">{u.name}</td>
                      <td className="px-4 py-2.5 text-xs text-[#6c6d7e]">{u.email || '—'}</td>
                      <td className="px-4 py-2.5 text-xs text-[#6c6d7e]">{u.phone || '—'}</td>
                      <td className="px-4 py-2.5 text-xs">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-[#eff6ff] text-[#2563eb]">
                          {u.tariff?.title || 'Без тарифа'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs">
                        {u.roles?.length > 0 ? (
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.roles.some(r => r.name === 'admin') ? 'bg-red-50 text-red-600' :
                            u.roles.some(r => r.name === 'manager') ? 'bg-purple-50 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {u.roles.map(r => r.name === 'admin' ? 'admin' : r.name === 'manager' ? 'manager' : r.name).join(', ')}
                          </span>
                        ) : (
                          <span className="text-[#9ca3af]">user</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center text-xs text-[#6c6d7e]">{u.ankets_count}</td>
                      <td className="px-4 py-2.5 text-xs text-[#6c6d7e]">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => loginAsMutation.mutate(u.id)}
                            disabled={loginAsMutation.isPending}
                            className="px-2.5 py-1 text-xs font-bold text-[#7c3aed] bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors"
                            title="Войти под пользователем"
                          >
                            👤
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.last_page > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-1.5 rounded-lg font-bold text-[#3476f5] disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  ← Назад
                </button>
                <span className="text-[#6c6d7e]">
                  {data.current_page} из {data.last_page}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                  disabled={page >= data.last_page}
                  className="px-4 py-1.5 rounded-lg font-bold text-[#3476f5] disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Вперед →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
