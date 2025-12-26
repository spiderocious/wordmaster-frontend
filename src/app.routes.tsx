import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { homeRoutes } from '@features/home/home.routes';
import { howToPlayRoutes } from '@features/how-to-play/how-to-play.routes';
import { demoRoutes } from '@features/demo/demo.routes';
import { gameRoutes } from '@features/game/game.routes';
import { multiplayerRoutes } from '@features/multiplayer/multiplayer.routes';
import { AppEntrypoint } from './app.entrypoint';
import { ROUTES } from '@shared/constants/routes';

const EntrypointScreen = lazy(() =>
  import('@features/entrypoint/screen/entrypoint-screen').then((module) => ({
    default: module.EntrypointScreen,
  })),
);

/**
 * JSON-based Route Configuration
 *
 * This is the central place to register all application routes.
 * To add a new route:
 * 1. Import the route object from your feature
 * 2. Add it to the children array below
 *
 * Example:
 * import { aboutRoutes } from '@features/about/about.routes';
 * Then add: aboutRoutes, to the children array
 */
export const routes: RouteObject[] = [
  {
    path: ROUTES.ROOT.absPath,
    Component: AppEntrypoint,
    children: [
      {
        path: '',
        Component: EntrypointScreen,
      },
      homeRoutes,
      howToPlayRoutes,
      demoRoutes,
      gameRoutes,
      multiplayerRoutes,
    ],
  },
];
