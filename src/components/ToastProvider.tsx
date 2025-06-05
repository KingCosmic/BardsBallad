import React, { createContext, PropsWithChildren, useCallback, useState } from 'react';

import { ToastContext } from '@hooks/useToast';
import Toast from './Toast';

import { v4 as uuid } from "uuid";

const ToastProvider: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [toasts, setToasts] = useState<any[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = useCallback((message: string, type = "success", duration = 3000) => {
    const id = uuid();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => removeToast(id), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
