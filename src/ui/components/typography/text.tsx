import { HTMLAttributes, ReactNode } from 'react';

export type TextVariant = 'body' | 'small' | 'caption';

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  children: ReactNode;
}

export function Text({ variant = 'body', children, className = '', ...props }: TextProps) {
  const styles = {
    body: 'text-base text-gray-700',
    small: 'text-sm text-gray-600',
    caption: 'text-xs text-gray-500',
  };

  return (
    <p className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </p>
  );
}
