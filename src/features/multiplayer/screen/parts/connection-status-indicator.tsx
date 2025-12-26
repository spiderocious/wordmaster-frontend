/**
 * Connection Status Indicator
 *
 * Shows WebSocket connection status in corner of screen
 * with manual reconnect option
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '../../providers/websocket-provider';
import { FaRedo } from 'react-icons/fa';

export function ConnectionStatusIndicator() {
  const { isConnected, isReconnecting, reconnectAttempt, manualReconnect } = useWebSocket();

  // Determine status and styling
  const getStatus = () => {
    if (isConnected) {
      return {
        bg: 'bg-green-100',
        border: 'border-green-500',
        dot: 'bg-green-500',
        text: 'text-green-800',
        label: 'Connected',
        showButton: false,
      };
    }

    if (isReconnecting) {
      return {
        bg: 'bg-yellow-100',
        border: 'border-yellow-500',
        dot: 'bg-yellow-500',
        text: 'text-yellow-800',
        label: reconnectAttempt > 0 ? `Reconnecting (${reconnectAttempt})` : 'Reconnecting...',
        showButton: false,
      };
    }

    return {
      bg: 'bg-red-100',
      border: 'border-red-500',
      dot: 'bg-red-500',
      text: 'text-red-800',
      label: 'Disconnected',
      showButton: true,
    };
  };

  const status = getStatus();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border-2 ${status.bg} ${status.border}`}
        >
          {/* Status indicator dot */}
          <motion.div
            className={`w-3 h-3 rounded-full ${status.dot}`}
            animate={
              isConnected || isReconnecting
                ? {
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }
                : {}
            }
            transition={{
              duration: isReconnecting ? 0.8 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Status text */}
          <span className={`text-sm font-semibold ${status.text}`}>
            {status.label}
          </span>

          {/* Manual reconnect button */}
          <AnimatePresence>
            {status.showButton && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={manualReconnect}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                title="Reconnect"
              >
                <FaRedo className="text-xs" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
