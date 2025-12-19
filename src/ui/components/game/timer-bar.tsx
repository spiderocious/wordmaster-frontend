export type TimerState = 'normal' | 'warning' | 'critical';

export interface TimerBarProps {
  percentage: number;
  state?: TimerState;
}

export function TimerBar({ percentage, state = 'normal' }: TimerBarProps) {
  const stateStyles = {
    normal: 'bg-primary',
    warning: 'bg-warning',
    critical: 'bg-error',
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ease-linear ${stateStyles[state]}`}
        style={{
          width: `${Math.max(0, Math.min(100, percentage))}%`,
        }}
      />
    </div>
  );
}
