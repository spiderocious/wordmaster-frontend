import { ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', fullWidth = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-primary text-white hover:opacity-90 active:scale-95',
      secondary: 'bg-white text-gray-800 border-2 border-gray-300 hover:border-gray-400 active:scale-95',
    };

    const sizeStyles = {
      small: 'px-4 text-sm h-[36px]',
      medium: 'px-6 text-base h-[40px]',
      large: 'px-8 text-lg h-[48px]',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        style={{ maxHeight: '48px' }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
