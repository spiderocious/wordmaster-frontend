import { ReactNode } from 'react';

export type CategoryCardState = 'default' | 'selected' | 'locked';

export interface CategoryCardProps {
  icon: ReactNode;
  label: string;
  state?: CategoryCardState;
  onClick?: () => void;
}

export function CategoryCard({ icon, label, state = 'default', onClick }: CategoryCardProps) {
  const baseStyles = 'rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer';

  const stateStyles = {
    default: 'bg-white border-2 border-gray-200 hover:border-gray-300 active:scale-95',
    selected: 'bg-primary/10 border-2 border-primary shadow-lg',
    locked: 'bg-gray-100 border-2 border-gray-200 opacity-50 cursor-not-allowed',
  };

  return (
    <div
      className={`${baseStyles} ${stateStyles[state]}`}
      onClick={state !== 'locked' ? onClick : undefined}
    >
      <div className={`text-4xl ${state === 'selected' ? 'text-primary' : 'text-gray-700'}`}>
        {icon}
      </div>
      <span className={`font-semibold text-base ${state === 'selected' ? 'text-primary' : 'text-gray-800'}`}>
        {label}
      </span>
    </div>
  );
}
