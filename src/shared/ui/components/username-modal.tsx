/**
 * Username Modal
 *
 * Beautiful modal for username selection with validation
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCheck, FaSpinner, FaTimes } from '@icons';
import { TextInput } from '@ui/components';
import { useUsernameValidation } from '@shared/hooks/use-username-validation';

interface UsernameModalProps {
  isOpen: boolean;
  onSubmit: (username: string) => void;
  onClose?: () => void;
}

export function UsernameModal({ isOpen, onSubmit, onClose }: UsernameModalProps) {
  const [username, setUsername] = useState('');
  const { isChecking, isAvailable, error } = useUsernameValidation(username);

  const canSubmit = username.trim().length >= 3 && isAvailable === true && !isChecking;

  function handleSubmit() {
    if (canSubmit) {
      onSubmit(username.trim());
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && canSubmit) {
      handleSubmit();
    }
  }

  const getInputState = (): 'default' | 'error' | 'success' => {
    if (error) return 'error';
    if (isAvailable === true) return 'success';
    return 'default';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            )}

            {/* Icon */}
            <motion.div
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <FaUser className="text-3xl text-blue-600" />
            </motion.div>

            {/* Title */}
            <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">
              Choose Your Username
            </h2>
            <p className="text-gray-600 mb-8 text-center text-lg">
              Pick a unique name to play with friends
            </p>

            {/* Input */}
            <div className="mb-6">
              <div className="relative">
                <TextInput
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter username..."
                  state={getInputState()}
                  errorMessage={error || undefined}
                  successMessage={isAvailable === true ? 'Username available!' : undefined}
                  autoFocus
                  maxLength={20}
                  className="pr-12"
                />

                {/* Status Icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                  {isChecking && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <FaSpinner className="text-blue-600 text-lg" />
                    </motion.div>
                  )}
                  {!isChecking && isAvailable === true && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <FaCheck className="text-green-600 text-lg" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Character counter */}
              <div className="flex justify-between items-center mt-2 px-1">
                <p className="text-sm text-gray-500">
                  {username.length > 0 ? `${username.length}/20 characters` : 'Minimum 3 characters'}
                </p>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">Username Guidelines:</p>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  At least 3 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  Must be unique
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">•</span>
                  Be creative and memorable!
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                canSubmit
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={canSubmit ? { scale: 1.02 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
            >
              {isChecking ? 'Checking...' : 'Continue'}
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
