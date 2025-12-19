import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './app.routes';

/**
 * Root Application Component
 *
 * Creates the browser router with the centralized route configuration
 * and provides it to the application.
 *
 * The router is created once and reused throughout the app lifecycle.
 */
const router = createBrowserRouter(routes);

export function App() {
  return <RouterProvider router={router} />;
}
