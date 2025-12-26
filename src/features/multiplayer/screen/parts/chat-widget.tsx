/**
 * Chat Widget
 *
 * Real-time chat component for multiplayer games
 * Side panel on desktop, floating widget on mobile
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaTimes, FaPaperPlane, FaChevronDown } from '@icons';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { soundService } from '@shared/services/sound-service';

interface ChatWidgetProps {
    isSidePanel?: boolean; // true for desktop side panel, false for mobile floating
}

export function ChatWidget({ isSidePanel = false }: ChatWidgetProps) {
    const { messages, sendChatMessage, currentPlayer } = useMultiplayer();
    const [isOpen, setIsOpen] = useState(isSidePanel); // Side panel always open
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const maxChars = 500;
    const remainingChars = maxChars - message.length;

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Play sound on new message (if not from current user)
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage?.username && lastMessage.username !== currentPlayer?.username) {
                soundService.playButtonClick();
            }
        }
    }, [messages, currentPlayer]);

    // Focus input when opening
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    function handleToggle() {
        if (!isSidePanel) {
            setIsOpen(!isOpen);
            soundService.playButtonClick();
        }
    }

    function handleSend() {
        if (!message.trim()) return;

        sendChatMessage(message);
        setMessage('');
        soundService.playSuccess();
    }

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    function formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Side panel layout (desktop)
    if (isSidePanel) {
        return (
            <div className="bg-white rounded-2xl border-2 border-gray-200 h-full flex flex-col overflow-hidden shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaComment />
                        <h3 className="font-bold">Chat</h3>
                        {messages.length > 0 && (
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                {messages.length}
                            </span>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-gray-400 text-sm text-center">
                                No messages yet.<br />Start the conversation!
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            if (!msg?.username) return null; // Safety check
                            const isOwnMessage = msg.username === currentPlayer?.username;
                            return (
                                <motion.div
                                    key={`${msg.messageId}-${index}`}
                                    initial={{ opacity: 0, x: isOwnMessage ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {msg.username[0]?.toUpperCase() || '?'}
                                    </div>

                                    {/* Message bubble */}
                                    <div className={`flex-1 ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-semibold ${isOwnMessage ? 'text-blue-600' : 'text-gray-700'}`}>
                                                {isOwnMessage ? 'You' : msg.username}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        </div>
                                        <div
                                            className={`px-3 py-2 rounded-2xl max-w-[85%] break-words ${isOwnMessage
                                                ? 'bg-blue-600 text-white rounded-br-sm'
                                                : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.message}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-3 bg-white">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                            maxLength={maxChars}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${message.trim()
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <FaPaperPlane className="text-sm" />
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-1 px-1">
                        <p className="text-xs text-gray-400">Press Enter to send</p>
                        <p className={`text-xs font-medium ${remainingChars < 50 ? 'text-red-500' : 'text-gray-400'}`}>
                            {remainingChars}/{maxChars}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Floating widget layout (mobile) - positioned 20% higher
    return (
        <div className="fixed bottom-24 right-4 z-40">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 w-80 h-96 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaComment />
                                <h3 className="font-bold">Chat</h3>
                                {messages.length > 0 && (
                                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                        {messages.length}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleToggle}
                                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                            >
                                <FaChevronDown />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-gray-400 text-sm text-center">
                                        No messages yet.<br />Start the conversation!
                                    </p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    if (!msg?.username) return null; // Safety check
                                    const isOwnMessage = msg.username === currentPlayer?.username;
                                    return (
                                        <motion.div
                                            key={`${msg.messageId}-${index}`}
                                            initial={{ opacity: 0, x: isOwnMessage ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            {/* Avatar */}
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {msg.username[0]?.toUpperCase() || '?'}
                                            </div>

                                            {/* Message bubble */}
                                            <div className={`flex-1 ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs font-semibold ${isOwnMessage ? 'text-blue-600' : 'text-gray-700'}`}>
                                                        {isOwnMessage ? 'You' : msg.username}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {formatTime(msg.timestamp)}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`px-3 py-2 rounded-2xl max-w-[85%] break-words ${isOwnMessage
                                                        ? 'bg-blue-600 text-white rounded-br-sm'
                                                        : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.message}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="border-t border-gray-200 p-3 bg-white">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                                    maxLength={maxChars}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!message.trim()}
                                    className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${message.trim()
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <FaPaperPlane className="text-sm" />
                                </button>
                            </div>
                            <div className="flex justify-between items-center mt-1 px-1">
                                <p className="text-xs text-gray-400">Press Enter to send</p>
                                <p className={`text-xs font-medium ${remainingChars < 50 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {remainingChars}/{maxChars}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle button */}
            <motion.button
                onClick={handleToggle}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <FaTimes className="text-xl" /> : <FaComment className="text-xl" />}
                {!isOpen && messages.length > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    >
                        {messages.length > 9 ? '9+' : messages.length}
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
}
