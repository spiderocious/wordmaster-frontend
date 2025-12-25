/**
 * Multiplayer Routes Configuration
 *
 * Route configuration for multiplayer feature
 */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

const MultiplayerScreen = lazy(() =>
  import('./screen/multiplayer-screen').then((module) => ({
    default: module.MultiplayerScreen,
  })),
);

export const multiplayerRoutes: RouteObject = {
  path: ROUTES.multiplayer.absPath,
  children: [
    {
      path: ROUTES.multiplayer.mode.relativePath,
      Component: MultiplayerScreen,
    },
    // TODO: Add host and join routes in later phases
  ],
};
