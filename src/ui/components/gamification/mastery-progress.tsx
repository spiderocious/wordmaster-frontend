export interface MasteryProgressProps {
  category: string;
  currentProgress: number;
  maxProgress: number;
}

export function MasteryProgress({ category, currentProgress, maxProgress }: MasteryProgressProps) {
  const progressPercentage = (currentProgress / maxProgress) * 100;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-base text-gray-900">{category}</h4>
        <span className="text-sm text-gray-600">
          {currentProgress} / {maxProgress}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-300 bg-primary"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>
    </div>
  );
}
