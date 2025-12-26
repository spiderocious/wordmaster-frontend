/**
 * Three Panel Desktop Waiting Room
 *
 * Beautiful 3-column layout: Players | Settings | Chat
 * Matches the Stitch-generated design
 */

import {
  FaCheckCircle,
  FaClock,
  FaCopy,
  FaGamepad,
  FaLink,
  FaPaperPlane,
  FaShare,
  FaUserPlus,
  FaUsers
} from "@icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { getAvatarUrl } from "../../constants/game-config";
import { GameConfigEditor } from "./game-config-editor";
import { WaitingRoomProps } from "./waiting-room-screen";


export function ThreePanelDesktopWaitingRoom({
  room,
  isHost,
  error,
  playerCount,
  onlinePlayerCount,
  canStartGame,
  copyCodeSuccess,
  copyLinkSuccess,
  isUpdatingConfig,
  handleCopyCode,
  handleCopyLink,
  handleShareLink,
  handleStartGame,
  handleLeaveRoom,
  messages,
  sendChatMessage,
  MIN_PLAYERS,
  MAX_PLAYERS,
}: WaitingRoomProps) {
  const [chatInput, setChatInput] = useState("");

  function handleSendMessage() {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput("");
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 font-medium">Loading room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex">
      {/* LEFT PANEL - Players */}
      <div className="w-[30%] p-5">
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                Players
              </h2>
              <div className="flex items-center gap-1.5 bg-[#dbeafe] text-[#3b82f6] px-3 py-1 rounded-full">
                <FaUsers className="text-sm" />
                <span className="text-sm font-bold">{playerCount}</span>
              </div>
            </div>

            {/* Room Code */}
            <div className="bg-[#f3f4f6] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">ROOM CODE</p>
              <p className="text-2xl font-bold font-mono text-gray-900 text-center mb-3">
                {room.joinCode}
              </p>

              {/* Action Buttons */}
              <div className="space-y-2">
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
                  <span className="text-sm">
                    {copyLinkSuccess ? "Copied!" : "Copy Room Link"}
                  </span>
                </button>

                <button
                  onClick={handleShareLink}
                  className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaShare className="text-sm" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Players List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {room.players?.map((player: any, index: number) => {
              const isHostPlayer = player.role === "host";
              const avatarUrl = getAvatarUrl(player.username);
              return (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl p-4 ${
                    isHostPlayer
                      ? "bg-[#fffbeb] border-2 border-[#fbbf24]"
                      : "bg-white border border-[#e5e7eb]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={avatarUrl}
                        alt={`${player.username} avatar`}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Center - Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">
                          {player.username}
                        </h3>
                        {isHostPlayer && (
                          <span className="bg-[#fbbf24] text-[#78350f] text-xs font-bold px-2 py-0.5 rounded uppercase">
                            HOST
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            player.status === "active"
                              ? "bg-[#10b981]"
                              : "bg-[#fbbf24]"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            player.status === "active"
                              ? "text-[#10b981]"
                              : "text-[#fbbf24]"
                          }`}
                        >
                          {player.status === "active" ? "Online" : "Away"}
                        </span>
                      </div>
                    </div>

                    {/* Right - Number badge for non-host */}
                    {!isHostPlayer && (
                      <div className="w-8 h-8 rounded-full bg-[#dbeafe] flex items-center justify-center">
                        <span className="text-sm font-bold text-[#3b82f6]">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Empty Slots */}
            {playerCount < MAX_PLAYERS &&
              [...Array(MAX_PLAYERS - playerCount)].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="border-2 border-dashed border-[#d1d5db] rounded-xl p-4 bg-[#f9fafb]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaUserPlus className="text-gray-300 text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm italic">
                        Waiting for player...
                      </p>
                      <div className="flex gap-1 mt-1">
                        {[0, 1, 2].map((dot) => (
                          <motion.div
                            key={dot}
                            className="w-1.5 h-1.5 bg-gray-300 rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: dot * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* CENTER PANEL - Settings */}
      <div className="w-[37%] p-5">
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#0f172a]">Game Settings</h2>
            <p className="text-sm text-gray-500 mt-1">
              Configure your game before starting
            </p>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {isHost ? (
              <GameConfigEditor />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Rounds:</span>
                  <span className="font-bold text-gray-900">
                    {room.config?.roundsCount || 5}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Categories:</span>
                  <span className="font-bold text-gray-900">
                    {room.config?.supportedCategories?.length || 0}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-gray-600 font-medium mb-2">
                    Selected Categories:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {room.config?.supportedCategories?.map((cat: string) => (
                      <span
                        key={cat}
                        className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold"
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Settings are controlled by the host
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-3">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-5 border-t border-gray-100 space-y-3">
            {/* Status Indicator */}
            {isHost && (
              <>
                <div
                  className={`rounded-xl p-4 ${
                    isUpdatingConfig
                      ? "bg-[#fef3c7] border border-[#fbbf24]"
                      : canStartGame
                      ? "bg-[#f0fdf4] border border-[#86efac]"
                      : "bg-[#fff7ed] border border-[#fed7aa]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isUpdatingConfig ? (
                      <FaClock className="text-xl text-[#fbbf24] animate-spin" />
                    ) : canStartGame ? (
                      <FaCheckCircle className="text-xl text-[#10b981]" />
                    ) : (
                      <FaClock className="text-xl text-gray-600" />
                    )}
                    <div>
                      <p
                        className={`font-semibold ${
                          isUpdatingConfig
                            ? "text-[#fbbf24]"
                            : canStartGame
                            ? "text-[#10b981]"
                            : "text-gray-600"
                        }`}
                      >
                        {isUpdatingConfig
                          ? "Updating config..."
                          : canStartGame
                          ? "Ready to start!"
                          : "Waiting for players..."}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isUpdatingConfig
                          ? "Game settings being updated"
                          : canStartGame
                          ? `${playerCount} players ready`
                          : `Need at least ${
                              MIN_PLAYERS - playerCount
                            } more player`}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleStartGame}
                  disabled={!canStartGame}
                  className={`w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    canStartGame
                      ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:scale-[1.02] shadow-lg shadow-blue-500/30"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaGamepad />
                  Start Game
                </button>
                <button
                  onClick={handleLeaveRoom}
                  className="w-full text-red-500 hover:text-red-600 font-semibold text-sm transition-colors"
                >
                  ← Leave Room
                </button>
              </>
            )}

            {!isHost && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-900 font-semibold mb-1">
                  Waiting for host...
                </p>
                <p className="text-blue-700 text-sm">
                  The host will start the game when ready
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Chat */}
      <div className="w-[33%] p-5">
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0f172a]">Chat</h2>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>{onlinePlayerCount} online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#fafafa] space-y-6">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm text-center">
                  No messages yet.
                  <br />
                  Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg: any, index: number) => {

                return (
                  <motion.div
                    key={`${msg.messageId}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 flex-row`}
                  >

                    {/* Message */}
                    <div
                      className="flex-1 items-start flex flex-col max-w-[85%]"
                    >
                      <div
                        className="flex items-center gap-1.5 mb-1 flex-row"
                      >
                        <span
                          className="text-xs font-semibold text-gray-700"
                        >
                          {msg.username}
                        </span>
                      </div>
                      <div
                        className="px-3 py-2 rounded-2xl break-words bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full h-11 px-4 pr-12 bg-[#f3f4f6] border border-[#d1d5db] rounded-full focus:outline-none focus:border-[#3b82f6] text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    chatInput.trim()
                      ? "bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">Press Enter to send</p>
          </div>
        </div>
      </div>
    </div>
  );
}
