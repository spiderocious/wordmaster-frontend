/**
 * Waiting Room Wrapper
 *
 * Wraps waiting room with providers
 */

import { WebSocketProvider } from '../providers/websocket-provider';
import { MultiplayerProvider } from '../providers/multiplayer-provider';
import { usernameService } from '@shared/services/username-service';
import { WaitingRoomScreen } from './parts/waiting-room-screen';

export function WaitingRoomWrapper() {
  const username = usernameService.getUsername();

  if (!username) {
    return null;
  }

  return (
    <WebSocketProvider>
      <MultiplayerProvider username={username}>
        <WaitingRoomScreen />
      </MultiplayerProvider>
    </WebSocketProvider>
  );
}
