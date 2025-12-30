/**
 * Multiplayer Demo Waiting Room Screen
 *
 * Standalone version matching MobileWaitingRoom style - NO gradients, NO emojis
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMultiplayerDemoContext, MultiplayerDemoState } from '../../providers/multiplayer-demo-provider';
import { soundService } from '@shared/services/sound-service';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCopy,
  FaCrown,
  FaShare,
  FaUserPlus,
} from '@icons';

type TabType = 'players' | 'settings' | 'chat';

export function MPDemoWaitingRoomScreen() {
  const { setGameState, roomCode, players, categories } = useMultiplayerDemoContext();
  const [activeTab, setActiveTab] = useState<TabType>('players');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    soundService.playSuccess();

    const timer = setTimeout(() => {
      setGameState(MultiplayerDemoState.GAME_START);
    }, 7500);

    return () => clearTimeout(timer);
  }, [setGameState]);

  const handleCopyCode = () => {
    setCopySuccess(true);
    soundService.playSuccess();
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4">
        <div className="flex items-center justify-between mb-1 mt-3">
          <button className="w-11 h-11 flex items-center justify-center">
            <FaArrowLeft className="text-gray-700 text-xl" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Room Code</p>
            <p className="text-2xl font-black text-blue-600 tracking-widest">{roomCode}</p>
          </div>
          <button className="w-11 h-11 flex items-center justify-center">
            <FaShare className="text-blue-600 text-xl" />
          </button>
        </div>

        <div className="flex flex-row gap-2 mb-2">
          <button
            onClick={handleCopyCode}
            className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaCopy className="text-sm" />
            <span className="text-sm">{copySuccess ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <FaShare className="text-sm" />
            <span className="text-sm">Copy Room Link</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab('players')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'players' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Players ({players.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'settings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'chat' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="p-4 space-y-3">
            {players.map((player, index) => {
              const isHostPlayer = player.role === 'host';

              return (
                <motion.div
                  key={player.username}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl p-4 shadow-sm ${
                    isHostPlayer ? 'border-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={player.avatar}
                        alt={player.username}
                        className="w-16 h-16 rounded-full"
                      />
                      {isHostPlayer && (
                        <div className="absolute -top-1 -left-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center">
                          <FaCrown className="text-xs text-yellow-900" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{player.username}</h3>
                        {isHostPlayer && (
                          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded uppercase">
                            HOST
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-green-600">Ready to start</p>
                    </div>

                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-green-600 text-xl" />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty slots */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`empty-${i}`}
                className="bg-white rounded-2xl p-4 border-2 border-dashed border-gray-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaUserPlus className="text-3xl text-gray-300" />
                  </div>
                  <p className="text-gray-400 italic">Waiting for player...</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Game Configuration</h3>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Rounds
                </label>
                <div className="flex-1 bg-gray-100 rounded-xl py-3 text-center">
                  <p className="text-3xl font-black text-gray-900">1</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categories ({categories.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="px-3 py-2.5 rounded-xl font-semibold text-sm bg-blue-500 text-white shadow-md"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="p-4 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col items-start">
                <span className="text-xs font-semibold text-gray-600 uppercase mb-1">
                  {players[1].username}
                </span>
                <div className="px-4 py-2 rounded-2xl max-w-[85%] bg-white border border-gray-200">
                  <p className="text-sm">Ready to play!</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-row-reverse">
              <div className="flex-1 flex flex-col items-end">
                <span className="text-xs font-semibold text-gray-600 uppercase mb-1">You</span>
                <div className="px-4 py-2 rounded-2xl max-w-[85%] bg-blue-500 text-white">
                  <p className="text-sm">Let's do this!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        {activeTab === 'players' ? (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
            <p className="text-blue-900 font-semibold">Waiting for host...</p>
            <p className="text-blue-700 text-sm">The host will start the game when ready</p>
          </div>
        ) : (
          <button
            onClick={handleCopyCode}
            className="w-full h-14 bg-white border-2 border-blue-500 text-blue-500 rounded-full font-semibold flex items-center justify-center gap-2"
          >
            <FaCopy />
            {copySuccess ? 'Copied!' : 'Copy Room Code'}
          </button>
        )}
      </div>
    </div>
  );
}
