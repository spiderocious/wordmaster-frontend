/**
 * Multiplayer Demo Routes
 */

import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTES } from '@shared/constants/routes';

const MultiplayerDemoScreenWrapper = lazy(() =>
  import('./screen/multiplayer-demo-screen-wrapper').then((module) => ({
    default: module.MultiplayerDemoScreenWrapper,
  })),
);

export const multiplayerDemoRoutes: RouteObject = {
  path: ROUTES.multiplayerDemo.absPath,
  Component: MultiplayerDemoScreenWrapper,
};
