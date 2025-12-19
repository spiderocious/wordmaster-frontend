export interface ScoreDisplayProps {
  score: number;
  label?: string;
}

export function ScoreDisplay({ score, label = 'Score' }: ScoreDisplayProps) {
  return (
    <div className="bg-white rounded-xl px-6 py-3 shadow-md">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-blue-600">{score}</p>
    </div>
  );
}
