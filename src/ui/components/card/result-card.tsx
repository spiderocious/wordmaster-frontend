import { FaFire } from '@icons';

export interface ResultCardProps {
  score: number;
  streak: number;
  onNextRound?: () => void;
}

export function ResultCard({ score, streak, onNextRound }: ResultCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Round Complete!</h2>

      <div className="flex justify-center gap-8 mb-8">
        <div>
          <p className="text-sm text-gray-600 mb-1">Score</p>
          <p className="text-4xl font-bold text-blue-600">{score}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Streak</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-4xl font-bold text-orange-500">{streak}</p>
            <FaFire className="text-3xl text-orange-500" />
          </div>
        </div>
      </div>

      {onNextRound && (
        <button
          onClick={onNextRound}
          className="w-full font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 px-8 text-lg bg-blue-600 text-white hover:opacity-90 active:scale-95"
          style={{ height: '48px', maxHeight: '48px' }}
        >
          Next Round
        </button>
      )}
    </div>
  );
}
