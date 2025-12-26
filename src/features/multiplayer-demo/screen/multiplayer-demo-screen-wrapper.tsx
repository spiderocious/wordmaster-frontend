/**
 * Multiplayer Demo Screen Wrapper
 *
 * Wraps demo screen with provider
 */

import { MultiplayerDemoProvider } from '../providers/multiplayer-demo-provider';
import { MultiplayerDemoScreen } from './multiplayer-demo-screen';

export function MultiplayerDemoScreenWrapper() {
  return (
    <MultiplayerDemoProvider>
      <MultiplayerDemoScreen />
    </MultiplayerDemoProvider>
  );
}
