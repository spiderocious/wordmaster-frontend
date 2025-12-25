/**
 * Join Screen Wrapper
 *
 * Wraps join screen with providers
 */

import { WebSocketProvider } from '../providers/websocket-provider';
import { MultiplayerProvider } from '../providers/multiplayer-provider';
import { usernameService } from '@shared/services/username-service';
import { JoinSetupScreen } from './parts/join-setup-screen';

export function JoinScreenWrapper() {
  const username = usernameService.getUsername();

  if (!username) {
    return null;
  }

  return (
    <WebSocketProvider>
      <MultiplayerProvider username={username}>
        <JoinSetupScreen />
      </MultiplayerProvider>
    </WebSocketProvider>
  );
}
