/**
 * Mobile Waiting Room
 *
 * Mobile tabbed layout for the multiplayer lobby/waiting room
 * Implements Players/Settings/Chat tabs matching the mobile design
 */

import {
  FaArrowLeft,
  FaCheckCircle,
  FaCopy,
  FaCrown,
  FaEllipsisV,
  FaGamepad,
  FaLink,
  FaMinus,
  FaPaperPlane,
  FaPlus,
  FaShare,
  FaUserPlus,
} from "@icons";
import { soundService } from "@shared/services/sound-service";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AVAILABLE_CATEGORIES,
  DEFAULT_EXCLUDED_LETTERS,
  MAX_ROUNDS_COUNT,
  MIN_ROUNDS_COUNT,
} from "../../constants/game-config";
import { useMultiplayer } from "../../providers/multiplayer-provider";
import { GameConfig } from "../../types/multiplayer-types";
import { WaitingRoomProps } from "./waiting-room-screen";
import { useUsernameGuard } from "../../../../shared/hooks/use-username-guard";

type TabType = "players" | "settings" | "chat";

export function MobileWaitingRoom({
  room,
  isHost,
  playerCount,
  canStartGame,
  copyCodeSuccess,
  handleCopyCode,
  handleShareLink,
  handleStartGame,
  handleLeaveRoom,
  handleCopyLink,
  messages,
  sendChatMessage,
  showConfigUpdate,
  MAX_PLAYERS,
}: WaitingRoomProps) {
  const { updateGameConfig } = useMultiplayer();
  const [activeTab, setActiveTab] = useState<TabType>("players");
  const [chatInput, setChatInput] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastReadMessageCount, setLastReadMessageCount] = useState(0);

  // Settings state
  const [roundsCount, setRoundsCount] = useState(room?.config.roundsCount || 4);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    room?.config.supportedCategories || []
  );
  const [excludedLetters, setExcludedLetters] = useState<string[]>(
    room?.config.excludedLetters || DEFAULT_EXCLUDED_LETTERS
  );
  const saveTimeoutRef = useRef<number | null>(null);


  const { username } = useUsernameGuard();
  const currentPlayer = room?.players?.find((player: any) => player?.username === username);

  // Sync settings with room config when it updates from server
  useEffect(() => {
    if (room?.config) {
      setRoundsCount(room.config.roundsCount);
      setSelectedCategories(room.config.supportedCategories);
      setExcludedLetters(room.config.excludedLetters);
    }
  }, [room?.config]);

  // Track unread messages - update count when messages change or tab changes
  useEffect(() => {
    if (activeTab === "chat") {
      // Clear unread when viewing chat
      setUnreadMessages(0);
      setLastReadMessageCount(messages.length);
    } else {
      // Calculate unread when not viewing chat
      const newUnread = messages.length - lastReadMessageCount;
      setUnreadMessages(Math.max(0, newUnread));
    }
  }, [activeTab, messages.length, lastReadMessageCount]);

  // Throttled save function for settings
  const throttledSave = useCallback(
    (
      roundsCount: number,
      selectedCategories: string[],
      excludedLetters: string[]
    ) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for 2 seconds
      saveTimeoutRef.current = setTimeout(() => {
        // Validate
        if (roundsCount < MIN_ROUNDS_COUNT || roundsCount > MAX_ROUNDS_COUNT) {
          soundService.playError();
          return;
        }

        if (selectedCategories.length === 0) {
          soundService.playError();
          return;
        }

        const config: GameConfig = {
          roundsCount,
          supportedCategories: selectedCategories,
          excludedLetters,
        };

        updateGameConfig(config);
        soundService.playButtonClick();
      }, 2000);
    },
    [updateGameConfig]
  );

  function handleCategoryToggle(category: string) {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    soundService.playButtonClick();

    // Trigger throttled save
    throttledSave(roundsCount, newCategories, excludedLetters);
  }

  function handleRoundsChange(delta: number) {
    const newValue = roundsCount + delta;
    if (newValue < MIN_ROUNDS_COUNT || newValue > MAX_ROUNDS_COUNT) {
      return;
    }
    setRoundsCount(newValue);
    soundService.playButtonClick();

    // Trigger throttled save
    throttledSave(newValue, selectedCategories, excludedLetters);
  }

  function handleSendMessage() {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput("");
  }

  function formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 font-medium">Loading room...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4">
        <div className="flex items-center justify-between mb-1 mt-3">
          <button
            onClick={handleLeaveRoom}
            className="w-11 h-11 flex items-center justify-center"
          >
            <FaArrowLeft className="text-gray-700 text-xl" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Room Code
            </p>
            <p className="text-2xl font-black text-blue-600 tracking-widest">
              {room.joinCode}
            </p>
          </div>
          <button
            onClick={handleShareLink}
            className="w-11 h-11 flex items-center justify-center"
          >
            <FaShare className="text-blue-600 text-xl" />
          </button>
        </div>

        <div className="flex flex-row gap-2 mb-2">
          <button
            onClick={handleCopyCode}
            className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaCopy className="text-sm" />
            <span className="text-sm">
              {copyCodeSuccess ? "Copied!" : "Copy Code"}
            </span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaLink className="text-sm" />
            <span className="text-sm">Copy Room Link</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab("players")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${
              activeTab === "players"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Players ({playerCount})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors relative ${
              activeTab === "settings"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Settings
            {showConfigUpdate && activeTab !== "settings" && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors relative ${
              activeTab === "chat"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Chat
            {activeTab !== "chat" && (
              <>
                {unreadMessages > 0 ? (
                  <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-1">
                    <span className="text-white text-[10px] font-bold">
                      {unreadMessages > 99 ? '99+' : unreadMessages}
                    </span>
                  </div>
                ) : (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Players Tab */}
        {activeTab === "players" && (
          <div className="p-4 space-y-3">
            {room.players?.map((player: any, index: number) => {
              const isHostPlayer = player.role === "host";
              const isCurrentUser = player.username === currentPlayer?.username;

              return (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl p-4 shadow-sm ${
                    isHostPlayer ? "border-2 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar with badge */}
                    <div className="relative">
                      {isHostPlayer && (
                        <div className="absolute -top-1 -left-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center">
                          <FaCrown className="text-xs text-yellow-900" />
                        </div>
                      )}
                    </div>

                    {/* Player info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {isCurrentUser
                            ? `${player.username} (You)`
                            : player.username}
                        </h3>
                        {isHostPlayer && (
                          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded uppercase">
                            HOST
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          player.status === "active"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {player.status === "active"
                          ? "Ready to start"
                          : "Waiting..."}
                      </p>
                    </div>

                    {/* Status indicator */}
                    {player.status === "active" ? (
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="text-green-600 text-xl" />
                      </div>
                    ) : (
                      <button className="w-11 h-11 flex items-center justify-center">
                        <FaEllipsisV className="text-gray-400" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Empty slots */}
            {playerCount < MAX_PLAYERS &&
              [...Array(MAX_PLAYERS - playerCount)].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-white rounded-2xl p-4 border-2 border-dashed border-gray-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaUserPlus className="text-3xl text-gray-300" />
                    </div>
                    <p className="text-gray-400 italic">
                      Waiting for player...
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="p-4 space-y-6">
            {/* Game Configuration */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Game Configuration
              </h3>

              {/* Rounds Selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Rounds
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleRoundsChange(-1)}
                    disabled={!isHost || roundsCount <= MIN_ROUNDS_COUNT}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isHost && roundsCount > MIN_ROUNDS_COUNT
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <FaMinus className="text-lg" />
                  </button>

                  <div className="flex-1 bg-gray-100 rounded-xl py-3 text-center">
                    <p className="text-3xl font-black text-gray-900">
                      {roundsCount}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRoundsChange(1)}
                    disabled={!isHost || roundsCount >= MAX_ROUNDS_COUNT}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isHost && roundsCount < MAX_ROUNDS_COUNT
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <FaPlus className="text-lg" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {MIN_ROUNDS_COUNT}-{MAX_ROUNDS_COUNT} rounds available
                </p>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categories ({selectedCategories.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_CATEGORIES.map((category) => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                      <button
                        key={category}
                        onClick={() => isHost && handleCategoryToggle(category)}
                        disabled={!isHost}
                        className={`px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                          isSelected
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-gray-100 text-gray-700"
                        } ${isHost ? "hover:opacity-80" : "cursor-default"}`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Select at least 3 categories to start
                </p>
              </div>
            </div>

            {/* Game Summary Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                Game Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rounds:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {roundsCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Categories:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedCategories.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Players:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {playerCount}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-sm text-gray-600">Est. Duration:</span>
                  <span className="text-sm font-bold text-blue-600">
                    ~{roundsCount * 2} min
                  </span>
                </div>
              </div>
            </div>

            {/* Host Info / Non-host Notice */}
            {!isHost && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
                <p className="text-yellow-900 font-semibold text-sm">
                  Host Controls Only
                </p>
                <p className="text-yellow-700 text-xs mt-1">
                  Only the host can change game settings
                </p>
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="h-full flex flex-col bg-gray-50">
            {/* Messages area */}
            <div className="flex-1 p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400 text-sm">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg: any, index: number) => {
                  const isOwnMessage = msg.username === currentPlayer?.username;
                  console.log(msg, isOwnMessage, msg.username, currentPlayer?.username);
                  const senderIsHost =
                    room.players?.find((p: any) => p.username === msg.username)
                      ?.role === "host";

                  return (
                    <div key={`${msg.messageId}-${index}`}>
                      {index === 0 && (
                        <p className="text-center text-xs text-gray-400 mb-4">
                          Today {formatTime(msg.timestamp)}
                        </p>
                      )}

                      <div
                        className={`flex gap-2 ${
                          isOwnMessage ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                    

                        <div
                          className={`flex-1 ${
                            isOwnMessage ? "items-end" : "items-start"
                          } flex flex-col`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            {senderIsHost && !isOwnMessage && (
                              <FaCrown className="text-xs text-yellow-500" />
                            )}
                            <span className="text-xs font-semibold text-gray-600 uppercase">
                              {isOwnMessage ? "You" : msg.username}
                            </span>
                          </div>

                          <div
                            className={`px-4 py-2 rounded-2xl max-w-[85%] ${
                              isOwnMessage
                                ? "bg-blue-500 text-white"
                                : senderIsHost
                                ? "bg-yellow-50 border border-yellow-300"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>

                          {isOwnMessage && (
                            <p className="text-xs text-gray-400 mt-1">
                              Read {formatTime(msg.timestamp)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Button / Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        {activeTab === "chat" ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Say something..."
                className="w-full h-11 px-4 pr-12 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                chatInput.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <FaPaperPlane className="text-lg" />
            </button>
          </div>
        ) : activeTab === "players" ? (
          isHost ? (
            <button
              onClick={handleStartGame}
              disabled={!canStartGame}
              className={`w-full h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                canStartGame
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <FaGamepad />
              Start Game
            </button>
          ) : (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
              <p className="text-blue-900 font-semibold">Waiting for host...</p>
              <p className="text-blue-700 text-sm">
                The host will start the game when ready
              </p>
            </div>
          )
        ) : (
          <button
            onClick={handleCopyCode}
            className="w-full h-14 bg-white border-2 border-blue-500 text-blue-500 rounded-full font-semibold flex items-center justify-center gap-2"
          >
            <FaCopy />
            {copyCodeSuccess ? "Copied!" : "Copy Room Code"}
          </button>
        )}
      </div>
    </div>
  );
}
