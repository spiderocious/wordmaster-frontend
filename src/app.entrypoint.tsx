import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AppProvider } from './app.provider';

/**
 * Application Entrypoint
 *
 * This component serves as the root layout for the entire application.
 * It wraps all routes with:
 * - Global providers (AppProvider)
 * - Suspense boundary for lazy-loaded routes
 * - Outlet for nested routes
 *
 * The loading fallback is shown while lazy-loaded route components are being fetched.
 */
export function AppEntrypoint() {
  return (
    <AppProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading...</p>
            </div>
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </AppProvider>
  );
}
