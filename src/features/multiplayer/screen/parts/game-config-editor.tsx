/**
 * Game Config Editor
 *
 * Inline component for host to edit game configuration in waiting room
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "@icons";
import { useMultiplayer } from "../../providers/multiplayer-provider";
import { GameConfig } from "../../types/multiplayer-types";
import {
  AVAILABLE_CATEGORIES,
  DEFAULT_EXCLUDED_LETTERS,
  MIN_ROUNDS_COUNT,
  MAX_ROUNDS_COUNT,
} from "../../constants/game-config";
import { soundService } from "@shared/services/sound-service";

export function GameConfigEditor() {
  const { room, updateGameConfig, isHost } = useMultiplayer();

  const [roundsCount, setRoundsCount] = useState(room?.config.roundsCount || 4);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    room?.config.supportedCategories || []
  );
  const [excludedLetters, setExcludedLetters] = useState<string[]>(
    room?.config.excludedLetters || DEFAULT_EXCLUDED_LETTERS
  );
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);

  // Sync with room config when it updates from server
  useEffect(() => {
    if (room?.config) {
      setRoundsCount(room.config.roundsCount);
      setSelectedCategories(room.config.supportedCategories);
      setExcludedLetters(room.config.excludedLetters);
    }
  }, [room?.config]);

  // Memoized throttled save function
  const throttledSave = useCallback((roundsCount: number, selectedCategories: string[], excludedLetters: string[]) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for 2 seconds
    saveTimeoutRef.current = setTimeout(() => {
      // Validate
      if (roundsCount < MIN_ROUNDS_COUNT || roundsCount > MAX_ROUNDS_COUNT) {
        soundService.playError();
        return;
      }

      if (selectedCategories.length === 0) {
        soundService.playError();
        return;
      }

      const config: GameConfig = {
        roundsCount,
        supportedCategories: selectedCategories,
        excludedLetters,
      };

      //console.log(config);

      updateGameConfig(config);
      soundService.playButtonClick();

      // Show success message
      setShowSaveSuccess(true);
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);
    }, 2000);
  }, [roundsCount, selectedCategories, excludedLetters, updateGameConfig]);

  if (!isHost) return null;

  function handleCategoryToggle(category: string) {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    soundService.playButtonClick();

    // Trigger throttled save
    throttledSave(roundsCount, newCategories, excludedLetters);
  }

  function handleRoundsChange(value: number) {

    setRoundsCount(value);
    // Trigger throttled save
    if (!value || value < MIN_ROUNDS_COUNT || value > MAX_ROUNDS_COUNT || isNaN(value)) {
      return;
    }
    throttledSave(value, selectedCategories, excludedLetters);
  }



  return (
    <div className="space-y-4">
      {/* Success Message */}
      {showSaveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-50 border-2 border-green-200 rounded-xl p-3 flex items-center gap-2"
        >
          <FaCheck className="text-green-600" />
          <p className="text-green-800 text-sm font-semibold">
            Settings saved successfully!
          </p>
        </motion.div>
      )}

      {/* Rounds Count */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Number of Rounds
        </label>
        <input
          type="number"
          min={0}
          max={MAX_ROUNDS_COUNT}
          value={roundsCount?.toString()}
          onChange={(e) => handleRoundsChange(parseInt((e.target as any).value))}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 font-semibold"
        />
        <p className="text-xs text-gray-500 mt-1">
          Choose between {MIN_ROUNDS_COUNT}-{MAX_ROUNDS_COUNT} rounds
        </p>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Categories ({selectedCategories.length} selected)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AVAILABLE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${selectedCategories.includes(category)
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Select at least 3 category</p>
      </div>

      {/* Auto-save indicator */}
      <p className="text-xs text-gray-400 italic">
        Changes auto-save after 2 seconds
      </p>
    </div>
  );
}
