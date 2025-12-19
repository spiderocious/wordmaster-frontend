export interface LevelIndicatorProps {
  avatarUrl?: string;
  playerName: string;
  level: number;
  currentXP: number;
  maxXP: number;
}

export function LevelIndicator({ avatarUrl, playerName, level, currentXP, maxXP }: LevelIndicatorProps) {
  const xpPercentage = (currentXP / maxXP) * 100;

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={playerName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-xl font-bold">{playerName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {level}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate">{playerName}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
