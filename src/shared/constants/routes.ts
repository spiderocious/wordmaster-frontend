/**
 * Route Configuration System
 *
 * Centralized route constants following FSD architecture
 * Use absPath for navigation, relativePath for route definitions
 */

interface RouteConfig {
  absPath: string;
  relativePath: string;
}

type RouteWithChildren<T = Record<string, never>> = RouteConfig & T;

/**
 * Helper function to create route objects with nested children
 */
function route<T extends Record<string, RouteConfig>>(
  path: string,
  children?: T
): RouteWithChildren<T> {
  const absPath = `/${path}`;
  const relativePath = path;

  const result: RouteWithChildren<T> = {
    absPath,
    relativePath,
  } as RouteWithChildren<T>;

  if (children) {
    Object.entries(children).forEach(([key, value]) => {
      (result as Record<string, RouteConfig>)[key] = {
        absPath: `${absPath}${value.absPath}`,
        relativePath: value.relativePath,
      };
    });
  }

  return result;
}

/**
 * Application Routes
 * Add new routes here following the pattern
 */
export const ROUTES = {
  ROOT: { absPath: '/', relativePath: '/' },
  HOME: route('home'),
  howToPlay: route('how-to-play'),
  game: route('game', {
    start: { absPath: '/start', relativePath: 'start' },
    session: { absPath: '/session/:gameId', relativePath: 'session/:gameId' },
  }),

} as const;

// Helper to generate session route with gameId
export function getGameSessionRoute(gameId: string): string {
  return `/game/session/${gameId}`;
}
