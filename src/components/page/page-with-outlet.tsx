import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface PageWithOutletProps {
  children: ReactNode;
}

/**
 * Page Layout with Outlet
 *
 * This component provides a consistent layout wrapper for pages that have nested routes.
 * It renders the page content along with an Outlet for child routes.
 *
 * Usage:
 * <PageWithOutlet>
 *   <PageHeader title="My Page" />
 *   <PageContent>...</PageContent>
 * </PageWithOutlet>
 */
export function PageWithOutlet({ children }: PageWithOutletProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <Outlet />
    </div>
  );
}
