/**
 * Multiplayer Session Screen
 *
 * Orchestrates multiplayer game flow based on WebSocket events
 * Matches single-player flow: roulette → letter reveal → answering
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../providers/multiplayer-provider';
import { GamePhase } from '../types/multiplayer-types';
import { ROUTES } from '@shared/constants/routes';

// Multiplayer-specific screens
import { MPRouletteScreen } from './parts/mp-roulette-screen';
import { MPLetterRevealScreen } from './parts/mp-letter-reveal-screen';
import { MPAnsweringScreen } from './parts/mp-answering-screen';
import { MPRoundResultsScreen } from './parts/mp-round-results-screen';
import { MPFinalSummaryScreen } from './parts/mp-final-summary-screen';

type UIState = 'roulette' | 'letter-reveal' | 'answering';

export function MultiplayerSessionScreen() {
  const navigate = useNavigate();
  const { room } = useMultiplayer();
  const [uiState, setUIState] = useState<UIState>('roulette');

  // Reset UI state when round changes (new round started)
  useEffect(() => {
    if (room?.phase === GamePhase.PLAYING && room.roundData) {
      setUIState('roulette');
    }
  }, [room?.currentRound]);

  useEffect(() => {
    if (!room) {
      navigate(ROUTES.multiplayer.mode.absPath);
    } else if (room.phase === GamePhase.WAITING) {
      navigate('/multiplayer/waiting');
    }
  }, [room, navigate]);

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  // Render screen based on current game phase from WebSocket
  switch (room.phase) {
    case GamePhase.PLAYING:
      if (!room.roundData) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-600 font-medium">Loading round data...</p>
          </div>
        );
      }

      // UI flow: roulette → letter-reveal → answering (like single-player)
      if (uiState === 'roulette') {
        return <MPRouletteScreen onComplete={() => setUIState('letter-reveal')} />;
      }

      if (uiState === 'letter-reveal') {
        return <MPLetterRevealScreen onComplete={() => setUIState('answering')} />;
      }

      return <MPAnsweringScreen />;

    case GamePhase.ROUND_END:
      return <MPRoundResultsScreen />;

    case GamePhase.FINISHED:
      return <MPFinalSummaryScreen />;

    case GamePhase.WAITING:
    default:
      // Redirect handled in useEffect
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      );
  }
}
