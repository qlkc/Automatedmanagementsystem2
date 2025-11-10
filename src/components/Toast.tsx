import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const styles = {
    success: 'bg-[#2EA44F] text-white',
    error: 'bg-[#E02424] text-white',
    info: 'bg-[#F5D000] text-[#1B1B1B]'
  };
  
  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />
  };
  
  return (
    <div className={`w-80 p-4 rounded-lg shadow-lg flex items-center gap-3 ${styles[type]}`}>
      {icons[type]}
      <span className="flex-1 text-body">{message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }: { 
  toasts: Array<{ id: string; type: ToastType; message: string }>; 
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col gap-3">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
