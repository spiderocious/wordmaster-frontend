import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

export type ActionButtonVariant = 'hint' | 'skip' | 'submit';

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ActionButtonVariant;
  icon?: ReactNode;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ variant, icon, className = '', children, ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-6 text-base h-[40px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    const variantStyles = {
      hint: 'bg-warning text-gray-900 hover:opacity-90',
      skip: 'bg-gray-400 text-white hover:bg-gray-500',
      submit: 'bg-success text-white hover:opacity-90',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        style={{ maxHeight: '48px' }}
        {...props}
      >
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </button>
    );
  }
);

ActionButton.displayName = 'ActionButton';
