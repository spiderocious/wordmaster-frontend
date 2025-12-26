/**
 * Connection Status Indicator
 *
 * Shows WebSocket connection status in corner of screen
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '../../providers/websocket-provider';

export function ConnectionStatusIndicator() {
  const { isConnected } = useWebSocket();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
            isConnected
              ? 'bg-green-100 border-2 border-green-500'
              : 'bg-red-100 border-2 border-red-500'
          }`}
        >
          {/* Status indicator dot */}
          <motion.div
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
            animate={
              isConnected
                ? {
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Status text */}
          <span
            className={`text-sm font-semibold ${
              isConnected ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
