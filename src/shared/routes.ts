/**
 * Named Routes Configuration
 *
 * Centralized route definitions for the application.
 * All navigation MUST use this route map.
 *
 * Usage:
 * import { ROUTES } from '@shared/routes';
 * navigate(ROUTES.game);
 * <Link to={ROUTES.multiplayer}>Play Multiplayer</Link>
 */

export const ROUTES = {
  // Main routes
  home: '/',
  game: '/game',
  multiplayer: '/multiplayer',
  auth: '/auth',
  howToPlay: '/how-to-play',

  // Future routes
  // profile: '/profile',
  // leaderboard: '/leaderboard',
  // settings: '/settings',
} as const;

/**
 * Type-safe route keys
 */
export type RouteKey = keyof typeof ROUTES;

/**
 * Type-safe route values
 */
export type RouteValue = (typeof ROUTES)[RouteKey];
