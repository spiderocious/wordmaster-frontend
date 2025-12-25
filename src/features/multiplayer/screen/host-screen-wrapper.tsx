/**
 * Host Screen Wrapper
 *
 * Wraps host screen with providers
 */

import { WebSocketProvider } from '../providers/websocket-provider';
import { MultiplayerProvider } from '../providers/multiplayer-provider';
import { usernameService } from '@shared/services/username-service';
import { HostWaitingRoomScreen } from './parts/host-waiting-room-screen';

export function HostScreenWrapper() {
  const username = usernameService.getUsername();

  if (!username) {
    return null;
  }

  return (
    <WebSocketProvider>
      <MultiplayerProvider username={username}>
        <HostWaitingRoomScreen />
      </MultiplayerProvider>
    </WebSocketProvider>
  );
}
