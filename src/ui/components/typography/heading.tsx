import { HTMLAttributes, ReactNode } from 'react';

export type HeadingLevel = 1 | 2 | 3;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  children: ReactNode;
}

export function Heading({ level, children, className = '', ...props }: HeadingProps) {
  const styles = {
    1: 'text-4xl font-bold text-gray-900',
    2: 'text-3xl font-bold text-gray-900',
    3: 'text-2xl font-semibold text-gray-900',
  };

  const combinedClassName = `${styles[level]} ${className}`;

  switch (level) {
    case 1:
      return (
        <h1 className={combinedClassName} {...props}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className={combinedClassName} {...props}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 className={combinedClassName} {...props}>
          {children}
        </h3>
      );
  }
}
