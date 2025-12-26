/**
 * Waiting Room Screen
 *
 * Router component that decides between Desktop and Mobile layouts
 * based on screen size. Extracts logic into custom hook for reuse.
 */

import { useWaitingRoomLogic } from '../hooks/useWaitingRoomLogic';
import { ThreePanelDesktopWaitingRoom } from './three-panel-desktop-waiting-room';
import { MobileWaitingRoom } from './mobile-waiting-room';
import { Hidden } from 'meemaw';

export interface WaitingRoomProps {
  room: any;
  isHost: boolean;
  error: string | null;
  playerCount: number;
  onlinePlayerCount: number;
  canStartGame: boolean;
  isGameActive: boolean;
  copyCodeSuccess: boolean;
  copyLinkSuccess: boolean;
  isUpdatingConfig: boolean;
  showConfigUpdate: boolean;
  handleCopyCode: () => void;
  handleCopyLink: () => void;
  handleShareLink: () => void;
  handleStartGame: () => void;
  handleLeaveRoom: () => void;
  messages: any[];
  sendChatMessage: (message: string) => void;
  MIN_PLAYERS: number;
  MAX_PLAYERS: number;
}

export function WaitingRoomScreen() {
  // Extract all business logic into custom hook
  const logic = useWaitingRoomLogic();

  return (
    <>
      <Hidden on="mobile">
        <ThreePanelDesktopWaitingRoom {...logic} />
      </Hidden>
      <Hidden on="desktop">
        <MobileWaitingRoom {...logic} />
      </Hidden>
      </>
  )
}
