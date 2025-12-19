export interface PlayerCardProps {
  avatarUrl?: string;
  playerName: string;
  level: number;
  currentXP: number;
  maxXP: number;
}

export function PlayerCard({ avatarUrl, playerName, level, currentXP, maxXP }: PlayerCardProps) {
  const xpPercentage = (currentXP / maxXP) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={playerName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-2xl font-bold">{playerName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">{playerName}</h3>
          <p className="text-sm text-gray-600">Level {level}</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {currentXP} / {maxXP} XP
          </p>
        </div>
      </div>
    </div>
  );
}
