import { FaFire } from '@icons';

export interface StreakDisplayProps {
  streak: number;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div className="bg-white rounded-xl px-6 py-3 shadow-md">
      <p className="text-sm text-gray-600 mb-1">Streak</p>
      <div className="flex items-center gap-2">
        <p className="text-3xl font-bold text-orange-500">{streak}</p>
        <FaFire className="text-2xl text-orange-500" />
      </div>
    </div>
  );
}
