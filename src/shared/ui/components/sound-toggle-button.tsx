/**
 * Sound Toggle Button
 *
 * Floating button in bottom-right corner to mute/unmute game sounds
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { soundService } from '@shared/services/sound-service';

export function SoundToggleButton() {
  const [isMuted, setIsMuted] = useState(soundService.getMuted());

  useEffect(() => {
    const unsubscribe = soundService.subscribe((muted) => {
      setIsMuted(muted);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function handleToggle() {
    soundService.toggleMute();
    if (isMuted) {
      setTimeout(() => soundService.playButtonClick(), 100);
    }
  }

  return (
    <motion.button
      onClick={handleToggle}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-colors"
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
      title={isMuted ? 'Unmute sound' : 'Mute sound'}
    >
      {isMuted ? (
        <FaVolumeMute className="text-xl" />
      ) : (
        <FaVolumeUp className="text-xl" />
      )}
    </motion.button>
  );
}
