import { ReactNode } from 'react';

export type BadgeState = 'locked' | 'unlocked' | 'special';

export interface BadgeProps {
  icon: ReactNode;
  label: string;
  state?: BadgeState;
}

export function Badge({ icon, label, state = 'locked' }: BadgeProps) {
  const baseStyles = 'rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200';

  const stateStyles = {
    locked: 'bg-gray-100 opacity-40',
    unlocked: 'bg-white border-2 border-blue-200 shadow-md',
    special: 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400 shadow-lg',
  };

  return (
    <div className={`${baseStyles} ${stateStyles[state]}`}>
      <div className={`text-5xl ${state === 'locked' ? 'grayscale' : ''}`}>
        {icon}
      </div>
      <span className={`font-semibold text-sm text-center ${state === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>
        {label}
      </span>
    </div>
  );
}
