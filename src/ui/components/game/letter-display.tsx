export type LetterState = 'hidden' | 'revealed';

export interface LetterDisplayProps {
  letter: string;
  state?: LetterState;
}

export function LetterDisplay({ letter, state = 'hidden' }: LetterDisplayProps) {
  const baseStyles = 'w-32 h-32 rounded-2xl flex items-center justify-center text-6xl font-black shadow-lg transition-all duration-300';

  const stateStyles = {
    hidden: 'bg-success text-white',
    revealed: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
  };

  return (
    <div className={`${baseStyles} ${stateStyles[state]}`}>
      {state === 'revealed' ? letter : '?'}
    </div>
  );
}
