import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTES } from '@shared/constants/routes';

const EntrypointScreen = lazy(() =>
  import('./screen/entrypoint-screen').then((module) => ({
    default: module.EntrypointScreen,
  })),
);

export const entrypointRoutes: RouteObject = {
  path: ROUTES.ROOT.relativePath,
  Component: EntrypointScreen,
};
