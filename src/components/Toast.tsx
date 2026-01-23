import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastContextType {
    showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

interface ToastState {
    message: string;
    visible: boolean;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<ToastState>({ message: '', visible: false });

    const showToast = useCallback((message: string, duration: number = 2500) => {
        setToast({ message, visible: true });
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div style={{
                    position: 'fixed',
                    bottom: 100,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#191f28',
                    color: '#fff',
                    padding: '14px 24px',
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    animation: 'fadeInUp 0.3s ease',
                    maxWidth: 'calc(100% - 48px)',
                    textAlign: 'center'
                }}>
                    {toast.message}
                </div>
            )}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
}
