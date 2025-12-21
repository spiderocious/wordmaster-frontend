import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTES } from '@shared/constants/routes';
import { GameLayout } from './screen/game-layout';

const GameStartScreen = lazy(() =>
  import('./screen/game-start-screen').then((module) => ({
    default: module.GameStartScreen,
  })),
);

const GameSessionScreen = lazy(() =>
  import('./screen/game-session-screen').then((module) => ({
    default: module.GameSessionScreen,
  })),
);

export const gameRoutes: RouteObject = {
  path: ROUTES.game.absPath,
  Component: GameLayout,
  children: [
    {
      path: ROUTES.game.start.relativePath,
      Component: GameStartScreen,
    },
    {
      path: ROUTES.game.session.relativePath,
      Component: GameSessionScreen,
    },
  ],
};
