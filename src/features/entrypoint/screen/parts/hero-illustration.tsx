import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Hero Illustration - Letter Storm
 *
 * A dynamic, gamified illustration featuring scattered animated letters
 * forming a word game theme
 */
export function HeroIllustration() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const centerLetters = ['W', 'O', 'R'];
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  
  
  const updateLetter = () => {
    setCurrentLetterIndex((prevIndex: number) => (prevIndex + 1) % letters.length);
    setTimeout(() => updateLetter(), 200);
  }

  useEffect(() => {
    updateLetter();
  }, []); 

  return (
    <div className="relative w-full max-w-2xl h-40 mx-auto mb-12">
      {/* Background scattered letters */}
      <div className="absolute inset-0">
        {letters.map((letter, i) => {
          const angle = (i / letters.length) * 2 * Math.PI;
          const radius = 120 + Math.random() * 80;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 text-4xl font-black"
              style={{
                x: x,
                y: y,
                color: `hsl(${i * 14}, 70%, 60%)`,
                opacity: 0.3,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.1,
              }}
            >
              {letter}
            </motion.div>
          );
        })}
      </div>

      {/* Center word "WORDS" with dynamic effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-3">
          {centerLetters.map((_, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ y: -100, opacity: 0, rotateX: -90 }}
              animate={{
                y: 0,
                opacity: 1,
                rotateX: 0,
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
                type: 'spring',
                stiffness: 200,
              }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 blur-xl"
                style={{
                  background: `linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />

              {/* Letter */}
              <motion.div
                className="relative text-8xl font-black bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              >
                {letters[(currentLetterIndex + i) % letters.length]}
              </motion.div>

              {/* Sparkle particles */}
              {[...Array(3)].map((_, j) => (
                <motion.div
                  key={j}
                  className="absolute w-2 h-2 bg-white"
                  style={{
                    left: `${50 + Math.random() * 20}%`,
                    top: `${Math.random() * 100}%`,
                    borderRadius: '50%',
                  }}
                  animate={{
                    y: [-20, -60],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2 + j * 0.3,
                  }}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating letter particles around */}
      {[...Array(12)].map((_, i) => {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute text-2xl font-bold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            {randomLetter}
          </motion.div>
        );
      })}

      {/* Energy waves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-blue-400"
          style={{
            width: 100 + i * 80,
            height: 100 + i * 80,
            borderRadius: '50%',
          }}
          animate={{
            scale: [1, 2.5],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
