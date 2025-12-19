import { ReactNode } from 'react';

interface PageContentProps {
  children: ReactNode;
}

/**
 * Page Content Container
 *
 * Provides consistent spacing and max-width for page content.
 *
 * Usage:
 * <PageContent>
 *   <div>Your content here</div>
 * </PageContent>
 */
export function PageContent({ children }: PageContentProps) {
  return (
    <main>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{children}</div>
      </div>
    </main>
  );
}
