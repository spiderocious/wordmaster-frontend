/**
 * Game Config Editor
 *
 * Allows host to edit game configuration in waiting room
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave } from '@icons';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { GameConfig } from '../../types/multiplayer-types';
import { AVAILABLE_CATEGORIES, DEFAULT_EXCLUDED_LETTERS } from '../../constants/game-config';
import { soundService } from '@shared/services/sound-service';

interface GameConfigEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameConfigEditor({ isOpen, onClose }: GameConfigEditorProps) {
  const { room, updateGameConfig, isHost } = useMultiplayer();

  const [roundsCount, setRoundsCount] = useState(room?.config.roundsCount || 4);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    room?.config.supportedCategories || AVAILABLE_CATEGORIES
  );
  const [excludedLetters, setExcludedLetters] = useState<string[]>(
    room?.config.excludedLetters || DEFAULT_EXCLUDED_LETTERS
  );

  if (!isHost) return null;

  function handleCategoryToggle(category: string) {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // Need at least 1 category
        if (prev.length === 1) {
          soundService.playError();
          return prev;
        }
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
    soundService.playButtonClick();
  }

  function handleSave() {
    const config: GameConfig = {
      roundsCount,
      supportedCategories: selectedCategories,
      excludedLetters,
    };

    updateGameConfig(config);
    soundService.playSuccess();
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-black text-gray-900">Game Settings</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-600 text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Rounds Count */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Number of Rounds
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={roundsCount}
                  onChange={(e) => setRoundsCount(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 font-semibold"
                />
                <p className="text-xs text-gray-500 mt-1">Choose between 1-10 rounds</p>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Categories ({selectedCategories.length} selected)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVAILABLE_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                        selectedCategories.includes(category)
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Select at least 1 category</p>
              </div>

              {/* Current Config Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-2">Current Configuration</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>Rounds: {roundsCount}</p>
                  <p>Categories: {selectedCategories.join(', ')}</p>
                  <p>Excluded Letters: {excludedLetters.length > 0 ? excludedLetters.join(', ') : 'None'}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FaSave />
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
