import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ToastContext = createContext(null);

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const counterRef = useRef(0);

    const addToast = useCallback((message, type = 'success') => {
        const id = ++counterRef.current;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4500);
    }, []);

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
                {toasts.map(t => (
                    <ToastItem key={t.id} message={t.message} type={t.type} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ message, type }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-[#74D41D]';

    return (
        <div className={`pointer-events-auto rounded-2xl ${bgColor} text-white font-bold text-lg px-6 py-4 shadow-lg transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {message}
        </div>
    );
}
