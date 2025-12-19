import { ReactNode } from 'react';

export interface TopNavProps {
  title: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
}

export function TopNav({ title, leftAction, rightAction }: TopNavProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="w-10">{leftAction}</div>
        <h1 className="text-xl font-bold text-gray-900 text-center flex-1">{title}</h1>
        <div className="w-10">{rightAction}</div>
      </div>
    </nav>
  );
}
