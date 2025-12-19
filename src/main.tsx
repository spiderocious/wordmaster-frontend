import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import './index.css';

/**
 * Application Bootstrap
 *
 * This is the entry point of the React application.
 * It renders the root App component into the DOM.
 *
 * StrictMode helps identify potential problems in the application
 * during development (it has no effect in production).
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
