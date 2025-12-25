/**
 * Multiplayer Routes Configuration
 *
 * Route configuration for multiplayer feature
 */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

const MultiplayerLayout = lazy(() =>
  import('./screen/multiplayer-layout').then((module) => ({
    default: module.MultiplayerLayout,
  })),
);

const MultiplayerScreen = lazy(() =>
  import('./screen/multiplayer-screen').then((module) => ({
    default: module.MultiplayerScreen,
  })),
);

const HostWaitingRoomScreen = lazy(() =>
  import('./screen/parts/host-waiting-room-screen').then((module) => ({
    default: module.HostWaitingRoomScreen,
  })),
);

const JoinSetupScreen = lazy(() =>
  import('./screen/parts/join-setup-screen').then((module) => ({
    default: module.JoinSetupScreen,
  })),
);

const WaitingRoomScreen = lazy(() =>
  import('./screen/parts/waiting-room-screen').then((module) => ({
    default: module.WaitingRoomScreen,
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
      path: '',
      Component: MultiplayerLayout,
      children: [
        {
          path: ROUTES.multiplayer.host.relativePath,
          Component: HostWaitingRoomScreen,
        },
        {
          path: ROUTES.multiplayer.join.relativePath,
          Component: JoinSetupScreen,
        },
        {
          path: ROUTES.multiplayer.joinWaiting.relativePath,
          Component: JoinSetupScreen,
        },
        {
          path: 'waiting',
          Component: WaitingRoomScreen,
        },
      ],
    },
  ],
};
