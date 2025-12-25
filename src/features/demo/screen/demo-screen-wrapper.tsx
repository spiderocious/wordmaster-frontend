/**
 * Demo Screen Wrapper
 *
 * Wraps demo screen with provider
 */

import { DemoProvider } from '../providers/demo-provider';
import { DemoScreen } from './demo-screen';

export function DemoScreenWrapper() {
  return (
    <DemoProvider>
      <DemoScreen />
    </DemoProvider>
  );
}
