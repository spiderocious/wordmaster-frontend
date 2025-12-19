import { ReactNode } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle } from '@icons';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  variant: ToastVariant;
  message: string;
  onClose?: () => void;
}

export function Toast({ variant, message, onClose }: ToastProps) {
  const variantConfig: Record<ToastVariant, { bgClass: string; icon: ReactNode }> = {
    success: {
      bgClass: 'bg-success',
      icon: <FaCheckCircle />,
    },
    error: {
      bgClass: 'bg-error',
      icon: <FaExclamationCircle />,
    },
    warning: {
      bgClass: 'bg-warning',
      icon: <FaExclamationTriangle />,
    },
    info: {
      bgClass: 'bg-primary',
      icon: <FaInfoCircle />,
    },
  };

  const config = variantConfig[variant];

  return (
    <div
      className={`rounded-xl px-5 py-4 shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slide-up ${config.bgClass}`}
    >
      <div className="text-2xl text-white">{config.icon}</div>
      <p className="flex-1 text-white font-medium text-base">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-white hover:opacity-80 transition-opacity text-xl"
        >
          ×
        </button>
      )}
    </div>
  );
}
