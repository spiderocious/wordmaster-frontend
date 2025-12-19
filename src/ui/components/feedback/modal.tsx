import { ReactNode } from 'react';

export interface ModalProps {
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  children?: ReactNode;
}

export function Modal({
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  children,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-up">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-base text-gray-700 mb-6">{message}</p>

        {children}

        <div className="flex gap-3 mt-6">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-6 text-base bg-white text-gray-800 border-2 border-gray-300 hover:border-gray-400 active:scale-95 h-[48px]"
              style={{ maxHeight: '48px' }}
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="flex-1 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-6 text-base bg-primary text-white hover:opacity-90 active:scale-95 h-[48px]"
              style={{ maxHeight: '48px' }}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
