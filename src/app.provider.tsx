import { ReactNode } from 'react';
import { soundService } from './shared/services/sound-service';
import { SoundToggleButton } from './shared/ui/components/sound-toggle-button';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Global Providers Wrapper
 *
 * This component wraps the entire application with global providers.
 * Add your global state providers here in the correct order.
 *
 * Common providers to add:
 * - QueryClientProvider (React Query)
 * - ThemeProvider
 * - AuthProvider
 * - I18nProvider
 * - FeatureFlagsProvider
 */
export function AppProvider({ children }: AppProviderProps) {
  soundService.playButtonClick();
  return (
    <>
      <SoundToggleButton />
      {/* Add global providers here */}
      {/* Example: */}
      {/* <QueryClientProvider client={queryClient}> */}
      {/*   <ThemeProvider> */}
      {/*     <AuthProvider> */}
      {children}
      {/*     </AuthProvider> */}
      {/*   </ThemeProvider> */}
      {/* </QueryClientProvider> */}
    </>
  );
}
