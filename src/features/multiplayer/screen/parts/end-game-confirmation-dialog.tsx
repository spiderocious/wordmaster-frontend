/**
 * End Game Confirmation Dialog
 *
 * Modal dialog to confirm ending the game early
 */

import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTimes } from "@icons";
import { soundService } from "@shared/services/sound-service";

interface EndGameConfirmationDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function EndGameConfirmationDialog({
    isOpen,
    onConfirm,
    onCancel,
}: EndGameConfirmationDialogProps) {
    function handleConfirm() {
        soundService.playButtonClick();
        onConfirm();
    }

    function handleCancel() {
        soundService.playButtonClick();
        onCancel();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={handleCancel}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <FaExclamationTriangle className="text-red-600 text-2xl" />
                                <h2 className="text-xl font-black text-red-900">End Game?</h2>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="p-2 hover:bg-red-100 rounded-full transition-colors"
                            >
                                <FaTimes className="text-red-600 text-xl" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-700 text-base mb-2">
                                Are you sure you want to end the game?
                            </p>
                            <p className="text-gray-600 text-sm">
                                All progress will be lost and players will return to the lobby.
                                Scores will be reset.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                            >
                                End Game
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
