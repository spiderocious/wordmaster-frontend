import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

export type IconButtonVariant = 'settings' | 'close' | 'back' | 'menu';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'settings', icon, className = '', ...props }, ref) => {
    const baseStyles = 'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95';

    const variantStyles = {
      settings: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      close: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      back: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      menu: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
