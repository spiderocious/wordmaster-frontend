import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './app.routes';
import { ErrorBoundary } from '@shared/ui/components/error-boundary';

/**
 * Root Application Component
 *
 * Creates the browser router with the centralized route configuration
 * and provides it to the application.
 *
 * Wrapped with ErrorBoundary to catch and handle errors gracefully.
 * The router is created once and reused throughout the app lifecycle.
 */
const router = createBrowserRouter(routes);

export function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
