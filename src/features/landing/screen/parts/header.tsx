/**
 * Landing Page Header
 */

import { FaGamepad } from '@icons';

interface HeaderProps {
  onHowItWorksClick: () => void;
  onFeaturesClick: () => void;
  onRatingsClick: () => void;
  onPlayNowClick: () => void;
}

export function Header({
  onHowItWorksClick,
  onFeaturesClick,
  onRatingsClick,
  onPlayNowClick,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FaGamepad className="text-white text-xl" />
            </div>
            <span className="text-xl font-black text-gray-900">WordShot</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={onHowItWorksClick}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              How it Works
            </button>
            <button
              onClick={onFeaturesClick}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Features
            </button>
            <button
              onClick={onRatingsClick}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Ratings
            </button>
          </nav>
          <button
            onClick={onPlayNowClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
          >
            Play Now
          </button>
        </div>
      </div>
    </header>
  );
}
