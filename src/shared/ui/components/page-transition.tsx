/**
 * Page Transition Wrapper
 *
 * Reusable component for consistent page transitions across game screens
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type TransitionDirection = 'left' | 'right' | 'up' | 'down';

interface PageTransitionProps {
  children: ReactNode;
  direction?: TransitionDirection;
  className?: string;
}

const directionVariants = {
  left: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  right: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  up: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
  },
  down: {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
  },
};

export function PageTransition({
  children,
  direction = 'right',
  className = '',
}: PageTransitionProps) {
  const variants = directionVariants[direction];

  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
