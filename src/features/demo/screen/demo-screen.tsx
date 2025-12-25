/**
 * Demo Screen
 *
 * Main demo orchestrator that renders different demo screens based on state
 */

import { useDemoContext, DemoGameState } from '../providers/demo-provider';
import { DemoIntroScreen } from './parts/demo-intro-screen';
import { DemoRoundStartScreen } from './parts/demo-round-start-screen';
import { DemoRouletteScreen } from './parts/demo-roulette-screen';
import { DemoLetterRevealScreen } from './parts/demo-letter-reveal-screen';
import { DemoAnsweringScreen } from './parts/demo-answering-screen';
import { DemoRoundSummaryScreen } from './parts/demo-round-summary-screen';
import { DemoOutroScreen } from './parts/demo-outro-screen';

export function DemoScreen() {
  const { gameState } = useDemoContext();

  switch (gameState) {
    case DemoGameState.INTRO:
      return <DemoIntroScreen />;

    case DemoGameState.ROUND_START:
      return <DemoRoundStartScreen />;

    case DemoGameState.ROULETTE_SPIN:
      return <DemoRouletteScreen />;

    case DemoGameState.LETTER_REVEAL:
      return <DemoLetterRevealScreen />;

    case DemoGameState.ANSWERING:
      return <DemoAnsweringScreen />;

    case DemoGameState.ROUND_SUMMARY:
      return <DemoRoundSummaryScreen />;

    case DemoGameState.OUTRO:
      return <DemoOutroScreen />;

    default:
      return null;
  }
}
