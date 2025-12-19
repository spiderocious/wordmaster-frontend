import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTES } from '@shared/constants/routes';

const HomeScreen = lazy(() =>
  import('./screen/home-screen').then((module) => ({
    default: module.HomeScreen,
  })),
);

export const homeRoutes: RouteObject = {
  path: ROUTES.HOME.relativePath,
  Component: HomeScreen,
};
