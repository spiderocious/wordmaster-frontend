/**
 * Multiplayer Round Start Screen
 *
 * Shows round number and transitions to answering
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { PageTransition } from '@shared/ui/components/page-transition';
import { soundService } from '@shared/services/sound-service';
import Confetti from 'react-confetti';

export function MPRoundStartScreen() {
  const { room } = useMultiplayer();

  const currentRound = room?.currentRound || 1;
  const totalRounds = room?.totalRounds || room?.config.roundsCount || 4;

  useEffect(() => {
    const stopSound = soundService.playRoundStart();
    return () => stopSound();
  }, []);

  return (
    <PageTransition direction="up" className="h-screen w-full">
      <div className="h-screen w-full bg-gray-50 flex flex-col items-center justify-center px-4 overflow-hidden relative">
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={150}
          recycle={true}
          gravity={0.3}
        />

        <div className="text-center z-10">
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
              delay: 0.2,
            }}
          >
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-6xl font-black text-gray-900">
                Round
              </span>
              <span className="text-6xl font-black text-blue-600">
                {currentRound}
              </span>
            </div>
            <p className="text-gray-500 text-xl font-medium mt-2">
              of {totalRounds}
            </p>
          </motion.div>

          <motion.div
            className="flex gap-3 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {[...Array(totalRounds)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  delay: 0.5 + index * 0.1,
                }}
                className={`w-4 h-4 rounded-full ${
                  index < currentRound
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
