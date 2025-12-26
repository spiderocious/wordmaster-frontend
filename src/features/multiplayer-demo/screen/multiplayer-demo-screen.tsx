/**
 * Multiplayer Demo Screen
 *
 * Main demo orchestrator that renders different demo screens based on state
 */

import { useMultiplayerDemoContext, MultiplayerDemoState } from '../providers/multiplayer-demo-provider';
import { MPDemoIntroScreen } from './parts/mp-demo-intro-screen';
import { MPDemoWaitingRoomScreen } from './parts/mp-demo-waiting-room-screen';
import { MPDemoGameStartScreen } from './parts/mp-demo-game-start-screen';
import { MPDemoRouletteScreen } from './parts/mp-demo-roulette-screen';
import { MPDemoLetterRevealScreen } from './parts/mp-demo-letter-reveal-screen';
import { MPDemoAnsweringScreen } from './parts/mp-demo-answering-screen';
import { MPDemoRoundResultsScreen } from './parts/mp-demo-round-results-screen';
import { MPDemoOutroScreen } from './parts/mp-demo-outro-screen';

export function MultiplayerDemoScreen() {
  const { gameState } = useMultiplayerDemoContext();

  switch (gameState) {
    case MultiplayerDemoState.INTRO:
      return <MPDemoIntroScreen />;

    case MultiplayerDemoState.WAITING_ROOM:
      return <MPDemoWaitingRoomScreen />;

    case MultiplayerDemoState.GAME_START:
      return <MPDemoGameStartScreen />;

    case MultiplayerDemoState.ROULETTE:
      return <MPDemoRouletteScreen />;

    case MultiplayerDemoState.LETTER_REVEAL:
      return <MPDemoLetterRevealScreen />;

    case MultiplayerDemoState.ANSWERING:
      return <MPDemoAnsweringScreen />;

    case MultiplayerDemoState.ROUND_RESULTS:
      return <MPDemoRoundResultsScreen />;

    case MultiplayerDemoState.OUTRO:
      return <MPDemoOutroScreen />;

    default:
      return null;
  }
}
