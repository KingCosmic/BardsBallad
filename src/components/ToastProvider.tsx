import React from 'react'

import Toast from './Toast'
import { removeToast, toastState } from '@state/toasts';

const ToastProvider: React.FC = () => {
  const toasts = toastState.useValue()

  return (
    <div className='fixed bottom-4 right-4 space-y-2 z-50'>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

export default ToastProvider;
