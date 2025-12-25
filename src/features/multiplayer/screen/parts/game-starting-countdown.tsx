/**
 * Game Starting Countdown
 *
 * Shows 3-2-1 countdown before game starts
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { soundService } from '@shared/services/sound-service';

interface GameStartingCountdownProps {
  onComplete: () => void;
}

export function GameStartingCountdown({ onComplete }: GameStartingCountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    soundService.playRoundStart();

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 0;
        }
        soundService.playButtonClick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (count === 0) {
    return (
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center z-50"
        initial={{ scale: 1 }}
        animate={{ scale: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-9xl font-black text-white"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5 }}
        >
          GO!
        </motion.h1>
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center z-50">
      <motion.div
        key={count}
        className="text-[20rem] font-black text-white"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
      >
        {count}
      </motion.div>
    </div>
  );
}
