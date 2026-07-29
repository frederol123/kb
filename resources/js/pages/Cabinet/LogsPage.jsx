import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const levelColors = {
  'local.ERROR': { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
  'local.CRITICAL': { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
  'local.ALERT': { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
  'local.WARNING': { bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
  'local.INFO': { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
  'local.DEBUG': { bg: '#f5f3ff', text: '#7c3aed', dot: '#8b5cf6' },
  'local.NOTICE': { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
};

const defaultColor = { bg: '#f9fafb', text: '#6b7280', dot: '#9ca3af' };

function LogEntry({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const color = levelColors[entry.level] || defaultColor;

  const isLong = entry.message.length > 200;
  const msg = !expanded && isLong
    ? entry.message.slice(0, 200) + '…'
    : entry.message;

  const hasTrace = entry.stacktrace && entry.stacktrace.trim().length > 0;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-3.5 hover:bg-gray-50 transition-colors flex items-start gap-3"
      >
        <span
          className="inline-block w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
          style={{ backgroundColor: color.dot }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <span className="text-xs text-[#6c6d7e] font-mono whitespace-nowrap">
              {entry.timestamp}
            </span>
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-bold font-mono"
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {entry.level.replace('local.', '')}
            </span>
            {hasTrace && (
              <span className="text-xs text-[#6c6d7e]">
                {expanded ? '▲ свернуть' : '▼ стек'}
              </span>
            )}
            {isLong && (
              <span className="text-xs text-[#6c6d7e]">
                {expanded ? '▲ свернуть' : '▼ все'}
              </span>
            )}
          </div>
          <div className="text-sm text-[#1c2145] leading-relaxed break-words font-mono text-[13px]">
            {msg}
          </div>
          {expanded && hasTrace && (
            <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-[#6c6d7e] overflow-x-auto leading-relaxed max-h-80 overflow-y-auto">
              {entry.stacktrace}
            </pre>
          )}
        </div>
      </button>
    </div>
  );
}

export default function LogsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const roles = user?.roles || [];
  const hasAccess = roles.includes('admin') || roles.includes('manager');

  if (!hasAccess) {
    return <Navigate to="/lk" replace />;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['manager-logs', page],
    queryFn: () => api.get(`/manager/logs?page=${page}&per_page=50`).then(r => r.data),
    placeholderData: (prev) => prev,
  });

  return (
    <div>
      <h1 className="font-extrabold text-2xl lg:text-3xl text-[#1c2145] mb-6">
        Логи приложения
      </h1>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-[#6c6d7e] p-6">Загрузка...</p>
        ) : isError ? (
          <p className="text-red-500 p-6">Ошибка загрузки логов</p>
        ) : data?.entries?.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[#6c6d7e]">Логов пока нет</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {data.entries.map((entry, i) => (
                <LogEntry key={i} entry={entry} />
              ))}
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

      <p className="text-xs text-[#6c6d7e] mt-3">
        Файл: storage/logs/laravel.log
      </p>
    </div>
  );
}
