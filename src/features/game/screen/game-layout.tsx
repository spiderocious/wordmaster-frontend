/**
 * Game Layout
 *
 * Wraps all game screens with GameProvider
 */

import { Outlet } from 'react-router-dom';
import { GameProvider } from '../providers/game-provider';

export function GameLayout() {
  return (
    <GameProvider>
      <Outlet />
    </GameProvider>
  );
}
