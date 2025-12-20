import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTES } from '@shared/constants/routes';

const HowToPlayScreen = lazy(() =>
  import('./screen/how-to-play-screen').then((module) => ({
    default: module.HowToPlayScreen,
  })),
);

export const howToPlayRoutes: RouteObject = {
  path: ROUTES.howToPlay.absPath,
  Component: HowToPlayScreen,
};
