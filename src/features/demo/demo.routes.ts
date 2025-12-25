/**
 * Demo Routes
 */

import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTES } from '@shared/constants/routes';

const DemoScreenWrapper = lazy(() =>
  import('./screen/demo-screen-wrapper').then((module) => ({
    default: module.DemoScreenWrapper,
  })),
);

export const demoRoutes: RouteObject = {
  path: ROUTES.demo.absPath,
  Component: DemoScreenWrapper,
};
