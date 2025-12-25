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

const HostScreenWrapper = lazy(() =>
  import('./screen/host-screen-wrapper').then((module) => ({
    default: module.HostScreenWrapper,
  })),
);

export const multiplayerRoutes: RouteObject = {
  path: ROUTES.multiplayer.absPath,
  children: [
    {
      path: ROUTES.multiplayer.mode.relativePath,
      Component: MultiplayerScreen,
    },
    {
      path: ROUTES.multiplayer.host.relativePath,
      Component: HostScreenWrapper,
    },
    // TODO: Add join routes in later phase
  ],
};
