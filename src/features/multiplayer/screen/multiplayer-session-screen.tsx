/**
 * Multiplayer Session Screen
 *
 * Orchestrates multiplayer game flow based on WebSocket events
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../providers/multiplayer-provider';
import { GamePhase } from '../types/multiplayer-types';
import { ROUTES } from '@shared/constants/routes';
import { MPRoundStartScreen } from './parts/mp-round-start-screen';
import { MPAnsweringScreen } from './parts/mp-answering-screen';

export function MultiplayerSessionScreen() {
  const navigate = useNavigate();
  const { room } = useMultiplayer();
  const [currentPhase, setCurrentPhase] = useState<string>(GamePhase.STARTING);

  useEffect(() => {
    if (!room) {
      navigate(ROUTES.multiplayer.mode.absPath);
      return;
    }

    setCurrentPhase(room.phase);
  }, [room, navigate]);

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  switch (currentPhase) {
    case GamePhase.STARTING:
    case GamePhase.PLAYING:
      return <MPRoundStartScreen />;

    case GamePhase.ROUND_END:
      return <MPAnsweringScreen />;

    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600 font-medium">Waiting for game...</p>
        </div>
      );
  }
}
